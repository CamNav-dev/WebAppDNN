import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
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
  CircularProgress
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
    benefits: ["Sube hasta 2 estados financieros", "Acceso a reportes inmediatos cada trimestre", "Exportación limitada de reportes"],
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
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`/api/auth/profile/${currentUser?._id}`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
        },
      });
      if (res.data.success) {
        const user = res.data.user;
        setFormData({
          username: user.username || "",
          email: user.email || "",
          country: user.country || countries[0],
          membershipType: user.membershipType || "",
          creditCard: {
            number: user.creditCard?.number || "",
            expiry: user.creditCard?.expiry || "",
            cvv: "", 
          },
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        console.error("Error al cargar el perfil");
      }
    } catch (error) {
      console.error("Error en la solicitud de perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchUserProfile();
    }
  }, [currentUser]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    // Validación y formateo para el número de tarjeta
    if (name === "number") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19); // Máximo de 16 dígitos con espacios
    }

    // Validación y formateo para la fecha de expiración (MM/YY)
    if (name === "expiry") {
      formattedValue = value.replace(/\D/g, "").replace(/^(\d{2})(\d{0,2})/, "$1/$2");
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    // Validación para el CVV (máximo 3 dígitos)
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData((prevState) => ({
      ...prevState,
      creditCard: {
        ...prevState.creditCard,
        [name]: formattedValue,
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

    // Validaciones de tarjeta de crédito
    if (formData.creditCard.number.replace(/\s/g, "").length !== 16) {
      setSnackbar({
        open: true,
        message: "El número de tarjeta debe tener 16 dígitos",
        severity: "error",
      });
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.creditCard.expiry)) {
      setSnackbar({
        open: true,
        message: "La fecha de expiración debe estar en formato MM/YY",
        severity: "error",
      });
      return;
    }

    const [month, year] = formData.creditCard.expiry.split("/").map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = Number(currentDate.getFullYear().toString().slice(-2));

    if (month < 1 || month > 12 || (year < currentYear || (year === currentYear && month < currentMonth))) {
      setSnackbar({
        open: true,
        message: "La fecha de expiración debe ser válida y posterior al mes y año actual",
        severity: "error",
      });
      return;
    }

    try {
      dispatch(updateUserStart());
      const updateData = { ...formData };

      if (updateData.creditCard.number || updateData.creditCard.expiry) {
        updateData.creditCard.number = CryptoJS.AES.encrypt(updateData.creditCard.number, "secret_key").toString();
        updateData.creditCard.expiry = CryptoJS.AES.encrypt(updateData.creditCard.expiry, "secret_key").toString();
        delete updateData.creditCard.cvv;
      }
      

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
        navigate("/");  
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
    if (reason === "clickaway") return;
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

  const handleEditProfile = () => {
    if (currentUser && currentUser.creditCard?.number && currentUser.creditCard?.expiry) {
      try {
        const decryptedNumber = CryptoJS.AES.decrypt(currentUser.creditCard.number, "secret_key").toString(CryptoJS.enc.Utf8);
        const decryptedExpiry = CryptoJS.AES.decrypt(currentUser.creditCard.expiry, "secret_key").toString(CryptoJS.enc.Utf8);
        
        if (decryptedNumber && decryptedExpiry) {
          setFormData((prevState) => ({
            ...prevState,
            creditCard: {
              ...prevState.creditCard,
              number: decryptedNumber,
              expiry: decryptedExpiry,
            },
          }));
        } else {
          console.error("Desencriptación fallida, los datos no son válidos.");
        }
      } catch (error) {
        console.error("Error al desencriptar los datos de la tarjeta de crédito", error);
      }
    }
    setEditMode(true);
  };
  

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Perfil de Usuario
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
            label="Membresía Actual"
            name="membershipType"
            value={formData.membershipType}
            fullWidth
            disabled 
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid item xs={12}>
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
            type="text"
          />
          <TextField
            label="Fecha de Expiración (MM/YY)"
            name="expiry"
            value={formData.creditCard.expiry}
            onChange={handleCreditCardChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={!editMode}
            type="text"
          />
          <TextField
            label="CVV"
            name="cvv"
            type="text"
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

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Opciones de Upgrade de Membresía
        </Typography>
        <Button
          variant="outlined"
          onClick={handleOpenMembershipDialog}
          disabled={editMode}
        >
          Actualizar Membresía
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        {editMode ? (
          <>
            <Button onClick={() => setEditMode(false)} sx={{ mr: 2 }}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
          </>
        ) : (
          <>
            <Button variant="contained" onClick={handleEditProfile} sx={{ mr: 2 }}>Editar Perfil</Button>
            <Button variant="outlined" color="error" onClick={handleOpenDialog}>Eliminar Cuenta</Button>
          </>
        )}
      </Box>

      {/* Dialog para seleccionar plan de membresía */}
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
                    <Typography variant="h5" component="div">{plan.type}</Typography>
                    <Typography variant="body2" color="text.secondary">{plan.description}</Typography>
                    <Typography variant="h6" component="div" sx={{ mt: 2 }}>S/.{plan.price}/quarter</Typography>
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
          <Button onClick={handleUpgradeMembership} disabled={!selectedMembership} variant="contained">Actualizar Membresía</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"¿Eliminar permanentemente?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de eliminar tu cuenta. Esta acción es irreversible. ¿Estás seguro de que deseas continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">No, regresar</Button>
          <Button onClick={handleDeleteUser} color="error">Sí, eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Paper>
);

}

export default Profile;

