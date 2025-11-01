import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Dummy DB - one customer and one agent
const USERS = [
  {
    name: 'MS Dhoni',
    email: 'customer@gmail.com',
    password: 'cust123',
    role: 'customer',
  },
  {
    name: 'Sachin Tendulkar',
    email: 'agent@gmail.com',
    password: 'agent123',
    role: 'agent',
  },
];

const Login = () => {
  const { login } = useAuth();
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const found = USERS.find((u) => u.email === email && u.password === password);
    if (!found) {
      setError('Invalid email or password');
      return;
    }

    // Ensure selected role matches user's role
    if (found.role !== role) {
      setError(`Selected role "${role}" does not match user role.`);
      return;
    }

    // call auth login with role and user info
    login({ role: found.role, user: { name: found.name, email: found.email } });

    if (found.role === 'customer') navigate('/my-policies');
    else navigate('/agent-dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f3f6fb, #e9f0fb)',
      }}
    >
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, width: 380, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(_, val) => val && setRole(val)}
              sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}
            >
              <ToggleButton value="customer">Customer</ToggleButton>
              <ToggleButton value="agent">Agent</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button variant="contained" fullWidth type="submit">
              Login
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            (Use customer@example.com / cust123 or agent@example.com / agent123)
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
