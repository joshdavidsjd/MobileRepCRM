import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  location: string;
  score: number;
  status: 'Hot' | 'Warm' | 'Cold';
  aiInsight: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  source?: string;
  accountId?: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  employees?: number;
  revenue?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  department?: string;
  accountId: string;
  isPrimary: boolean;
  linkedInUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  contactName: string;
  value: string;
  stage: 'Discovery' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  closeDate: string;
  winProbability: number;
  urgent: boolean;
  aiAnalysis: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  leadId?: string;
  accountId?: string;
  contactId?: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'follow-up';
  title: string;
  description: string;
  contactName: string;
  company: string;
  status: 'completed' | 'pending' | 'scheduled';
  duration?: number; // in minutes
  outcome?: 'successful' | 'unsuccessful' | 'follow-up-needed' | 'no-answer';
  notes?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  leadId?: string;
  opportunityId?: string;
  accountId?: string;
  contactId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  quotaTarget?: string;
  dashboardWidgets: string[]; // Array of widget IDs
  updatedAt: Date;
}

interface DataContextType {
  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getLead: (id: string) => Lead | undefined;
  
  // Accounts
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  getAccount: (id: string) => Account | undefined;
  
  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
  getAccountContacts: (accountId: string) => Contact[];
  
  // Opportunities
  opportunities: Opportunity[];
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  getOpportunity: (id: string) => Opportunity | undefined;
  
  // Activities
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  getActivity: (id: string) => Activity | undefined;
  
  // Profile
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateDashboardWidgets: (widgets: string[]) => void;
  
  // Utility functions
  convertLeadToOpportunity: (leadId: string, opportunityData: Partial<Opportunity>) => void;
  getLeadActivities: (leadId: string) => Activity[];
  getOpportunityActivities: (opportunityId: string) => Activity[];
  getAccountActivities: (accountId: string) => Activity[];
  getContactActivities: (contactId: string) => Activity[];
  getAccountOpportunities: (accountId: string) => Opportunity[];
  
