import { useStartOrderChat } from '../../hooks';
import type { ConversationId } from '../../types';
import * as S from './ChatButton.styles';

type ChatButtonProps = {
  clientUserId: string;
  onConversationStarted: (conversationId: ConversationId) => void;
};

export const ChatButton: React.FC<ChatButtonProps> = ({
  clientUserId,
  onConversationStarted,
}) => {
  const { startOrderChat, isStarting } = useStartOrderChat();

  async function handleStartChat() {
    const conversationId = await startOrderChat({ clientUserId });

    if (conversationId) {
      onConversationStarted(conversationId);
    }
  }

  return (
    <S.Button onClick={handleStartChat} disabled={isStarting}>
      {isStarting ? 'Abrindo chat...' : 'Abrir chat'}
    </S.Button>
  );
};
