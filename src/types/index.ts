export type ActivityStatus = 'New' | 'Ongoing' | 'Completed' | 'Extended' | 'Discontinued';

export type UserRole = 'Administrator' | 'Researcher' | 'Viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  centerId: string;
  directorateId?: string;
  title: string;
  avatarUrl?: string;
}

export interface ResearchCenter {
  id: string;
  name: string;
  shortCode: string;
  zone: string;
  location: string;
  agroEcology: 'Highland' | 'Midland' | 'Lowland' | 'Pastoral / Arid' | 'Headquarters';
  mandate: string;
  director: string;
  establishedYear: number;
  activeStaffCount: number;
  focalCommodities: string[];
}

export interface Directorate {
  id: string;
  name: string;
  code: string;
  director: string;
  description: string;
  teams: ResearchTeam[];
}

export interface ResearchTeam {
  id: string;
  directorateId: string;
  name: string;
  leadScientist: string;
  focusAreas: string[];
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  deliverableSummary?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  type: 'Variety Release' | 'Journal Publication' | 'Technical Manual' | 'Patent / Prototype' | 'Policy Brief' | 'Conference Paper';
  status: 'Draft' | 'Submitted' | 'Published' | 'Certified';
  date: string;
  linkOrRef?: string;
}

export interface ExtensionRequest {
  id: string;
  requestedMonths: number;
  previousEndDate: string;
  newEndDate: string;
  justification: string;
  requestedBy: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewDate?: string;
  reviewNotes?: string;
}

export interface ResearchActivity {
  id: string;
  code: string; // e.g. IQQO-CR-SIN-2026-01
  title: string;
  centerId: string;
  directorateId: string;
  teamId: string;
  status: ActivityStatus;
  progressPercent: number; // 0 to 100
  principalInvestigator: string;
  piEmail: string;
  collaborators: string[];
  fiscalYear: number;
  startDate: string;
  endDate: string;
  budgetAllocatedETB: number; // in Ethiopian Birr
  budgetUtilizedETB: number;
  objectives: string[];
  methodology: string;
  expectedOutputs: string;
  targetAgroEcology: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  extensionHistory: ExtensionRequest[];
  lastUpdated: string;
  // Natural Resource Research Directorate & Action Plan Performance Fields
  yearStartEC?: number | string;
  yearCompletionEC?: number | string;
  performanceBeforeYearPercent?: number;
  targetCurrentYearPercent?: number;
  quarterPlan?: number;
  quarterPerformance?: number;
  quarterPerformancePercent?: number;
  planTillQuarter?: number;
  performanceTillQuarter?: number;
  performanceFromYearPlanPercent?: number;
  overallPerformancePercent?: number;
  underPerformanceReason?: string;
  // 2018 E.C. Completed Activities & Presentation Fields
  presentationDecision?: 'Will be presented' | 'Will not presented' | string;
  nonPresentationReason?: string;
  initiators?: string;
  researchTeamName?: string;
  yearStartedEC?: number | string;
  performanceBefore2016EC?: number;
  yearlyPlanDistributionPercent?: number;
  q2Plan?: number;
  q2Performance?: number;
  q2PerformancePercent?: number;
  planTillQ2?: number;
  performanceTillQ2?: number;
  performanceTillQ2Percent?: number;
  performanceFrom2016Plan?: number;
  reasonUnderperformance?: string;
}

export interface SchemaTableField {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
  isNullable?: boolean;
  description: string;
}

export interface SchemaTable {
  tableName: string;
  description: string;
  fields: SchemaTableField[];
  indexes: string[];
  rlsPolicies: {
    role: UserRole;
    permissions: string;
    description: string;
  }[];
}
