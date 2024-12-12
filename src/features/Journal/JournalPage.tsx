import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

import { JournalForm } from './JournalForm';
import { useJournalByDate } from './hooks/useJournalByDate';

export const JournalPage = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { data: journal, isLoading, error } = useJournalByDate(date!);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">Błąd podczas ładowania wpisu dziennika</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/journal')}
        style={{ marginBottom: '10px' }}
      >
        Powrót do listy
      </Button>
      <Typography variant="h4">Wpis dziennika z dnia {new Date(date!).toLocaleDateString('pl')}</Typography>

      <JournalForm initialData={journal} date={date!} key={date} />
    </Box>
  );
};
