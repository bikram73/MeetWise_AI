export interface ActionItem {
  id?: string;
  task: string;
  owner: string;
  due_date: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  status: 'Pending' | 'In Progress' | 'Completed' | string;
}

export interface DecisionItem {
  id?: string;
  title: string;
  status?: 'Approved' | 'Delayed' | 'Rejected' | 'Pending' | string;
  impact?: string;
  details?: string;
}

export interface MeetingAnalysisResult {
  meeting_title: string;
  meeting_objective: string;
  summary: string;
  discussion_points: string[];
  decisions: string[] | DecisionItem[];
  risks: string[];
  open_questions: string[];
  action_items: ActionItem[];
  date?: string;
  participants?: { name: string; role?: string }[];
}

export interface PromptPreset {
  id: string;
  title: string;
  description: string;
  promptInstructions: string;
}
