import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ResearchActivity, ResearchCenter, Directorate, UserProfile, UserRole, ActivityStatus, Milestone, ExtensionRequest } from '../types';
import { RESEARCH_CENTERS } from '../data/centersData';
import { DIRECTORATES } from '../data/directoratesData';
import { INITIAL_ACTIVITIES } from '../data/initialActivities';

interface AppContextType {
  activities: ResearchActivity[];
  centers: ResearchCenter[];
  directorates: Directorate[];
  currentUser: UserProfile;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeTab: 'overview' | 'activities' | 'natural-resources' | 'livestock-research' | 'centers' | 'directorates' | 'schema' | 'reports';
  setActiveTab: (tab: 'overview' | 'activities' | 'natural-resources' | 'livestock-research' | 'centers' | 'directorates' | 'schema' | 'reports') => void;
  
  // Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  centerFilter: string;
  setCenterFilter: (c: string) => void;
  directorateFilter: string;
  setDirectorateFilter: (d: string) => void;
  statusFilter: ActivityStatus | 'All';
  setStatusFilter: (s: ActivityStatus | 'All') => void;
  
  // Modals & Selections
  selectedActivity: ResearchActivity | null;
  setSelectedActivity: (act: ResearchActivity | null) => void;
  isNewActivityModalOpen: boolean;
  setIsNewActivityModalOpen: (open: boolean) => void;
  drilldownCenterId: string | null;
  setDrilldownCenterId: (id: string | null) => void;
  drilldownDirectorateId: string | null;
  setDrilldownDirectorateId: (id: string | null) => void;
  
