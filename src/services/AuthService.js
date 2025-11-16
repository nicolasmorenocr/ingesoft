import auth from "../config/Auth.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";



const provider = new GoogleAuthProvider();
auth.languageCode = "es";

// Función de login (exportada)
export async function loginGoogle() {
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
// Función auxiliar para el registro 
export async function CreateEmailAndPassword(email,password){
  try{
    let result = await createUserWithEmailAndPassword(auth, email,password);
    return result

  }
  catch(error){
    console.error("error", error);
  }
}
export async function LoginEmailAndPassword(email,password){
  try{
    let result = await signInWithEmailAndPassword(auth, email,password);
    return result
  }
  catch(error){
    console.error("error", error);
  }
}
