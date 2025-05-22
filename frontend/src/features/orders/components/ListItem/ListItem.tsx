import { Dispatch, SetStateAction } from 'react';
import * as S from './ListItem.styles';

type ListItemType = {
  orderId: string;
  clientName: string;
  setSelectedOrderId: Dispatch<SetStateAction<string>>;
};

export const ListItem: React.FC<ListItemType> = ({ orderId, clientName, setSelectedOrderId }) => {
  function handleClick() {
    setSelectedOrderId(orderId);
  }

  return (
    <S.Item key={orderId} onClick={handleClick}>
      {`Pedido #${orderId}`}
      <div>{clientName}</div>
    </S.Item>
  );
};
