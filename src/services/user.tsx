import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';


export default async function getUsernameByUid(uid: string) {
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.username || "Usuário sem nome";
    }
    return "Usuário sem nome";
}

export async function getUidByEmail(email: string) {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.id; 
    } else {
        return "Usuário não encontrado";
    }
}