import {
  styled,
  Tooltip,
  tooltipClasses,
  type TooltipProps,
} from '@mui/material';

const ErrorTooltip = styled(
  ({ className, children, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }}>
      {children}
    </Tooltip>
  ),
)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.error.main,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    boxShadow: theme.shadows[2],
  },
  color: theme.palette.common.white,
}));

export default ErrorTooltip;
