import { Home } from './pages/Home';
import GlobalStyles from './styles/GlobalStyles';
import { ChatProvider } from './features/chat';

export const App = () => {
  return (
    <>
      <ChatProvider>
        <GlobalStyles />
        <Home />
      </ChatProvider>
    </>
  );
};
