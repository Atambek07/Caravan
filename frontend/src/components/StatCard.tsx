import { Card, CardContent, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

export const StatCard = ({ title, value, icon, color = '#2563EB' }: Props) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
        </Box>
        {icon && (
          <Box
            sx={{
              bgcolor: `${color}20`,
              color,
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);
