import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MultidisciplinaryTeamBuilder } from './MultidisciplinaryTeamBuilder';
import {
  Users,
  PlusCircle,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  Search,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const UniversityTeamsPage: React.FC = () => {
  const { challenges, projects, showToast, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'roster' | 'create'>('roster');

  // Pre-populated active multidisciplinary teams
  const [teams, setTeams] = useState([
    {
      id: 'TEAM-2026-01',
      name: 'Team Jal-Shuddhi (Water Sanitation Cohort)',
      challengeTitle: 'High Fluoride Contamination in Ground Water (Khunti)',
      challengeId: 'JH-2026-001248',
      leadFaculty: 'Dr. Alok Verma (Professor, Chemical Engg)',
      studentLead: 'Pooja Soren (B.Tech Chemical, Final Year)',
      membersCount: 4,
      members: [
        { name: 'Pooja Soren', role: 'Student Team Lead & Adsorption Testing', dept: 'Chemical Engineering', skills: ['Spectrometry', 'Water Testing', 'Lab Analysis'] },
        { name: 'Rohan Kumar Gupta', role: 'IoT Firmware & Telemetry', dept: 'Electronics & Comm (ECE)', skills: ['STM32', 'LoRaWAN', 'C++'] },
        { name: 'Amit Murmu', role: 'Mechanical Filtration Enclosure', dept: 'Mechanical Engineering', skills: ['CAD / SolidWorks', '3D Printing', 'Fabrication'] },
        { name: 'Sunita Hembrom', role: 'Community Field Deployment & Surveys', dept: 'Rural Development / Social Work', skills: ['Santhali Language', 'Field Trials', 'SHG Liaison'] },
      ],
      currentStage: 'TRL 5: Lab Testing & Calibration',
      status: 'Active R&D',
      fundingCommitted: '₹3,50,000 (Tata Steel CSR)',
    },
    {
      id: 'TEAM-2026-02',
      name: 'Team Krishi-Urja (Solar Agritech Cohort)',
      challengeTitle: 'Off-grid Cold Storage for Lac Cultivators (Gumla)',
      challengeId: 'JH-2026-001252',
      leadFaculty: 'Dr. Meenakshi Sahu (Associate Prof, Renewable Energy)',
      studentLead: 'Vikramaditya Roy (M.Tech Power Systems)',
      membersCount: 3,
      members: [
        { name: 'Vikramaditya Roy', role: 'Solar PV & Thermal Design', dept: 'Electrical Engineering', skills: ['PV Sizing', 'MPPT Controllers', 'Battery Storage'] },
        { name: 'Sneha Kumari', role: 'IoT Temperature Sensor Array', dept: 'Computer Science & Engg', skills: ['Cloud Telemetry', 'Flutter App', 'Python'] },
        { name: 'Deepak Besra', role: 'Post-Harvest Lac Biology', dept: 'Agricultural Sciences', skills: ['Lac Storage', 'Humidity Control', 'Farmer Outreach'] },
      ],
      currentStage: 'TRL 4: Component Prototype',
      status: 'In Development',
      fundingCommitted: '₹2,20,000 (Central Coalfields CSR)',
    },
    {
      id: 'TEAM-2026-03',
      name: 'Team Swasthya-Setu (Tele-Diagnostic Diagnostic)',
      challengeTitle: 'Maternal Anemia Diagnostic Kit with Instant HB Reading',
      challengeId: 'JH-2026-001259',
      leadFaculty: 'Dr. Rajesh Sinha (HoD Bioengineering)',
      studentLead: 'Kritika Sharma (B.Tech Bioengineering)',
      membersCount: 3,
      members: [
        { name: 'Kritika Sharma', role: 'Non-Invasive Optical Sensor', dept: 'Bioengineering', skills: ['Photoplethysmography', 'Optics', 'Biomedical Testing'] },
        { name: 'Rahul Oraon', role: 'Microcontroller & Display UI', dept: 'Instrumentation Engg', skills: ['Embedded C', 'OLED UI', 'BLE'] },
        { name: 'Dr. Ananya Roy', role: 'Clinical Validation Mentor', dept: 'Ranchi Sadar Hospital', skills: ['Clinical Trials', 'ICMR Protocols'] },
      ],
      currentStage: 'TRL 3: Proof of Concept',
      status: 'Forming',
      fundingCommitted: '₹1,50,000 (State R&D Seed Grant)',
    },
  ]);

  const handleCreateTeam = (teamName: string, members: any[]) => {
    const newTeam = {
      id: `TEAM-2026-0${teams.length + 1}`,
      name: teamName,
      challengeTitle: 'Multi-Department Innovation Project',
      challengeId: challenges[0]?.id || 'JH-2026-001248',
      leadFaculty: 'Dr. Alok Verma (Chemical Engg)',
      studentLead: members[0]?.name || 'Student Lead',
      membersCount: members.length,
      members: members.map((m) => ({
        name: m.name,
        role: m.role || 'Member',
        dept: m.department || 'Engineering',
        skills: m.skills || ['R&D', 'Prototyping'],
      })),
      currentStage: 'TRL 2: Team Formation',
      status: 'Active R&D',
      fundingCommitted: 'Pending Review',
    };

    setTeams([newTeam, ...teams]);
    showToast('success', 'Cohort Registered', `${teamName} assembled with ${members.length} members.`);
    setActiveTab('roster');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              Multidisciplinary Capstone Hub
            </span>
            <span className="text-xs text-amber-300 font-mono">JSHEC NEP 2020 Compliant</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Multidisciplinary Student & Faculty Teams
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Assembling engineering, sciences, design, and rural development students with senior faculty mentors to build scalable solutions for Jharkhand's pressing grassroots challenges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              activeTab === 'create'
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Assemble New Cohort</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'roster'
              ? 'border-indigo-700 text-indigo-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Active Innovation Cohorts ({teams.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'create'
              ? 'border-indigo-700 text-indigo-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-amber-500" />
          <span>Cohort Builder Tool</span>
        </button>
      </div>

      {/* Tab 1: Cohorts Roster */}
      {activeTab === 'roster' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block">Total Cohorts</span>
              <span className="text-xl font-black text-indigo-950 mt-1 block">{teams.length}</span>
              <span className="text-[10px] text-indigo-600 font-bold">12 Departments Joined</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block">Student Innovators</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">
                {teams.reduce((acc, t) => acc + t.membersCount, 0)} Active
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Capstone Credits Earning</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block">Faculty Directors</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">8 Mentors</span>
              <span className="text-[10px] text-slate-500">Cross-Discipline PI</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 block">CSR / R&D Co-Funding</span>
              <span className="text-xl font-black text-emerald-600 mt-1 block">₹7.20 Lakhs</span>
              <span className="text-[10px] text-emerald-600 font-bold">Industry Backed</span>
            </div>
          </div>

          {/* Teams List */}
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-indigo-400 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {team.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {team.status}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800">
                        {team.currentStage}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{team.name}</h3>
                    <p className="text-xs text-slate-500">
                      Assigned Challenge: <strong>{team.challengeTitle}</strong> ({team.challengeId})
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-emerald-800 block">{team.fundingCommitted}</span>
                    <span className="text-[10px] text-slate-500">Grant Status</span>
                  </div>
                </div>

                {/* Faculty Mentor & Lead info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Principal Faculty Mentor</span>
                      <span className="font-bold text-slate-900">{team.leadFaculty}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Student Cohort Lead</span>
                      <span className="font-bold text-slate-900">{team.studentLead}</span>
                    </div>
                  </div>
                </div>

                {/* Team Members Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Multidisciplinary Members ({team.members.length}):
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {team.members.map((member, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-start justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center justify-center">
                              {member.name.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-slate-900">{member.name}</span>
                          </div>
                          <p className="text-[11px] text-indigo-700 font-medium pl-8">{member.dept}</p>
                          <p className="text-[10px] text-slate-500 pl-8">{member.role}</p>
                          <div className="flex flex-wrap gap-1 pl-8 pt-1">
                            {member.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Eligible for 6-Credit Capstone Project under JSHEC Curriculum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentView('project-workspace')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Open R&D Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Cohort Builder */}
      {activeTab === 'create' && (
        <div className="animate-in fade-in duration-150">
          <MultidisciplinaryTeamBuilder
            challengeId={challenges[0]?.id || 'JH-2026-001248'}
            onTeamCreated={handleCreateTeam}
          />
        </div>
      )}
    </div>
  );
};
