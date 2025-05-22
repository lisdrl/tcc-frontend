import { useAtom } from 'jotai';
import { Order } from '../../types';
import { ListItem } from '../ListItem';
import * as S from './OrderList.styles';
import { ordersAtom } from '../../state';

export const OrderList: React.FC = () => {
  const [orders] = useAtom(ordersAtom);

  return (
    <S.Container>
      <S.Title>Pedidos</S.Title>
      {orders.map((order: Order) => (
        <ListItem
          orderId={order.id}
          clientName={order.clientName}
        />
      ))}
    </S.Container>
  );
};
