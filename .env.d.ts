/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_CHAT_API_KEY: string;
    REACT_APP_CHAT_APP_ID: string;
  }
}
