export enum EditorType {
  Code = 'CODE',
  AI = 'AI_CHAT',
  Text = 'TEXT',
  ThreeD = '3D',
  Drawing = 'DRAWING',
  ScreenRecord = 'SCREEN_RECORD',
  Prompt = 'PROMPT',
  MindMap = 'MIND_MAP',
  Universal = 'UNIVERSAL'
}

export interface ChatMessage {
  sender: 'user' | 'ai' | 'viewer';
  text: string;
  id: string;
}

export interface Project {
  id:string;
  name: string;
  description?: string;
  editorType: EditorType;
  createdAt: number; // Unix timestamp
  userId: string;
}

export interface Recording {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL: string;
  projectId: string;
  projectName: string;
  projectEditorType: EditorType;
  videoUrl: string;
  createdAt: number; // Unix timestamp
  duration: number; // in seconds
}