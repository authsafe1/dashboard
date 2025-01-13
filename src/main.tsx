import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { Loader } from './components';
import { AuthProvider } from './context/AuthContext';
import { OrganizationProvider } from './context/OrganizationContext';
import { ThemeProvider } from './context/ThemeContext';
import router from './router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <OrganizationProvider>
          <AuthProvider>
            <Suspense fallback={<Loader loading={true} />}>
              <RouterProvider router={router} />
            </Suspense>
          </AuthProvider>
        </OrganizationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
);