  // Search functionality
  globalSearch: (query: string) => {
    leads: Lead[];
    opportunities: Opportunity[];
    accounts: Account[];
    contacts: Contact[];
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techsales.com',
    company: 'TechSales Corp',
    title: 'Senior Sales Representative',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced sales professional with 8+ years in enterprise software sales.',
    location: 'San Francisco, CA',
    timezone: 'PST',
    quotaTarget: '$2.5M',
    dashboardWidgets: ['pipeline-value', 'win-rate', 'hot-leads', 'activities', 'pipeline-chart', 'conversion-chart'],
    updatedAt: new Date()
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleAccounts: Account[] = [
      {
        id: '1',
        name: 'TechNova Corp',
        industry: 'Software',
        website: 'https://technova.com',
        phone: '+1 (555) 100-2000',
        address: '123 Innovation Drive',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        employees: 500,
        revenue: '$50M',
        description: 'Leading software development company specializing in enterprise solutions.',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        name: 'DataFlow Solutions',
        industry: 'Analytics',
        website: 'https://dataflow.com',
        phone: '+1 (555) 200-3000',
        address: '456 Data Street',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        employees: 250,
        revenue: '$25M',
        description: 'Data analytics and business intelligence platform provider.',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '3',
        name: 'GreenTech Industries',
        industry: 'Manufacturing',
        website: 'https://greentech.com',
        phone: '+1 (555) 300-4000',
        address: '789 Green Way',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        employees: 1000,
        revenue: '$100M',
        description: 'Sustainable manufacturing solutions for the modern world.',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    const sampleContacts: Contact[] = [
      {
        id: '1',
        name: 'Jennifer Wilson',
        email: 'jennifer.wilson@technova.com',
        phone: '+1 (555) 123-4567',
        title: 'VP of Technology',
        department: 'Engineering',
        accountId: '1',
        isPrimary: true,
        linkedInUrl: 'https://linkedin.com/in/jenniferwilson',
        notes: 'Key decision maker for technology purchases. Very responsive.',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        name: 'Robert Chen',
        email: 'robert.chen@dataflow.com',
        phone: '+1 (555) 234-5678',
        title: 'CTO',
        department: 'Technology',
        accountId: '2',
        isPrimary: true,
        linkedInUrl: 'https://linkedin.com/in/robertchen',
        notes: 'Technical expert, focuses on integration capabilities.',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '3',
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@greentech.com',
        phone: '+1 (555) 345-6789',
        title: 'Director of Operations',
        department: 'Operations',
        accountId: '3',
        isPrimary: true,
        notes: 'Concerned about security and compliance requirements.',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: '4',
        name: 'James Smith',
        email: 'james.smith@technova.com',
        phone: '+1 (555) 123-4568',
        title: 'IT Manager',
        department: 'IT',
        accountId: '1',
        isPrimary: false,
        notes: 'Technical implementer, reports to Jennifer.',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-22')
      }
    ];

    const sampleLeads: Lead[] = [
      {
        id: '1',
        name: 'Jennifer Wilson',
        email: 'jennifer.wilson@technova.com',
        phone: '+1 (555) 123-4567',
        company: 'TechNova Corp',
        industry: 'Software',
        location: 'San Francisco, CA',
        score: 9.2,
        status: 'Hot',
        aiInsight: 'High engagement with pricing emails. Ready for proposal.',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        source: 'Website',
        notes: 'Very interested in enterprise features. Budget approved for Q1.',
        accountId: '1'
      },
      {
        id: '2',
        name: 'Robert Chen',
        email: 'robert.chen@dataflow.com',
        phone: '+1 (555) 234-5678',
        company: 'DataFlow Solutions',
        industry: 'Analytics',
        location: 'Austin, TX',
        score: 7.8,
        status: 'Warm',
        aiInsight: 'Interested in integration capabilities. Schedule technical demo.',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        source: 'LinkedIn',
        notes: 'Technical decision maker. Needs integration with existing systems.',
        accountId: '2'
      },
      {
        id: '3',
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@greentech.com',
        phone: '+1 (555) 345-6789',
        company: 'GreenTech Industries',
        industry: 'Manufacturing',
        location: 'Denver, CO',
        score: 6.5,
        status: 'Warm',
        aiInsight: 'Budget approved. Waiting for security review completion.',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-16'),
        source: 'Referral',
        notes: 'Security compliance is top priority. Long evaluation process.',
        accountId: '3'
      },
      {
        id: '4',
        name: 'David Thompson',
        email: 'david.thompson@cloudfirst.com',
        phone: '+1 (555) 456-7890',
        company: 'CloudFirst LLC',
        industry: 'Cloud Services',
        location: 'Seattle, WA',
        score: 5.3,
        status: 'Cold',
        aiInsight: 'Long sales cycle. Focus on relationship building.',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-12'),
        source: 'Cold Outreach',
        notes: 'Early stage. Need to identify pain points and decision makers.'
      }
    ];

    const sampleOpportunities: Opportunity[] = [
      {
        id: '1',
        title: 'Enterprise Software License',
        company: 'TechNova Corp',
        contactName: 'Jennifer Wilson',
        value: '250k',
        stage: 'Proposal',
        closeDate: 'Mar 15, 2024',
        winProbability: 85,
        urgent: true,
        aiAnalysis: 'Strong buying signals. Decision maker engaged. Recommend aggressive pricing strategy.',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-25'),
        description: 'Full enterprise license for 500+ users with premium support.',
        leadId: '1',
        accountId: '1',
        contactId: '1'
      },
      {
        id: '2',
        title: 'Cloud Migration Project',
        company: 'DataFlow Solutions',
        contactName: 'Robert Chen',
        value: '180k',
        stage: 'Negotiation',
        closeDate: 'Mar 28, 2024',
        winProbability: 72,
        urgent: false,
        aiAnalysis: 'Price sensitivity detected. Highlight ROI and long-term value proposition.',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-23'),
        description: 'Complete cloud infrastructure migration with training.',
        leadId: '2',
        accountId: '2',
        contactId: '2'
      },
      {
        id: '3',
        title: 'Manufacturing Analytics Platform',
        company: 'GreenTech Industries',
        contactName: 'Maria Rodriguez',
        value: '320k',
        stage: 'Discovery',
        closeDate: 'Apr 10, 2024',
        winProbability: 45,
        urgent: false,
        aiAnalysis: 'Early stage. Focus on pain point identification and relationship building.',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-20'),
        description: 'Custom analytics solution for manufacturing optimization.',
        accountId: '3',
        contactId: '3'
      },
      {
        id: '4',
        title: 'Security Audit Service',
        company: 'SecureBank Ltd',
        contactName: 'Michael Davis',
        value: '95k',
        stage: 'Qualification',
        closeDate: 'Mar 22, 2024',
        winProbability: 68,
        urgent: true,
        aiAnalysis: 'Compliance deadline driving urgency. Fast-track security clearance process.',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-22'),
        description: 'Comprehensive security audit and compliance certification.'
      }
    ];

    const sampleActivities: Activity[] = [
      {
        id: '1',
        type: 'demo',
        title: 'Product Demo Completed',
        description: 'Demonstrated key features and answered technical questions',
        contactName: 'Jennifer Wilson',
        company: 'TechNova Corp',
        status: 'completed',
        duration: 45,
        outcome: 'successful',
        notes: 'Very interested in enterprise features. Requested pricing proposal.',
        completedDate: new Date('2024-01-25T14:00:00'),
        createdAt: new Date('2024-01-25T14:30:00'),
        leadId: '1',
        opportunityId: '1',
        accountId: '1',
        contactId: '1'
      },
      {
        id: '2',
        type: 'email',
        title: 'Follow-up Email Sent',
        description: 'Sent pricing proposal and next steps',
        contactName: 'Robert Chen',
        company: 'DataFlow Solutions',
        status: 'completed',
        duration: 15,
        outcome: 'successful',
        notes: 'Proposal sent. Waiting for technical review.',
        completedDate: new Date('2024-01-24T10:30:00'),
        createdAt: new Date('2024-01-24T10:35:00'),
        leadId: '2',
        opportunityId: '2',
        accountId: '2',
        contactId: '2'
      },
      {
        id: '3',
        type: 'call',
        title: 'Discovery Call Scheduled',
        description: 'Initial needs assessment and qualification call',
        contactName: 'Maria Rodriguez',
        company: 'GreenTech Industries',
        status: 'scheduled',
        duration: 30,
        notes: 'Focus on security and compliance requirements.',
        scheduledDate: new Date('2024-01-30T15:00:00'),
        createdAt: new Date('2024-01-26T09:00:00'),
        opportunityId: '3',
        accountId: '3',
        contactId: '3'
      }
    ];

    setAccounts(sampleAccounts);
    setContacts(sampleContacts);
    setLeads(sampleLeads);
    setOpportunities(sampleOpportunities);
    setActivities(sampleActivities);
  }, []);

  // Lead CRUD operations
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setLeads(prev => [...prev, newLead]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id 
        ? { ...lead, ...updates, updatedAt: new Date() }
        : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
    setActivities(prev => prev.filter(activity => activity.leadId !== id));
  };

  const getLead = (id: string) => {
    return leads.find(lead => lead.id === id);
  };

  // Account CRUD operations
  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(account => 
      account.id === id 
        ? { ...account, ...updates, updatedAt: new Date() }
        : account
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
    setContacts(prev => prev.filter(contact => contact.accountId !== id));
    setActivities(prev => prev.filter(activity => activity.accountId !== id));
  };

  const getAccount = (id: string) => {
    return accounts.find(account => account.id === id);
  };

  // Contact CRUD operations
  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id 
        ? { ...contact, ...updates, updatedAt: new Date() }
        : contact
    ));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    setActivities(prev => prev.filter(activity => activity.contactId !== id));
  };

  const getContact = (id: string) => {
    return contacts.find(contact => contact.id === id);
  };

  const getAccountContacts = (accountId: string) => {
    return contacts.filter(contact => contact.accountId === accountId);
  };

  // Opportunity CRUD operations
  const addOpportunity = (opportunityData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOpportunity: Opportunity = {
      ...opportunityData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setOpportunities(prev => [...prev, newOpportunity]);
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities(prev => prev.map(opportunity => 
      opportunity.id === id 
        ? { ...opportunity, ...updates, updatedAt: new Date() }
        : opportunity
    ));
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(opportunity => opportunity.id !== id));
    setActivities(prev => prev.filter(activity => activity.opportunityId !== id));
  };

  const getOpportunity = (id: string) => {
    return opportunities.find(opportunity => opportunity.id === id);
  };

  // Activity CRUD operations
  const addActivity = (activityData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id 
        ? { ...activity, ...updates }
        : activity
    ));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const getActivity = (id: string) => {
    return activities.find(activity => activity.id === id);
  };

  // Profile operations
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
  };

  const updateDashboardWidgets = (widgets: string[]) => {
    setUserProfile(prev => ({
      ...prev,
      dashboardWidgets: widgets,
      updatedAt: new Date()
    }));
  };

  // Utility functions
  const convertLeadToOpportunity = (leadId: string, opportunityData: Partial<Opportunity>) => {
    const lead = getLead(leadId);
    if (!lead) return;

    const newOpportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'> = {
      title: opportunityData.title || `${lead.company} Opportunity`,
      company: lead.company,
      contactName: lead.name,
      value: opportunityData.value || '0',
      stage: opportunityData.stage || 'Discovery',
      closeDate: opportunityData.closeDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      winProbability: opportunityData.winProbability || 50,
      urgent: opportunityData.urgent || false,
      aiAnalysis: opportunityData.aiAnalysis || 'Converted from lead. Needs qualification.',
      description: opportunityData.description,
      leadId: leadId,
      accountId: lead.accountId
    };

    addOpportunity(newOpportunity);
  };

  const getLeadActivities = (leadId: string) => {
    return activities.filter(activity => activity.leadId === leadId);
  };

  const getOpportunityActivities = (opportunityId: string) => {
    return activities.filter(activity => activity.opportunityId === opportunityId);
  };

  const getAccountActivities = (accountId: string) => {
    return activities.filter(activity => activity.accountId === accountId);
  };

  const getContactActivities = (contactId: string) => {
    return activities.filter(activity => activity.contactId === contactId);
  };

  const getAccountOpportunities = (accountId: string) => {
    return opportunities.filter(opportunity => opportunity.accountId === accountId);
  };

  const globalSearch = (query: string) => {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      return { leads: [], opportunities: [], accounts: [], contacts: [] };
    }

    const filteredLeads = leads.filter(lead =>
      lead.name.toLowerCase().includes(searchTerm) ||
      lead.company.toLowerCase().includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm) ||
      lead.industry.toLowerCase().includes(searchTerm)
    );

    const filteredOpportunities = opportunities.filter(opportunity =>
      opportunity.title.toLowerCase().includes(searchTerm) ||
      opportunity.company.toLowerCase().includes(searchTerm) ||
      opportunity.contactName.toLowerCase().includes(searchTerm)
    );

    const filteredAccounts = accounts.filter(account =>
      account.name.toLowerCase().includes(searchTerm) ||
      account.industry.toLowerCase().includes(searchTerm)
    );

    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.title.toLowerCase().includes(searchTerm)
    );

    return {
      leads: filteredLeads,
      opportunities: filteredOpportunities,
      accounts: filteredAccounts,
      contacts: filteredContacts
    };
  };

  return (
    <DataContext.Provider value={{
      leads,
      addLead,
      updateLead,
      deleteLead,
      getLead,
      accounts,
      addAccount,
      updateAccount,
      deleteAccount,
      getAccount,
      contacts,
      addContact,
      updateContact,
      deleteContact,
      getContact,
      getAccountContacts,
      opportunities,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      getOpportunity,
      activities,
      addActivity,
      updateActivity,
      deleteActivity,
      getActivity,
      userProfile,
      updateProfile,
      updateDashboardWidgets,
      convertLeadToOpportunity,
      getLeadActivities,
      getOpportunityActivities,
      getAccountActivities,
      getContactActivities,
      getAccountOpportunities,
      globalSearch
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}