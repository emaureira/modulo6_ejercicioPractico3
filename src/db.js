// src/db.js
import { openDB } from 'idb';

const DB_NAME = 'citas_db';
const STORE_NAME = 'citas';

const initDB = async () => {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          }
      },
  });
};

// Agregar una cita
export const addCita = async (cita) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.add(cita);
  await tx.done;
  return true;
};

// Obtener todas las citas
export const getAllCitas = async () => {
  const db = await initDB();
  const citas = await db.getAll(STORE_NAME);
  return citas;
};

// Obtener una cita por su ID
export const getCita = async (id) => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

// Eliminar una cita
export const deleteCita = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};