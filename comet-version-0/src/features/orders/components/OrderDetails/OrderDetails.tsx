import { useAtom } from 'jotai';
import * as S from './OrderDetails.styles';
import { selectedOrderIdAtom } from '../../state';
import { useOrderById } from '../../hooks';
import { SENDBIRD_USER_ID } from '../../../users/constants';
import { useState } from 'react';
import { ChatButton, ChatModal } from '../../../chat/components';

export const OrderDetails: React.FC = () => {
  const [selectedOrderId] = useAtom(selectedOrderIdAtom);
  const selectedOrder = useOrderById(selectedOrderId);
  const [isChatListModalOpen, setIsChatListModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [channelUrl, setChannelUrl] = useState('');

  function handleClickChat(url: string) {
    setChannelUrl(url);
    setShowChat(true);
    setIsChatListModalOpen(true);
  }

  return (
    <S.Container>
      {selectedOrder ? (
        <>
          <h2>{`Pedido #${selectedOrder.id}`}</h2>
          <p>Cliente: {selectedOrder.client.name}</p>
          <ChatButton
            onCreateChannel={handleClickChat}
            clientId={selectedOrder.client.id}
            userId={SENDBIRD_USER_ID}
          />
          {showChat && channelUrl && (
            <ChatModal
              isOpen={isChatListModalOpen}
              onClose={() => setIsChatListModalOpen(false)}
              type="SINGLE"
              channelUrl={channelUrl}
            />
          )}
        </>
      ) : (
        <p>Selecione um pedido</p>
      )}
    </S.Container>
  );
};
