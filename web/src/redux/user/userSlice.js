import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;  // Store the full payload
      state.loading = false;
      state.error = false;
      localStorage.setItem('token', action.payload.token); // Ensure the token is saved
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
      // Eliminar el token de localStorage al cerrar sesión
      localStorage.removeItem('token');
    },
    
    // Update User actions
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload; // Verifica que `action.payload` contenga los datos actualizados
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateToken: (state, action) => {
      if (state.currentUser) {
        state.currentUser.token = action.payload;
      }
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,  // Action to handle failed update
  updateUserStart,    // Action to handle the beginning of an update
  updateUserSuccess,  // Action to handle successful update
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  updateToken,
} = userSlice.actions;

export default userSlice.reducer;
