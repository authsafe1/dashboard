import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import React, { FC, useState } from 'react';

interface IFAQProps {
  body: {
    title: string;
    summary: string;
  }[];
}

const FAQ: FC<IFAQProps> = ({ body }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box>
      {body.map((value, index) => (
        <Accordion
          expanded={expanded === `panel-${index}`}
          onChange={handleChange(`panel-${index}`)}
          key={index}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`panel-${index}-content`}
            id={`panel-${index}d-header`}
          >
            <Typography component="h3" variant="subtitle2">
              {value.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" gutterBottom>
              {value.summary}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;
