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
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
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
    benefits: ["Sube hasta 2 estados financieros",
      "Acceso a reportes inmediatos cada trimestre",
      "Exportación limitada de reportes"],
    price: 155
  },
  {
    type: "plan mediana empresa",
    description: "Perfecto para empresas en crecimiento con necesidades financieras más complejas",
    benefits: ["Permite subir hasta 5 estados financieros", "Reportes inmediatos para hasta 5 archivos", "Exportación de hasta 5 reportes"],
    price: 330
  },
  {
    type: "plan grande empresa",
    description: "Diseñado para grandes corporaciones que requieren una gestión financiera integral",
    benefits: ["Subida ilimitada de estados financieros", "Reportes inmediatos por cada archivo subido", "Exportación ilimitada de reportes"],
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
  const [showAchievement, setShowAchievement] = useState(false);
  const getAvailablePlans = () => {
    const currentPlanIndex = membershipPlans.findIndex(plan => plan.type === formData.membershipType);
    return membershipPlans.slice(currentPlanIndex + 1);
  };
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
          cvv: currentUser.creditCard?.cvv || "",
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
      // Elimina los campos de nueva contraseña si no se ha proporcionado
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
        navigate("/");  // Redirigir a la página principal después de eliminar
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
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 5000);
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
            Subir de membresía
          </Button>
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
          {editMode && (
            <>
              <TextField
                label="Nueva Contraseña"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        {editMode ? (
          <>
            <Button onClick={() => setEditMode(false)} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Guardar
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" onClick={() => setEditMode(true)} sx={{ mr: 2 }}>
              Editar Perfil
            </Button>
            <Button variant="outlined" color="error" onClick={handleOpenDialog}>
              Eliminar Cuenta
            </Button>
          </>
        )}
      </Box>

      {/* Cuadro de diálogo para confirmar eliminación */}
      <Dialog open={openMembershipDialog} onClose={handleCloseMembershipDialog} maxWidth="md" fullWidth>
        <DialogTitle>Actualizar Membresía</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {membershipPlans.filter(plan => plan.type !== formData.membershipType).map((plan) => (
              <Grid item xs={12} sm={6} key={plan.type}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: selectedMembership === plan.type ? '2px solid blue' : 'none'
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {plan.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.description}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                      S/.{plan.price}/quarter
                    </Typography>
                    <ul>
                      {plan.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleSelectMembership(plan.type)}
                      variant={selectedMembership === plan.type ? "contained" : "outlined"}
                    >
                      Seleccionar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMembershipDialog}>Cancelar</Button>
          <Button onClick={handleUpgradeMembership} disabled={!selectedMembership} variant="contained">
            Actualizar Membresía
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logro de actualización */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showAchievement}
        autoHideDuration={5000}
        onClose={() => setShowAchievement(false)}
      >
        <Alert
          icon={<EmojiEventsIcon fontSize="inherit" />}
          severity="success"
          sx={{ width: '100%' }}
        >
          ¡Felicidades! Has mejorado tu membresía
        </Alert>
      </Snackbar>
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"¿Eliminar permanentemente?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de eliminar tu cuenta. Esta acción es irreversible. ¿Estás seguro de que deseas continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No, regresar
          </Button>
          <Button onClick={handleDeleteUser} color="error">
            Sí, eliminar
          </Button>
        </DialogActions>
      </Dialog>

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
