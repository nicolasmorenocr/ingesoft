import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword
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
// export const auth = getAuth(app);
// export default app;
// Opcional: escucha cambios de estado de auth
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("onAuthStateChanged: user signed in:", user.email);
  } else {
    console.log("onAuthStateChanged: no user");
  }
});
export {auth, app};