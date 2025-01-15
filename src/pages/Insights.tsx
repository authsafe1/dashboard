import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  Grid2 as Grid,
  Typography,
} from '@mui/material';
import { LineChart } from '@mui/x-charts';
import dayjs from 'dayjs';
import { useLoaderData, useNavigate } from 'react-router';
import { brand } from '../config/theme';

type ILoaderData = [
  number,
  number,
  number,
  {
    xAxis: number[];
    yAxis: number[];
  },
  number[],
];

const Insight = () => {
  const loaderData = useLoaderData() as ILoaderData;
  const navigate = useNavigate();

  return (
    <Grid container width="100%" spacing={2} direction="column">
      <Grid rowSpacing={2}>
        <Typography variant="h4">Insights</Typography>
        <Typography color="textSecondary">
          Monitor key metrics like users, applications, and security alerts to
          stay updated on system activity.
        </Typography>
      </Grid>
      <Grid width="100%">
        <Card variant="outlined" sx={{ p: 1 }}>
          <Grid container rowSpacing={2} textAlign="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <CardActionArea
                onClick={() => navigate('/organizations?skip=0&take=10')}
                sx={{ p: 2 }}
              >
                <Typography variant="h5" color="textSecondary">
                  Organizations
                </Typography>
                <Typography>{loaderData[0]}</Typography>
              </CardActionArea>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CardActionArea
                onClick={() => navigate('/log/authorization?skip=0&take=10')}
                sx={{ p: 2 }}
              >
                <Typography variant="h5" color="textSecondary">
                  Authorization Logs
                </Typography>
                <Typography>{loaderData[1]}</Typography>
              </CardActionArea>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CardActionArea
                onClick={() => navigate('/log/security?skip=0&take=10')}
                sx={{ p: 2 }}
              >
                <Typography variant="h5" color="textSecondary">
                  Security Alerts
                </Typography>
                <Typography color="error">{loaderData[2]}</Typography>
              </CardActionArea>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid width="100%">
        <Divider />
      </Grid>
      <Grid width="100%">
        <Card variant="outlined">
          <CardHeader title="Activity" />
          <CardContent>
            <LineChart
              height={300}
              xAxis={[
                {
                  data: loaderData[3].xAxis,
                  scaleType: 'time',
                  valueFormatter: (value) =>
                    value === null ? '' : dayjs(value).format('D-MMM-YYYY'),
                },
              ]}
              series={[
                {
                  data: loaderData[3].yAxis,
                  color: brand[400],
                  area: false,
                },
              ]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Insight;
