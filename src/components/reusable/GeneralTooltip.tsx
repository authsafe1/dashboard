import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

const GeneralTooltip = styled(
  ({ className, arrow, children, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow={arrow} classes={{ popper: className }}>
      {children}
    </Tooltip>
  ),
)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    color: theme.palette.common.black,
  },
}));

export default GeneralTooltip;
