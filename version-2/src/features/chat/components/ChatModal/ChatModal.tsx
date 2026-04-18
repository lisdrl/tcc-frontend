import { useState, type MouseEvent } from 'react';
import * as S from './ChatModal.styles';
import { useChatImplementation, type ConversationId } from '../../core';

type ChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'list' | 'conversation';
  conversationId?: ConversationId;
};

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  mode,
  conversationId,
}) => {
  const [currentConversationId, setCurrentConversationId] = useState<ConversationId>();
  const {
    views: { ConversationList, Conversation },
  } = useChatImplementation();
  const isChatList = mode === 'list';

  const handleSetCurrentConversation = (nextConversationId: ConversationId) => {
    setCurrentConversationId(nextConversationId);
  };

  if (!isOpen) {
    return null;
  }

  const handleContentClick = (e: MouseEvent<HTMLDivElement>) => {
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
              <ConversationList
                onConversationSelect={handleSetCurrentConversation}
                selectedConversationId={currentConversationId}
              />
              <Conversation conversationId={currentConversationId} />
            </>
          ) : (
            <Conversation conversationId={conversationId} />
          )}
        </S.ChannelListContainer>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};
