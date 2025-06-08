import React, { useState } from 'react';
import * as S from './Header.styles';
import { ChatListModal } from '../../features/chat/components/ChatListModal'; // We will create this component next

type HeaderType = {
  title: string;
};

export const Header: React.FC<HeaderType> = ({ title }) => {
  const [isChatListModalOpen, setIsChatListModalOpen] = useState(false);

  const toggleChatListModal = () => {
    setIsChatListModalOpen(!isChatListModalOpen);
  };

  return (
    <>
      <S.Container>
        <h1>{title}</h1>
        <S.ChatButtonStyled onClick={toggleChatListModal}>
          Ver chats
        </S.ChatButtonStyled>
      </S.Container>
      {isChatListModalOpen && (
        <ChatListModal isOpen={isChatListModalOpen} onClose={toggleChatListModal} />
      )}
    </>
  );
};
