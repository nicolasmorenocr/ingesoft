// Auth.js (módulo, usa Firebase v9 modular por CDN)
// Exporta login() y logout()

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  connectAuthEmulator
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// --- Configuración de tu proyecto Firebase (usa la tuya)
const firebaseConfig = {
  apiKey: "AIzaSyAVTmgZ0Dseoo09_VlAJg3PUXSfmT1uug8",
  authDomain: "soryu-dde62.firebaseapp.com",
  projectId: "soryu-dde62",
  storageBucket: "soryu-dde62.firebasestorage.app",
  messagingSenderId: "429755791917",
  appId: "1:429755791917:web:0e0cce1d2a2015baed16a4"
};

// Inicializar Firebase y Auth (UNA ÚNICA VEZ)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Si usas el Auth Emulator (opcional), descomenta la línea siguiente
// connectAuthEmulator(auth, "http://localhost:9099");

// Proveedor de Google
const provider = new GoogleAuthProvider();
auth.languageCode = "es";

// Función de login (exportada)
export async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    // result.user contiene la info del usuario
    console.log("Login correcto:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error en login:", error);
    throw error; // re-lanzar para manejo en el llamador si hace falta
  }
}

// Función de logout (exportada)
export async function logout() {
  try {
    await signOut(auth);
    console.log("Usuario desconectado");
  } catch (error) {
    console.error("Error en logout:", error);
    throw error;
  }
}
