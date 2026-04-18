import React, { useState } from 'react';
import * as S from './ChatModal.styles';
import SendbirdGroupChannelList from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannel as SendbirdGroupChannel } from '@sendbird/uikit-react/GroupChannel';
import type { GroupChannel as SendbirdGroupChannelType } from '@sendbird/chat/groupChannel';
import type { ConversationId } from '../../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'list' | 'conversation';
  conversationId?: ConversationId;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  mode,
  conversationId,
}) => {
  const [currentConversation, setCurrentConversation] =
    useState<SendbirdGroupChannelType | null>(null);
  const isChatList = mode === 'list';

  const handleSetCurrentConversation = (conversation: SendbirdGroupChannelType) => {
    setCurrentConversation(conversation);
  };

  if (!isOpen) {
    return null;
  }

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={handleContentClick}>
        <S.ModalHeader>
          <S.ModalTitle>{isChatList ? 'Chats Ativos' : 'Conversa'}</S.ModalTitle>
          <S.CloseButton type="button" onClick={onClose} aria-label="Fechar modal">
            ×
          </S.CloseButton>
        </S.ModalHeader>
        <S.ChannelListContainer>
          {isChatList ? (
            <>
              <SendbirdGroupChannelList
                onChannelSelect={handleSetCurrentConversation}
                onChannelCreated={handleSetCurrentConversation}
                selectedChannelUrl={currentConversation?.url ?? ''}
              />
              <SendbirdGroupChannel channelUrl={currentConversation?.url ?? ''} />
            </>
          ) : (
            <SendbirdGroupChannel channelUrl={conversationId ?? ''} />
          )}
        </S.ChannelListContainer>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};
