import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const KPIWidget = ({ title, value }: { title: string; value: number | string }) => (
  <Card sx={{ boxShadow: 3 }}>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="h4" color="primary">{value}</Typography>
    </CardContent>
  </Card>
);

export default KPIWidget;