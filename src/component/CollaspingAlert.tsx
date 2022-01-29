import { Alert, AlertColor, Box, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AlertMessage } from "../domain/AlertMessage";
export const CollaspingAlert = ({
  alertMessage,
  setAlertMessage,
}: {
  alertMessage: AlertMessage;
  setAlertMessage: (v: AlertMessage) => void;
}) => {
  return (
    <Box sx={{ width: "100%", margin: !!alertMessage ? "5px 0" : "0" }}>
      <Collapse in={!!alertMessage.message}>
        <Alert
          severity={alertMessage.severity}
          action={
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => setAlertMessage({ ...alertMessage, message: "" })}
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          }
        >
          {alertMessage?.message}
        </Alert>
      </Collapse>
    </Box>
  );
};
