import {
  Card,
  CardActionArea,
  CardContent,
  FormLabel,
  Grid2 as Grid,
  Paper,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import constants from '../../config/constants';

interface IGrantSelectorProps {
  defaultValue: string;
  title: string;
  onSelect: (grant: string) => void;
}

const GrantSelector: FC<IGrantSelectorProps> = ({
  defaultValue,
  title,
  onSelect,
}) => {
  const [selected, setSelected] = useState(defaultValue);
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12 }}>
        <FormLabel required>{title}</FormLabel>
      </Grid>
      {constants.grants.map(({ Icon, title, description, value }, index) => (
        <Grid key={`${value}-${index}`} size={{ xs: 12, md: 6 }} height="100%">
          <Card
            variant="outlined"
            sx={(theme) => {
              return {
                cursor: 'pointer',
                borderColor:
                  selected === value ? theme.palette.primary.main : undefined,
              };
            }}
          >
            <CardActionArea
              onClick={() => {
                setSelected(value);
                onSelect(value);
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,

                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Paper>
                  <Icon fontSize="large" />
                </Paper>
                <Typography variant="h6" component="span">
                  {title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default GrantSelector;
