import { SchemaTable } from '../types';

export const DATABASE_SCHEMA_TABLES: SchemaTable[] = [
  {
    tableName: 'research_centers',
    description: 'Stores the 18 regional research centers and HQ comprising the Oromia Agricultural Research Institute (IQQO) network.',
    fields: [
      { name: 'center_id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'Unique identifier / slug (e.g., adami-tulu, sinana-arc, holeta-bee)' },
      { name: 'code', type: 'VARCHAR(16)', description: 'Official short code acronym (e.g., ATARC, SARC, HBRC)' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Full official English and Afaan Oromoo institutional name' },
      { name: 'zone', type: 'VARCHAR(128)', description: 'Administrative Zone in Oromia (e.g., East Shewa, Bale, Borana)' },
      { name: 'agro_ecology', type: 'VARCHAR(64)', description: 'Highland, Midland, Lowland, Pastoral/Arid, or Headquarters' },
      { name: 'location', type: 'VARCHAR(255)', description: 'Town and geographic coordinates' },
      { name: 'mandate', type: 'TEXT', description: 'Institutional commodity or thematic mandate description' },
      { name: 'director_name', type: 'VARCHAR(128)', description: 'Current center director or coordinator' },
      { name: 'established_year', type: 'INTEGER', description: 'Year established (e.g., 1968, 1986)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Record creation timestamp with UTC timezone' }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_center_code ON research_centers(code)', 'CREATE INDEX idx_center_zone ON research_centers(zone)'],
    rlsPolicies: [
      { role: 'Administrator', permissions: 'ALL (SELECT, INSERT, UPDATE, DELETE)', description: 'Full administrative authority to configure center metadata and director appointments.' },
      { role: 'Researcher', permissions: 'SELECT', description: 'Read-only access to browse all center profiles and locations.' },
      { role: 'Viewer', permissions: 'SELECT', description: 'Read-only public inspection of center information.' }
    ]
  },
  {
    tableName: 'directorates',
    description: 'The 10 core scientific directorates and HQ research processes coordinating agricultural commodities and cross-cutting themes.',
    fields: [
      { name: 'directorate_id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'Slug ID (e.g., crop-research, livestock-research, biotechnology)' },
      { name: 'code', type: 'VARCHAR(16)', description: 'Directorate code (e.g., CRD, LRD, NRRD, FSRD, AERD)' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Full directorate name' },
      { name: 'director_name', type: 'VARCHAR(128)', description: 'Director name appointed at IQQO HQ' },
      { name: 'description', type: 'TEXT', description: 'Strategic scope and national agricultural policy alignment' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp of record registration' }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_directorate_code ON directorates(code)'],
    rlsPolicies: [
      { role: 'Administrator', permissions: 'ALL', description: 'Can add, edit, and restructure directorates.' },
      { role: 'Researcher', permissions: 'SELECT', description: 'Read-only access to view directorate portfolio details.' },
      { role: 'Viewer', permissions: 'SELECT', description: 'Read-only access.' }
    ]
  },
  {
    tableName: 'research_teams',
    description: 'Specialized scientific commodity and discipline teams nested under each Directorate.',
    fields: [
      { name: 'team_id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'Team identifier (e.g., team-cereal-crops, team-dairy-beef)' },
      { name: 'directorate_id', type: 'VARCHAR(64)', isForeignKey: true, references: 'directorates(directorate_id)', description: 'Parent scientific directorate' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Team title (e.g., Cereal Crops Research Team)' },
      { name: 'lead_scientist', type: 'VARCHAR(128)', description: 'National or regional research lead' },
      { name: 'focus_areas', type: 'TEXT[]', description: 'Array of core research focus commodities and techniques' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Registration timestamp' }
    ],
    indexes: ['CREATE INDEX idx_teams_directorate ON research_teams(directorate_id)'],
    rlsPolicies: [
      { role: 'Administrator', permissions: 'ALL', description: 'Full CRUD on team structures and lead scientist assignments.' },
      { role: 'Researcher', permissions: 'SELECT', description: 'Read-only access to team directory.' },
      { role: 'Viewer', permissions: 'SELECT', description: 'Read-only access.' }
    ]
  },
  {
    tableName: 'users',
    description: 'System user identities with assigned privilege roles, centers, and directorate affiliations.',
    fields: [
      { name: 'user_id', type: 'UUID', isPrimaryKey: true, description: 'Unique user identifier' },
      { name: 'email', type: 'VARCHAR(255)', description: 'Official IQQO institutional email (@iqqo.gov.et)' },
      { name: 'full_name', type: 'VARCHAR(128)', description: 'Researcher or administrator name' },
      { name: 'role', type: 'VARCHAR(32)', description: 'Privilege Level: Administrator | Researcher | Viewer' },
      { name: 'center_id', type: 'VARCHAR(64)', isForeignKey: true, references: 'research_centers(center_id)', description: 'Home research center affiliation' },
      { name: 'directorate_id', type: 'VARCHAR(64)', isForeignKey: true, isNullable: true, references: 'directorates(directorate_id)', description: 'Primary directorate affiliation' },
      { name: 'title', type: 'VARCHAR(128)', description: 'Academic or administrative rank (e.g., Senior Wheat Breeder)' },
      { name: 'is_active', type: 'BOOLEAN', description: 'Account status flag' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Creation date' }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_users_email ON users(email)', 'CREATE INDEX idx_users_role_center ON users(role, center_id)'],
    rlsPolicies: [
      { role: 'Administrator', permissions: 'ALL', description: 'Full user account administration and role provisioning.' },
      { role: 'Researcher', permissions: 'SELECT own profile and peers; UPDATE own profile', description: 'Can view colleagues and update personal profile data.' },
      { role: 'Viewer', permissions: 'SELECT researcher directory', description: 'Read-only directory access.' }
    ]
  },
  {
    tableName: 'research_activities',
    description: 'Core activity entity tracking research projects, lifecycle statuses, budget allocations, and timelines.',
    fields: [
      { name: 'activity_id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'Primary key (UUID or slug)' },
      { name: 'code', type: 'VARCHAR(64)', description: 'Institutional activity code (e.g., IQQO-CRD-SIN-2025-01)' },
      { name: 'title', type: 'VARCHAR(512)', description: 'Full scientific activity title' },
      { name: 'center_id', type: 'VARCHAR(64)', isForeignKey: true, references: 'research_centers(center_id)', description: 'Executing center' },
      { name: 'directorate_id', type: 'VARCHAR(64)', isForeignKey: true, references: 'directorates(directorate_id)', description: 'Governing directorate' },
      { name: 'team_id', type: 'VARCHAR(64)', isForeignKey: true, references: 'research_teams(team_id)', description: 'Assigned research team' },
      { name: 'status', type: 'VARCHAR(32)', description: 'ENUM: New | Ongoing | Completed | Extended | Discontinued' },
      { name: 'progress_percent', type: 'INTEGER', description: 'Progress percentage (0 to 100)' },
      { name: 'pi_user_id', type: 'UUID', isForeignKey: true, references: 'users(user_id)', description: 'Principal Investigator' },
      { name: 'fiscal_year', type: 'INTEGER', description: 'Ethiopian fiscal year (e.g., 2024, 2025, 2026)' },
      { name: 'start_date', type: 'DATE', description: 'Official project start date' },
      { name: 'end_date', type: 'DATE', description: 'Scheduled project completion date' },
      { name: 'budget_allocated_etb', type: 'NUMERIC(14,2)', description: 'Total approved budget in Ethiopian Birr (ETB)' },
      { name: 'budget_utilized_etb', type: 'NUMERIC(14,2)', description: 'Cumulative expenditure incurred to date in ETB' },
      { name: 'target_agro_ecology', type: 'VARCHAR(128)', description: 'Target zone/altitude belt' },
      { name: 'objectives', type: 'TEXT[]', description: 'Array of specific, measurable scientific objectives' },
      { name: 'methodology', type: 'TEXT', description: 'Experimental design, replication, and statistical analysis model' },
      { name: 'expected_outputs', type: 'TEXT', description: 'Planned technologies, publications, and seed quantities' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Initial registration date' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', description: 'Last progress update timestamp' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_activities_code ON research_activities(code)',
      'CREATE INDEX idx_activities_center_status ON research_activities(center_id, status)',
      'CREATE INDEX idx_activities_directorate ON research_activities(directorate_id)',
      'CREATE INDEX idx_activities_dates ON research_activities(start_date, end_date)'
    ],
    rlsPolicies: [
      { role: 'Administrator', permissions: 'ALL', description: 'Unrestricted control: create, edit, approve, delete, and override lifecycle status.' },
      { role: 'Researcher', permissions: 'SELECT ALL; INSERT (for own center); UPDATE (where pi_user_id = auth.uid() OR center_id = user.center_id)', description: 'Researchers can view all institutional projects to prevent duplication; create proposals for their center; update milestones and progress for their assigned projects.' },
      { role: 'Viewer', permissions: 'SELECT ALL', description: 'Read-only access to all activities and metrics.' }
    ]
  },
  {
    tableName: 'activity_milestones',
    description: 'Quarterly and phase milestones tracking step-by-step progress towards activity completion.',
    fields: [
      { name: 'milestone_id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'Milestone UUID' },
      { name: 'activity_id', type: 'VARCHAR(64)', isForeignKey: true, references: 'research_activities(activity_id)', description: 'Parent activity' },
      { name: 'title', type: 'VARCHAR(255)', description: 'Deliverable milestone description' },
      { name: 'due_date', type: 'DATE', description: 'Target deadline' },
      { name: 'is_completed', type: 'BOOLEAN', description: 'Milestone achievement status' },
      { name: 'completed_date', type: 'DATE', isNullable: true, description: 'Date milestone was certified complete' },
      { name: 'deliverable_summary', type: 'TEXT', isNullable: true, description: 'Summary notes or output metrics' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp' }
    ],
    indexes: ['CREATE INDEX idx_milestones_activity ON activity_milestones(activity_id, is_completed)'],
    rlsPolicies: [
      { role: 'Administrator', permissions: 'ALL', description: 'Can create, edit, and mark milestones as verified.' },
      { role: 'Researcher', permissions: 'SELECT ALL; INSERT, UPDATE (if PI or team member on parent activity)', description: 'Can manage milestones for assigned research projects.' },
      { role: 'Viewer', permissions: 'SELECT ALL', description: 'Read-only access.' }
    ]
  },
  {
    tableName: 'activity_deliverables',
    description: 'Tangible scientific outputs including certified variety releases, publications, manuals, and patents.',
    fields: [
      { name: 'deliverable_id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'Output identifier' },
      { name: 'activity_id', type: 'VARCHAR(64)', isForeignKey: true, references: 'research_activities(activity_id)', description: 'Originating research activity' },
      { name: 'title', type: 'VARCHAR(512)', description: 'Title of release, paper, or technology package' },
      { name: 'deliverable_type', type: 'VARCHAR(64)', description: 'Variety Release | Journal Publication | Technical Manual | Patent | Policy Brief' },
      { name: 'status', type: 'VARCHAR(32)', description: 'Draft | Submitted | Published | Certified' },
      { name: 'publication_date', type: 'DATE', description: 'Release or gazette date' },
      { name: 'reference_url', type: 'VARCHAR(512)', isNullable: true, description: 'DOI link, repository reference, or bulletin number' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Creation date' }
    ],
    indexes: ['CREATE INDEX idx_deliverables_activity ON activity_deliverables(activity_id)', 'CREATE INDEX idx_deliverables_type ON activity_deliverables(deliverable_type)'],
    rlsPolicies: [
      { role: 'Administrator', permissions: 'ALL', description: 'Institutional publication oversight and certification.' },
      { role: 'Researcher', permissions: 'SELECT ALL; INSERT, UPDATE (on own activity deliverables)', description: 'Researchers log and attach draft publications and release dossiers.' },
      { role: 'Viewer', permissions: 'SELECT ALL', description: 'Read-only access to published technologies.' }
    ]
  },
  {
    tableName: 'extension_requests',
    description: 'Formal governance audit trail for project timeline extensions with justification and director approval.',
    fields: [
      { name: 'request_id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'Extension record identifier' },
      { name: 'activity_id', type: 'VARCHAR(64)', isForeignKey: true, references: 'research_activities(activity_id)', description: 'Extended activity' },
      { name: 'requested_months', type: 'INTEGER', description: 'Number of additional months requested (e.g., 3, 6, 12)' },
      { name: 'previous_end_date', type: 'DATE', description: 'Original scheduled completion date' },
      { name: 'new_end_date', type: 'DATE', description: 'Proposed revised completion date' },
      { name: 'justification', type: 'TEXT', description: 'Scientific, climate, or logistical justification' },
      { name: 'requested_by_user_id', type: 'UUID', isForeignKey: true, references: 'users(user_id)', description: 'Researcher submitting request' },
      { name: 'request_status', type: 'VARCHAR(32)', description: 'Pending | Approved | Rejected' },
      { name: 'reviewed_by_user_id', type: 'UUID', isForeignKey: true, isNullable: true, references: 'users(user_id)', description: 'HQ Director General or RRC Chair' },
      { name: 'review_date', type: 'TIMESTAMPTZ', isNullable: true, description: 'Date of review decision' },
      { name: 'review_notes', type: 'TEXT', isNullable: true, description: 'Conditions or remarks attached to decision' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Submission timestamp' }
    ],
    indexes: ['CREATE INDEX idx_extensions_activity ON extension_requests(activity_id, request_status)'],
    rlsPolicies: [
      { role: 'Administrator', permissions: 'ALL (can approve or reject requests)', description: 'Review and approve/reject extension petitions.' },
      { role: 'Researcher', permissions: 'SELECT ALL; INSERT (request extension for own activity)', description: 'Submit extension requests with justification.' },
      { role: 'Viewer', permissions: 'SELECT ALL', description: 'Read-only access to approved extension records.' }
    ]
  },
  {
    tableName: 'budget_ledger',
    description: 'Financial ledger tracking budget tranches, operational expenses, and expenditure utilization.',
    fields: [
      { name: 'ledger_id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'Transaction record ID' },
      { name: 'activity_id', type: 'VARCHAR(64)', isForeignKey: true, references: 'research_activities(activity_id)', description: 'Related activity' },
      { name: 'transaction_type', type: 'VARCHAR(32)', description: 'Allocation | Expenditure | Adjustment' },
      { name: 'amount_etb', type: 'NUMERIC(14,2)', description: 'Transaction amount in Ethiopian Birr (ETB)' },
      { name: 'expense_category', type: 'VARCHAR(64)', description: 'Field Trials | Lab Reagents | Farm Implements | Travel & Per Diem | Publication' },
      { name: 'description', type: 'TEXT', description: 'Itemized voucher description' },
      { name: 'authorized_by', type: 'VARCHAR(128)', description: 'Center finance officer or director' },
      { name: 'transaction_date', type: 'DATE', description: 'Voucher date' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Timestamp' }
    ],
    indexes: ['CREATE INDEX idx_budget_activity ON budget_ledger(activity_id, transaction_date)'],
    rlsPolicies: [
      { role: 'Administrator', permissions: 'ALL', description: 'Audit and approve budget authorizations.' },
      { role: 'Researcher', permissions: 'SELECT for own center; INSERT expenditure receipts', description: 'Log project expenditures.' },
      { role: 'Viewer', permissions: 'SELECT aggregated summaries only', description: 'Cannot view individual financial vouchers.' }
    ]
  }
];

export const SQL_DDL_SCRIPT = `-- =====================================================================
-- Oromia Agricultural Research Institute (IQQO)
-- Research Activities Management System Database Schema
-- Compatible with PostgreSQL 15+, Cloud SQL, and Supabase
-- =====================================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE activity_status_enum AS ENUM (
  'New',
  'Ongoing',
  'Completed',
  'Extended',
  'Discontinued'
);

CREATE TYPE user_role_enum AS ENUM (
  'Administrator',
  'Researcher',
  'Viewer'
);

CREATE TYPE deliverable_type_enum AS ENUM (
  'Variety Release',
  'Journal Publication',
  'Technical Manual',
  'Patent / Prototype',
  'Policy Brief',
  'Conference Paper'
);

-- 2. RESEARCH CENTERS TABLE (18 IQQO Centers)
CREATE TABLE research_centers (
  center_id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  zone VARCHAR(128) NOT NULL,
  agro_ecology VARCHAR(64) NOT NULL,
  location VARCHAR(255) NOT NULL,
  mandate TEXT NOT NULL,
  director_name VARCHAR(128) NOT NULL,
  established_year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DIRECTORATES TABLE (10 Scientific Directorates + HQ Process)
CREATE TABLE directorates (
  directorate_id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  director_name VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RESEARCH TEAMS TABLE
CREATE TABLE research_teams (
  team_id VARCHAR(64) PRIMARY KEY,
  directorate_id VARCHAR(64) NOT NULL REFERENCES directorates(directorate_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  lead_scientist VARCHAR(128) NOT NULL,
  focus_areas TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. USERS & RBAC PRIVILEGES TABLE
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(128) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'Researcher',
  center_id VARCHAR(64) NOT NULL REFERENCES research_centers(center_id),
  directorate_id VARCHAR(64) REFERENCES directorates(directorate_id),
  title VARCHAR(128) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. RESEARCH ACTIVITIES TABLE (Core Entity)
CREATE TABLE research_activities (
  activity_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  code VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(512) NOT NULL,
  center_id VARCHAR(64) NOT NULL REFERENCES research_centers(center_id),
  directorate_id VARCHAR(64) NOT NULL REFERENCES directorates(directorate_id),
  team_id VARCHAR(64) NOT NULL REFERENCES research_teams(team_id),
  status activity_status_enum NOT NULL DEFAULT 'New',
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  pi_user_id UUID NOT NULL REFERENCES users(user_id),
  fiscal_year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_allocated_etb NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  budget_utilized_etb NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  target_agro_ecology VARCHAR(128) NOT NULL,
  objectives TEXT[] NOT NULL DEFAULT '{}',
  methodology TEXT NOT NULL,
  expected_outputs TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_dates CHECK (end_date >= start_date)
);

-- 7. ACTIVITY MILESTONES TABLE
CREATE TABLE activity_milestones (
  milestone_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  activity_id VARCHAR(64) NOT NULL REFERENCES research_activities(activity_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  due_date DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_date DATE,
  deliverable_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DELIVERABLES & PUBLICATIONS TABLE
CREATE TABLE activity_deliverables (
  deliverable_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  activity_id VARCHAR(64) NOT NULL REFERENCES research_activities(activity_id) ON DELETE CASCADE,
  title VARCHAR(512) NOT NULL,
  deliverable_type deliverable_type_enum NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Draft',
  publication_date DATE NOT NULL,
  reference_url VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. EXTENSION REQUESTS TABLE (Lifecycle Governance)
CREATE TABLE extension_requests (
  request_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  activity_id VARCHAR(64) NOT NULL REFERENCES research_activities(activity_id) ON DELETE CASCADE,
  requested_months INTEGER NOT NULL CHECK (requested_months > 0),
  previous_end_date DATE NOT NULL,
  new_end_date DATE NOT NULL,
  justification TEXT NOT NULL,
  requested_by_user_id UUID NOT NULL REFERENCES users(user_id),
  request_status VARCHAR(32) NOT NULL DEFAULT 'Pending',
  reviewed_by_user_id UUID REFERENCES users(user_id),
  review_date TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE research_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE extension_requests ENABLE ROW LEVEL SECURITY;

-- Policy A: Viewers have universal SELECT
CREATE POLICY "Viewers can read all activities"
  ON research_activities FOR SELECT
  USING (true);

-- Policy B: Researchers can insert in their assigned center
CREATE POLICY "Researchers can propose activities for their center"
  ON research_activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = auth.uid()
        AND users.role IN ('Researcher', 'Administrator')
        AND (users.center_id = research_activities.center_id OR users.role = 'Administrator')
    )
  );

-- Policy C: Researchers can update their own projects; Admins can update all
CREATE POLICY "Researchers update own activities, Admins update all"
  ON research_activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = auth.uid()
        AND (users.role = 'Administrator' OR users.user_id = research_activities.pi_user_id)
    )
  );

-- Policy D: Only Administrators can delete activities
CREATE POLICY "Only Administrators can delete activities"
  ON research_activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = auth.uid() AND users.role = 'Administrator'
    )
  );
`;
