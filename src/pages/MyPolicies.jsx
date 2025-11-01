import React, { useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import axios from 'axios';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

// Simple helper to format currency
const fmtCurrency = (value) =>
  typeof value === 'number'
    ? value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
    : value;

const MyPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        // Replace with real API if different
        const res = await axios.get('https://apimetlife-hagebecuckfwbmcr.canadacentral-01.azurewebsites.net/api/policies/CUST0001');
        if (mounted) setPolicies(res.data || []);
      } catch (err) {
        console.error('Failed to fetch policies', err);
        if (mounted) setError(err?.message || 'Failed to load policies');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPolicies();
    return () => (mounted = false);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        My Policies
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Grid container spacing={3}>
          {policies.length === 0 && (
            <Grid item xs={12}>
              <Typography>No policies found.</Typography>
            </Grid>
          )}

          {policies.map((p) => (
            <Grid item key={p.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {p.policyNumber}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {p.policyHolderName}
                      </Typography>
                    </Box>
                    <Chip label={p.status} color={p.status === 'ACTIVE' ? 'success' : 'default'} />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Type:</strong> {p.policyType}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Premium:</strong> {fmtCurrency(p.premiumAmount)}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Coverage:</strong> {fmtCurrency(p.coverageAmount)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Period:</strong>{' '}
                    {p.startDate ? format(parseISO(p.startDate), 'dd MMM yyyy') : '-'} to{' '}
                    {p.endDate ? format(parseISO(p.endDate), 'dd MMM yyyy') : '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyPolicies;
