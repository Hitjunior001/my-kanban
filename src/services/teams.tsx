import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore"; 

const db = getFirestore();

export const sendInviteTeam = async (sendInviteTeamData) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
        try {
            await addDoc(collection(db, 'invites'), {
                ...sendInviteTeamData,
                from: user.uid,
                createdAt: new Date(),
            });
            console.log(sendInviteTeamData)
        } catch (err) {
            console.error("Erro ao enviar convite: ", err);
        }
    } else {
        alert("Você precisa estar logado para enviar convite.");
    }
};

export const getTeamNameById = async (teamId) => {
    const teamDocRef = doc(db, 'teams', teamId);
    const teamSnap = await getDoc(teamDocRef);

    if (!teamSnap.exists()) {
        alert("Equipe não encontrada!");
        return;
    }

    const teamData = teamSnap.data();
    const teamName = teamData?.name 

    return teamName;
}