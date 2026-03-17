export type ChatAiSession = {
  name: string;
  sessionId: number;
  sessionToken: string;
  updatedAt: string;
};

export type ChatAiSessionResponse = {
  currentPage: number;
  hasNextPage: boolean;
  items: ChatAiSession[];
  pageSize: number;
  totalCount: number;
};

export type DocumentData = {
  content?: string;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileSizeFormatted?: string;
  format: string;
  metadata: {
    generatedAt: string;
    messageCount: number;
    sessionId: number;
    sessionName: string;
  };
  title: string;
  type: string;
};

export type DownloadDocumentResponse = [boolean, DocumentData];
