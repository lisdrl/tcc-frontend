import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import * as S from './Home.styles';
import { Header } from '../../components';
import { OrderList } from '../../features/orders/components/OrderList/OrderList';
import { orders as ordersMock } from '../../features/orders/data';
import { OrderDetails } from '../../features/orders/components/OrderDetails';
import { ordersAtom } from '../../features/orders/state';

export const Home: React.FC = () => {
  const [, setOrders] = useAtom(ordersAtom);

  useEffect(() => {
    setOrders(ordersMock);
  });

  return (
    <S.Container>
      <Header title="Gestor de Pedidos - Versão 2" />
      <S.Content>
        <OrderList />
        <OrderDetails />
      </S.Content>
    </S.Container>
  );
};
