import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { FC } from 'react';
import { useNavigate, useRouteError } from 'react-router';
import { useAuth } from './context/AuthContext';

interface IBackButtonProps {
  text: string;
  handleClick: () => void;
}

const StyledBackButton: FC<IBackButtonProps> = ({ text, handleClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={handleClick}
      sx={{
        textTransform: 'none',
        px: 3,
        py: 1.5,
        borderRadius: 2,
        backgroundImage: (theme) =>
          `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        '&:hover': {
          backgroundImage: (theme) =>
            `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        },
      }}
    >
      {text}
    </Button>
  );
};

const ErrorComponent = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <ErrorOutline color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom color="text.primary">
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {error instanceof Error
            ? error.message
            : 'An unexpected error has occurred.'}
        </Typography>
        {isAuthenticated ? (
          <StyledBackButton
            text="Back to Dashboard"
            handleClick={() => navigate('/dashboard')}
          />
        ) : (
          <StyledBackButton
            text="Back to Home"
            handleClick={() => navigate('/')}
          />
        )}
      </Box>
    </Container>
  );
};

export default ErrorComponent;
