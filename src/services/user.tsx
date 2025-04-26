import { doc, getDoc } from 'firebase/firestore';
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