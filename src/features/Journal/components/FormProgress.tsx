import React from 'react';
import { 
  Box, 
  LinearProgress, 
  Typography,
  Tooltip,
  Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface FormProgressProps {
  completedFields: number;
  totalFields: number;
}

export const FormProgress = ({ completedFields, totalFields }: FormProgressProps) => {
  const progress = (completedFields / totalFields) * 100;
  const isComplete = completedFields === totalFields;

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Typography variant="body2" color="text.secondary">
          Progress: {completedFields}/{totalFields} fields completed
        </Typography>
        {isComplete && (
          <Tooltip title="All required fields completed">
            <CheckCircleIcon color="success" />
          </Tooltip>
        )}
      </Stack>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8,
          borderRadius: 4,
          backgroundColor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            backgroundColor: isComplete ? 'success.main' : 'primary.main',
          }
        }}
      />
    </Box>
  );
}; 