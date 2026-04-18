import type { PropsWithChildren } from 'react';
import { SendbirdChatProvider } from '../adapters/sendbird/SendbirdChatProvider';
import { CHAT_ACCESS_TOKEN, CHAT_APP_ID, CURRENT_CHAT_USER_ID } from '../config/chatConfig';

export const ChatProvider = ({ children }: PropsWithChildren) => {
  return (
    <SendbirdChatProvider
      appId={CHAT_APP_ID}
      userId={CURRENT_CHAT_USER_ID}
      accessToken={CHAT_ACCESS_TOKEN}
    >
      {children}
    </SendbirdChatProvider>
  );
};
