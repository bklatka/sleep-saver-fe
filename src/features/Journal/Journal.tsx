import React from 'react';
import { useNavigate } from 'react-router-dom';
import pl from 'date-fns/locale/pl';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Paper,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { settingsStore } from '../../stores/SettingsStore';
import { CompactProgress } from './components/CompactProgress';
import { NewEntryDialog } from './components/NewEntryDialog';
import { useDownloadWeeklyReport } from './hooks/useDownloadWeeklyReport';
import { useJournalQuery } from './hooks/useJournalQuery';
import { formatWeekRange, getWeekDays, groupEntriesByWeek } from './utils/dateUtils';
import { TOTAL_REQUIRED_FIELDS, calculateCompletedFields } from './utils/progressUtils';

const DayCard = ({ date, entry, onEdit, onAdd, formatTime }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{format(date, 'EEE, d MMM', { locale: pl })}</Typography>
        {entry ? (
          <Button startIcon={<EditIcon />} onClick={onEdit} size="small">
            Edytuj
          </Button>
        ) : (
          <Button startIcon={<AddIcon />} onClick={onAdd} size="small" color="primary">
            Dodaj
          </Button>
        )}
      </Box>

      {entry && (
        <>
          <Stack spacing={1}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Pora snu
              </Typography>
              <Typography>
                {formatTime(entry.timeGoToBed)} → {formatTime(entry.timeDecidedToSleep)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Pora pobudki
              </Typography>
              <Typography>
                {formatTime(entry.timeWakeupMorning)} → {formatTime(entry.timeOutOfBedMorning)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Postęp
              </Typography>
              <CompactProgress
                completedFields={calculateCompletedFields(entry)}
                totalFields={TOTAL_REQUIRED_FIELDS}
              />
            </Box>
          </Stack>
        </>
      )}
    </CardContent>
  </Card>
);

export const JournalList = observer(() => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: journals, isLoading } = useJournalQuery();
  const downloadReport = useDownloadWeeklyReport();

  const weekGroups = React.useMemo(
    () => groupEntriesByWeek(journals || [], settingsStore.weekStartsOn),
    [journals, settingsStore.weekStartsOn]
  );

  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = React.useState(false);

  const handleNewEntry = (date: string) => {
    navigate(`/journal/${date}`);
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'HH:mm', { locale: pl });
  };

  const handleDownload = async (weekStart: Date) => {
    try {
      await downloadReport.mutateAsync(weekStart);
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dziennik snu</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsNewEntryDialogOpen(true)}
        >
          Nowy wpis
        </Button>
      </Box>

      <NewEntryDialog
        open={isNewEntryDialogOpen}
        onClose={() => setIsNewEntryDialogOpen(false)}
        onConfirm={handleNewEntry}
      />

      {weekGroups.map((group) => (
        <Box key={group.weekStart.toISOString()} sx={{ mb: 4 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" color="primary">
              {formatWeekRange(group.weekStart, settingsStore.weekStartsOn)}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleDownload(group.weekStart)}
              disabled={downloadReport.isPending}
            >
              {downloadReport.isPending ? 'Pobieranie...' : 'Pobierz PDF'}
            </Button>
          </Box>

          {isMobile ? (
            <Stack spacing={2}>
              {getWeekDays(group.weekStart, settingsStore.weekStartsOn, group.entries).map(
                ({ date, entry }) => (
                  <DayCard
                    key={date.toISOString()}
                    date={date}
                    entry={entry}
                    onEdit={() => navigate(`/journal/${format(date, 'yyyy-MM-dd')}`)}
                    onAdd={() => navigate(`/journal/${format(date, 'yyyy-MM-dd')}`)}
                    formatTime={formatTime}
                  />
                )
              )}
            </Stack>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell align="center">Pora snu</TableCell>
                    <TableCell align="center">Pora pobudki</TableCell>
                    <TableCell align="center">Postęp</TableCell>
                    <TableCell align="center">Akcje</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getWeekDays(group.weekStart, settingsStore.weekStartsOn, group.entries).map(
                    ({ date, entry }) => (
                      <TableRow
                        key={date.toISOString()}
                        sx={{
                          backgroundColor: entry ? undefined : 'action.hover',
                        }}
                      >
                        <TableCell>{format(date, 'EEE, d MMM', { locale: pl })}</TableCell>
                        {entry ? (
                          <>
                            <TableCell align="center">
                              <Tooltip title="Czas pójścia do łóżka → Czas decyzji o śnie" arrow>
                                <span>
                                  {formatTime(entry.timeGoToBed)} →{' '}
                                  {formatTime(entry.timeDecidedToSleep)}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Czas obudzenia → Czas wstania z łóżka" arrow>
                                <span>
                                  {formatTime(entry.timeWakeupMorning)} →{' '}
                                  {formatTime(entry.timeOutOfBedMorning)}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center" sx={{ minWidth: 100 }}>
                              <CompactProgress
                                completedFields={calculateCompletedFields(entry)}
                                totalFields={TOTAL_REQUIRED_FIELDS}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                startIcon={<EditIcon />}
                                onClick={() => navigate(`/journal/${format(date, 'yyyy-MM-dd')}`)}
                                size="small"
                              >
                                Edytuj
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>-</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">
                              <Button
                                startIcon={<AddIcon />}
                                onClick={() => navigate(`/journal/${format(date, 'yyyy-MM-dd')}`)}
                                size="small"
                                color="primary"
                              >
                                Dodaj
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ))}

      {!journals?.length && (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Brak wpisów w dzienniku. Utwórz swój pierwszy wpis!
          </Typography>
        </Paper>
      )}
    </Box>
  );
});

export const Journal = () => {
  return <JournalList />;
};
