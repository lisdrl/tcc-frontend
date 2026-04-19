import type { ComponentType } from 'react';

export type ConversationId = string;

// Find better name
export type OrderChatTarget = {
  clientUserId: string;
};

export type ChatCountState = {
  count: number;
  isLoading: boolean;
  error: unknown;
};

export type Unsubscribe = () => void;

// Functions related to the consumer chat
export type ChatClient = {
  getTotalUnreadCount: () => Promise<number>;
  // check
  subscribeToTotalUnreadCount: (onChange: (count: number) => void) => Unsubscribe;
  getOrderChatUnreadCount: (target: OrderChatTarget) => Promise<number>;
  // check
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
