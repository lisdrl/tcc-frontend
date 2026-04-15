import { useEffect, useId, useState } from 'react';
import { GroupChannelHandler, QueryType } from '@sendbird/chat/groupChannel';
import { useSendbird } from '@sendbird/uikit-react';
import { CURRENT_CHAT_USER_ID } from '../../config/chatConfig';
import type { ChatCountState, OrderChatTarget } from '../../types';

type ChannelUnreadState = {
  url: string;
  unreadMessageCount?: number;
  members?: { userId: string }[];
};

export const useOrderChatUnreadCount = ({ clientUserId }: OrderChatTarget): ChatCountState => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const subscriptionId = useId();
  const {
    state: { stores },
  } = useSendbird();
  const sdk = stores.sdkStore.sdk;

  useEffect(() => {
    if (!sdk?.groupChannel || !clientUserId) {
      setIsLoading(false);
      return;
    }

    let conversationId = '';
    let isMounted = true;
    const handlerId = `order-chat-unread-count-${subscriptionId}`;

    async function loadUnreadMessageCount() {
      try {
        const query = sdk.groupChannel.createMyGroupChannelListQuery({
          includeEmpty: true,
          limit: 1,
          userIdsFilter: {
            userIds: [CURRENT_CHAT_USER_ID, clientUserId],
            includeMode: true,
            queryType: QueryType.AND,
          },
        });
        const [conversation] = await query.next();

        if (!isMounted) {
          return;
        }

        conversationId = conversation?.url ?? '';
        setCount(conversation?.unreadMessageCount ?? 0);
        setError(null);
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

    const isOrderConversation = (conversation: ChannelUnreadState) => {
      if (conversationId) {
        return conversation.url === conversationId;
      }

      const memberIds = conversation.members?.map((member) => member.userId) ?? [];
      return memberIds.includes(CURRENT_CHAT_USER_ID) && memberIds.includes(clientUserId);
    };

    const updateUnreadMessageCount = (conversation: ChannelUnreadState) => {
      if (isOrderConversation(conversation)) {
        conversationId = conversation.url;
        setCount(conversation.unreadMessageCount ?? 0);
        setError(null);
        setIsLoading(false);
      }
    };

    setIsLoading(true);

    sdk.groupChannel.addGroupChannelHandler(
      handlerId,
      new GroupChannelHandler({
        onChannelChanged: updateUnreadMessageCount,
        onMessageReceived: updateUnreadMessageCount,
        onUnreadMemberStatusUpdated: updateUnreadMessageCount,
      }),
    );

    loadUnreadMessageCount();

    return () => {
      isMounted = false;
      sdk.groupChannel.removeGroupChannelHandler(handlerId);
    };
  }, [clientUserId, sdk, subscriptionId]);

  return { count, isLoading, error };
};
