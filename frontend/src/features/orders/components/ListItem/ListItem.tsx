import { useAtom } from 'jotai';
import * as S from './ListItem.styles';
import { selectedOrderIdAtom } from '../../state';

type ListItemType = {
  orderId: string;
  clientName: string;
};

export const ListItem: React.FC<ListItemType> = ({ orderId, clientName }) => {
  const [, setSelectedOrderId] = useAtom(selectedOrderIdAtom);

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
