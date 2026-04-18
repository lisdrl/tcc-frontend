import { useEffect, useState } from 'react';
import { useChatClient } from '../../core';
import type { ChatCountState } from '../../core';

export const useTotalUnreadMessages = (): ChatCountState => {
  const chatClient = useChatClient();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    const unsubscribe = chatClient.subscribeToTotalUnreadCount((nextCount) => {
      if (isMounted) {
        setCount(nextCount);
        setError(null);
        setIsLoading(false);
      }
    });

    chatClient
      .getTotalUnreadCount()
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
  }, [chatClient]);

  return { count, isLoading, error };
};
