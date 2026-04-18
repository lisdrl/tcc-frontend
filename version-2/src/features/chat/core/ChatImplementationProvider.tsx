import type { PropsWithChildren } from 'react';
import { ChatContext } from './ChatContext';
import type { ChatImplementation } from './chatTypes';

type ChatImplementationProviderProps = PropsWithChildren<{
  implementation: ChatImplementation;
}>;

export const ChatImplementationProvider = ({
  implementation,
  children,
}: ChatImplementationProviderProps) => {
  return <ChatContext.Provider value={implementation}>{children}</ChatContext.Provider>;
};
