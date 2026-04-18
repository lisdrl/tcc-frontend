import { useAtom } from 'jotai';
import * as S from './OrderDetails.styles';
import { selectedOrderIdAtom } from '../../state';
import { useOrderById } from '../../hooks';
import { useState } from 'react';
import { ChatButton, ChatModal, type ConversationId } from '../../../chat';

export const OrderDetails: React.FC = () => {
  const [selectedOrderId] = useAtom(selectedOrderIdAtom);
  const selectedOrder = useOrderById(selectedOrderId);
  const [isChatListModalOpen, setIsChatListModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [conversationId, setConversationId] = useState<ConversationId | null>(null);

  function handleConversationStarted(nextConversationId: ConversationId) {
    setConversationId(nextConversationId);
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
            onConversationStarted={handleConversationStarted}
            clientUserId={selectedOrder.client.id}
          />
          {showChat && conversationId && (
            <ChatModal
              isOpen={isChatListModalOpen}
              onClose={() => setIsChatListModalOpen(false)}
              mode="conversation"
              conversationId={conversationId}
            />
          )}
        </>
      ) : (
        <p>Selecione um pedido</p>
      )}
    </S.Container>
  );
};
