import { useAtom } from 'jotai';
import * as S from './OrderDetails.styles';
import { selectedOrderIdAtom } from '../../state';
import { useOrderById } from '../../hooks';

export const OrderDetails: React.FC = () => {
  const [selectedOrderId, ] = useAtom(selectedOrderIdAtom);
  const selectedOrder = useOrderById(selectedOrderId);

  return (
    <S.Container>
      {selectedOrder ? (
        <>
          <h2>{`Pedido #${selectedOrder.id}`}</h2>
          <p>Cliente: {selectedOrder.clientName}</p>
          {/* {!showChat ? (
            <Button onClick={() => setShowChat(true)}>Abrir chat</Button>
          ) : (
            <ChatComponent chat={selectedChat} />
          )} */}
        </>
      ) : (
        <p>Selecione um pedido</p>
      )}
    </S.Container>
  );
};
