import {
  AuthUser,
  AuthSession,
  RolePermissions,
  CitizenProfile,
  UniversityProfile,
  FacultyProfile,
  IndustryProfile,
  StartupProfile,
  GovernmentProfile,
} from '../types/auth';
import { UserRole, User } from '../types';
import { MOCK_USERS } from '../mock/data';

const STORAGE_KEY_USERS = 'jh_innov_users_db_v1';
const STORAGE_KEY_SESSION = 'jh_innov_current_session_v1';
const STORAGE_KEY_CITIZEN_PROFILES = 'jh_innov_citizen_profiles_v1';
const STORAGE_KEY_UNIV_PROFILES = 'jh_innov_univ_profiles_v1';
const STORAGE_KEY_FACULTY_PROFILES = 'jh_innov_faculty_profiles_v1';
const STORAGE_KEY_INDUSTRY_PROFILES = 'jh_innov_industry_profiles_v1';
const STORAGE_KEY_STARTUP_PROFILES = 'jh_innov_startup_profiles_v1';
const STORAGE_KEY_GOVT_PROFILES = 'jh_innov_govt_profiles_v1';

// Initial pre-seeded users for rich multi-user concurrent simulation
const INITIAL_USERS: AuthUser[] = [
  {
    id: 'user-cit-01',
    name: 'Sunita Devi',
    email: 'sunita.devi@jhcitizen.in',
    phone: '+91 98351 44210',
    role: 'citizen',
    district: 'Khunti',
    designation: 'Community Organizer, Torpa Block',
    verified: true,
    isEmailVerified: true,
    joinedDate: '2025-11-14',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    roleProfileId: 'cit-prof-01',
  },
  {
    id: 'user-cit-02',
    name: 'Birsa Munda',
    email: 'birsa.munda@jhcitizen.in',
    phone: '+91 98351 99881',
    role: 'citizen',
    district: 'Ranchi',
    designation: 'Farmer & Youth Council Member',
    verified: true,
    isEmailVerified: true,
    joinedDate: '2026-01-20',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    roleProfileId: 'cit-prof-02',
  },
  {
    id: 'user-univ-01',
    name: 'Prof. Alok Ranjan',
    email: 'dean.research@bitmesra.ac.in',
    phone: '+91 651 2275444',
    role: 'university_admin',
    district: 'Ranchi',
    organization: 'Birla Institute of Technology (BIT) Mesra',
    designation: 'Dean (Research, Innovation & Incubation)',
    verified: true,
    isEmailVerified: true,
    joinedDate: '2025-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    roleProfileId: 'univ-prof-01',
  },
  {
    id: 'user-univ-02',
    name: 'Prof. S. K. Mitra',
    email: 'director.rd@iitism.ac.in',
    phone: '+91 326 2235000',
    role: 'university_admin',
    district: 'Dhanbad',
    organization: 'IIT (ISM) Dhanbad',
    designation: 'Dean of R&D and Sponsored Projects',
    verified: true,
    isEmailVerified: true,
    joinedDate: '2025-02-10',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    roleProfileId: 'univ-prof-02',
  },
  {
    id: 'user-fac-01',
    name: 'Dr. Meenakshi Soren',
    email: 'meenakshi.soren@iitism.ac.in',
    phone: '+91 326 2235001',
    role: 'faculty_mentor',
    district: 'Dhanbad',
    organization: 'IIT (ISM) Dhanbad',
    designation: 'Associate Professor, Dept. of Environmental Science & Engineering',
    verified: true,
    isEmailVerified: true,
    joinedDate: '2025-02-01',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    roleProfileId: 'fac-prof-01',
  },
  {
    id: 'user-ind-01',
    name: 'Vikram Sengupta',
    email: 'v.sengupta@tatasteel.com',
    phone: '+91 657 2424000',
    role: 'csr_org',
    district: 'East Singhbhum (Jamshedpur)',
    organization: 'Tata Steel Innovation & CSR',
    designation: 'Head of Rural Technology Partnerships',
    verified: true,
    isEmailVerified: true,
    joinedDate: '2025-03-10',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    roleProfileId: 'ind-prof-01',
  },
  {
    id: 'user-start-01',
    name: 'Anand Kumar',
    email: 'founder@agrotechjharkhand.com',
    phone: '+91 94311 55667',
    role: 'industry_msme',
    district: 'Ranchi',
    organization: 'AgroTech Jharkhand Solutions Pvt Ltd',
    designation: 'Co-Founder & CEO (DPIIT Incubatee)',
    verified: true,
    isEmailVerified: true,
    joinedDate: '2025-07-15',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roleProfileId: 'start-prof-01',
  },
  {
    id: 'user-govt-01',
    name: 'Dr. Vivek H. Topno, IAS',
    email: 'secy-he@jharkhandmail.gov.in',
    phone: '+91 651 2400811',
    role: 'govt_department',
    district: 'Ranchi',
    organization: 'Dept. of Higher & Technical Education, Govt of Jharkhand',
    designation: 'Special Secretary (Innovation & Technical Institutions)',
    verified: true,
    isEmailVerified: true,
    joinedDate: '2025-01-01',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    roleProfileId: 'govt-prof-01',
  },
  {
    id: 'user-admin-01',
    name: 'Jharkhand Innovation PMU Admin',
    email: 'admin@innovation.jharkhand.gov.in',
    phone: '+91 651 2490001',
    role: 'platform_admin',
    district: 'Ranchi',
    organization: 'Jharkhand State Higher Education Council (JSHEC)',
    designation: 'State System Administrator',
    verified: true,
    isEmailVerified: true,
    joinedDate: '2025-01-01',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    roleProfileId: 'admin-prof-01',
  },
];

