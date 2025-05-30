import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

export default function FormGeneral() {
  const [gender, setGender] = useState<string>('');
  const [socialNetwork, setSocialNetwork] = useState<string>('');
  const [gold, setGold] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // NUEVO: control del Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleGenderChange = (event: SelectChangeEvent) => setGender(event.target.value);
  const handleSocialNetworkChange = (event: SelectChangeEvent) => setSocialNetwork(event.target.value);
  const handleGoldChange = (event: SelectChangeEvent) => setGold(event.target.value);
  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => setMessage(event.target.value);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/createMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          message,
          socialNetworkId: socialNetwork,
          gold,
        }),
      });

      if (!res.ok) throw new Error('Error al enviar');

      // Mostrar mensaje de éxito
      setSnackbarMessage('Formulario enviado 🚀');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Limpiar formulario
      setGender('');
      setMessage('');
      setSocialNetwork('');
      setGold('');
    } catch (err) {
      console.error(err);
      setSnackbarMessage('Hubo un error al enviar el formulario');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      maxWidth={480}
      mx="auto"
      p={5}
      bgcolor="white"
      borderRadius={4}
      boxShadow={10}
      mt={4}
    >
      <Typography
        variant="h4"
        align="center"
        mb={1}
        fontWeight="bold"
        color="primary"
      >
        Formulario de Investigación
      </Typography>
      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        mb={4}
      >
        Comparte tu mensaje.
      </Typography>

      {/* Selects */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="gender-label">Género</InputLabel>
        <Select
          labelId="gender-label"
          value={gender}
          label="Género"
          onChange={handleGenderChange}
        >
          <MenuItem value="hombre">Hombre</MenuItem>
          <MenuItem value="mujer">Mujer</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="social-network-label">Red Social</InputLabel>
        <Select
          labelId="social-network-label"
          value={socialNetwork}
          label="Red Social"
          onChange={handleSocialNetworkChange}
        >
          <MenuItem value="1">X (Twitter)</MenuItem>
          <MenuItem value="2">Reddit</MenuItem>
          <MenuItem value="3">Facebook</MenuItem>
          <MenuItem value="4">Otro</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="gold-label">Gold</InputLabel>
        <Select
          labelId="gold-label"
          value={gold}
          label="Gold"
          onChange={handleGoldChange}
        >
          <MenuItem value="SI">SI</MenuItem>
          <MenuItem value="NO">NO</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Mensaje"
        placeholder="Escribe tu mensaje aquí..."
        multiline
        rows={4}
        fullWidth
        margin="normal"
        value={message}
        onChange={handleMessageChange}
      />

      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{
          mt: 3,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
        onClick={handleSubmit}
      >
        Enviar
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
