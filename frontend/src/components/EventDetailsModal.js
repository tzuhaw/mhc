import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
// Using built-in date formatting instead of date-fns
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const EventDetailsModal = ({ open, onClose, event, onEventUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [remarks, setRemarks] = useState('');

  if (!event) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const handleApprove = async () => {
    if (!selectedDate) {
      setError('Please select a confirmed date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.put(`/api/events/${event._id}/approve`, {
        confirmedDate: selectedDate,
      });
      
      onEventUpdate(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve event');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.put(`/api/events/${event._id}/reject`, {
        remarks: remarks.trim(),
      });
      
      onEventUpdate(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject event');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDate('');
    setRemarks('');
    setError('');
    onClose();
  };

  const isVendor = user?.role === 'Vendor';
  const canTakeAction = isVendor && event.status === 'Pending';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{event.eventName}</Typography>
          <Chip
            label={event.status}
            color={getStatusColor(event.status)}
            variant="outlined"
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Company:</strong> {event.companyName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Event Type:</strong> {event.eventType}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Location:</strong> {event.location}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Vendor:</strong> {event.assignedVendor?.vendorName || 'Not assigned'}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Date Created:</strong> {formatDate(event.createdAt)}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Proposed Dates:</strong>
          </Typography>
          {event.proposedDates.map((date, index) => (
            <Chip
              key={index}
              label={formatDate(date)}
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        {event.confirmedDate && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Confirmed Date:</strong> {formatDate(event.confirmedDate)}
            </Typography>
          </Box>
        )}

        {event.remarks && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Remarks:</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {event.remarks}
            </Typography>
          </Box>
        )}

        {canTakeAction && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vendor Actions
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Confirmed Date</InputLabel>
              <Select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                label="Select Confirmed Date"
              >
                {event.proposedDates.map((date, index) => (
                  <MenuItem key={index} value={date}>
                    {formatDate(date)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason (if rejecting)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Close
        </Button>
        
        {canTakeAction && (
          <>
            <Button
              onClick={handleReject}
              color="error"
              variant="outlined"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Reject'}
            </Button>
            <Button
              onClick={handleApprove}
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Approve'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal;