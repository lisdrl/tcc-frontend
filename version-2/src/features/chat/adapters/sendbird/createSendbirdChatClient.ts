import { UserEventHandler } from '@sendbird/chat';
import { GroupChannelHandler, QueryType } from '@sendbird/chat/groupChannel';
import type {
  ChatClient,
  ConversationId,
  OrderChatTarget,
  Unsubscribe,
} from '../../core/chatTypes';

type SendbirdMember = {
  userId: string;
};

type SendbirdConversation = {
  url: string;
  unreadMessageCount?: number;
  members?: SendbirdMember[];
};

type SendbirdGroupChannelQuery = {
  next: () => Promise<SendbirdConversation[]>;
};

type SendbirdGroupChannelModule = {
  getTotalUnreadMessageCount: () => Promise<number>;
  createMyGroupChannelListQuery: (params: {
    includeEmpty: boolean;
    limit: number;
    userIdsFilter: {
      userIds: string[];
      includeMode: boolean;
      queryType: typeof QueryType.AND;
    };
  }) => SendbirdGroupChannelQuery;
  createChannel: (params: {
    invitedUserIds: string[];
    isDistinct: boolean;
  }) => Promise<SendbirdConversation>;
  addGroupChannelHandler: (handlerId: string, handler: unknown) => void;
  removeGroupChannelHandler: (handlerId: string) => void;
};

type SendbirdSdk = {
  groupChannel?: SendbirdGroupChannelModule;
  addUserEventHandler?: (handlerId: string, handler: unknown) => void;
  removeUserEventHandler?: (handlerId: string) => void;
};

type CreateSendbirdChatClientParams = {
  sdk: unknown;
  currentUserId: string;
};

type SendbirdUnreadCount = {
  groupChannelCount: number;
};

let subscriptionCounter = 0;

const noop: Unsubscribe = () => undefined;

const createSubscriptionId = (name: string) => {
  subscriptionCounter += 1;
  return `${name}-${subscriptionCounter}`;
};

export const createSendbirdChatClient = ({
  sdk,
  currentUserId,
}: CreateSendbirdChatClientParams): ChatClient => {
  const sendbirdSdk = sdk as SendbirdSdk | null | undefined;
  const groupChannel = sendbirdSdk?.groupChannel;

  const getOrderConversation = async ({
    clientUserId,
  }: OrderChatTarget): Promise<SendbirdConversation | null> => {
    if (!groupChannel || !clientUserId) {
      return null;
    }

    const query = groupChannel.createMyGroupChannelListQuery({
      includeEmpty: true,
      limit: 1,
      userIdsFilter: {
        userIds: [currentUserId, clientUserId],
        includeMode: true,
        queryType: QueryType.AND,
      },
    });
    const [conversation] = await query.next();

    return conversation ?? null;
  };

  const getTotalUnreadCount = async () => {
    if (!groupChannel) {
      return 0;
    }

    return groupChannel.getTotalUnreadMessageCount();
  };

  const getOrderChatUnreadCount = async (target: OrderChatTarget) => {
    const conversation = await getOrderConversation(target);

    return conversation?.unreadMessageCount ?? 0;
  };

  const subscribeToTotalUnreadCount = (onChange: (count: number) => void): Unsubscribe => {
    if (!sendbirdSdk?.addUserEventHandler || !sendbirdSdk.removeUserEventHandler || !groupChannel) {
      return noop;
    }

    const userHandlerId = createSubscriptionId('chat-total-unread-count');
    const groupChannelHandlerId = createSubscriptionId('chat-total-unread-count-channel');

    const notifyWithCurrentCount = () => {
      void getTotalUnreadCount()
        .then(onChange)
        .catch(() => undefined);
    };

    sendbirdSdk.addUserEventHandler(
      userHandlerId,
      new UserEventHandler({
        onTotalUnreadMessageCountChanged: (unreadMessageCount: SendbirdUnreadCount) => {
          onChange(unreadMessageCount.groupChannelCount);
        },
      }),
    );

    groupChannel.addGroupChannelHandler(
      groupChannelHandlerId,
      new GroupChannelHandler({
        onChannelChanged: notifyWithCurrentCount,
        onMessageReceived: notifyWithCurrentCount,
        onMessageDeleted: notifyWithCurrentCount,
        onUnreadMemberStatusUpdated: notifyWithCurrentCount,
      }),
    );

    return () => {
      sendbirdSdk.removeUserEventHandler?.(userHandlerId);
      groupChannel.removeGroupChannelHandler(groupChannelHandlerId);
    };
  };

  const subscribeToOrderChatUnreadCount = (
    target: OrderChatTarget,
    onChange: (count: number) => void,
  ): Unsubscribe => {
    if (!groupChannel || !target.clientUserId) {
      return noop;
    }

    let conversationId: ConversationId = '';
    const handlerId = createSubscriptionId('order-chat-unread-count');

    const isOrderConversation = (conversation: SendbirdConversation) => {
      if (conversationId) {
        return conversation.url === conversationId;
      }

      const memberIds = conversation.members?.map((member) => member.userId) ?? [];
      return memberIds.includes(currentUserId) && memberIds.includes(target.clientUserId);
    };

    const updateUnreadCount = (conversation: SendbirdConversation) => {
      if (!isOrderConversation(conversation)) {
        return;
      }

      conversationId = conversation.url;
      onChange(conversation.unreadMessageCount ?? 0);
    };

    groupChannel.addGroupChannelHandler(
      handlerId,
      new GroupChannelHandler({
        onChannelChanged: updateUnreadCount,
        onMessageReceived: updateUnreadCount,
        onUnreadMemberStatusUpdated: updateUnreadCount,
      }),
    );

    void getOrderConversation(target).then((conversation) => {
      conversationId = conversation?.url ?? '';
    }).catch(() => undefined);

    return () => {
      groupChannel.removeGroupChannelHandler(handlerId);
    };
  };

  const startOrderChat = async ({
    clientUserId,
  }: OrderChatTarget): Promise<ConversationId> => {
    if (!groupChannel) {
      throw new Error('Chat SDK is not initialized.');
    }

    if (!clientUserId) {
      throw new Error('Client user id is required to start an order chat.');
    }

    const conversation = await groupChannel.createChannel({
      invitedUserIds: [currentUserId, clientUserId],
      isDistinct: true,
    });

    return conversation.url;
  };

  return {
    getTotalUnreadCount,
    subscribeToTotalUnreadCount,
    getOrderChatUnreadCount,
    subscribeToOrderChatUnreadCount,
    startOrderChat,
  };
};
