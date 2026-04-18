import type { GroupChannel as SendbirdGroupChannelType } from '@sendbird/chat/groupChannel';
import SendbirdGroupChannelList from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannel as SendbirdGroupChannel } from '@sendbird/uikit-react/GroupChannel';
import type { ChatViews, ConversationId } from '../../core/chatTypes';

export const createSendbirdChatViews = (): ChatViews => {
  const ConversationList: ChatViews['ConversationList'] = ({
    selectedConversationId,
    onConversationSelect,
  }) => {
    const handleConversationSelect = (conversation: SendbirdGroupChannelType | null) => {
      if (conversation?.url) {
        onConversationSelect(conversation.url);
      }
    };

    return (
      <SendbirdGroupChannelList
        onChannelSelect={handleConversationSelect}
        onChannelCreated={handleConversationSelect}
        selectedChannelUrl={selectedConversationId ?? ''}
      />
    );
  };

  const Conversation: ChatViews['Conversation'] = ({ conversationId }: { conversationId?: ConversationId }) => {
    return <SendbirdGroupChannel channelUrl={conversationId ?? ''} />;
  };

  return {
    ConversationList,
    Conversation,
  };
};
