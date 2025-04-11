import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { LineChart } from '@mui/x-charts';
import dayjs from 'dayjs';
import { useLoaderData, useNavigate } from 'react-router';
import { brand } from '~/config/theme';
import { fetchApi } from '~/utils/fetchService';

export async function clientLoader() {
  const endpoints = [
    `${import.meta.env.VITE_API_URL}/organization/count`,
    `${import.meta.env.VITE_API_URL}/log/count?type=authorization&duration=1d`,
    `${import.meta.env.VITE_API_URL}/log/count?type=security&duration=1d`,
    `${import.meta.env.VITE_API_URL}/log?startTime=${dayjs()
      .subtract(1, 'week')
      ?.toISOString()}&endTime=${dayjs()?.toISOString()}&type=activity`,
  ];
  const data = await Promise.all(endpoints.map((url) => fetchApi(url)));
  return data;
}

type ILoaderData = [number, number, number, [string, string]];

const processLogData = (apiResponse: [string, string] = [] as any) => {
  const dailyCounts: Record<string, number> = {};

  apiResponse.forEach(([timestamp]) => {
    const date = dayjs(Number(timestamp) / 1e6).format('YYYY-MM-DD');

    if (!dailyCounts[date]) {
      dailyCounts[date] = 0;
    }
    dailyCounts[date]++;
  });

  const xAxis = Object.keys(dailyCounts)
    .sort((a, b) => new Date(a).getDate() - new Date(b).getDate())
    .map((date) => dayjs(date).valueOf());

  const yAxis = xAxis.map(
    (timestamp) => dailyCounts[dayjs(timestamp).format('YYYY-MM-DD')],
  );

  return { xAxis, yAxis };
};

const Insight = () => {
  const loaderData = useLoaderData() as ILoaderData;
  const navigate = useNavigate();
  const activityChart = processLogData(loaderData[3]);

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
                onClick={() => navigate('/log?type=authorization')}
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
                onClick={() => navigate('/log?type=security')}
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
                  data: activityChart.xAxis,
                  scaleType: 'time',
                  valueFormatter: (value) =>
                    value === null ? '' : dayjs(value).format('D-MMM-YYYY'),
                },
              ]}
              series={[
                {
                  data: activityChart.yAxis,
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
