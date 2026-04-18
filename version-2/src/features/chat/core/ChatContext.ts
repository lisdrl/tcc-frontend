import { createContext } from 'react';
import type { ChatImplementation } from './chatTypes';

export const ChatContext = createContext<ChatImplementation | null>(null);
