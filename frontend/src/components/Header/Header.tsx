import React, { useEffect, useState } from 'react';
import { UserEventHandler } from '@sendbird/chat';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { useSendbird } from '@sendbird/uikit-react';
import * as S from './Header.styles';
import { ChatModal } from '../../features/chat/components/ChatModal';
import { UnreadBadge } from '../UnreadBadge';

type HeaderType = {
  title: string;
};

export const Header: React.FC<HeaderType> = ({ title }) => {
  const [isChatListModalOpen, setIsChatListModalOpen] = useState(false);
  const [totalUnreadMessageCount, setTotalUnreadMessageCount] = useState(0);
  const {
    state: { stores },
  } = useSendbird();
  const sdk = stores.sdkStore.sdk;

  const toggleChatListModal = () => {
    setIsChatListModalOpen(!isChatListModalOpen);
  };

  useEffect(() => {
    if (!sdk?.groupChannel) {
      return;
    }

    let isMounted = true;
    const handlerId = 'header-total-unread-count';
    const groupChannelHandlerId = `${handlerId}-group-channel`;

    async function loadTotalUnreadMessageCount() {
      const unreadCount = await sdk.groupChannel.getTotalUnreadMessageCount();

      if (isMounted) {
        setTotalUnreadMessageCount(unreadCount);
      }
    }

    sdk.addUserEventHandler(
      handlerId,
      new UserEventHandler({
        onTotalUnreadMessageCountChanged: (unreadMessageCount) => {
          setTotalUnreadMessageCount(unreadMessageCount.groupChannelCount);
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

  return (
    <>
      <S.Container>
        <h1>{title}</h1>
        <S.ChatButtonStyled onClick={toggleChatListModal}>
          Ver chats
          <UnreadBadge
            count={totalUnreadMessageCount}
            label={`${totalUnreadMessageCount} mensagens nao lidas em todos os chats`}
          />
        </S.ChatButtonStyled>
      </S.Container>
      {isChatListModalOpen && (
        <ChatModal isOpen={isChatListModalOpen} onClose={toggleChatListModal} type="LIST" />
      )}
    </>
  );
};
