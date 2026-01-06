// types.ts
export interface Project {
  projectId: string;
  projectName: string;
  useCase: string;
  description: string;
  features: string[];
  organization: string;
  timezone: string;
  metrics: {
    messagesSent: number;
    contactsManaged: number;
    activeGroups: number;
  };
  status: string;
  servicePlanLimit: {
    monthlyMessageCap: number;
    currentMonthUsage: number;
  };
  managementActions: {
    switchProjectUrl: string;
    manageContactsUrl: string;
    configureRoutesUrl: string;
    viewAnalyticsUrl: string;
  };
}
