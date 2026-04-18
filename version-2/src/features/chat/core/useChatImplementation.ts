import { useContext } from 'react';
import { ChatContext } from './ChatContext';
import type { ChatImplementation } from './chatTypes';

export const useChatImplementation = (): ChatImplementation => {
  const implementation = useContext(ChatContext);

  if (!implementation) {
    throw new Error('Chat implementation is not configured.');
  }

  return implementation;
};
