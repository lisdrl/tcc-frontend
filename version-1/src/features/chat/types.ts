export type ConversationId = string;

export type OrderChatTarget = {
  clientUserId: string;
};

export type ChatCountState = {
  count: number;
  isLoading: boolean;
  error: unknown;
};
