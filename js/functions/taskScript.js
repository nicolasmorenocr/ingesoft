// Cliente Firestore + Functions + Messaging (Firebase v9 modular CDN)
// Requiere que `Auth.js` inicialice la app y exporte `auth`.

import { getApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {getFirestore,collection,doc,setDoc,addDoc,updateDoc,deleteDoc,query,where,orderBy,getDocs,onSnapshot,serverTimestamp,arrayUnion
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-functions.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";
import { auth } from "../../src/config/Auth.js";


const app = getApp();
const db = getFirestore(app);
const functions = getFunctions(app, 'us-central1'); // ajustar región si hace falta
const messaging = getMessaging(app);

// ---------- API cliente mínimas para tareas.html ----------

// 1) Crear una nueva tarea
export async function createTask(task) {
  // task: { title, type, frequency, daysOfWeek, dueDate, timeOfDay, advanceMinutes, active, timezone }
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('No auth');
  const payload = { ...task, userId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  const ref = await addDoc(collection(db, 'tasks'), payload);
  return ref.id;
}

// 2) Escuchar tareas del usuario (realtime)
export function listenUserTasks(onUpdate) {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};
  const q = query(collection(db, 'tasks'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
  const unsub = onSnapshot(q, (snap) => {
    const tasks = [];
    snap.forEach(d => tasks.push({ id: d.id, ...d.data() }));
    onUpdate(tasks);
  });
  return unsub;
}

export async function updateTask(taskId, updates) {
  if (!auth.currentUser) throw new Error('Unauthenticated');
  const taskRef = doc(db, 'tasks', taskId);
  updates.updatedAt = serverTimestamp();
  await updateDoc(taskRef, updates);
}

export async function deleteTask(taskId) {
  if (!auth.currentUser) throw new Error('Unauthenticated');
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
}
// 3) Obtener ocurrencias para un rango (ejemplo: mes)
export async function getOccurrencesForRange(startDateStr, endDateStr) {
  // Asume colección top-level 'occurrences' con campos 'userId' y 'date' (YYYY-MM-DD)
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('No auth');
  const occs = [];
  const q = query(collection(db, 'occurrences'), where('userId', '==', uid), where('date', '>=', startDateStr), where('date', '<=', endDateStr));
  const snap = await getDocs(q);
  snap.forEach(doc => occs.push({ id: doc.id, ...doc.data() }));
  return occs;
}

// 4) Completar una ocurrencia: llamar a Cloud Function server-side (transaction segura)
export async function completeOccurrence(taskId, occurrenceId) {
  if (!auth.currentUser) throw new Error('Unauthenticated');
  const callable = httpsCallable(functions, 'completeOccurrence'); // debe existir en backend
  const res = await callable({ taskId, occurrenceId });
  return res.data;
}

// 5) Registrar token FCM del navegador en users/{uid}.fcmTokens
export async function registerFcmToken(vapidKey) {
  if (!auth.currentUser) throw new Error('No auth');
  try {
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      // Asegura que exista user doc
      await setDoc(userRef, { uid: auth.currentUser.uid, email: auth.currentUser.email }, { merge: true });
      // añade token con arrayUnion
      await updateDoc(userRef, { fcmTokens: arrayUnion(currentToken) });
      return currentToken;
    } else {
      console.log('No token disponible — solicitar permiso al usuario');
      return null;
    }
  } catch (err) {
    console.error('Error al obtener token FCM', err);
    throw err;
  }
}

// 6) Handle inbound FCM messages while app en foreground
export function onForegroundMessage(handler) {
  onMessage(messaging, (payload) => {
    handler(payload);
  });
}

// 7) Utility: create user doc if not exists (puede usarse al login)
export async function ensureUserDoc() {
  if (!auth.currentUser) return;
  const userRef = doc(db, 'users', auth.currentUser.uid);
  await setDoc(userRef, { uid: auth.currentUser.uid, email: auth.currentUser.email, name: auth.currentUser.displayName, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }, { merge: true });
}

/*
Notas importantes:
- Necesitas `firebase-messaging-sw.js` en la raíz pública para notificaciones en background.
- Ajusta `functions` región si usas otra (en getFunctions).
- Asegúrate de que las reglas Firestore permitan que el usuario actual edite su `users/{uid}` doc.
- Si usas subcollections `tasks/{taskId}/occurrences`, ajusta las queries correspondientemente (collectionGroup queries requieren índices compuestos).
*/

// js/functions/taskScript.js
// Cliente Firestore + Functions + Messaging (Firebase v9 modular CDN)
// Requiere que Auth.js haya inicializado la app y exporte `auth`.
// Ajusta imports/version si usas otra versión.puede
