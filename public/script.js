// script.js (módulo de UI, importa login/logout desde Auth.js)
import { loginGoogle, logout, auth, CreateEmailAndPassword, LoginEmailAndPassword } from "../src/services/AuthService.js";
import { RegisterAccount, CheckEmail } from "../src/services/Db.js";

const buttonLogin = document.querySelector("#button-login");
const buttonLogout = document.querySelector("#button-logout2");
const inputDemo = document.querySelector("#input-demo");
const formulario = document.querySelector(".formulario");
const fuffy = document.querySelector("#fuffy");
const buttonGoogle = document.querySelector("#button-google");
const buttonRegister = document.querySelector("#button-register");
const RegisterPopup = document.querySelector("#RegistroPopup");
const buttonSendRegister = document.querySelector("#Send-Register");
const buttonCancRegister = document.querySelector("#Cancel-Register");

// Evitamos que el click haga submit o recargue
buttonGoogle.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const user = await loginGoogle();
    let email = String(user.email);
    console.log(email);
    let username = String(user.displayName);
    console.log(email);
    let UID = String(user.uid);
    console.log(email);
    // Puedes mostrar datos del usuario en pantalla
    if (user) {
      console.log("Usuario logueado:", user.displayName, user.email);
      // ejemplo: rellenar el input con el email
      inputDemo.value = user.email ?? "";
      let result = await CheckEmail(user.email);
      if (result.empty){
        await RegisterAccount(username, email,UID);
      }

      init();
    }
    console.log("catch");

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
    reset();
  } catch (err) {
    console.error("Fallo logout:", err);
    alert("Error al cerrar sesión. Revisa la consola.");
  }
});


// funciones para ocultar todo lo necesario cuando el login se completa, y para volver a mostrarlo al cerrar sesion 
function init(){
    if(auth.currentUser){
        formulario.classList.add("hidden");
        fuffy.classList.remove("hidden");
    }
}
function reset(){
    formulario.classList.remove("hidden");
    fuffy.classList.add("hidden");
}
// funcion para hacer aparecer el popup de registro
buttonRegister.addEventListener("click", (e) => {
  e.preventDefault();
  RegisterPopup.classList.add("RegistroPopup");
  RegisterPopup.showModal();
  

})
buttonCancRegister.addEventListener("click", (e) => {
  e.preventDefault();
  RegisterPopup.classList.remove("RegistroPopup");
  RegisterPopup.close();
})
// funcion para enviar el los datos de registro a la base de datos
buttonSendRegister.addEventListener("click", async (e) => {
  e.preventDefault();
  try{
      let username = document.getElementById("Input-Username").value;
      let email = document.getElementById("Input-Email").value;
      let password = document.getElementById("Input-Password").value;
  if(username == "" || email == "" || password == "" ){
    alert("Todos los campos deben ser rellenados")
    return
  }
  if(email.includes("@") == false){
    alert("El correo debe contener un @")
    return}
  let result = await CreateEmailAndPassword(email, password);
  let user = result.user;
  let uid = user.uid;
  await RegisterAccount(username, email, uid);
  RegisterPopup.close();
  console.log("Cuenta creada");
  }
  catch(error){
    console.error("error", error);
    throw error;
  }
})
// Funcion para iniciar sesión con correo y contraseña propios
buttonLogin.addEventListener("click", async (e) => 
{
  e.preventDefault();
  try {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if(email == "" || password == "" ){
      alert("Todos los campos deben ser rellenados")
      return
    }
    let ThereIsEmail = await CheckEmail(email);
    if(ThereIsEmail.empty){
      alert("El correo no se encuentra registrado")
      return
    }
    let result = await LoginEmailAndPassword(email, password);
    let user = result.user;
    console.log("Login correcto:", user);
    init()
    }
  catch(error){
    console.error("error",error);
    throw error;
  }
}
)

