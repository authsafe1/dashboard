import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { FC, PropsWithChildren } from 'react';
import { AuthProvider } from '~/context/auth-context';
import { OrganizationProvider } from '~/context/organization-context';
import { ThemeProvider } from '~/context/theme-context';

const GlobalLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <OrganizationProvider>
          <AuthProvider>{children}</AuthProvider>
        </OrganizationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default GlobalLayout;
