import stringTemplate from 'string-template';

import { CHAT_AI_API } from '@/constants/route-apis.const';
import { get, post } from '@/libs/fetch/utils';
import {
  ChatAIDocumentFormat,
  ChatAIDocumentType,
} from '@/models/enums/chatai.enum';
import {
  ChatAiInitResponse,
  ChatAiMessageResponse,
} from '@/models/interfaces/chat-ai.interface';
import {
  ChatAiSession,
  ChatAiSessionResponse,
} from '@/models/types/chatai.type';

export const chatAiInitApi = async () => {
  const url = CHAT_AI_API.INIT;
  return await post<ChatAiInitResponse>(url, undefined, {
    credentials: 'include',
  });
};

export const chatAiMessageApi = async (
  sessionToken: string,
  message: string,
  context?: string,
) => {
  const url = CHAT_AI_API.MESSAGE;
  return await post<ChatAiMessageResponse>(
    url,
    {
      message,
      sessionToken,
      ...(context && { context }),
    },
    {
      credentials: 'include',
    },
  );
};

export const chatAiSessionDetailApi = async (sessionToken: string) => {
  const url = stringTemplate(CHAT_AI_API.SESSION_DETAIL, {
    sessionToken,
  });
  return await get<string>(url, {
    credentials: 'include',
  });
};

export const chatAiListSessionApi = async (
  page: number = 1,
  limit: number = 10,
): Promise<ChatAiSessionResponse> => {
  const offset = (page - 1) * limit;
  const params: Record<string, string> = {};
  params.limit = limit.toString();
  params.offset = offset.toString();
  let url = CHAT_AI_API.LIST_SESSION;
  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }
  const response = await get<ChatAiSession[]>(url, {
    credentials: 'include',
  });
  const items = response.data;
  const totalCount = items.length;
  const hasNextPage = items.length === limit;
  const currentPage = page;
  const pageSize = limit;

  return {
    currentPage,
    hasNextPage,
    items,
    pageSize,
    totalCount,
  };
};

export const chatAiDeleteSessionApi = async (sessionToken: string) => {
  const url = stringTemplate(CHAT_AI_API.DELETE_SESSION, {
    sessionToken,
  });
  return await post<string>(url, undefined, {
    credentials: 'include',
  });
};

export const chatAiRenameSessionApi = async (
  sessionToken: string,
  name: string,
) => {
  const url = stringTemplate(CHAT_AI_API.RENAME_SESSION, { sessionToken });
  return await post<string>(
    url,
    { name },
    {
      credentials: 'include',
    },
  );
};

export const chatAiGenerateDocumentApi = async (
  sessionToken: string,
  documentType: ChatAIDocumentType,
  format: ChatAIDocumentFormat,
) => {
  const url = stringTemplate(CHAT_AI_API.GENERATE_DOCUMENT, { sessionToken });
  return await post<string>(
    url,
    {
      documentType,
      format,
    },
    {
      credentials: 'include',
    },
  );
};

export const chatAiLikeMessageApi = async (messageId: number) => {
  const url = stringTemplate(CHAT_AI_API.LIKE_MESSAGE, { messageId });
  return await post<string>(url, undefined, {
    credentials: 'include',
  });
};

export const chatAiDislikeMessageApi = async (messageId: number) => {
  const url = stringTemplate(CHAT_AI_API.DISLIKE_MESSAGE, { messageId });
  return await post<string>(url, undefined, {
    credentials: 'include',
  });
};

export const chatAiRemoveInteractionApi = async (messageId: number) => {
  const url = stringTemplate(CHAT_AI_API.REMOVE_INTERACTION, { messageId });
  return await post<string>(url, undefined, {
    credentials: 'include',
  });
};

export const chatAiUploadFileApi = async (
  sessionToken: string,
  fileContent: string,
  fileName: string,
  fileType: string,
) => {
  const url = stringTemplate(CHAT_AI_API.UPLOAD_FILE, { sessionToken });
  return await post<string>(
    url,
    { fileContent, fileName, fileType },
    {
      credentials: 'include',
    },
  );
};
