import React, { useState } from 'react';
import * as S from './Home.styles';
import { Header } from '../../components';
import { OrderList } from '../../features/orders/components/OrderList/OrderList';
import { orders } from '../../features/orders/data';
import { OrderDetails } from '../../features/orders/components/OrderDetails';

export const Home: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const selectedOrder = orders?.find(order => order.id === selectedOrderId);

  return (
    <S.Container>
      <Header title="Gestor de Pedidos" />
      <S.Content>
        <OrderList
          orders={orders}
          setSelectedOrderId={setSelectedOrderId}
        />
        <OrderDetails orderId={selectedOrder?.id} clientName={selectedOrder?.clientName} />
      </S.Content>
    </S.Container>
  );
};