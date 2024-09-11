import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// ** Redux Imports
import store from './redux/store';
import { Provider } from 'react-redux';

// ** Toast
import { Toaster } from 'react-hot-toast';

import FullScreenLoader from './components/FullScreenLoader';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './assets/scss/app-loader.scss';

import reportWebVitals from './reportWebVitals';

// ** Lazy load app
const LazyApp = lazy(() => import('./App'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<FullScreenLoader />}>
        <LazyApp />
        <Toaster position="top-right" toastOptions={{ className: 'react-hot-toast' }} />
      </Suspense>
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
