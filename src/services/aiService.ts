import { AIAnalysis, ChallengeCategory, ChallengeUrgency } from '../types';
import { MOCK_UNIVERSITIES } from '../mock/data';

export interface AIAnalysisRequest {
  title: string;
  description: string;
  district: string;
  block?: string;
  category?: ChallengeCategory;
  affectedPopulation: number;
}

export const aiService = {
  /**
   * Prototype mock of external Gemini/LLM AI analysis pipeline.
   * Future Integration: POST /api/ai/analyze-challenge
   */
  analyzeChallengeAsync: async (request: AIAnalysisRequest): Promise<AIAnalysis> => {
    // Simulate short network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const text = `${request.title} ${request.description}`.toLowerCase();

    // Deterministic category inference fallback
    let detectedCategory: ChallengeCategory = request.category || 'Water Resources';
    let subCat = 'Rural Drinking Water & Quality Monitoring';
    let urgency: ChallengeUrgency = 'High';
    let priorityScore = 85;
    const affectedPopFormatted = (request.affectedPopulation || 0).toLocaleString();
    let reasoning = `High societal impact in ${request.district} affecting an estimated ${affectedPopFormatted} citizens. Problem exhibits clear technological feasibility for university research intervention.`;

    if (text.includes('water') || text.includes('arsenic') || text.includes('fluoride') || text.includes('handpump') || text.includes('filter')) {
      detectedCategory = 'Water Resources';
      subCat = 'Groundwater Remediation & IoT Filtration Systems';
      priorityScore = request.affectedPopulation > 10000 ? 94 : 86;
      urgency = priorityScore > 90 ? 'Critical' : 'High';
      reasoning = `High chemical/pathogenic hazard reported in ${request.district}. Potential severe public health risks (fluorosis/gastroenteritis). High priority for adsorption or membrane technology deployment.`;
    } else if (text.includes('crop') || text.includes('farmer') || text.includes('lac') || text.includes('mahua') || text.includes('soil') || text.includes('irrigation') || text.includes('vegetable')) {
      detectedCategory = 'Agriculture & Rural Economy';
      subCat = 'Agro-Mechanization, Solar Cold Chain & Post-Harvest Value Addition';
      priorityScore = 88;
      urgency = 'High';
      reasoning = `Direct income multiplier for agrarian/tribal producers in ${request.district}. Addresses post-harvest storage losses and physical labor bottlenecks.`;
    } else if (text.includes('health') || text.includes('doctor') || text.includes('hospital') || text.includes('clinic') || text.includes('maternal') || text.includes('sickle cell')) {
      detectedCategory = 'Healthcare & Telemedicine';
      subCat = 'Point-of-Care Diagnostics & Rural Tele-Consultation Grid';
      priorityScore = 95;
      urgency = 'Critical';
      reasoning = `Critical clinical accessibility gap in remote geography. High potential for portable battery-operated diagnostic hardware and specialist telemedicine.`;
    } else if (text.includes('school') || text.includes('student') || text.includes('learning') || text.includes('education') || text.includes('teacher')) {
      detectedCategory = 'Smart Education & Skilling';
      subCat = 'Offline Mesh Learning Pods & Solar Digital Classrooms';
      priorityScore = 82;
      urgency = 'Medium';
      reasoning = `Significant pedagogical inequality in low-connectivity forest school blocks. Highly suitable for edge-cached micro-servers (Raspberry Pi/Diksha).`;
    } else if (text.includes('coal') || text.includes('dust') || text.includes('smoke') || text.includes('pollution') || text.includes('forest') || text.includes('mine')) {
      detectedCategory = 'Environment & Forest Livelihood';
      subCat = 'Industrial Air & Runoff Remediation Telemetry';
      priorityScore = 91;
      urgency = 'Critical';
      reasoning = `Severe environmental compliance violation impacting community respiratory health and water bodies. High scope for CSR co-funding.`;
    }

    // Rank matching universities
    const recommendedUniversities = MOCK_UNIVERSITIES.map((univ) => {
      let match = 70;
      if (univ.domainStrengths.includes(detectedCategory)) match += 20;
      if (univ.district === request.district) match += 6;
      match = Math.min(98, Math.max(65, match + (priorityScore % 7)));
      return {
        universityId: univ.id,
        universityName: `${univ.shortName} (${univ.district})`,
        matchScore: match,
        matchingFacultyCount: Math.floor(match / 10),
        domainExcellence: `Recognized lab for ${detectedCategory} and rural technology transfer`,
      };
    })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    return {
      category: detectedCategory,
      subCategory: subCat,
      priority: urgency,
      priorityScore,
      reasoning,
      similarChallengesCount: Math.floor(Math.random() * 3) + 1,
      similarChallengeIds: ['JH-2025-008910', 'JH-2025-006240'],
      recommendedDisciplines: [
        'Applied Science & Materials Engineering',
        'IoT Telemetry & Embedded Systems',
        'Civil & Environmental Design',
        'Social Impact & Field Ergonomics',
      ],
      recommendedUniversities,
      potentialImpactAssessment: `Direct upliftment of ${(request.affectedPopulation || 0).toLocaleString()} citizens with scalable deployment across neighboring blocks of ${request.district}.`,
      estimatedBudgetRange: '₹3,50,000 – ₹6,80,000 (Eligible for State R&D Grant + CSR)',
      confidenceScore: 0.96,
    };
  },

  /**
   * Sends user query to the AI server /chat endpoint.
   * Target endpoint: POST /api/chat with { "message": string }
   * Returns { response: string, provider: string }
   */
  sendChatMessage: async (message: string): Promise<{ response: string; provider: string }> => {
    const endpoints = [
      '/api/chat',
      '/chat',
      import.meta.env.VITE_AI_SERVER_URL ? `${import.meta.env.VITE_AI_SERVER_URL.replace(/\/$/, '')}/chat` : null,
    ].filter(Boolean) as string[];

    let lastError: any = null;

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: message.trim() }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            response: data.response || 'No response returned from AI.',
            provider: data.provider || 'gemini',
          };
        }

        let errorDetail = 'Failed to get response from AI server';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorDetail = errorData.detail;
          else if (errorData.error) errorDetail = errorData.error;
        } catch {
          errorDetail = `Server returned status ${response.status}: ${response.statusText}`;
        }
        lastError = new Error(errorDetail);
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('Unable to connect to SolveSphere AI service.');
  },

  /**
   * Checks health of the AI server: GET /api/ai-health or /health
   */
  checkHealth: async (): Promise<{ status: string; service: string; primary?: string; fallback?: string } | null> => {
    const urls = [
      '/api/ai-health',
      '/api/health',
      '/health',
      import.meta.env.VITE_AI_SERVER_URL ? `${import.meta.env.VITE_AI_SERVER_URL.replace(/\/$/, '')}/health` : null,
    ].filter(Boolean) as string[];

    for (const rawUrl of urls) {
      try {
        const response = await fetch(rawUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          return await response.json();
        }
      } catch {
        // try next
      }
    }
    return null;
  },
};


