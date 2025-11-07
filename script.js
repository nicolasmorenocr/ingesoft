// script.js (módulo de UI, importa login/logout desde Auth.js)
import { login, logout, auth } from "./Auth.js";

const buttonLogin = document.querySelector("#button-login");
const buttonLogout = document.querySelector("#button-logout");
const inputDemo = document.querySelector("#input-demo");
const formulario = document.querySelector(".formulario");

// Evitamos que el click haga submit o recargue
buttonLogin.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const user = await login();
    // Puedes mostrar datos del usuario en pantalla
    if (user) {
      console.log("Usuario logueado:", user.displayName, user.email);
      // ejemplo: rellenar el input con el email
      inputDemo.value = user.email ?? "";
      init();
    }

  } catch (err) {
    // Manejo de errores de login
    console.error("Fallo login:", err);
    alert("Error en el login. Revisa la consola.");
  }
});

buttonLogout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await logout();
    inputDemo.value = "";
    console.log("Sesión cerrada");
  } catch (err) {
    console.error("Fallo logout:", err);
    alert("Error al cerrar sesión. Revisa la consola.");
  }
});

// Opcional: escucha cambios de estado de auth
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("onAuthStateChanged: user signed in:", user.email);
  } else {
    console.log("onAuthStateChanged: no user");
  }
});
// funcion para ocultar todo lo necesario cuando el login se completa
function init(){
    if(auth.currentUser){
        formulario.classList.add("hidden");
    }
}
