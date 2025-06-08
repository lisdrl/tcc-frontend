import React, { useState } from 'react';
import * as S from './ChatListModal.styles';
import GroupChannelList from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
import { GroupChannel as GroupChannelType } from '@sendbird/chat/groupChannel';

interface ChatListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatListModal: React.FC<ChatListModalProps> = ({ isOpen, onClose }) => {
  const [currentChannel, setCurrentChannel] = useState<GroupChannelType | null>(null);

  const handleSetCurrentChannel = (channel: GroupChannelType) => {
    setCurrentChannel(channel);
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
          <S.ModalTitle>Chats Ativos</S.ModalTitle>
          <S.CloseButton onClick={onClose} aria-label="Fechar modal">
            &times;
          </S.CloseButton>
        </S.ModalHeader>
        <S.ChannelListContainer>
          <GroupChannelList
            onChannelSelect={handleSetCurrentChannel}
            onChannelCreated={handleSetCurrentChannel}
            selectedChannelUrl={currentChannel?.url ?? ''}
          />
          <GroupChannel
            channelUrl={currentChannel?.url ?? ''}
          />
        </S.ChannelListContainer>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};
