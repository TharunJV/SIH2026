import { Challenge, ChallengeCategory, ChallengeUrgency, ChallengeStatus } from '../types';
import { MOCK_CHALLENGES } from '../mock/data';
import { aiService } from './aiService';

export interface CreateChallengeInput {
  title: string;
  description: string;
  category: ChallengeCategory;
  subCategory?: string;
  district: string;
  block: string;
  village: string;
  gpsCoordinates?: { lat: number; lng: number };
  affectedPopulation: number;
  frequency: 'Daily' | 'Seasonal' | 'Recurring Periodic' | 'One-Time Event';
  urgency: ChallengeUrgency;
  expectedImpact: string;
  additionalInformation?: string;
  submittedBy: {
    userId: string;
    userName: string;
    userRole: any;
    contactNumber: string;
    organization?: string;
  };
  evidenceUrls?: {
    type: 'image' | 'video' | 'document' | 'audio';
    url: string;
    caption: string;
    gpsCoordinates?: { lat: number; lng: number };
    geotagLocation?: string;
    accuracy?: number;
    isGeotagged?: boolean;
    timestamp?: string;
  }[];
}

class ChallengeService {
  private challenges: Challenge[] = [...MOCK_CHALLENGES];

  async getChallenges(filters?: {
    district?: string;
    category?: ChallengeCategory | 'All';
    urgency?: ChallengeUrgency | 'All';
    status?: ChallengeStatus | 'All';
    search?: string;
  }): Promise<Challenge[]> {
    await new Promise((res) => setTimeout(res, 150));
    let result = [...this.challenges];

    if (!filters) return result;

    if (filters.district && filters.district !== 'All') {
      result = result.filter((c) => c.district.toLowerCase().includes(filters.district!.toLowerCase()));
    }
    if (filters.category && filters.category !== 'All') {
      result = result.filter((c) => c.category === filters.category);
    }
    if (filters.urgency && filters.urgency !== 'All') {
      result = result.filter((c) => c.urgency === filters.urgency);
    }
    if (filters.status && filters.status !== 'All') {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.block.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    return result;
  }

  async getChallengeById(id: string): Promise<Challenge | undefined> {
    await new Promise((res) => setTimeout(res, 100));
    return this.challenges.find((c) => c.id === id);
  }

  async createChallenge(input: CreateChallengeInput): Promise<Challenge> {
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newId = `JH-2026-00${randomSeq}`;

    // Perform AI analysis
    const aiAnalysis = await aiService.analyzeChallengeAsync({
      title: input.title,
      description: input.description,
      district: input.district,
      block: input.block,
      category: input.category,
      affectedPopulation: input.affectedPopulation,
    });

    const newChallenge: Challenge = {
      id: newId,
      title: input.title,
      description: input.description,
      category: input.category,
      subCategory: input.subCategory || aiAnalysis.subCategory,
      district: input.district,
      block: input.block,
      village: input.village,
      gpsCoordinates: input.gpsCoordinates || { lat: 23.3441 + (Math.random() - 0.5) * 0.8, lng: 85.3096 + (Math.random() - 0.5) * 0.8 },
      submittedBy: input.submittedBy,
      affectedPopulation: Number(input.affectedPopulation),
      frequency: input.frequency,
      urgency: input.urgency,
      expectedImpact: input.expectedImpact,
      additionalInformation: input.additionalInformation,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
      currentStage: 'Challenge Submitted',
      aiAnalysis,
      tags: [input.category, input.district, 'Crowdsourced'],
      endorsementsCount: 1,
      viewsCount: 1,
      evidence: (input.evidenceUrls || []).map((e, idx) => ({
        id: `ev-new-${Date.now()}-${idx}`,
        type: e.type,
        url: e.url,
        caption: e.caption,
        timestamp: e.timestamp || new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        gpsCoordinates: e.gpsCoordinates || input.gpsCoordinates,
        geotagLocation: e.geotagLocation || `${input.village ? input.village + ', ' : ''}${input.block}, ${input.district}`,
        accuracy: e.accuracy || 3.5,
        isGeotagged: e.isGeotagged ?? true,
      })),
      timeline: [
        {
          stage: 'Challenge Submitted',
          date: new Date().toISOString().split('T')[0],
          description: `Filed by ${input.submittedBy.userName} from ${input.district} District.`,
          actor: 'Citizen / Submitter',
        },
        {
          stage: 'AI Analysis Completed',
          date: new Date().toISOString().split('T')[0],
          description: `AI Priority Index: ${aiAnalysis.priorityScore}/100. Matched with ${aiAnalysis.recommendedUniversities[0]?.universityName}.`,
          actor: 'AI Problem Engine',
        },
      ],
    };

    this.challenges.unshift(newChallenge);
    return newChallenge;
  }

  async endorseChallenge(id: string): Promise<number> {
    const ch = this.challenges.find((c) => c.id === id);
    if (ch) {
      ch.endorsementsCount += 1;
      return ch.endorsementsCount;
    }
    return 0;
  }

  async updateChallengeStatus(id: string, status: ChallengeStatus, assignedUniversityName?: string): Promise<Challenge | null> {
    const ch = this.challenges.find((c) => c.id === id);
    if (ch) {
      ch.status = status;
      if (assignedUniversityName) {
        ch.assignedUniversityName = assignedUniversityName;
      }
      ch.timeline.push({
        stage: `Status updated to ${status}`,
        date: new Date().toISOString().split('T')[0],
        description: `Challenge advanced to ${status} stage.`,
        actor: 'Platform Nodal Officer',
      });
      return { ...ch };
    }
    return null;
  }
}

export const challengeService = new ChallengeService();
