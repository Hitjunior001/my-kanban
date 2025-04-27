import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import AddPostItForm from '../components/postIts/AddPostItForm';
import FilterPostIts from '../components/postIts/filterPostIts';
import handleMovePostIt from '../components/postIts/handleMovePostIt';

export default function KanbanBoard() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [postIts, setPostIts] = useState<any[]>([]);
    const [existingSprints, setExistingSprints] = useState<string[]>([]);
    const [selectedSprint, setSelectedSprint] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    // const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'postIts'), where('teamId', '==', teamId));
        const unsub = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))
                .filter(postIt => postIt.status !== 'finalizado');
            setPostIts(posts);

            const sprints = new Set<string>();
            posts.forEach(post => {
                if (post.sprintName) {
                    sprints.add(post.sprintName);
                }
            });
            setExistingSprints(Array.from(sprints));
        });
        return () => unsub();
    }, [teamId]);

    // useEffect(() => {
    //     const checkIfOwner = async () => {
    //         const auth = getAuth();
    //         const user = auth.currentUser;

    //         if (user) {
    //             const teamDocRef = doc(db, 'teams', teamId!);
    //             const teamSnap = await getDoc(teamDocRef);

    //             if (teamSnap.exists()) {
    //                 const teamData = teamSnap.data();
    //                 setIsOwner(teamData.createdBy === user.uid);
    //             }
    //         }
    //     };

    //     if (teamId) {
    //         checkIfOwner();
    //     }
    // }, [teamId]);

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error("Erro ao sair: ", error);
            });
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-tech text-cyan-400">Quadro Kanban da Equipe</h1>
                <div className="space-x-4">
                    <button onClick={handleGoToDashboard} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
                        Voltar para o Dashboard
                    </button>
                    <button onClick={handleLogout} className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded">
                        Sair
                    </button>
                </div>
            </div>

            {/* {isOwner && (
                        <AddPostItForm
                            teamId={teamId}
                            setSelectedSprint={setSelectedSprint}
                            existingSprints={existingSprints}
                            selectedSprint={selectedSprint}
                        />
            )} */}
                <AddPostItForm
                    teamId={teamId}
                    setSelectedSprint={setSelectedSprint}
                    existingSprints={existingSprints}
                    selectedSprint={selectedSprint}
                    />
            <div className="flex space-x-6">
                {['todo', 'doing', 'done'].map((status) => (
                    <div
                        key={status}
                        className="bg-gray-800 p-4 rounded w-1/3"
                        onDrop={(e) => {
                            const postItId = e.dataTransfer.getData('postItId');
                            handleMovePostIt(postItId, status);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <h2 className="text-xl font-bold text-cyan-400 mb-2">
                            {status === 'todo' ? 'A Fazer' : status === 'doing' ? 'Fazendo' : 'Concluir'}
                        </h2>
                        <FilterPostIts postIts={postIts} status={status} />
                    </div>
                ))}
            </div>
        </div>
    );
}
