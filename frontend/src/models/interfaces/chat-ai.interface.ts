import { ChatMessageRole, ChatMessageType } from '../enums/chat-ai.enum';
import { InteractionType } from '../enums/chatai.enum';

export interface ChatAiInitResponse {
  sessionToken: string;
}

export interface ChatAiMessageResponse {
  createdAt: string;
  message: string;
  messageId: number;
  metadata: [number, string];
  sessionId: number;
  suggestedActions: string[];
}

export interface ChatHistory {
  date: string;
  id: string;
  messages: {
    content: string;
    id: string;
    role: ChatMessageRole;
    timestamp: Date;
    tools?: {
      createDocument: boolean;
      editDocument: boolean;
    };
    type?: ChatMessageType;
  }[];
  title: string;
  type: ChatMessageType;
}

export interface ChatMessage {
  content: string;
  id: string;
  messageId: number;
  role: ChatMessageRole;
  suggestions?: string[];
  timestamp: Date;
  tools?: {
    createDocument: boolean;
    editDocument: boolean;
  };
  type?: ChatMessageType;
  userInteraction?: InteractionType;
}

export interface IChatAiUploadFileParams {
  fileContent: string;
  fileName: string;
  fileType: string;
  sessionToken: string;
}
