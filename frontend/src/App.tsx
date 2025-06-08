import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { Home } from './pages/Home';
import GlobalStyles from './styles/GlobalStyles';
import { SENDBIRD_USER_ID } from './features/users/constants';
import '@sendbird/uikit-react/dist/index.css';

const SENDBIRD_APP_ID = import.meta.env.VITE_SENDBIRD_APP_ID ?? '';

export const App: React.FC = () => {
  return (
    <>
      <SendbirdProvider appId={SENDBIRD_APP_ID} userId={SENDBIRD_USER_ID} accessToken='135fbbab8c6125b1c994ddd9d4ff877ec6dde57b'>
        <GlobalStyles />
        <Home />/
      </SendbirdProvider>
    </>
  );
};
