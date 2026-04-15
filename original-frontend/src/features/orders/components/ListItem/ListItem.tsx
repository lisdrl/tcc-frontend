import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useSendbird } from '@sendbird/uikit-react';
import { GroupChannelHandler, QueryType } from '@sendbird/chat/groupChannel';
import * as S from './ListItem.styles';
import { selectedOrderIdAtom } from '../../state';
import { SENDBIRD_USER_ID } from '../../../users/constants';
import { UnreadBadge } from '../../../../components/UnreadBadge';

type ListItemType = {
  orderId: string;
  clientName: string;
  clientId: string;
};

type ChannelUnreadState = {
  url: string;
  unreadMessageCount?: number;
  members?: { userId: string }[];
};

export const ListItem: React.FC<ListItemType> = ({ orderId, clientName, clientId }) => {
  const [, setSelectedOrderId] = useAtom(selectedOrderIdAtom);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const {
    state: { stores },
  } = useSendbird();
  const sdk = stores.sdkStore.sdk;

  function handleClick() {
    setSelectedOrderId(orderId);
  }

  useEffect(() => {
    if (!sdk?.groupChannel) {
      return;
    }

    let channelUrl = '';
    let isMounted = true;
    const handlerId = `order-${orderId}-unread-count`;

    async function loadUnreadMessageCount() {
      const query = sdk.groupChannel.createMyGroupChannelListQuery({
        includeEmpty: true,
        limit: 1,
        userIdsFilter: {
          userIds: [SENDBIRD_USER_ID, clientId],
          includeMode: true,
          queryType: QueryType.AND,
        },
      });
      const [channel] = await query.next();

      if (!isMounted) {
        return;
      }

      channelUrl = channel?.url ?? '';
      setUnreadMessageCount(channel?.unreadMessageCount ?? 0);
    }

    const isOrderChannel = (channel: ChannelUnreadState) => {
      if (channelUrl) {
        return channel.url === channelUrl;
      }

      const memberIds = channel.members?.map((member) => member.userId) ?? [];
      return memberIds.includes(SENDBIRD_USER_ID) && memberIds.includes(clientId);
    };

    const updateUnreadMessageCount = (channel: ChannelUnreadState) => {
      if (isOrderChannel(channel)) {
        channelUrl = channel.url;
        setUnreadMessageCount(channel.unreadMessageCount ?? 0);
      }
    };

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
  }, [clientId, orderId, sdk]);

  return (
    <S.Item key={orderId} onClick={handleClick}>
      <S.OrderHeader>
        <span>{`Pedido #${orderId}`}</span>
        <UnreadBadge count={unreadMessageCount} />
      </S.OrderHeader>
      <div>{clientName}</div>
    </S.Item>
  );
};
