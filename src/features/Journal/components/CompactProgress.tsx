import React from 'react';
import { 
  Box, 
  LinearProgress, 
  Typography,
  Tooltip,
  Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CompactProgressProps {
  completedFields: number;
  totalFields: number;
  showLabel?: boolean;
}

export const CompactProgress = ({ completedFields, totalFields, showLabel = false }: CompactProgressProps) => {
  const progress = (completedFields / totalFields) * 100;
  const isComplete = completedFields === totalFields;

  return (
    <Tooltip title={`${completedFields}/${totalFields} fields completed`}>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Box sx={{ flex: 1, minWidth: 60 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 4,
              borderRadius: 2,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                backgroundColor: isComplete ? 'success.main' : 'primary.main',
              }
            }}
          />
        </Box>
        {showLabel && (
          <Typography variant="caption" color="text.secondary">
            {completedFields}/{totalFields}
          </Typography>
        )}
        {isComplete && (
          <CheckCircleIcon 
            color="success" 
            sx={{ fontSize: 16 }}
          />
        )}
      </Stack>
    </Tooltip>
  );
}; 