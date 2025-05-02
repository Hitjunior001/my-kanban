import { doc, getDoc, updateDoc } from "firebase/firestore";
import getUsernameByUid from "../../services/user";
import { db } from "../../firebase/config";
import { getAuth } from "firebase/auth";

const handleMovePostIt = async (postItId: string, newStatus: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const postItRef = doc(db, 'postIts', postItId);
    const postItSnap = await getDoc(postItRef);

    if (!postItSnap.exists()) return;

    const currentData = postItSnap.data();
    const currentStatus = currentData.status;

    if (currentStatus === newStatus) return;

    if (currentStatus === 'finalizado') {
        alert('Essa tarefa já foi finalizada');
        return;
    }

    const username = await getUsernameByUid(user.uid);

    if (currentStatus === 'todo' && newStatus !== 'doing') {
        alert('Tarefas em "A Fazer" só podem ser movidas para "Fazendo".');
        return;
    }

    if (currentStatus === 'teste' && newStatus === 'bugs') {
        if (username !== 'testador') {
            alert('Apenas o testador pode mover a tarefa para "Bugs".');
            return;
        }
    }

    if (currentStatus === 'teste' && newStatus === 'finalizado') {
        if (username !== 'testador') {
            alert('Apenas o usuário testador pode concluir esta tarefa.');
            return;
        }

        const confirm = window.confirm('Deseja realmente marcar como finalizado?');
        if (!confirm) return;
    }

    if (newStatus === 'finalizado' && currentStatus !== 'teste') {
        alert('A tarefa só pode ser finalizada a partir da etapa de teste.');
        return;
    }

    const updatePayload: any = {
        status: newStatus,
    };

    if (currentStatus !== 'doing') {
        updatePayload.movedBy = username;
    }

    if (currentStatus === 'teste' && newStatus === 'bugs') {
        if (username !== 'testador') {
            alert('Apenas o testador pode mover a tarefa para "Bugs".');
            return;
        }
    
        const bugDescription = window.prompt('Descreva o problema encontrado:');
        if (!bugDescription || bugDescription.trim() === '') {
            alert('É necessário descrever o problema para mover para Bugs.');
            return;
        }
    
        updatePayload.status = newStatus;
        updatePayload.movedBy = username;
        updatePayload.bugDescription = bugDescription;
    
        await updateDoc(postItRef, updatePayload);
        return;
    }
    };

export default handleMovePostIt;
