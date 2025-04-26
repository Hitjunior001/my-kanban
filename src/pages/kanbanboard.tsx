import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import getUsernameByUid from '../services/user';
import AddPostItForm from '../components/postIts/AddPostItForm';

export default function KanbanBoard() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [postIts, setPostIts] = useState<any[]>([]);
    const [existingSprints, setExistingSprints] = useState<string[]>([]);
    const [selectedSprint, setSelectedSprint] = useState('');
    // const [isOwner, setIsOwner] = useState(false);


    function formatRelativeTime(timestamp: { seconds: number, nanoseconds: number }) {
        const createdAt = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return 'Agora mesmo';
        if (diffMinutes < 60) return `${diffMinutes} min atrás`;
        if (diffHours < 24) return `${diffHours} h atrás`;
        return `${diffDays} d atrás`;
    }

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

    const getColorByArea = (area: string) => {
        switch (area) {
            case 'developers':
                return 'bg-blue-600';
            case 'design':
                return 'bg-pink-500';
            case 'engenheiro':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-700';
        }
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

                        {postIts.filter(postIt => postIt.status === status).map(postIt => (
                            <div
                                key={postIt.id}
                                className={`${getColorByArea(postIt.area)} p-4 rounded my-2 cursor-move transition-all hover:scale-105 shadow-lg`}
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData('postItId', postIt.id)}
                            >

                                <p className="font-bold text-xl mb-2">{postIt.title}</p>

                                <hr className="border-t-2 border-white opacity-30 my-2" />

                                <p className="text-base text-white leading-relaxed mb-2"><p className='font-bold'>Missão: </p> {postIt.description}</p>

                                <hr className="border-t-2 border-white opacity-30 my-2" />

                                <div className="text-sm text-gray-100 space-y-1">
                                    {postIt.movedBy && (
                                        <p><strong>Movido por:</strong> {postIt.movedBy}</p>
                                    )}
                                    {postIt.sprintName && (
                                        <p><strong>Sprint:</strong> {postIt.sprintName}</p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">
                                    {formatRelativeTime(postIt.createdAt)}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
