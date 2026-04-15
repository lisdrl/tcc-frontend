import React, { useState } from 'react';
import * as S from './Header.styles';
import { ChatModal, useTotalUnreadMessages } from '../../features/chat';
import { UnreadBadge } from '../UnreadBadge';

type HeaderType = {
  title: string;
};

export const Header: React.FC<HeaderType> = ({ title }) => {
  const [isChatListModalOpen, setIsChatListModalOpen] = useState(false);
  const { count: totalUnreadMessageCount } = useTotalUnreadMessages();

  const toggleChatListModal = () => {
    setIsChatListModalOpen(!isChatListModalOpen);
  };

  return (
    <>
      <S.Container>
        <h1>{title}</h1>
        <S.ChatButtonStyled onClick={toggleChatListModal}>
          Ver chats
          <UnreadBadge
            count={totalUnreadMessageCount}
            label={`${totalUnreadMessageCount} mensagens não lidas em todos os chats`}
          />
        </S.ChatButtonStyled>
      </S.Container>
      {isChatListModalOpen && (
        <ChatModal isOpen={isChatListModalOpen} onClose={toggleChatListModal} mode="list" />
      )}
    </>
  );
};
