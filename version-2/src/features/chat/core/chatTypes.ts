import type { ComponentType } from 'react';

export type ConversationId = string;

export type OrderChatTarget = {
  clientUserId: string;
};

export type ChatCountState = {
  count: number;
  isLoading: boolean;
  error: unknown;
};

export type Unsubscribe = () => void;

export type ChatClient = {
  getTotalUnreadCount: () => Promise<number>;
  subscribeToTotalUnreadCount: (onChange: (count: number) => void) => Unsubscribe;
  getOrderChatUnreadCount: (target: OrderChatTarget) => Promise<number>;
  subscribeToOrderChatUnreadCount: (
    target: OrderChatTarget,
    onChange: (count: number) => void,
  ) => Unsubscribe;
  startOrderChat: (target: OrderChatTarget) => Promise<ConversationId>;
};

export type ChatViews = {
  ConversationList: ComponentType<{
    selectedConversationId?: ConversationId;
    onConversationSelect: (conversationId: ConversationId) => void;
  }>;
  Conversation: ComponentType<{
    conversationId?: ConversationId;
  }>;
};

export type ChatImplementation = {
  client: ChatClient;
  views: ChatViews;
};
