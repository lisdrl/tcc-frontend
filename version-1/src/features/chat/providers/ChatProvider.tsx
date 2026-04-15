import type { PropsWithChildren } from 'react';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import '@sendbird/uikit-react/dist/index.css';
import { CHAT_ACCESS_TOKEN, CHAT_APP_ID, CURRENT_CHAT_USER_ID } from '../config/chatConfig';

export const ChatProvider = ({ children }: PropsWithChildren) => {
  return (
    <SendbirdProvider
      appId={CHAT_APP_ID}
      userId={CURRENT_CHAT_USER_ID}
      accessToken={CHAT_ACCESS_TOKEN}
    >
      {children}
    </SendbirdProvider>
  );
};
