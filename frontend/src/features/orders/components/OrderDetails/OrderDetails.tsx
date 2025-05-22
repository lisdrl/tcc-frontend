import * as S from './OrderDetails.styles';

type OrderDetailsType = {
  orderId?: string;
  clientName?: string;
};

export const OrderDetails: React.FC<OrderDetailsType> = ({
  orderId,
  clientName,
}) => {
  return (
    <S.Container>
      {orderId ? (
        <>
          <h2>{`Pedido #${orderId}`}</h2>
          <p>Cliente: {clientName}</p>
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
