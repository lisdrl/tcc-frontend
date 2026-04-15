import { useCallback, useState } from 'react';
import { useSendbird } from '@sendbird/uikit-react';
import { CURRENT_CHAT_USER_ID } from '../../config/chatConfig';
import type { ConversationId, OrderChatTarget } from '../../types';

type StartOrderChatState = {
  startOrderChat: (target: OrderChatTarget) => Promise<ConversationId | null>;
  isStarting: boolean;
  error: unknown;
};

export const useStartOrderChat = (): StartOrderChatState => {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const {
    state: { stores },
  } = useSendbird();
  const sdk = stores.sdkStore.sdk;

  const startOrderChat = useCallback(
    async ({ clientUserId }: OrderChatTarget): Promise<ConversationId | null> => {
      if (!sdk?.groupChannel) {
        const initializationError = new Error('Chat SDK is not initialized.');
        setError(initializationError);
        return null;
      }

      setIsStarting(true);
      setError(null);

      try {
        const conversation = await sdk.groupChannel.createChannel({
          invitedUserIds: [CURRENT_CHAT_USER_ID, clientUserId],
          isDistinct: true,
        });

        return conversation.url;
      } catch (currentError) {
        setError(currentError);
        return null;
      } finally {
        setIsStarting(false);
      }
    },
    [sdk],
  );

  return { startOrderChat, isStarting, error };
};
