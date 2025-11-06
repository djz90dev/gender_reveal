import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, CollectionReference, DocumentData, doc, setDoc, getDocs, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { setLogLevel } from "firebase/firestore";
import type { Prediction } from '@/types';

// Establecer el nivel de registro de Firestore en debug (útil para desarrollo)
setLogLevel('debug');

const firebaseConfig = {
  apiKey: "AIzaSyC7o0lwGoHR8D7txFoKHwgE2dJ4HgR4hT0",
  authDomain: "gender-reveal-e6a51.firebaseapp.com",
  projectId: "gender-reveal-e6a51",
  storageBucket: "gender-reveal-e6a51.firebasestorage.app",
  messagingSenderId: "927819546385",
  appId: "1:927819546385:web:d796561a0d3e8b2ef596b0"
};

const appId = firebaseConfig.appId;
const initialAuthToken = null; // No se proporciona un token inicial en este caso

// La colección donde se almacenarán las predicciones
const PREDICTIONS_COLLECTION_NAME = 'gender_predictions';
const REVEAL_COLLECTION_NAME = 'reveal_status';
const REVEAL_DOC_ID = 'status';

// Ruta pública obligatoria para que todos los usuarios compartan los datos
export const PREDICTIONS_PUBLIC_PATH = `artifacts/${appId}/public/data/${PREDICTIONS_COLLECTION_NAME}`;
const REVEAL_PUBLIC_PATH = `artifacts/${appId}/public/data/${REVEAL_COLLECTION_NAME}`;

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

let predictionsCollectionRef: CollectionReference<DocumentData> | null = null;
let currentUserId: string | null = null;

// Una promesa para asegurar que la inicialización solo se ejecute una vez.
let authPromise: Promise<string | null> | null = null;


/**
 * Inicializa la autenticación (usa token si está disponible, si no, anónima) y
 * configura la referencia de la colección de Firestore.
 * @returns El ID del usuario autenticado o null si falla.
 */
export async function initializeAuthAndDatabase() {
    if (authPromise) {
        return authPromise;
    }

    authPromise = (async () => {
        try {
            if (auth.currentUser) {
                console.log("User already authenticated.");
            } else if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
            } else {
                await signInAnonymously(auth);
            }

            // Obtener el ID del usuario (UID)
            currentUserId = auth.currentUser?.uid || crypto.randomUUID();
            // Obtener la referencia de la colección de predicciones
            predictionsCollectionRef = collection(db, PREDICTIONS_PUBLIC_PATH);

            console.log("Firebase initialized. User ID:", currentUserId);
            return currentUserId;
        } catch (error) {
            console.error("Error initializing Firebase or authenticating:", error);
            authPromise = null; // Permitir reintentos si falla
            throw new Error("Firebase authentication failed. Please check your configuration and network connection.");
            return null;
        }
    })();

    return authPromise;
}

/**
 * Devuelve la referencia a la colección de predicciones.
 */
export function getPredictionsCollectionRef() {
    return predictionsCollectionRef;
}

/**
 * Devuelve la referencia al documento único para el estado de revelación.
 */
export function getRevealDocRef() {
    return doc(db, REVEAL_PUBLIC_PATH, REVEAL_DOC_ID);
}


/**
 * Añade un nuevo documento de predicción a Firestore.
 */
export async function addPredictionToDatabase(data: { name: string, prediction: "boy" | "girl", message: string }, userId: string) {
    const collectionRef = getPredictionsCollectionRef();
    if (!collectionRef) {
        throw new Error("Database not initialized. Cannot add prediction.");
    }

    await addDoc(collectionRef, {
        ...data,
        userId: userId,
        timestamp: serverTimestamp(), // Usar timestamp del servidor para un orden preciso
    });

    console.log(`Prediction added for ${data.name} (${data.prediction})`);
}

/**
 * Escucha cambios en tiempo real en la colección de predicciones y
 * ejecuta un callback con los datos actualizados.
 * @param callback La función a la que se llamará con la lista de predicciones.
 * @returns Una función para cancelar la suscripción y dejar de escuchar.
 */
export function listenToPredictions(callback: (predictions: Prediction[]) => void) {
    const collectionRef = getPredictionsCollectionRef();
    if (!collectionRef) {
        console.error("Database not initialized. Cannot listen to predictions.");
        return () => {}; // Devuelve una función vacía si no está inicializado
    }

    // Creamos una consulta para ordenar las predicciones por fecha
    const q = query(collectionRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const predictions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convertimos el timestamp de Firebase a un formato estándar
            timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString(),
        })) as Prediction[];
        callback(predictions);
    });

    return unsubscribe; // Esta función permite "apagar" el listener
}

/**
 * Escucha cambios en tiempo real en el estado de revelación.
 * @param callback La función que se llamará con el estado de revelación.
 * @returns Una función para cancelar la suscripción.
 */
export function listenToRevealStatus(callback: (status: { gender: "boy" | "girl" } | null) => void) {
    const revealDocRef = getRevealDocRef();

    const unsubscribe = onSnapshot(revealDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            callback({
                gender: data.gender,
            });
        } else {
            callback(null);
        }
    });

    return unsubscribe;
}

/**
 * Almacena el resultado de la revelación de género.
 */
export async function setRevealStatus(gender: "boy" | "girl") {
    const revealDocRef = getRevealDocRef();

    await setDoc(revealDocRef, {
        gender: gender,
        revealed_at: serverTimestamp(),
    });
    console.log(`Reveal status set to: ${gender}`);
}

/**
 * Obtiene todas las predicciones desde Firestore.
 */
export async function getPredictionsFromDatabase() {
    const collectionRef = getPredictionsCollectionRef();
    if (!collectionRef) {
        throw new Error("Database not initialized. Cannot fetch predictions.");
    }

    const querySnapshot = await getDocs(collectionRef);
    const predictions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString(),
    }));

    console.log(`Fetched ${predictions.length} predictions from Firestore`);
    return predictions;
}

/**
 * Obtiene el estado de revelación desde Firestore.
 */
export async function getRevealStatusFromDatabase() {
    const revealDocRef = getRevealDocRef();
    const docSnap = await getDoc(revealDocRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            gender: data.gender,
            revealed_at: data.revealed_at?.toDate()?.toISOString() || new Date().toISOString(),
        };
    } else {
        return null;
    }
}
