import { useAtom } from 'jotai';
import * as S from './ListItem.styles';
import { selectedOrderIdAtom } from '../../state';
import { UnreadBadge } from '../../../../components/UnreadBadge';
import { useOrderChatUnreadCount } from '../../../chat';

type ListItemType = {
  orderId: string;
  clientName: string;
  clientId: string;
};

export const ListItem: React.FC<ListItemType> = ({ orderId, clientName, clientId }) => {
  const [, setSelectedOrderId] = useAtom(selectedOrderIdAtom);
  const { count: unreadMessageCount } = useOrderChatUnreadCount({ clientUserId: clientId });

  function handleClick() {
    setSelectedOrderId(orderId);
  }

  return (
    <S.Item key={orderId} onClick={handleClick}>
      <S.OrderHeader>
        <span>{`Pedido #${orderId}`}</span>
        <UnreadBadge count={unreadMessageCount} />
      </S.OrderHeader>
      <div>{clientName}</div>
    </S.Item>
  );
};
