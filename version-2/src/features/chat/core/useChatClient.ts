import type { ChatClient } from './chatTypes';
import { useChatImplementation } from './useChatImplementation';

export const useChatClient = (): ChatClient => {
  return useChatImplementation().client;
};
