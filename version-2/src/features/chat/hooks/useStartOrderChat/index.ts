import { useCallback, useState } from 'react';
import { useChatClient } from '../../core';
import type { ConversationId, OrderChatTarget } from '../../core';

type StartOrderChatState = {
  startOrderChat: (target: OrderChatTarget) => Promise<ConversationId | null>;
  isStarting: boolean;
  error: unknown;
};

export const useStartOrderChat = (): StartOrderChatState => {
  const chatClient = useChatClient();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const startOrderChat = useCallback(
    async (target: OrderChatTarget): Promise<ConversationId | null> => {
      setIsStarting(true);
      setError(null);

      try {
        return await chatClient.startOrderChat(target);
      } catch (currentError) {
        setError(currentError);
        return null;
      } finally {
        setIsStarting(false);
      }
    },
    [chatClient],
  );

  return { startOrderChat, isStarting, error };
};
