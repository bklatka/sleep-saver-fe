import React from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

interface NewEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

export const NewEntryDialog = ({ open, onClose, onConfirm }: NewEntryDialogProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(format(selectedDate, 'yyyy-MM-dd'));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Date for New Entry</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <DatePicker
            label="Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Create Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};
