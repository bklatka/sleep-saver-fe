import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  Button,
  Tooltip
} from '@mui/material';
import { format } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { JournalEntry } from '../types';
import { calculateCompletedFields, TOTAL_REQUIRED_FIELDS } from '../utils/progressUtils';

interface TodayWidgetProps {
  todayEntry: JournalEntry | null;
}

export const TodayWidget = ({ todayEntry }: TodayWidgetProps) => {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const completedFields = todayEntry ? calculateCompletedFields(todayEntry) : 0;
  const progress = (completedFields / TOTAL_REQUIRED_FIELDS) * 100;
  const isComplete = completedFields === TOTAL_REQUIRED_FIELDS;

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        minWidth: 250,
        height: '100%',
        minHeight: 300,
      }}
    >
      <Typography variant="h6" color="primary">
        Today's Journal
      </Typography>

      <Box 
        sx={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={80}
          thickness={4}
          sx={{
            color: isComplete ? 'success.main' : 'primary.main',
            backgroundColor: 'action.hover',
            borderRadius: '50%',
          }}
        />
        {isComplete ? (
          <CheckCircleIcon
            color="success"
            sx={{
              position: 'absolute',
              fontSize: 40,
            }}
          />
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              position: 'absolute',
            }}
          >
            {Math.round(progress)}%
          </Typography>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" align="center">
        {isComplete 
          ? "All fields completed!" 
          : todayEntry 
            ? `${completedFields} of ${TOTAL_REQUIRED_FIELDS} fields completed`
            : "No entry yet"
        }
      </Typography>

      {!isComplete && (
        <Button
          variant="outlined"
          size="small"
          startIcon={todayEntry ? <EditIcon /> : <AddIcon />}
          onClick={() => navigate(`/journal/${today}`)}
        >
          {todayEntry ? 'Continue Entry' : 'Start Entry'}
        </Button>
      )}
    </Paper>
  );
}; 