import { useEffect, useState } from 'react';
import { useChatClient } from '../../core';
import type { ChatCountState, OrderChatTarget } from '../../core';

export const useOrderChatUnreadCount = ({ clientUserId }: OrderChatTarget): ChatCountState => {
  const chatClient = useChatClient();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!clientUserId) {
      setCount(0);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const target = { clientUserId };

    setIsLoading(true);

    const unsubscribe = chatClient.subscribeToOrderChatUnreadCount(target, (nextCount) => {
      if (isMounted) {
        setCount(nextCount);
        setError(null);
        setIsLoading(false);
      }
    });

    chatClient
      .getOrderChatUnreadCount(target)
      .then((nextCount) => {
        if (isMounted) {
          setCount(nextCount);
          setError(null);
        }
      })
      .catch((currentError: unknown) => {
        if (isMounted) {
          setError(currentError);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [chatClient, clientUserId]);

  return { count, isLoading, error };
};
