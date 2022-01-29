import { Alert, AlertColor, Box, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
export const CollaspingAlert = ({
  message,
  severity,
  onClose,
}: {
  message: string;
  severity: AlertColor;
  onClose: () => void;
}) => {
  return (
    <Box sx={{ width: "100%", margin: "3px 0" }}>
      <Collapse in={!!message}>
        <Alert
          severity={severity}
          action={
            <IconButton aria-label="close" size="small" onClick={onClose}>
              <CloseIcon></CloseIcon>
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};
