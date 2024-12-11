import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { toastService } from '../services/ToastService';

export const Toast = observer(() => {
  return (
    <>
      {toastService.toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          style={{ bottom: `${index * 60 + 16}px` }}
        >
          <Alert
            onClose={() => toastService.remove(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}); 