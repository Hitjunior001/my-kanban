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

    // Evita ações se status não mudou
    if (currentStatus === newStatus) return;

    // Impede mudança de tarefas finalizadas
    if (currentStatus === 'finalizado') {
        alert('Essa tarefa já foi finalizada');
        return;
    }

    const username = await getUsernameByUid(user.uid);

    // Regra: só pode mover de "todo" para "doing"
    if (currentStatus === 'todo' && newStatus !== 'doing') {
        alert('Tarefas em "A Fazer" só podem ser movidas para "Fazendo".');
        return;
    }

    // Regra: só testador pode mover de "teste" para "bugs"
    if (currentStatus === 'teste' && newStatus === 'bugs') {
        if (username !== 'testador') {
            alert('Apenas o testador pode mover a tarefa para "Bugs".');
            return;
        }
    }

    // Regra: só testador pode mover de "teste" para "finalizado"
    if (currentStatus === 'teste' && newStatus === 'finalizado') {
        if (username !== 'testador') {
            alert('Apenas o usuário testador pode concluir esta tarefa.');
            return;
        }

        const confirm = window.confirm('Deseja realmente marcar como finalizado?');
        if (!confirm) return;
    }

    // Regra: não pode ir direto para "finalizado" de outro lugar que não seja "teste"
    if (newStatus === 'finalizado' && currentStatus !== 'teste') {
        alert('A tarefa só pode ser finalizada a partir da etapa de teste.');
        return;
    }

    // Atualiza status — evita mudar movedBy se já estiver em "doing"
    const updatePayload: any = {
        status: newStatus,
    };

    if (currentStatus !== 'doing') {
        updatePayload.movedBy = username;
    }

    await updateDoc(postItRef, updatePayload);
};

export default handleMovePostIt;
