// src/services/firebaseService.js
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
import getUsernameByUid from "./user";

const db = getFirestore();

export const addPostIt = async (postItData) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const username = await getUsernameByUid(user.uid);

        try {
            await addDoc(collection(db, 'postIts'), {
                ...postItData,
                createdAt: new Date(),
                createdBy: username,
                movedBy: '',
                status: 'todo',
                teamMembers: [user.uid],
            });
        } catch (err) {
            console.error("Erro ao adicionar post-it: ", err);
        }
    } else {
        alert("Você precisa estar logado para adicionar post-its.");
    }
};
