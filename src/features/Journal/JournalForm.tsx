import React from 'react';
import { useNavigate } from 'react-router-dom';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Rating,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { parseISO, set } from 'date-fns';

import { toastService } from '../../services/ToastService';
import { FormProgress } from './components/FormProgress';
import { SleepMetricsSummary } from './components/SleepMetricsSummary';
import { useCreateJournal, useUpdateJournal } from './hooks/useJournalMutations';
import { JournalEntry } from './types';

interface JournalFormProps {
  initialData: JournalEntry | null;
  date: string;
}

interface FormState {
  timeGoToBed: Date | null;
  timeDecidedToSleep: Date | null;
  minutesNeededToSleep: number | null;
  timesWokenUp: number | null;
  totalWokeupDuration: number | null;
  timeWakeupMorning: Date | null;
  timeOutOfBedMorning: Date | null;
  minutesFeelingSleepy: number | null;
  sleepingQuality: number | null;
  mood: number | null;
  comment: string | null;
}

export const JournalForm = ({ initialData, date }: JournalFormProps) => {
  const navigate = useNavigate();
  const createJournal = useCreateJournal();
  const updateJournal = useUpdateJournal();

  const parseTimeString = (timeString: string | null | undefined): Date | null => {
    if (!timeString) return null;

    const baseDate = parseISO(date);

    if (timeString.includes('T')) {
      const parsedDate = parseISO(timeString);
      return set(baseDate, {
        hours: parsedDate.getHours(),
        minutes: parsedDate.getMinutes(),
        seconds: 0,
        milliseconds: 0,
      });
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    return set(baseDate, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });
  };

  const [formState, setFormState] = React.useState<FormState>({
    timeGoToBed: initialData?.timeGoToBed ? parseTimeString(initialData.timeGoToBed) : null,
    timeDecidedToSleep: initialData?.timeDecidedToSleep
      ? parseTimeString(initialData.timeDecidedToSleep)
      : null,
    minutesNeededToSleep: initialData?.minutesNeededToSleep ?? null,
    timesWokenUp: initialData?.timesWokenUp ?? null,
    totalWokeupDuration: initialData?.totalWokeupDuration ?? null,
    timeWakeupMorning: initialData?.timeWakeupMorning
      ? parseTimeString(initialData.timeWakeupMorning)
      : null,
    timeOutOfBedMorning: initialData?.timeOutOfBedMorning
      ? parseTimeString(initialData.timeOutOfBedMorning)
      : null,
    minutesFeelingSleepy: initialData?.minutesFeelingSleepy ?? null,
    sleepingQuality: initialData?.sleepingQuality ?? null,
    mood: initialData?.mood ?? null,
    comment: initialData?.comment ?? null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (initialData?._id) {
        await updateJournal.mutateAsync({
          date,
          data: {
            date,
            ...formState,
          },
        });
        toastService.success('Wpis dziennika został zaktualizowany');
      } else {
        await createJournal.mutateAsync({
          date,
          ...formState,
        });
        toastService.success('Wpis dziennika został utworzony');
      }

      navigate('/journal');
    } catch (error) {
      console.error('Failed to save journal:', error);
      toastService.error('Nie udało się zapisać wpisu dziennika');
    }
  };

  const setTimeToNow = (field: keyof FormState) => {
    const now = new Date();
    const baseDate = parseISO(date);

    // Set the time from 'now' but keep the date from the form
    const timeWithFormDate = set(baseDate, {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: 0,
      milliseconds: 0,
    });

    setFormState((prev) => ({ ...prev, [field]: timeWithFormDate }));
  };

  const handleTimeChange = (field: keyof FormState, newValue: Date | null) => {
    if (!newValue) {
      setFormState((prev) => ({ ...prev, [field]: null }));
      return;
    }

    const baseDate = parseISO(date);
    const timeWithFormDate = set(baseDate, {
      hours: newValue.getHours(),
      minutes: newValue.getMinutes(),
      seconds: 0,
      milliseconds: 0,
    });

    setFormState((prev) => ({ ...prev, [field]: timeWithFormDate }));
  };

  const renderTimeField = (
    label: string,
    field: keyof FormState,
    value: string | null | undefined
  ) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TimePicker
        label={label}
        value={formState[field]}
        onChange={(newValue) => handleTimeChange(field, newValue)}
        sx={{ flex: 1 }}
        views={['hours', 'minutes']}
        format="HH:mm"
        ampm={false}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
      />
      <Tooltip title="Ustaw aktualny czas">
        <IconButton onClick={() => setTimeToNow(field)} size="small">
          <AccessTimeIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderNumberField = (label: string, field: keyof FormState, min?: number, max?: number) => (
    <TextField
      label={label}
      type="number"
      fullWidth
      value={formState[field] ?? ''}
      onChange={(e) =>
        setFormState((prev) => ({
          ...prev,
          [field]: e.target.value ? Number(e.target.value) : null,
        }))
      }
      inputProps={{ min, max }}
    />
  );

  const isLoading = createJournal.isPending || updateJournal.isPending;

  const getCompletedFieldsCount = (state: FormState): number => {
    const requiredFields: (keyof FormState)[] = [
      'timeGoToBed',
      'timeDecidedToSleep',
      'minutesNeededToSleep',
      'timesWokenUp',
      'totalWokeupDuration',
      'timeWakeupMorning',
      'timeOutOfBedMorning',
      'minutesFeelingSleepy',
      'sleepingQuality',
      'mood',
    ];

    return requiredFields.filter((field) => {
      const value = state[field];
      return value !== null && value !== undefined && value !== '';
    }).length;
  };

  const totalRequiredFields = 10; // All fields except comment
  const completedFields = getCompletedFieldsCount(formState);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {initialData && (
        <SleepMetricsSummary
          minutesInBed={initialData.minutesInBed ?? null}
          minutesSleeping={initialData.minutesSleeping ?? null}
          sleepingEfficiency={initialData.sleepingEfficiency ?? null}
        />
      )}

      <FormProgress completedFields={completedFields} totalFields={totalRequiredFields} />

      <Grid container spacing={3}>
        {/* Bedtime Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Pora snu
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderTimeField('O której poszedłeś do łóżka', 'timeGoToBed', null)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTimeField('O której postanowiłeś zasnąć', 'timeDecidedToSleep', null)}
            </Grid>
          </Grid>
        </Grid>

        {/* Morning Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Poranek
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderTimeField('O której się obudziłeś', 'timeWakeupMorning', null)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTimeField('O której wstałeś z łóżka', 'timeOutOfBedMorning', null)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderNumberField('Ile minut zajęło zaśnięcie (w minutach)', 'minutesNeededToSleep', 0)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderNumberField('Ile razy się obudziłeś', 'timesWokenUp', 0)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderNumberField('Całkowity czas obudzeń w minutach', 'totalWokeupDuration', 0)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderNumberField('Ile minut byłeś senny w ciągu dnia', 'minutesFeelingSleepy', 0)}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography component="legend">Jakość snu</Typography>
              <Rating
                value={formState.sleepingQuality}
                onChange={(_, newValue) =>
                  setFormState((prev) => ({
                    ...prev,
                    sleepingQuality: newValue,
                  }))
                }
                max={5}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography component="legend">Nastrój</Typography>
              <Rating
                value={formState.mood}
                onChange={(_, newValue) =>
                  setFormState((prev) => ({
                    ...prev,
                    mood: newValue,
                  }))
                }
                max={5}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Komentarze"
                multiline
                rows={4}
                value={formState.comment ?? ''}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    comment: e.target.value || null,
                  }))
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Zapisywanie...' : initialData ? 'Aktualizuj' : 'Utwórz'} wpis dziennika
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
