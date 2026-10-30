import React, { useState } from 'react';
import { DATABASE_SCHEMA_TABLES, SQL_DDL_SCRIPT } from '../data/databaseSchemaData';
import { SchemaTable, UserRole } from '../types';
import {
  Database,
  Table,
  Key,
  Shield,
  Code2,
  Copy,
  Check,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const DatabaseSchemaViewer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<SchemaTable>(DATABASE_SCHEMA_TABLES[4]); // research_activities
  const [copied, setCopied] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'erd' | 'tables' | 'rls' | 'sql'>('erd');

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SQL_DDL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const erdNodes = [
    { id: 'research_centers', name: 'research_centers', pk: 'center_id', fks: [] },
    { id: 'directorates', name: 'directorates', pk: 'directorate_id', fks: [] },
    { id: 'research_teams', name: 'research_teams', pk: 'team_id', fks: ['directorate_id -> directorates'] },
    { id: 'users', name: 'users', pk: 'user_id', fks: ['center_id -> centers', 'directorate_id -> directorates'] },
    { id: 'research_activities', name: 'research_activities', pk: 'activity_id', fks: ['center_id -> centers', 'directorate_id -> directorates', 'team_id -> teams', 'pi_user_id -> users'] },
    { id: 'activity_milestones', name: 'activity_milestones', pk: 'milestone_id', fks: ['activity_id -> activities'] },
    { id: 'activity_deliverables', name: 'activity_deliverables', pk: 'deliverable_id', fks: ['activity_id -> activities'] },
    { id: 'extension_requests', name: 'extension_requests', pk: 'request_id', fks: ['activity_id -> activities', 'requested_by -> users'] },
    { id: 'budget_ledger', name: 'budget_ledger', pk: 'ledger_id', fks: ['activity_id -> activities'] },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                PostgreSQL · Cloud SQL Relational Architecture
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-stone-500 font-mono">10 Relational Tables</span>
            </div>
            <h2 className="text-base font-bold text-stone-900 mt-1">
              Institutional Database Schema & Access Privilege Architecture
            </h2>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed max-w-3xl">
              Normalized relational schema designed for Oromia Agricultural Research Institute (IQQO).
              Supports hierarchical governance across 18 centers, 10 directorates, multi-disciplinary research teams,
              and lifecycle tracking with Row-Level Security (RLS) enforcement.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex items-center bg-stone-100 p-1 rounded-md text-xs">
            <button
              onClick={() => setActiveSchemaTab('erd')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeSchemaTab === 'erd' ? 'bg-white shadow-xs font-bold text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Interactive ERD
            </button>
            <button
              onClick={() => setActiveSchemaTab('tables')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeSchemaTab === 'tables' ? 'bg-white shadow-xs font-bold text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Table Dictionary
            </button>
            <button
              onClick={() => setActiveSchemaTab('rls')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeSchemaTab === 'rls' ? 'bg-white shadow-xs font-bold text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              3-Level RBAC & RLS
            </button>
            <button
              onClick={() => setActiveSchemaTab('sql')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeSchemaTab === 'sql' ? 'bg-white shadow-xs font-bold text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              SQL DDL Script
            </button>
          </div>
        </div>
      </div>

      {/* ERD Visual Map View */}
      {activeSchemaTab === 'erd' && (
        <div className="bg-stone-900 text-stone-100 p-6 rounded-xl border border-stone-800 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Entity Relationship Diagram (ERD) & Foreign Key Flow</h3>
              <p className="text-xs text-stone-400">Institutional relationship matrix from Centers down to Milestones & Ledger</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Primary Entities
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Core Lifecycle
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Detail / Child Entities
              </span>
            </div>
          </div>

          {/* Visual Diagram Representation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Institutional Core */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
                01. Governance & Institutions
              </div>

              <div
                onClick={() => {
                  setSelectedTable(DATABASE_SCHEMA_TABLES.find(t => t.tableName === 'research_centers')!);
                  setActiveSchemaTab('tables');
                }}
                className="p-3 rounded-lg bg-stone-800/80 border border-emerald-500/40 hover:border-emerald-400 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400">research_centers</span>
                  <span className="text-[10px] text-stone-400 font-mono">18 Centers</span>
                </div>
                <div className="text-[11px] text-stone-300">
                  <span className="font-mono text-emerald-300">PK center_id</span> · code · zone · mandate
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedTable(DATABASE_SCHEMA_TABLES.find(t => t.tableName === 'directorates')!);
                  setActiveSchemaTab('tables');
                }}
                className="p-3 rounded-lg bg-stone-800/80 border border-emerald-500/40 hover:border-emerald-400 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400">directorates</span>
                  <span className="text-[10px] text-stone-400 font-mono">10 Scientific</span>
                </div>
                <div className="text-[11px] text-stone-300">
                  <span className="font-mono text-emerald-300">PK directorate_id</span> · code · director
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedTable(DATABASE_SCHEMA_TABLES.find(t => t.tableName === 'research_teams')!);
                  setActiveSchemaTab('tables');
                }}
                className="p-3 rounded-lg bg-stone-800/80 border border-stone-700 hover:border-emerald-400 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-200">research_teams</span>
                  <span className="text-[10px] text-stone-400 font-mono">Commodity Teams</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  <span className="font-mono text-stone-300">PK team_id</span> · <span className="text-amber-300 font-mono">FK directorate_id</span>
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedTable(DATABASE_SCHEMA_TABLES.find(t => t.tableName === 'users')!);
                  setActiveSchemaTab('tables');
                }}
                className="p-3 rounded-lg bg-stone-800/80 border border-stone-700 hover:border-emerald-400 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-200">users (RBAC)</span>
                  <span className="text-[10px] text-stone-400 font-mono">Scientists & DG</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  <span className="font-mono text-stone-300">PK user_id</span> · role (Admin/Researcher/Viewer)
                </div>
              </div>
            </div>

            {/* Column 2: Central Activity Hub */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
                02. Core Activity Hub (1:N Focal Point)
              </div>

              <div
                onClick={() => {
                  setSelectedTable(DATABASE_SCHEMA_TABLES.find(t => t.tableName === 'research_activities')!);
                  setActiveSchemaTab('tables');
                }}
                className="p-4 rounded-lg bg-sky-950/40 border-2 border-sky-500 shadow-md cursor-pointer hover:border-sky-400 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-sky-300">research_activities</span>
                  <span className="text-[10px] font-mono bg-sky-900 text-sky-200 px-1.5 py-0.5 rounded">Core Entity</span>
                </div>
                <p className="text-[11px] text-stone-300">
                  Central registry tracking codes, titles, status lifecycle, progress percentage, and budgets.
                </p>
                <div className="space-y-1 text-[11px] font-mono text-stone-300 border-t border-sky-800/80 pt-2">
                  <div className="text-emerald-400 font-bold">PK activity_id</div>
                  <div className="text-amber-300">FK center_id → research_centers</div>
                  <div className="text-amber-300">FK directorate_id → directorates</div>
                  <div className="text-amber-300">FK team_id → research_teams</div>
                  <div className="text-amber-300">FK pi_user_id → users</div>
                  <div className="text-stone-400">status (New | Ongoing | Completed...)</div>
                  <div className="text-stone-400">progress_percent (0–100)</div>
                  <div className="text-stone-400">budget_allocated_etb & utilized</div>
                </div>
              </div>
            </div>

            {/* Column 3: Child Deliverables & Operations */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
                03. Milestones & Operational Ledger
              </div>

              <div
                onClick={() => {
                  setSelectedTable(DATABASE_SCHEMA_TABLES.find(t => t.tableName === 'activity_milestones')!);
                  setActiveSchemaTab('tables');
                }}
                className="p-3 rounded-lg bg-stone-800/80 border border-stone-700 hover:border-amber-400 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">activity_milestones</span>
                  <span className="text-[10px] text-stone-400 font-mono">Phase Deliverables</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  <span className="font-mono text-stone-300">PK milestone_id</span> · <span className="text-amber-300 font-mono">FK activity_id</span> · is_completed
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedTable(DATABASE_SCHEMA_TABLES.find(t => t.tableName === 'activity_deliverables')!);
                  setActiveSchemaTab('tables');
                }}
                className="p-3 rounded-lg bg-stone-800/80 border border-stone-700 hover:border-amber-400 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">activity_deliverables</span>
                  <span className="text-[10px] text-stone-400 font-mono">Varieties & Papers</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  <span className="font-mono text-stone-300">PK deliverable_id</span> · <span className="text-amber-300 font-mono">FK activity_id</span> · deliverable_type
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedTable(DATABASE_SCHEMA_TABLES.find(t => t.tableName === 'extension_requests')!);
                  setActiveSchemaTab('tables');
                }}
                className="p-3 rounded-lg bg-stone-800/80 border border-stone-700 hover:border-amber-400 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">extension_requests</span>
                  <span className="text-[10px] text-stone-400 font-mono">Governance Audit</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  <span className="font-mono text-stone-300">PK request_id</span> · <span className="text-amber-300 font-mono">FK activity_id</span> · requested_months
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedTable(DATABASE_SCHEMA_TABLES.find(t => t.tableName === 'budget_ledger')!);
                  setActiveSchemaTab('tables');
                }}
                className="p-3 rounded-lg bg-stone-800/80 border border-stone-700 hover:border-amber-400 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">budget_ledger</span>
                  <span className="text-[10px] text-stone-400 font-mono">ETB Vouchers</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  <span className="font-mono text-stone-300">PK ledger_id</span> · <span className="text-amber-300 font-mono">FK activity_id</span> · amount_etb
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Dictionary View */}
      {activeSchemaTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table List Sidebar */}
          <div className="lg:col-span-4 space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400 px-1 mb-2">
              Schema Tables ({DATABASE_SCHEMA_TABLES.length})
            </div>
            {DATABASE_SCHEMA_TABLES.map(table => {
              const isSelected = selectedTable.tableName === table.tableName;
              return (
                <button
                  key={table.tableName}
                  onClick={() => setSelectedTable(table)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white font-semibold'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-mono font-bold">{table.tableName}</div>
                  <div className={`text-[11px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                    {table.fields.length} columns · {table.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Table Detail View */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-stone-200 p-5 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-stone-900">
                  {selectedTable.tableName}
                </span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs font-mono text-stone-500">
                  {selectedTable.fields.length} Columns
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">{selectedTable.description}</p>
            </div>

            {/* Field Definitions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Column Name</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Constraints</th>
                    <th className="py-2 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {selectedTable.fields.map(field => (
                    <tr key={field.name} className="hover:bg-stone-50/50">
                      <td className="py-2 px-3 font-mono font-bold text-stone-800 whitespace-nowrap">
                        {field.name}
                      </td>
                      <td className="py-2 px-3 font-mono text-emerald-800 whitespace-nowrap">
                        {field.type}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-[11px]">
                        {field.isPrimaryKey && (
                          <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold mr-1">
                            PK
                          </span>
                        )}
                        {field.isForeignKey && (
                          <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono mr-1">
                            FK → {field.references}
                          </span>
                        )}
                        {field.isNullable && (
                          <span className="text-stone-400">nullable</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-stone-600">
                        {field.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Indexes */}
            {selectedTable.indexes?.length > 0 && (
              <div className="space-y-1.5 pt-3 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Database Indexes</h4>
                <div className="space-y-1">
                  {selectedTable.indexes.map((idx, i) => (
                    <div key={i} className="font-mono text-[11px] bg-stone-50 p-1.5 rounded border border-stone-200 text-stone-700">
                      {idx}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RBAC & Row-Level Security Matrix */}
      {activeSchemaTab === 'rls' && (
        <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold text-stone-900">
              Three-Level Privilege Model & Row-Level Security (RLS) Specification
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Strict multi-tenant security rules applied directly at the database engine level (PostgreSQL / Supabase / Cloud SQL)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Role 1: Administrator */}
            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/40 space-y-2.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700" />
                <h4 className="text-sm font-bold text-stone-900">1. Administrator (HQ DG)</h4>
              </div>
              <div className="text-xs text-stone-600 leading-relaxed">
                Represents Institutional Director General, Research Directorate Chairs, and System Admins.
              </div>
              <div className="pt-2 border-t border-amber-200/60 space-y-1 text-xs">
                <div className="font-semibold text-stone-800">Permissions:</div>
                <div className="text-emerald-800 font-mono">SELECT, INSERT, UPDATE, DELETE (Universal)</div>
                <ul className="list-disc list-inside text-stone-600 text-[11px] pt-1 space-y-0.5">
                  <li>Approve or reject proposed research activities</li>
                  <li>Review and grant project lifecycle extension requests</li>
                  <li>Reallocate institutional research budgets</li>
                  <li>Provision researcher accounts and assign centers</li>
                </ul>
              </div>
            </div>

            {/* Role 2: Researcher */}
            <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-2.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700" />
                <h4 className="text-sm font-bold text-stone-900">2. Researcher (PI / Scientist)</h4>
              </div>
              <div className="text-xs text-stone-600 leading-relaxed">
                Principal Investigators, Commodity Breeders, and Research Team members.
              </div>
              <div className="pt-2 border-t border-emerald-200/60 space-y-1 text-xs">
                <div className="font-semibold text-stone-800">Permissions:</div>
                <div className="text-emerald-800 font-mono">SELECT ALL; INSERT (Assigned Center); UPDATE (Assigned Activities)</div>
                <ul className="list-disc list-inside text-stone-600 text-[11px] pt-1 space-y-0.5">
                  <li>Propose new activities for their center</li>
                  <li>Update milestone completion and progress %</li>
                  <li>Submit formal timeline extension justifications</li>
                  <li>Log variety release dossiers and papers</li>
                  <li>Restricted from overriding institutional approvals</li>
                </ul>
              </div>
            </div>

            {/* Role 3: Viewer */}
            <div className="p-4 rounded-lg border border-sky-200 bg-sky-50/40 space-y-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-700" />
                <h4 className="text-sm font-bold text-stone-900">3. Viewer (Stakeholder / Public)</h4>
              </div>
              <div className="text-xs text-stone-600 leading-relaxed">
                Agricultural Extension officers, Ministry liaisons, academic partners, and public observers.
              </div>
              <div className="pt-2 border-t border-sky-200/60 space-y-1 text-xs">
                <div className="font-semibold text-stone-800">Permissions:</div>
                <div className="text-sky-800 font-mono">SELECT ONLY (Read-Only)</div>
                <ul className="list-disc list-inside text-stone-600 text-[11px] pt-1 space-y-0.5">
                  <li>Browse all approved research activities and findings</li>
                  <li>Filter by center, crop commodity, and agro-ecology</li>
                  <li>Inspect published deliverables and variety releases</li>
                  <li>Export executive summary dossiers (PDF/CSV)</li>
                  <li>Zero write, edit, or delete capabilities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL Script View */}
      {activeSchemaTab === 'sql' && (
        <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden text-stone-100">
          <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold font-mono text-emerald-400">iqqo_schema_ddl.sql</h3>
              <p className="text-[11px] text-stone-400">PostgreSQL DDL script with foreign keys, indexes, and RLS policies</p>
            </div>
            <button
              onClick={handleCopySQL}
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded text-xs font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied DDL' : 'Copy SQL'}</span>
            </button>
          </div>
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <pre className="font-mono text-xs text-stone-300 leading-relaxed whitespace-pre">
              {SQL_DDL_SCRIPT}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
