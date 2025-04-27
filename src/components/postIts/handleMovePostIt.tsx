import { doc, updateDoc } from "firebase/firestore";
import getUsernameByUid from "../../services/user";
import { db } from "../../firebase/config";
import { getAuth } from "firebase/auth";

const handleMovePostIt = async (postItId: string, newStatus: string) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const username = await getUsernameByUid(user.uid);
            const postItRef = doc(db, 'postIts', postItId);

            if (newStatus === 'done') {
                const confirm = window.confirm('Deseja realmente marcar como finalizado?');
                if (confirm) {
                    await updateDoc(postItRef, {
                        status: 'finalizado',
                        movedBy: username,
                    });
                }
            } else {
                await updateDoc(postItRef, {
                    status: newStatus,
                    movedBy: username,
                });
            }
        }
    };

    export default handleMovePostIt