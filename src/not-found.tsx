import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router';

interface IBackButtonProps {
  text: string;
  onClick: () => void;
}

const StyledBackButton: FC<IBackButtonProps> = ({ text, onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={onClick}
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

const NotFoundComponent = () => {
  const navigate = useNavigate();

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
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <StyledBackButton text="Back to Home" onClick={() => navigate('/')} />
      </Box>
    </Container>
  );
};

export default NotFoundComponent;
