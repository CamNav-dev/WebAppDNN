import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  TextField,
  Button,
  Avatar,
  MenuItem,
  Grid,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";

const countries = [
  "Perú",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Thailand",
  "Other",
];

function Profile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // Estado local para manejar los datos del formulario
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    country: "",
    creditCard: {
      number: "",
      expiry: "",
      cvv: "",
    },
  });

  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Sincronizar los datos del usuario en el formulario cada vez que `currentUser` cambie
  useEffect(() => {
    console.log("useEffect - currentUser:", currentUser);
    if (currentUser) {
      console.log("Usuario actualizado en useEffect:", currentUser); // Verifica el estado
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        country: countries.includes(currentUser.country)
          ? currentUser.country
          : "Other",
        creditCard: {
          number: currentUser.creditCard?.number || "",
          expiry: currentUser.creditCard?.expiry || "",
          cvv: currentUser.creditCard?.cvv || "",
        },
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      creditCard: {
        ...prevState.creditCard,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!currentUser || !currentUser._id) {
      setSnackbar({
        open: true,
        message: "Error: Usuario no encontrado",
        severity: "error",
      });
      return;
    }

    try {
      dispatch(updateUserStart());
      const response = await axios.put(
        `/api/auth/update/${currentUser._id}`,
        formData
      );
      console.log("Datos actualizados del servidor:", response.data); // Esto debería mostrar los datos actualizados
      dispatch(updateUserSuccess(response.data.user)); // Asegúrate de que `response.data.user` contenga los datos del usuario

      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Usuario actualizado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      dispatch(
        updateUserFailure(
          error.response?.data?.message || "Failed to update user"
        )
      );
      setSnackbar({
        open: true,
        message: "Error al actualizar el usuario",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        country: countries.includes(currentUser.country)
          ? currentUser.country
          : "Other",
        creditCard: {
          number: currentUser.creditCard?.number || "",
          expiry: currentUser.creditCard?.expiry || "",
          cvv: currentUser.creditCard?.cvv || "",
        },
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (!currentUser) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Perfil de Usuario
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
            <TextField
              label="Nombre de usuario"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            />
          </Box>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="País"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={!editMode}
          >
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Información de Tarjeta de Crédito
          </Typography>
          <TextField
            label="Número de Tarjeta"
            name="number"
            value={formData.creditCard.number}
            onChange={handleCreditCardChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={!editMode}
          />
          <TextField
            label="Fecha de Expiración"
            name="expiry"
            value={formData.creditCard.expiry}
            onChange={handleCreditCardChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={!editMode}
          />
          <TextField
            label="CVV"
            name="cvv"
            value={formData.creditCard.cvv}
            onChange={handleCreditCardChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={!editMode}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        {editMode ? (
          <>
            <Button onClick={handleCancel} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Guardar
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={() => setEditMode(true)}>
            Editar Perfil
          </Button>
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default Profile;
