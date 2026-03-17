'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

// TODO: Fix component prop mismatches before re-enabling
// import ChatHeader from '@/components/searchAi/ChatHeader';
// import ChatHistorySidebar from '@/components/searchAi/ChatHistorySidebar';
// import MessageBubble from '@/components/searchAi/MessageBubble';
// import SearchAiChatInput from '@/components/searchAi/SearchAiChatInput';
import { useAIChatStore } from '@/stores/aiChat.store';

const AIAssistantPage: React.FC = () => {
  const t = useTranslations();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    createNewConversation,
    isTyping,
    messages,
    sendMessage,
  } = useAIChatStore();

  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation(t);
    }
  }, [conversations.length, createNewConversation, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      await sendMessage(message, '', t);
    }
  };

  // TODO: Uncomment these handlers when fixing component prop mismatches
  // const handleNewChat = () => {
  //   createNewConversation();
  // };

  // const handleSelectConversation = (conversationId: string) => {
  //   loadConversation(conversationId);
  // };

  // const handleDeleteConversation = (conversationId: string) => {
  //   deleteConversation(conversationId);
  // };

  const suggestions = [
    t('aiAssistant.suggestions.compareProducts'),
    t('aiAssistant.suggestions.findBestLaptop'),
    t('aiAssistant.suggestions.explainSpecs'),
    t('aiAssistant.suggestions.recommendAccessories'),
  ];

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      {/* TODO: Fix prop mismatch with ChatHistorySidebar
      <ChatHistorySidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onDeleteConversation={handleDeleteConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      */}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {/* TODO: Fix prop mismatch with ChatHeader
        <ChatHeader
          onClearChat={clearCurrentChat}
          title={t('aiAssistant.title')}
        />
        */}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto pt-20">
              <h2 className="text-2xl font-semibold text-center mb-8">
                {t('aiAssistant.welcome')}
              </h2>
              <p className="text-gray-600 text-center mb-8">
                {t('aiAssistant.welcomeMessage')}
              </p>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                  <button
                    className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                  >
                    <p className="text-sm">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-8">
              {/* TODO: Fix prop mismatch with MessageBubble
              {messages.map((message) => (
                <MessageBubble
                  content={message.content}
                  isUser={message.role === 'user'}
                  key={message.id}
                  timestamp={message.timestamp}
                />
              ))}
              */}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 mt-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm">{t('aiAssistant.typing')}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="max-w-3xl mx-auto">
            {/* TODO: Fix prop mismatch with SearchAiChatInput
            <SearchAiChatInput
              onSendMessage={handleSendMessage}
              placeholder={t('aiAssistant.inputPlaceholder')}
            />
            */}
            <p className="text-xs text-gray-500 mt-2 text-center">
              {t('aiAssistant.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
