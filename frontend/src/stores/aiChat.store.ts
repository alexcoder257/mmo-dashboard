import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { ChatMessageRole, ChatMessageType } from '@/models/enums/chat-ai.enum';
import { InteractionType } from '@/models/enums/chatai.enum';

export interface Conversation {
  id: string;
  messages: Message[];
  title: string;
  updatedAt: Date;
}

export interface Message {
  content: string;
  createdAt?: string;
  id: string;
  messageId?: number;
  role: ChatMessageRole;
  sessionId?: number;
  timestamp: Date;
  type?: ChatMessageType;
  userInteraction?: InteractionType;
}

interface AIChatActions {
  addMessage: (
    message: Omit<Message, 'id' | 'timestamp'>,
    customId?: string,
  ) => void;
  clearCurrentChat: () => void;
  clearMessages: () => void;
  createNewConversation: (t?: TranslationFunction) => void;
  deleteConversation: (id: string) => void;
  loadConversation: (id: string) => void;
  sendMessage: (
    content: string,
    sessionToken: string,
    t?: TranslationFunction,
    context?: string,
  ) => Promise<void>;
  setCurrentInput: (input: string) => void;
  setLoading: (loading: boolean) => void;
  setSessionToken: (token: string) => void;
  setTyping: (typing: boolean) => void;
  updateConversationTitle: (id: string, title: string) => void;
  updateLastMessageToDocument: (documentData: {
    fileName: string;
    fileSizeFormatted: string;
    generatedAt: string;
    type: ChatMessageType;
  }) => void;
}

interface AIChatState {
  conversations: Conversation[];
  currentConversationId: null | string;
  currentInput: string;
  error: null | string;
  isLoading: boolean;
  isTyping: boolean;
  messages: Message[];
  sessionToken: null | string;
}

interface AIChatStore extends AIChatActions, AIChatState {}

type TranslationFunction = (key: string) => string;

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAIChatStore = create<AIChatStore>()(
  devtools((set, get) => ({
    addMessage: (message, customId) => {
      const newMessage: Message = {
        ...message,
        createdAt: message.createdAt,
        id: customId || generateId(),
        messageId: message.messageId,
        sessionId: message.sessionId,
        timestamp: new Date(),
      };

      set((state) => {
        const updatedMessages = [...state.messages, newMessage];

        if (state.currentConversationId) {
          const updatedConversations = state.conversations.map((conv) =>
            conv.id === state.currentConversationId
              ? {
                  ...conv,
                  messages: updatedMessages,
                  updatedAt: new Date(),
                }
              : conv,
          );

          return {
            conversations: updatedConversations,
            messages: updatedMessages,
          };
        }

        return { messages: updatedMessages };
      });
    },

    clearCurrentChat: () => {
      set({ error: null, messages: [] });
    },

    clearMessages: () => {
      set({ messages: [] });
    },

    conversations: [],

    createNewConversation: (t) => {
      const newConversation: Conversation = {
        id: generateId(),
        messages: [],
        title: t ? t('shared.chatai.newConversation') : 'New Conversation',
        updatedAt: new Date(),
      };

      set((state) => ({
        conversations: [newConversation, ...state.conversations],
        currentConversationId: newConversation.id,
        messages: [],
      }));
    },

    currentConversationId: null,

    currentInput: '',

    deleteConversation: (id) => {
      set((state) => {
        const updatedConversations = state.conversations.filter(
          (conv) => conv.id !== id,
        );

        return {
          conversations: updatedConversations,
          currentConversationId:
            state.currentConversationId === id
              ? updatedConversations[0]?.id || null
              : state.currentConversationId,
          messages:
            state.currentConversationId === id
              ? updatedConversations[0]?.messages || []
              : state.messages,
        };
      });
    },

    error: null,

    isLoading: false,

    isTyping: false,

    loadConversation: (id) => {
      const conversation = get().conversations.find((conv) => conv.id === id);

      if (conversation) {
        set({
          currentConversationId: id,
          messages: conversation.messages,
        });
      }
    },

    messages: [],

    sendMessage: async (content, sessionToken, t, context?: string) => {
      get().addMessage({ content, role: ChatMessageRole.User });

      const loadingMessageId = generateId();
      get().addMessage(
        {
          content: '',
          role: ChatMessageRole.Assistant,
        },
        loadingMessageId,
      );

      set({ isTyping: true });

      try {
        const { chatAiMessageApi } = await import('@/apis/chat-ai.api');
        const response = await chatAiMessageApi(sessionToken, content, context);

        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== loadingMessageId),
        }));

        if (response.data.message && response.data.message.trim() !== '') {
          get().addMessage({
            content: response.data.message,
            createdAt: response.data.createdAt,
            messageId: response.data.messageId,
            role: ChatMessageRole.Assistant,
            sessionId: response.data.sessionId,
          });
        } else {
          set((state) => ({
            messages: state.messages.filter(
              (msg) => msg.id !== loadingMessageId,
            ),
          }));

          get().addMessage({
            content: t
              ? t('shared.chatai.errorMessages.cannotProcess')
              : 'Sorry, I cannot process your request at this time. Please try again or ask a different question.',
            role: ChatMessageRole.Assistant,
          });
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        set({
          error: t
            ? t('shared.chatai.errorMessages.failedToSend')
            : 'Failed to send message. Please try again.',
        });

        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== loadingMessageId),
        }));

        get().addMessage({
          content: t
            ? t('shared.chatai.errorMessages.failedToSend')
            : 'Failed to send message. Please try again.',
          role: ChatMessageRole.Assistant,
        });
      } finally {
        set({ isTyping: false });
      }
    },

    sessionToken: null,

    setCurrentInput: (input) => {
      set({ currentInput: input });
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
    },

    setSessionToken: (token) => {
      set({ sessionToken: token });
    },

    setTyping: (typing) => {
      set({ isTyping: typing });
    },

    updateConversationTitle: (id, title) => {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === id ? { ...conv, title } : conv,
        ),
      }));
    },

    updateLastMessageToDocument: (documentData) => {
      set((state) => {
        if (state.messages.length === 0) return state;

        const updatedMessages = [...state.messages];
        const lastMessageIndex = updatedMessages.length - 1;
        const lastMessage = updatedMessages[lastMessageIndex];

        updatedMessages[lastMessageIndex] = {
          ...lastMessage,
          content: `file_name:${documentData.fileName} file_size:${documentData.fileSizeFormatted} generated_at:${documentData.generatedAt}`,
          type: documentData.type,
        };

        if (state.currentConversationId) {
          const updatedConversations = state.conversations.map((conv) =>
            conv.id === state.currentConversationId
              ? {
                  ...conv,
                  messages: updatedMessages,
                  updatedAt: new Date(),
                }
              : conv,
          );

          return {
            conversations: updatedConversations,
            messages: updatedMessages,
          };
        }

        return { messages: updatedMessages };
      });
    },
  })),
);
