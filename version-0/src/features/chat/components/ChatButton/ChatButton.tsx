import { useCreateChannel } from '../../hooks';
import * as S from './ChatButton.styles';

type ChatButtonProps = {
  userId: string;
  clientId: string;
  onCreateChannel: (url: string) => void;
};

export const ChatButton: React.FC<ChatButtonProps> = ({ userId, clientId, onCreateChannel }) => {
  const onStartChat = useCreateChannel(userId, clientId, onCreateChannel);

  return <S.Button onClick={onStartChat}>{'Abrir chat'}</S.Button>;
};
