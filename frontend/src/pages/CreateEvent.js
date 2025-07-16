import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    location: '',
    proposedDates: [null, null, null],
  });
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const response = await axios.get('/api/users/event-types');
      setEventTypes(response.data);
    } catch (error) {
      console.error('Error fetching event types:', error);
      setError('Failed to fetch event types');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (index, date) => {
    const newDates = [...formData.proposedDates];
    newDates[index] = date;
    setFormData(prev => ({
      ...prev,
      proposedDates: newDates
    }));
  };

  const validateForm = () => {
    if (!formData.eventName.trim()) {
      setError('Event name is required');
      return false;
    }
    if (!formData.eventType) {
      setError('Event type is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (formData.proposedDates.some(date => !date)) {
      setError('All three proposed dates are required');
      return false;
    }
    
    // Check if all dates are in the future
    const today = dayjs().startOf('day');
    if (formData.proposedDates.some(date => dayjs(date).isBefore(today))) {
      setError('All proposed dates must be in the future');
      return false;
    }
    
    // Check if all dates are unique
    const dateStrings = formData.proposedDates.map(date => dayjs(date).format('YYYY-MM-DD'));
    if (new Set(dateStrings).size !== 3) {
      setError('All proposed dates must be unique');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const eventData = {
        eventName: formData.eventName.trim(),
        eventType: formData.eventType,
        location: formData.location.trim(),
        proposedDates: formData.proposedDates.map(date => dayjs(date).toISOString()),
      };
      
      await axios.post('/api/events', eventData);
      setSuccess('Event created successfully!');
      
      // Reset form
      setFormData({
        eventName: '',
        eventType: '',
        location: '',
        proposedDates: [null, null, null],
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/hr-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/hr-dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Create New Event - {user?.companyName}
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Wellness Event
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Name"
                  value={formData.eventName}
                  onChange={(e) => handleInputChange('eventName', e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={loading}>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={formData.eventType}
                    onChange={(e) => handleInputChange('eventType', e.target.value)}
                    label="Event Type"
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={user?.companyName || ''}
                  disabled
                  helperText="Auto-populated from your account"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  disabled={loading}
                  helperText="Enter postal code or full address"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Proposed Dates (3 required)
                </Typography>
              </Grid>
              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {[0, 1, 2].map((index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <DatePicker
                      label={`Proposed Date ${index + 1}`}
                      value={formData.proposedDates[index]}
                      onChange={(date) => handleDateChange(index, date)}
                      minDate={dayjs().add(1, 'day')}
                      disabled={loading}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </Grid>
                ))}
              </LocalizationProvider>
              
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/hr-dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Create Event'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CreateEvent;