import { CreditCardRounded, SimCardRounded } from '@mui/icons-material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  Card as MuiCard,
  OutlinedInput,
  Stack,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from '@mui/material';
import React, { FC, useState } from 'react';
import constants from '../../config/constants';

const StyledCard = styled(MuiCard)<{ selected?: boolean; disabled?: boolean }>(
  ({ theme }) => ({
    border: '1px solid',
    borderColor: theme.palette.divider,
    width: '100%',
    '&:hover': {
      background:
        'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
      borderColor: 'primary.dark',
      boxShadow: '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
    },
    variants: [
      {
        props: ({ selected }) => selected,
        style: {
          borderColor: theme.palette.primary.dark,
        },
      },
      {
        props: ({ disabled }) => disabled,
        style: {
          background: theme.palette.grey[700],
        },
      },
    ],
  }),
);

const PaymentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  height: 375,
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
  border: '1px solid ',
  borderColor: theme.palette.divider,
  background:
    'linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)',
  boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
  [theme.breakpoints.up('xs')]: {
    height: 300,
  },
  [theme.breakpoints.up('sm')]: {
    height: 350,
  },
  ...theme.applyStyles('dark', {
    background:
      'linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)',
    boxShadow: '0px 4px 8px hsl(220, 35%, 0%)',
  }),
}));

const FormGrid = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const SelectPlan: FC = () => {
  return (
    <Grid container spacing={2} my={2}>
      {constants.billingTiers.map((value, index) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
          <StyledCard>
            <CardHeader title={value.title} />
            <CardContent></CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

const addresses = ['1 MUI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
  { name: 'Card type:', detail: 'Visa' },
  { name: 'Card holder:', detail: 'Mr. John Smith' },
  { name: 'Card number:', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Expiry date:', detail: '04/2024' },
];

const Review = () => {
  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Products" secondary="4 selected" />
          <Typography variant="body2">$134.98</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" secondary="Plus taxes" />
          <Typography variant="body2">$9.99</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            $144.97
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Shipment details
          </Typography>
          <Typography gutterBottom>John Smith</Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary' }}>
            {addresses.join(', ')}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: '100%', mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {payment.name}
                  </Typography>
                  <Typography variant="body2">{payment.detail}</Typography>
                </Stack>
              </React.Fragment>
            ))}
          </Grid>
        </div>
      </Stack>
    </Stack>
  );
};

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const handleCardNumberChange = (event: { target: { value: string } }) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (value.length <= 16) {
      setCardNumber(formattedValue);
    }
  };

  const handleCvvChange = (event: { target: { value: string } }) => {
    const value = event.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleExpirationDateChange = (event: { target: { value: string } }) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{2})(?=\d{2})/, '$1/');
    if (value.length <= 4) {
      setExpirationDate(formattedValue);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PaymentContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2">Credit card</Typography>
          <CreditCardRounded sx={{ color: 'text.secondary' }} />
        </Box>
        <SimCardRounded
          sx={{
            fontSize: { xs: 48, sm: 56 },
            transform: 'rotate(90deg)',
            color: 'text.secondary',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            gap: 2,
          }}
        >
          <FormGrid sx={{ flexGrow: 1 }}>
            <FormLabel htmlFor="card-number" required>
              Card number
            </FormLabel>
            <OutlinedInput
              id="card-number"
              autoComplete="card-number"
              placeholder="0000 0000 0000 0000"
              required
              size="small"
              value={cardNumber}
              onChange={handleCardNumberChange}
            />
          </FormGrid>
          <FormGrid sx={{ maxWidth: '20%' }}>
            <FormLabel htmlFor="cvv" required>
              CVV
            </FormLabel>
            <OutlinedInput
              id="cvv"
              autoComplete="CVV"
              placeholder="123"
              required
              size="small"
              value={cvv}
              onChange={handleCvvChange}
            />
          </FormGrid>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormGrid sx={{ flexGrow: 1 }}>
            <FormLabel htmlFor="card-name" required>
              Name
            </FormLabel>
            <OutlinedInput
              id="card-name"
              autoComplete="card-name"
              placeholder="John Smith"
              required
              size="small"
            />
          </FormGrid>
          <FormGrid sx={{ flexGrow: 1 }}>
            <FormLabel htmlFor="card-expiration" required>
              Expiration date
            </FormLabel>
            <OutlinedInput
              id="card-expiration"
              autoComplete="card-expiration"
              placeholder="MM/YY"
              required
              size="small"
              value={expirationDate}
              onChange={handleExpirationDateChange}
            />
          </FormGrid>
        </Box>
      </PaymentContainer>
      <FormControlLabel
        control={<Checkbox name="saveCard" />}
        label="Remember credit card details for next time"
      />
    </Box>
  );
};

const steps = ['Select Plan', 'Payment details', 'Review your order'];
function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <SelectPlan />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
}
const BillingPlan = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <Grid container width="100%" direction="column" spacing={2}>
      <Grid width="100%">
        <Stepper
          variant="outlined"
          id="desktop-stepper"
          activeStep={activeStep}
          sx={{ width: '100%', height: 40 }}
        >
          {steps.map((label) => (
            <Step
              sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }}
              key={label}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
      <Grid width="100%">
        <Box>
          <React.Fragment>
            {getStepContent(activeStep)}
            <Box
              sx={[
                {
                  display: 'flex',
                  flexDirection: { xs: 'column-reverse', sm: 'row' },
                  alignItems: 'end',
                  flexGrow: 1,
                  gap: 1,
                  pb: { xs: 12, sm: 0 },
                  mt: { xs: 2, sm: 0 },
                  mb: '60px',
                },
                activeStep !== 0
                  ? { justifyContent: 'space-between' }
                  : { justifyContent: 'flex-end' },
              ]}
            >
              {activeStep !== 0 && (
                <Button
                  startIcon={<ChevronLeftRoundedIcon />}
                  onClick={handleBack}
                  variant="text"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  Previous
                </Button>
              )}
              {activeStep !== 0 && (
                <Button
                  startIcon={<ChevronLeftRoundedIcon />}
                  onClick={handleBack}
                  variant="outlined"
                  fullWidth
                  sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                  Previous
                </Button>
              )}
              <Button
                variant="contained"
                endIcon={<ChevronRightRoundedIcon />}
                onClick={handleNext}
                sx={{ width: { xs: '100%', sm: 'fit-content' } }}
              >
                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
              </Button>
            </Box>
          </React.Fragment>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BillingPlan;