// Helper to safely load from local storage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

// Helper to save to local storage
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export class AuthService {
  private users: AuthUser[] = [];
  private currentSession: AuthSession | null = null;
  private verificationCodes: Map<string, string> = new Map(); // userId -> 6-digit code

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    const existing = loadFromStorage<AuthUser[] | null>(STORAGE_KEY_USERS, null);
    if (!existing || existing.length === 0) {
      this.users = [...INITIAL_USERS];
      saveToStorage(STORAGE_KEY_USERS, this.users);
    } else {
      this.users = existing;
    }

    const savedSession = loadFromStorage<AuthSession | null>(STORAGE_KEY_SESSION, null);
    if (savedSession && savedSession.expiresAt > Date.now()) {
      this.currentSession = savedSession;
    } else {
      // Default to Sunita Devi (Citizen) for initial view
      const defaultUser = this.users[0];
      this.currentSession = {
        token: `mock-session-tok-${defaultUser.id}`,
        user: defaultUser,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      saveToStorage(STORAGE_KEY_SESSION, this.currentSession);
    }
  }

  // Get current active session
  public getSession(): AuthSession | null {
    return this.currentSession;
  }

  // Get current authenticated user
  public getCurrentUser(): AuthUser {
    return this.currentSession?.user || this.users[0];
  }

  // List all users in database (for concurrent multi-user switcher / testing)
  public getAllUsers(): AuthUser[] {
    return [...this.users];
  }

  // Login with Email or Phone Number and optional password
  public async login(
    identifier: string,
    password?: string,
    requestedRole?: UserRole,
    rememberMe: boolean = true
  ): Promise<{ success: boolean; user?: AuthUser; message: string }> {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.trim().replace(/\s+/g, '');

    // Search by email or phone
    let matchedUser = this.users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.phone.replace(/\s+/g, '').includes(cleanPhone)
    );

    // If no exact match but user requested a role in demo mode, provide or create a simulated profile
    if (!matchedUser && requestedRole) {
      matchedUser = this.users.find((u) => u.role === requestedRole);
    }

    if (!matchedUser) {
      return {
        success: false,
        message: 'No account found with this email or mobile number. Please sign up first.',
      };
    }

    // Role check warning or adaptation
    if (requestedRole && matchedUser.role !== requestedRole) {
      // Map compatible roles (e.g. csr_org and industry_msme)
      const isCompatible =
        (requestedRole === 'csr_org' && matchedUser.role === 'industry_msme') ||
        (requestedRole === 'industry_msme' && matchedUser.role === 'csr_org') ||
        (requestedRole === 'govt_department' && matchedUser.role === 'platform_admin');

      if (!isCompatible) {
        return {
          success: false,
          message: `This account is registered as a ${matchedUser.role.replace('_', ' ').toUpperCase()}, not ${requestedRole.replace('_', ' ').toUpperCase()}. Please switch role or log in with the correct role.`,
        };
      }
    }

    // Create active session
    const session: AuthSession = {
      token: `session-${matchedUser.id}-${Date.now()}`,
      user: matchedUser,
      expiresAt: rememberMe ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000,
    };

    this.currentSession = session;
    saveToStorage(STORAGE_KEY_SESSION, session);

    return {
      success: true,
      user: matchedUser,
      message: `Welcome back, ${matchedUser.name}! Authentication successful.`,
    };
  }

  // Quick switch active user (Crucial for testing concurrent multi-user scenarios)
  public switchUser(userId: string): AuthUser | null {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;

    const session: AuthSession = {
      token: `session-${user.id}-${Date.now()}`,
      user,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    this.currentSession = session;
    saveToStorage(STORAGE_KEY_SESSION, session);
    return user;
  }

  // Logout
  public logout(): void {
    this.currentSession = null;
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }

  // Generate 6-digit email verification code
  public generateVerificationCode(userId: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCodes.set(userId, code);
    return code;
  }

  // Verify email with code
  public async verifyEmail(userId: string, code: string): Promise<{ success: boolean; message: string }> {
    const validCode = this.verificationCodes.get(userId) || '123456'; // 123456 demo fallback

    if (code.trim() === validCode || code.trim() === '123456') {
      const userIndex = this.users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        this.users[userIndex].isEmailVerified = true;
        this.users[userIndex].verified = true;
        saveToStorage(STORAGE_KEY_USERS, this.users);

        if (this.currentSession && this.currentSession.user.id === userId) {
          this.currentSession.user.isEmailVerified = true;
          this.currentSession.user.verified = true;
          saveToStorage(STORAGE_KEY_SESSION, this.currentSession);
        }
      }
      return { success: true, message: 'Email address verified successfully!' };
    }

    return { success: false, message: 'Invalid verification code. Please check and try again.' };
  }

  // Request password reset
  public async requestPasswordReset(email: string): Promise<{ success: boolean; resetCode?: string; message: string }> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address.',
      };
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCodes.set(`reset-${user.id}`, resetCode);

    return {
      success: true,
      resetCode,
      message: `Password reset link and code sent to ${email}.`,
    };
  }

  // Complete password reset
  public async resetPassword(
    email: string,
    resetCode: string,
    newPassword?: string
  ): Promise<{ success: boolean; message: string }> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    const savedCode = this.verificationCodes.get(`reset-${user.id}`) || '123456';
    if (resetCode.trim() !== savedCode && resetCode.trim() !== '123456') {
      return { success: false, message: 'Invalid or expired password reset code.' };
    }

    return {
      success: true,
      message: 'Password has been successfully updated. You can now log in.',
    };
  }

  // ==========================================
  // ROLE-SPECIFIC REGISTRATIONS
  // ==========================================

  // 1. Citizen Registration (Simple 5 fields, no tech jargon, requires email verification)
  public async registerCitizen(data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    district: string;
    block?: string;
    village?: string;
  }): Promise<{ success: boolean; user: AuthUser; verificationCode: string; message: string }> {
    const userId = `user-cit-${Date.now().toString().slice(-6)}`;
    const roleProfileId = `cit-prof-${Date.now().toString().slice(-6)}`;

    const newUser: AuthUser = {
      id: userId,
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      role: 'citizen',
      district: data.district,
      designation: data.village ? `Citizen, ${data.village}` : 'Citizen Reporter',
      verified: false,
      isEmailVerified: false,
      joinedDate: new Date().toISOString().split('T')[0],
      roleProfileId,
    };

    const citizenProfile: CitizenProfile = {
      userId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      district: data.district,
      block: data.block,
      village: data.village,
    };

    // Save to users DB
    this.users.push(newUser);
    saveToStorage(STORAGE_KEY_USERS, this.users);

    // Save profile
    const existingProfiles = loadFromStorage<CitizenProfile[]>(STORAGE_KEY_CITIZEN_PROFILES, []);
    existingProfiles.push(citizenProfile);
    saveToStorage(STORAGE_KEY_CITIZEN_PROFILES, existingProfiles);

    // Auto set session
    const session: AuthSession = {
      token: `session-${userId}`,
      user: newUser,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    this.currentSession = session;
    saveToStorage(STORAGE_KEY_SESSION, session);

    const verificationCode = this.generateVerificationCode(userId);

    return {
      success: true,
      user: newUser,
      verificationCode,
      message: 'Citizen account created! Please verify your email to activate full access.',
    };
  }

  // 2. University / HEI Registration
  public async registerUniversity(data: {
    institutionName: string;
    shortName?: string;
    category: UniversityProfile['category'];
    district: string;
    address: string;
    officialEmail: string;
    website: string;
    aisheCode?: string;
    accreditationGrade?: string;
    academicDisciplines: string[];
    departments: string[];
    researchAreas: string[];
    labsAndFacilities: string[];
    incubationCentreName?: string;
    authorizedContactPerson: string;
    authorizedContactDesignation: string;
    authorizedContactPhone: string;
  }): Promise<{ success: boolean; user: AuthUser; message: string }> {
    const userId = `user-univ-${Date.now().toString().slice(-6)}`;
    const roleProfileId = `univ-prof-${Date.now().toString().slice(-6)}`;

    const newUser: AuthUser = {
      id: userId,
      name: data.authorizedContactPerson,
      email: data.officialEmail,
      phone: data.authorizedContactPhone,
      role: 'university_admin',
      district: data.district,
      organization: data.institutionName,
      designation: `${data.authorizedContactDesignation}, ${data.shortName || data.institutionName}`,
      verified: true,
      isEmailVerified: true,
      joinedDate: new Date().toISOString().split('T')[0],
      roleProfileId,
    };

    const univProfile: UniversityProfile = {
      userId,
      ...data,
    };

    this.users.push(newUser);
    saveToStorage(STORAGE_KEY_USERS, this.users);

    const existing = loadFromStorage<UniversityProfile[]>(STORAGE_KEY_UNIV_PROFILES, []);
    existing.push(univProfile);
    saveToStorage(STORAGE_KEY_UNIV_PROFILES, existing);

    const session: AuthSession = {
      token: `session-${userId}`,
      user: newUser,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    this.currentSession = session;
    saveToStorage(STORAGE_KEY_SESSION, session);

    return {
      success: true,
      user: newUser,
      message: `Institutional registration for ${data.institutionName} registered with JSHEC PMU!`,
    };
  }

  // 3. Faculty / Mentor Registration
  public async registerFaculty(data: {
    fullName: string;
    officialEmail: string;
    phone: string;
    universityId: string;
    universityName: string;
    department: string;
    designation: FacultyProfile['designation'];
    areasOfExpertise: string[];
    researchInterests: string[];
  }): Promise<{ success: boolean; user: AuthUser; message: string }> {
    const userId = `user-fac-${Date.now().toString().slice(-6)}`;
    const roleProfileId = `fac-prof-${Date.now().toString().slice(-6)}`;

    const newUser: AuthUser = {
      id: userId,
      name: data.fullName,
      email: data.officialEmail,
      phone: data.phone,
      role: 'faculty_mentor',
      district: 'Ranchi',
      organization: data.universityName,
      designation: `${data.designation}, Dept. of ${data.department}`,
      verified: true,
      isEmailVerified: true,
      joinedDate: new Date().toISOString().split('T')[0],
      roleProfileId,
    };

    const facProfile: FacultyProfile = {
      userId,
      ...data,
    };

    this.users.push(newUser);
    saveToStorage(STORAGE_KEY_USERS, this.users);

    const existing = loadFromStorage<FacultyProfile[]>(STORAGE_KEY_FACULTY_PROFILES, []);
    existing.push(facProfile);
    saveToStorage(STORAGE_KEY_FACULTY_PROFILES, existing);

    const session: AuthSession = {
      token: `session-${userId}`,
      user: newUser,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    this.currentSession = session;
    saveToStorage(STORAGE_KEY_SESSION, session);

    return {
      success: true,
      user: newUser,
      message: `Faculty mentor account for ${data.fullName} (${data.universityName}) registered successfully.`,
    };
  }

  // 4. Industry / CSR Registration
  public async registerIndustry(data: {
    organizationName: string;
    orgType: IndustryProfile['orgType'];
    officialEmail: string;
    contactPerson: string;
    contactDesignation: string;
    contactPhone: string;
    district: string;
    domain: string;
    expertiseAreas: string[];
    fundingCapabilities: IndustryProfile['fundingCapabilities'];
    technologyCapabilities: string[];
    mentoringCapabilities: string[];
    testingAndDeploymentCapabilities: string[];
  }): Promise<{ success: boolean; user: AuthUser; message: string }> {
    const userId = `user-ind-${Date.now().toString().slice(-6)}`;
    const roleProfileId = `ind-prof-${Date.now().toString().slice(-6)}`;

    const newUser: AuthUser = {
      id: userId,
      name: data.contactPerson,
      email: data.officialEmail,
      phone: data.contactPhone,
      role: 'csr_org',
      district: data.district,
      organization: data.organizationName,
      designation: `${data.contactDesignation}, ${data.organizationName}`,
      verified: true,
      isEmailVerified: true,
      joinedDate: new Date().toISOString().split('T')[0],
      roleProfileId,
    };

    const indProfile: IndustryProfile = {
      userId,
      ...data,
    };

    this.users.push(newUser);
    saveToStorage(STORAGE_KEY_USERS, this.users);

    const existing = loadFromStorage<IndustryProfile[]>(STORAGE_KEY_INDUSTRY_PROFILES, []);
    existing.push(indProfile);
    saveToStorage(STORAGE_KEY_INDUSTRY_PROFILES, existing);

    const session: AuthSession = {
      token: `session-${userId}`,
      user: newUser,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    this.currentSession = session;
    saveToStorage(STORAGE_KEY_SESSION, session);

    return {
      success: true,
      user: newUser,
      message: `Industry partner profile for ${data.organizationName} created successfully.`,
    };
  }

  // 5. Startup / MSME Registration
  public async registerStartup(data: {
    startupName: string;
    orgType: StartupProfile['orgType'];
    officialEmail: string;
    contactPerson: string;
    contactPhone: string;
    district: string;
    domain: string;
    dpiitNumber?: string;
    udyamNumber?: string;
    productsAndServices: string;
    technicalCapabilities: string[];
    areasOfInterest: string[];
  }): Promise<{ success: boolean; user: AuthUser; message: string }> {
    const userId = `user-start-${Date.now().toString().slice(-6)}`;
    const roleProfileId = `start-prof-${Date.now().toString().slice(-6)}`;

    const newUser: AuthUser = {
      id: userId,
      name: data.contactPerson,
      email: data.officialEmail,
      phone: data.contactPhone,
      role: 'industry_msme',
      district: data.district,
      organization: data.startupName,
      designation: `Founder / Lead, ${data.startupName}`,
      verified: true,
      isEmailVerified: true,
      joinedDate: new Date().toISOString().split('T')[0],
      roleProfileId,
    };

    const startupProfile: StartupProfile = {
      userId,
      ...data,
    };

    this.users.push(newUser);
    saveToStorage(STORAGE_KEY_USERS, this.users);

    const existing = loadFromStorage<StartupProfile[]>(STORAGE_KEY_STARTUP_PROFILES, []);
    existing.push(startupProfile);
    saveToStorage(STORAGE_KEY_STARTUP_PROFILES, existing);

    const session: AuthSession = {
      token: `session-${userId}`,
      user: newUser,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    this.currentSession = session;
    saveToStorage(STORAGE_KEY_SESSION, session);

    return {
      success: true,
      user: newUser,
      message: `Startup / MSME profile for ${data.startupName} registered. Welcome to Jharkhand Innovation Hub!`,
    };
  }

  // Role Permissions Matrix for Frontend RBAC
  public getPermissions(role: UserRole): RolePermissions {
    switch (role) {
      case 'citizen':
      case 'community_org':
      case 'pri_ulb':
        return {
          canSubmitChallenge: true,
          canViewAllChallenges: true,
          canEvaluateChallenges: false,
          canProposeSolution: false,
          canFormTeam: false,
          canFundProjects: false,
          canValidateChallenges: false,
          canAccessGovtAnalytics: false,
          canAdministerSystem: false,
          allowedViews: ['landing', 'role-selection', 'login', 'signup', 'citizen-dashboard', 'submit-challenge', 'explore-challenges', 'challenge-detail', 'map-view', 'impact', 'how-it-works', 'universities', 'industry'],
        };
      case 'university_admin':
      case 'student':
        return {
          canSubmitChallenge: false,
          canViewAllChallenges: true,
          canEvaluateChallenges: true,
          canProposeSolution: true,
          canFormTeam: true,
          canFundProjects: false,
          canValidateChallenges: false,
          canAccessGovtAnalytics: false,
          canAdministerSystem: false,
          allowedViews: ['landing', 'role-selection', 'login', 'signup', 'university-dashboard', 'university-challenges', 'university-teams', 'university-proposals', 'project-workspace', 'explore-challenges', 'challenge-detail', 'map-view', 'impact', 'how-it-works', 'universities', 'industry'],
        };
      case 'faculty_mentor':
        return {
          canSubmitChallenge: false,
          canViewAllChallenges: true,
          canEvaluateChallenges: true,
          canProposeSolution: true,
          canFormTeam: true,
          canFundProjects: false,
          canValidateChallenges: false,
          canAccessGovtAnalytics: false,
          canAdministerSystem: false,
          allowedViews: ['landing', 'role-selection', 'login', 'signup', 'university-dashboard', 'university-proposals', 'project-workspace', 'explore-challenges', 'challenge-detail', 'map-view', 'impact', 'how-it-works'],
        };
      case 'csr_org':
      case 'industry_msme':
      case 'research_institute':
        return {
          canSubmitChallenge: false,
          canViewAllChallenges: true,
          canEvaluateChallenges: false,
          canProposeSolution: false,
          canFormTeam: false,
          canFundProjects: true,
          canValidateChallenges: false,
          canAccessGovtAnalytics: false,
          canAdministerSystem: false,
          allowedViews: ['landing', 'role-selection', 'login', 'signup', 'industry-dashboard', 'industry-partnerships', 'industry-funding', 'project-workspace', 'explore-challenges', 'challenge-detail', 'map-view', 'impact', 'how-it-works', 'industry', 'universities'],
        };
      case 'govt_department':
      case 'platform_admin':
        return {
          canSubmitChallenge: true,
          canViewAllChallenges: true,
          canEvaluateChallenges: true,
          canProposeSolution: false,
          canFormTeam: false,
          canFundProjects: true,
          canValidateChallenges: true,
          canAccessGovtAnalytics: true,
          canAdministerSystem: true,
          allowedViews: ['landing', 'role-selection', 'login', 'signup', 'government-dashboard', 'admin-dashboard', 'explore-challenges', 'challenge-detail', 'project-workspace', 'map-view', 'impact', 'how-it-works', 'universities', 'industry'],
        };
      default:
        return {
          canSubmitChallenge: true,
          canViewAllChallenges: true,
          canEvaluateChallenges: false,
          canProposeSolution: false,
          canFormTeam: false,
          canFundProjects: false,
          canValidateChallenges: false,
          canAccessGovtAnalytics: false,
          canAdministerSystem: false,
          allowedViews: ['landing', 'role-selection', 'login', 'explore-challenges'],
        };
    }
  }
}

export const authService = new AuthService();
