import { Snackbar } from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import React from "react";

export type ToastOptions = {
  message: string;
  type: AlertColor;
};

interface ToastProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toastOptions: ToastOptions;
}

const Toast = ({ open, setOpen, toastOptions }: ToastProps) => {
  return (
    <Snackbar open={open} autoHideDuration={1000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <MuiAlert onClose={() => setOpen(false)} severity={toastOptions.type} sx={{ width: "100%" }} variant="filled">
        {toastOptions.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Toast;
