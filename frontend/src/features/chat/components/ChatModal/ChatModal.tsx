import React, { useState } from 'react';
import * as S from './ChatModal.styles';
import GroupChannelList from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
import { GroupChannel as GroupChannelType } from '@sendbird/chat/groupChannel';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'LIST' | 'SINGLE';
  channelUrl?: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, type, channelUrl }) => {
  const [currentChannel, setCurrentChannel] = useState<GroupChannelType | null>(null);
  const isChatList = type == 'LIST';

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
          <S.ModalTitle>{isChatList ? 'Chats Ativos' : 'Conversa'}</S.ModalTitle>
          <S.CloseButton onClick={onClose} aria-label="Fechar modal">
            &times;
          </S.CloseButton>
        </S.ModalHeader>
        <S.ChannelListContainer>
          {isChatList ? (
            <>
              <GroupChannelList
                onChannelSelect={handleSetCurrentChannel}
                onChannelCreated={handleSetCurrentChannel}
                selectedChannelUrl={currentChannel?.url ?? ''}
              />
              <GroupChannel channelUrl={currentChannel?.url ?? ''} />
            </>
          ) : (
            <GroupChannel channelUrl={channelUrl ?? ''} />
          )}
        </S.ChannelListContainer>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};
