import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx';
import * as AuthContext from './auth.tsx';

import reportWebVitals from './reportWebVitals.ts';
import { App } from './app.tsx';

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <AuthContext.Provider>
          <App />
        </AuthContext.Provider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  );
}

reportWebVitals(console.log);
