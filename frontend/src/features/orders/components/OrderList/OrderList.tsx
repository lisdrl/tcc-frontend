import { Dispatch, SetStateAction } from 'react';
import { Order } from '../../types';
import { ListItem } from '../ListItem';
import * as S from './OrderList.styles';

type OrderListType = {
  orders: Order[];
  setSelectedOrderId: Dispatch<SetStateAction<string>>;
};

export const OrderList: React.FC<OrderListType> = ({ orders, setSelectedOrderId }) => {
  return (
    <S.Container>
      <S.Title>Pedidos</S.Title>
      {orders.map((order: Order) => (
        <ListItem
          orderId={order.id}
          clientName={order.clientName}
          setSelectedOrderId={setSelectedOrderId}
        />
      ))}
    </S.Container>
  );
};
