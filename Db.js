import app from "./Auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
const db = getFirestore(app);
export async function RegisterAccount(username, email,uid){
  try{
    await addDoc(collection(db,"Usuarios"),
    {
      username: username,
      email: email,
      UID: uid
    })
  }
  catch(error){
    console.error("error",error);
    throw error;
    
  }
}
export async function CheckEmail(email){
  try{
    const q = query(collection(db,"Usuarios"), where("email", "==", email));
    const queryState = await getDocs(q);
    return queryState
  }
  catch(error){
    console.error("error",error);
    throw error;
  }
}
