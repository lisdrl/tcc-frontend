import { useEffect, useState } from 'react';
import { UserEventHandler } from '@sendbird/chat';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { useSendbird } from '@sendbird/uikit-react';
import type { ChatCountState } from '../../types';

export const useTotalUnreadMessages = (): ChatCountState => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const {
    state: { stores },
  } = useSendbird();
  const sdk = stores.sdkStore.sdk;

  useEffect(() => {
    if (!sdk?.groupChannel) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const handlerId = 'chat-total-unread-count';
    const groupChannelHandlerId = `${handlerId}-group-channel`;

    async function loadTotalUnreadMessageCount() {
      try {
        const unreadCount = await sdk.groupChannel.getTotalUnreadMessageCount();

        if (isMounted) {
          setCount(unreadCount);
          setError(null);
        }
      } catch (currentError) {
        if (isMounted) {
          setError(currentError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    setIsLoading(true);

    sdk.addUserEventHandler(
      handlerId,
      new UserEventHandler({
        onTotalUnreadMessageCountChanged: (unreadMessageCount) => {
          if (isMounted) {
            setCount(unreadMessageCount.groupChannelCount);
            setError(null);
            setIsLoading(false);
          }
        },
      }),
    );

    sdk.groupChannel.addGroupChannelHandler(
      groupChannelHandlerId,
      new GroupChannelHandler({
        onChannelChanged: loadTotalUnreadMessageCount,
        onMessageReceived: loadTotalUnreadMessageCount,
        onMessageDeleted: loadTotalUnreadMessageCount,
        onUnreadMemberStatusUpdated: loadTotalUnreadMessageCount,
      }),
    );

    loadTotalUnreadMessageCount();

    return () => {
      isMounted = false;
      sdk.removeUserEventHandler(handlerId);
      sdk.groupChannel.removeGroupChannelHandler(groupChannelHandlerId);
    };
  }, [sdk]);

  return { count, isLoading, error };
};
