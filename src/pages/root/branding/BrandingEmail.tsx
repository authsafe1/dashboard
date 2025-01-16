import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  Grid2 as Grid,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { RichTextEditor } from '../../../components';

interface IEmailTemplateDialog {
  title: string;
  open: boolean;
  body: {
    from: string;
    replyTo: string;
    subject: string;
    body: object;
  };
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => void;
  handleClose: () => void;
}

const EmailTemplateDialog: FC<IEmailTemplateDialog> = ({
  title,
  open,
  body,
  handleInputChange,
  handleSubmit,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="From"
              fullWidth
              required
              autoComplete="email"
              placeholder="e.g. John Doe"
              // error={validation.name}
              // helperText={validation.name ? "Must not be blank" : ""}
              value={body.from}
              onChange={(event) =>
                handleInputChange('from', event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
          <Grid>
            <TextField
              label="Reply To"
              fullWidth
              required
              autoComplete="email"
              placeholder="e.g. acne@example.com"
              // error={validation.name}
              // helperText={validation.name ? "Must not be blank" : ""}
              value={body.replyTo}
              onChange={(event) =>
                handleInputChange('replyTo', event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
          <Grid>
            <TextField
              label="Subject"
              fullWidth
              required
              placeholder="e.g. Email subject"
              // error={validation.name}
              // helperText={validation.name ? "Must not be blank" : ""}
              value={body.subject}
              onChange={(event) =>
                handleInputChange('subject', event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
          <Grid rowSpacing={2}>
            <FormLabel required>Body</FormLabel>
            <RichTextEditor
              value={body.body}
              onUpdate={(content) => handleInputChange('body', content)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <LoadingButton variant="contained" onClick={handleSubmit}>
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const Email = () => {
  const [templateDialog, setTemplateDialog] = useState({
    open: false,
    title: '',
    handleSubmit: () => null,
  });

  const [body, setBody] = useState({
    from: '',
    replyTo: '',
    subject: '',
    body: {},
  });

  const handleTemplateDialogClose = () => {
    setTemplateDialog({
      open: false,
      title: '',
      handleSubmit: () => null,
    });
  };

  const handleInputChange = (name: string, value: string) => {
    setBody({ ...body, [name]: value });
  };

  return (
    <>
      <EmailTemplateDialog
        open={templateDialog.open}
        title={templateDialog.title}
        body={body}
        handleInputChange={handleInputChange}
        handleSubmit={templateDialog.handleSubmit}
        handleClose={handleTemplateDialogClose}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid rowSpacing={2}>
          <Typography variant="h4">Email Template Customization</Typography>
          <Typography color="textSecondary">
            Customize the text and layout of your email templates to match your
            organization's tone and style. Edit content to create engaging and
            brand-aligned communication.
          </Typography>
        </Grid>
        <Grid container width="100%" spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardActionArea
                onClick={() => {
                  setTemplateDialog({
                    ...templateDialog,
                    open: true,
                    title: 'User Invitation',
                  });
                }}
              >
                <CardHeader title="User Invitation" subheader="" />
                <CardContent>
                  <Typography>Updated 2 days ago</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Email;
