import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";

const countries = ["Perú", "USA", "UK", "Canadá", "Australia", "Alemania", "Francia", "Japón", "China", "India", "Brazil", "Tailanda", "Otro"];

const membershipPlans = [
  {
    type: "plan pequeña empresa",
    description: "Ideal para negocios emergentes y autónomos",
    benefits: [
      "Sube hasta 2 estados financieros",
      "Acceso a reportes inmediatos cada trimestre",
      "Exportación limitada de reportes"
    ],
    price: 155
  },
  {
    type: "plan mediana empresa",
    description: "Perfecto para empresas en crecimiento con necesidades financieras más complejas",
    benefits: [
      "Permite subir hasta 5 estados financieros",
      "Reportes inmediatos para hasta 5 archivos",
      "Exportación de hasta 5 reportes"
    ],
    price: 330
  },
  {
    type: "plan grande empresa",
    description: "Diseñado para grandes corporaciones que requieren una gestión financiera integral",
    benefits: [
      "Subida ilimitada de estados financieros",
      "Reportes inmediatos por cada archivo subido",
      "Exportación ilimitada de reportes"
    ],
    price: 555
  }
];

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    country: "",
    membershipType: "",
    creditCard: {
      number: "",
      expiry: "",
      cvv: "",
    },
    newPassword: "",
    confirmPassword: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [openMembershipDialog, setOpenMembershipDialog] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        country: countries.includes(currentUser.country) ? currentUser.country : "Otro",
        membershipType: currentUser.membershipType || "",
        creditCard: {
          number: currentUser.creditCard?.number || "",
          expiry: currentUser.creditCard?.expiry || "",
          cvv: "",
        },
        newPassword: "",
        confirmPassword: "",
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

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: "Las contraseñas no coinciden",
        severity: "error",
      });
      return;
    }

    try {
      dispatch(updateUserStart());
      const updateData = { ...formData };
      if (updateData.newPassword) {
        updateData.password = updateData.newPassword;
        delete updateData.newPassword;
        delete updateData.confirmPassword;
      }
      const response = await axios.put(`/api/auth/update/${currentUser._id}`, updateData);
      dispatch(updateUserSuccess(response.data.user));
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Usuario actualizado correctamente",
        severity: "success",
      });
    } catch (error) {
      dispatch(updateUserFailure(error.response?.data?.message || "Error al actualizar el usuario"));
      setSnackbar({
        open: true,
        message: "Error al actualizar el usuario",
        severity: "error",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      await axios.delete(`/api/auth/delete/${currentUser._id}`);
      dispatch(deleteUserSuccess());
      setSnackbar({
        open: true,
        message: "Usuario eliminado correctamente",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/"); // Redirigir a la página principal después de eliminar
      }, 2000);
    } catch (error) {
      dispatch(deleteUserFailure(error.response?.data?.message || "Error al eliminar el usuario"));
      setSnackbar({
        open: true,
        message: "Error al eliminar el usuario",
        severity: "error",
      });
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenMembershipDialog = () => {
    setOpenMembershipDialog(true);
  };

  const handleCloseMembershipDialog = () => {
    setOpenMembershipDialog(false);
    setSelectedMembership(null);
  };

  const handleSelectMembership = (membershipType) => {
    setSelectedMembership(membershipType);
  };

  const handleUpgradeMembership = async () => {
    if (!selectedMembership) return;

    try {
      dispatch(updateUserStart());
      const response = await axios.put(`/api/auth/update/${currentUser._id}`, {
        membershipType: selectedMembership
      });
      dispatch(updateUserSuccess(response.data.user));
      setFormData(prevState => ({
        ...prevState,
        membershipType: selectedMembership
      }));
      setOpenMembershipDialog(false);
      setSnackbar({
        open: true,
        message: "Membresía actualizada correctamente",
        severity: "success",
      });
    } catch (error) {
      dispatch(updateUserFailure(error.response?.data?.message || "Error al actualizar la membresía"));
      setSnackbar({
        open: true,
        message: "Error al actualizar la membresía",
        severity: "error",
      });
    }
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
          <TextField
            label="Membresía Actual"
            name="membershipType"
            value={formData.membershipType}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpenMembershipDialog}
            sx={{ mb: 2 }}
          >
            Cambiar Membresía
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Información de la Tarjeta de Crédito</Typography>
          <TextField
            label="Número de Tarjeta"
            name="number"
            value={formData.creditCard.number}
            onChange={handleCreditCardChange}
            fullWidth
            disabled={!editMode}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Fecha de Expiración"
            name="expiry"
            value={formData.creditCard.expiry}
            onChange={handleCreditCardChange}
            fullWidth
            disabled={!editMode}
            sx={{ mb: 2 }}
          />
          <TextField
            label="CVV"
            name="cvv"
            value={formData.creditCard.cvv}
            onChange={handleCreditCardChange}
            fullWidth
            disabled={!editMode}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
      <Button variant="contained" onClick={() => setEditMode((prev) => !prev)}>
        {editMode ? "Cancelar" : "Editar"}
      </Button>
      {editMode && (
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
          Guardar Cambios
        </Button>
      )}
      <Button variant="outlined" color="error" onClick={handleOpenDialog} sx={{ ml: 2 }}>
        Eliminar Cuenta
      </Button>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialog for deleting user confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Eliminar Cuenta</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de que desea eliminar su cuenta?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for selecting a membership plan */}
      <Dialog open={openMembershipDialog} onClose={handleCloseMembershipDialog}>
        <DialogTitle>Seleccionar Plan de Membresía</DialogTitle>
        <DialogContent>
          {membershipPlans.map((plan) => (
            <Card key={plan.type} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h5">{plan.type}</Typography>
                <Typography color="text.secondary">{plan.description}</Typography>
                <Typography>Beneficios:</Typography>
                <ul>
                  {plan.benefits.map((benefit, index) => (
                    <li key={index}><Typography>{benefit}</Typography></li>
                  ))}
                </ul>
                <Typography variant="h6">Precio: ${plan.price}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => handleSelectMembership(plan.type)} size="small">
                  Seleccionar
                </Button>
              </CardActions>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMembershipDialog}>Cancelar</Button>
          <Button onClick={handleUpgradeMembership} color="primary" disabled={!selectedMembership}>
            Actualizar Membresía
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Profile;
