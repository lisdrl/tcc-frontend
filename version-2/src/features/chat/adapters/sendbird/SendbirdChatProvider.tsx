import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { useSendbird } from '@sendbird/uikit-react';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import '@sendbird/uikit-react/dist/index.css';
import { ChatImplementationProvider } from '../../core/ChatImplementationProvider';
import type { ChatImplementation } from '../../core/chatTypes';
import { createSendbirdChatClient } from './createSendbirdChatClient';
import { createSendbirdChatViews } from './SendbirdChatViews';

type SendbirdChatProviderProps = PropsWithChildren<{
  appId: string;
  userId: string;
  accessToken: string;
}>;

type SendbirdImplementationBridgeProps = PropsWithChildren<{
  currentUserId: string;
}>;

const sendbirdChatViews = createSendbirdChatViews();

const SendbirdImplementationBridge = ({
  currentUserId,
  children,
}: SendbirdImplementationBridgeProps) => {
  const {
    state: { stores },
  } = useSendbird();
  const sdk = stores.sdkStore.sdk;

  const implementation = useMemo<ChatImplementation>(
    () => ({
      client: createSendbirdChatClient({ sdk, currentUserId }),
      views: sendbirdChatViews,
    }),
    [currentUserId, sdk],
  );

  return (
    <ChatImplementationProvider implementation={implementation}>
      {children}
    </ChatImplementationProvider>
  );
};

export const SendbirdChatProvider = ({
  appId,
  userId,
  accessToken,
  children,
}: SendbirdChatProviderProps) => {
  return (
    <SendbirdProvider appId={appId} userId={userId} accessToken={accessToken}>
      <SendbirdImplementationBridge currentUserId={userId}>
        {children}
      </SendbirdImplementationBridge>
    </SendbirdProvider>
  );
};