  // CRUD & Operations
  addActivity: (activity: Omit<ResearchActivity, 'id' | 'lastUpdated'>) => void;
  updateActivity: (id: string, updates: Partial<ResearchActivity>) => void;
  deleteActivity: (id: string) => boolean;
  updateActivityStatus: (id: string, newStatus: ActivityStatus) => void;
  toggleMilestone: (activityId: string, milestoneId: string) => void;
  requestExtension: (activityId: string, requestedMonths: number, justification: string) => void;
  approveExtension: (activityId: string, requestId: string, approved: boolean, notes?: string) => void;
  resetAllData: () => void;
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  Administrator: {
    id: 'usr-admin-01',
    name: 'Institutional Coordination',
    email: 'boqolo@iqqo.gov.et',
    role: 'Administrator',
    centerId: 'iqqo-hq',
    title: 'Research Portfolio Secretariat'
  },
  Researcher: {
    id: 'usr-res-01',
    name: 'Dr. Gemechu Keneni',
    email: 'gemechu.k@iqqo.gov.et',
    role: 'Researcher',
    centerId: 'sinana-arc',
    directorateId: 'crop-research',
    title: 'Senior Durum Wheat Breeder'
  },
  Viewer: {
    id: 'usr-view-01',
    name: 'Obbo Keno Feyisa',
    email: 'keno.feyisa@oromia-agr.gov.et',
    role: 'Viewer',
    centerId: 'adami-tulu',
    title: 'Regional Agricultural Extension Officer'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<UserRole>('Administrator');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USERS.Administrator);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'natural-resources' | 'livestock-research' | 'centers' | 'directorates' | 'schema' | 'reports'>('overview');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [centerFilter, setCenterFilter] = useState('All');
  const [directorateFilter, setDirectorateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | 'All'>('All');
  
  const [selectedActivity, setSelectedActivity] = useState<ResearchActivity | null>(null);
  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
  const [drilldownCenterId, setDrilldownCenterId] = useState<string | null>(null);
  const [drilldownDirectorateId, setDrilldownDirectorateId] = useState<string | null>(null);

  // Initialize activities from localStorage or fallback to INITIAL_ACTIVITIES
  const [activities, setActivities] = useState<ResearchActivity[]>(() => {
    try {
      const saved = localStorage.getItem('iqqo_activities_data_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_ACTIVITIES.length) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ACTIVITIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('iqqo_activities_data_v5', JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [activities]);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    setCurrentUser(DEFAULT_USERS[role]);
  };

  const addActivity = (newActData: Omit<ResearchActivity, 'id' | 'lastUpdated'>) => {
    const id = `act-${Date.now()}`;
    const newAct: ResearchActivity = {
      ...newActData,
      id,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const updateActivity = (id: string, updates: Partial<ResearchActivity>) => {
    setActivities(prev =>
      prev.map(act => {
        if (act.id === id) {
          const updated = {
            ...act,
            ...updates,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
          if (selectedActivity && selectedActivity.id === id) {
            setSelectedActivity(updated);
          }
          return updated;
        }
        return act;
      })
    );
  };

  const updateActivityStatus = (id: string, newStatus: ActivityStatus) => {
    updateActivity(id, { status: newStatus });
  };

  const deleteActivity = (id: string): boolean => {
    if (activeRole !== 'Administrator') {
      return false;
    }
    setActivities(prev => prev.filter(act => act.id !== id));
    if (selectedActivity?.id === id) {
      setSelectedActivity(null);
    }
    return true;
  };

  const toggleMilestone = (activityId: string, milestoneId: string) => {
    setActivities(prev =>
      prev.map(act => {
        if (act.id !== activityId) return act;
        const newMilestones = act.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          const nextCompleted = !m.completed;
          return {
            ...m,
            completed: nextCompleted,
            completedDate: nextCompleted ? new Date().toISOString().split('T')[0] : undefined
          };
        });
        const total = newMilestones.length;
        const comp = newMilestones.filter(m => m.completed).length;
        const newProg = total > 0 ? Math.round((comp / total) * 100) : act.progressPercent;
        const updated = {
          ...act,
          milestones: newMilestones,
          progressPercent: newProg,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        if (selectedActivity?.id === activityId) {
          setSelectedActivity(updated);
        }
        return updated;
      })
    );
  };

  const requestExtension = (activityId: string, requestedMonths: number, justification: string) => {
    setActivities(prev =>
      prev.map(act => {
        if (act.id !== activityId) return act;
        const currEnd = new Date(act.endDate);
        const newEndDateObj = new Date(currEnd.setMonth(currEnd.getMonth() + requestedMonths));
        const newEndDateStr = newEndDateObj.toISOString().split('T')[0];
        
        const newRequest: ExtensionRequest = {
          id: `ext-${Date.now()}`,
          requestedMonths,
          previousEndDate: act.endDate,
          newEndDate: newEndDateStr,
          justification,
          requestedBy: currentUser.name,
          requestDate: new Date().toISOString().split('T')[0],
          status: 'Pending'
        };

        const updated = {
          ...act,
          extensionHistory: [newRequest, ...(act.extensionHistory || [])],
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        if (selectedActivity?.id === activityId) {
          setSelectedActivity(updated);
        }
        return updated;
      })
    );
  };

  const approveExtension = (activityId: string, requestId: string, approved: boolean, notes?: string) => {
    setActivities(prev =>
      prev.map(act => {
        if (act.id !== activityId) return act;
        let newEndDate = act.endDate;
        const updatedExtHistory = (act.extensionHistory || []).map(req => {
          if (req.id !== requestId) return req;
          if (approved) {
            newEndDate = req.newEndDate;
          }
          return {
            ...req,
            status: approved ? ('Approved' as const) : ('Rejected' as const),
            reviewedBy: currentUser.name,
            reviewDate: new Date().toISOString().split('T')[0],
            reviewNotes: notes || (approved ? 'Approved by HQ Research Directorate' : 'Rejected after institutional review')
          };
        });

        const updated = {
          ...act,
          endDate: newEndDate,
          status: approved ? ('Extended' as ActivityStatus) : act.status,
          extensionHistory: updatedExtHistory,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        if (selectedActivity?.id === activityId) {
          setSelectedActivity(updated);
        }
        return updated;
      })
    );
  };

  const resetAllData = () => {
    localStorage.removeItem('iqqo_activities_data_v4');
    localStorage.removeItem('iqqo_activities_data_v3');
    setActivities(INITIAL_ACTIVITIES);
    setSelectedActivity(null);
  };

  return (
    <AppContext.Provider
      value={{
        activities,
        centers: RESEARCH_CENTERS,
        directorates: DIRECTORATES,
        currentUser,
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        centerFilter,
        setCenterFilter,
        directorateFilter,
        setDirectorateFilter,
        statusFilter,
        setStatusFilter,
        selectedActivity,
        setSelectedActivity,
        isNewActivityModalOpen,
        setIsNewActivityModalOpen,
        drilldownCenterId,
        setDrilldownCenterId,
        drilldownDirectorateId,
        setDrilldownDirectorateId,
        addActivity,
        updateActivity,
        deleteActivity,
        updateActivityStatus,
        toggleMilestone,
        requestExtension,
        approveExtension,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
