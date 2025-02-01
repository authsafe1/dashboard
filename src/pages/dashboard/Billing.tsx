import { CheckCircleRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Alert } from '../../components';
import constants from '../../config/constants';
import { brand } from '../../config/theme';
import { Plan, useAuth } from '../../context/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

const Billing = () => {
  const { profile, checkAuth } = useAuth();
  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: { FREE: false, PROFESSIONAL: false, ENTERPRISE: false },
    success: false,
    message: '',
  });

  const handleVerifyPayment = async (
    paymentResponse: PaymentResponse,
    type: 'PROFESSIONAL' | 'ENTERPRISE',
  ) => {
    try {
      setApiResponse({
        ...apiResponse,
        loading: { ...apiResponse.loading, [type]: true },
      });
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/billing/verify`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: paymentResponse.razorpay_payment_id,
            subscriptionId: paymentResponse.razorpay_subscription_id,
            razorpaySignature: paymentResponse.razorpay_signature,
          }),
        },
      );

      if (response.ok) {
        setApiResponse({
          ...apiResponse,
          success: true,
          message: 'Payment verified',
          loading: { ...apiResponse.loading, [type]: false },
        });
      } else {
        constants.fetchError(response.status);
      }
    } catch (err: any) {
      setApiResponse({
        ...apiResponse,
        error: true,
        message: err.message || 'Error with payment',
        loading: { ...apiResponse.loading, [type]: false },
      });
      return;
    }
  };

  const handleSubscription = async (type: 'PROFESSIONAL' | 'ENTERPRISE') => {
    let subscriptionId = '';

    try {
      setApiResponse({
        ...apiResponse,
        loading: { ...apiResponse.loading, [type]: true },
      });
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/billing/create`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type }),
        },
      );

      if (response.ok) {
        const responseBody = await response.json();
        subscriptionId = responseBody.subscriptionId;
      } else {
        constants.fetchError(response.status);
      }
    } catch (err: any) {
      setApiResponse({
        ...apiResponse,
        error: true,
        message: err.message || 'Error creating subscription',
      });
      return;
    }

    if (!subscriptionId) {
      setApiResponse({
        ...apiResponse,
        error: true,
        message: 'Error creating subscription',
      });
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      name: 'AuthSafe',
      subscription_id: subscriptionId,
      theme: { color: brand[400] },
      prefill: {
        name: profile?.name,
        email: profile?.email,
        method: 'card',
      },
      handler: (response: PaymentResponse) =>
        handleVerifyPayment(response, type),
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCancelSubscription = async () => {
    try {
      setApiResponse({
        ...apiResponse,
        loading: { ...apiResponse.loading, FREE: true },
      });
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/billing/cancel`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.ok) {
        setApiResponse({
          ...apiResponse,
          success: true,
          message: 'Plan downgraded to free',
          loading: { ...apiResponse.loading, FREE: false },
        });
      } else {
        constants.fetchError(response.status);
      }
    } catch (err: any) {
      console.log(err);
      setApiResponse({
        ...apiResponse,
        loading: { ...apiResponse.loading, FREE: false },
        error: true,
        message: err.message || 'Error downgrading plan',
      });
      return;
    }
  };

  return (
    <>
      <Alert
        success={apiResponse.success}
        error={apiResponse.error}
        message={apiResponse.message}
        handleClose={() => {
          setApiResponse({
            ...apiResponse,
            error: false,
            loading: { FREE: false, PROFESSIONAL: false, ENTERPRISE: false },
            success: false,
            message: '',
          });
          checkAuth();
        }}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid container width="100%" justifyContent="space-between">
          <Grid rowSpacing={2}>
            <Typography variant="h4">Billing</Typography>
            <Typography color="textSecondary">
              Upgrade your profile for more powerful features.
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} width="100%">
          <Grid size={{ md: 4, xs: 12 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardHeader
                title="Free"
                subheader={constants.billingTiers.FREE.price}
              />
              <CardContent>
                <Stack spacing={2}>
                  {constants.billingTiers.FREE.features.map((tier, index) => (
                    <Stack key={`FREE-${index}`} direction="row" spacing={1.5}>
                      <CheckCircleRounded color="primary" />
                      <Typography variant="subtitle2">{tier}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
              <CardActions>
                <LoadingButton
                  loading={apiResponse.loading.FREE}
                  disabled={profile?.Subscription.type === Plan.FREE}
                  variant="contained"
                  onClick={handleCancelSubscription}
                >
                  {profile?.Subscription.type === Plan.FREE
                    ? 'Continue as Free'
                    : 'Downgrade to Free'}
                </LoadingButton>
              </CardActions>
            </Card>
          </Grid>
          <Grid size={{ md: 4, xs: 12 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardHeader
                title="Professional"
                subheader={constants.billingTiers.PROFESSIONAL.price}
              />
              <CardContent>
                <Stack spacing={2}>
                  {constants.billingTiers.PROFESSIONAL.features.map(
                    (tier, index) => (
                      <Stack
                        key={`PROFESSIONAL-${index}`}
                        direction="row"
                        spacing={1.5}
                      >
                        <CheckCircleRounded color="primary" />
                        <Typography variant="subtitle2">{tier}</Typography>
                      </Stack>
                    ),
                  )}
                </Stack>
              </CardContent>
              <CardActions>
                <LoadingButton
                  loading={apiResponse.loading.PROFESSIONAL}
                  disabled={profile?.Subscription.type === Plan.PROFESSIONAL}
                  variant="contained"
                  onClick={(event) => {
                    event.preventDefault();
                    handleSubscription('PROFESSIONAL');
                  }}
                >
                  {profile?.Subscription.type === Plan.ENTERPRISE
                    ? 'Downgrade to Professional'
                    : 'Upgrade to Professional'}
                </LoadingButton>
              </CardActions>
            </Card>
          </Grid>
          <Grid size={{ md: 4, xs: 12 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardHeader
                title="Enterprise"
                subheader={constants.billingTiers.ENTERPRISE.price}
              />
              <CardContent>
                <Stack spacing={2}>
                  {constants.billingTiers.ENTERPRISE.features.map(
                    (tier, index) => (
                      <Stack
                        key={`ENTERPRISE-${index}`}
                        direction="row"
                        spacing={1.5}
                      >
                        <CheckCircleRounded color="primary" />
                        <Typography variant="subtitle2">{tier}</Typography>
                      </Stack>
                    ),
                  )}
                </Stack>
              </CardContent>
              <CardActions>
                <LoadingButton
                  loading={apiResponse.loading.ENTERPRISE}
                  disabled={profile?.Subscription.type === Plan.ENTERPRISE}
                  variant="contained"
                  onClick={(event) => {
                    event.preventDefault();
                    handleSubscription('ENTERPRISE');
                  }}
                >
                  Upgrade to Enterprise
                </LoadingButton>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Billing;
