import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

export default function KanbanBoard() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [postIts, setPostIts] = useState([]);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'postIts'), where('teamId', '==', teamId));
        const unsub = onSnapshot(q, (snapshot) => {
            setPostIts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsub();
    }, [teamId]);

    const handleAddPostIt = async () => {
        if (!title.trim()) return alert('O título é obrigatório.');

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            try {
                await addDoc(collection(db, 'postIts'), {
                    title,
                    description,
                    teamId,
                    createdAt: new Date(),
                    createdBy: user.email,
                    movedBy: '',
                    status: 'todo',
                    teamMembers: [user.uid],
                });
                setTitle('');
                setDescription('');
            } catch (err) {
                console.error("Erro ao adicionar post-it: ", err);
            }
        } else {
            alert("Você precisa estar logado para adicionar post-its.");
        }
    };

    const handleDeletePostIt = async (postItId) => {
        await deleteDoc(doc(db, 'postIts', postItId));
    };

    const handleUpdatePostIt = async (postItId, newContent) => {
        const postItRef = doc(db, 'postIts', postItId);
        await updateDoc(postItRef, { content: newContent });
    };

    const handleMovePostIt = async (postItId, newStatus) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const postItRef = doc(db, 'postIts', postItId);
            await updateDoc(postItRef, {
                status: newStatus,
                movedBy: user.email,
            });
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

    return (
        <div className="min-h-screen bg-black text-white p-6 space-y-6">
            {/* Botões superiores */}
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

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="text-white bg-gray-800 p-2 rounded w-full"
                />
                <textarea
                    placeholder="Descrição (opcional)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="text-white bg-gray-800 p-2 rounded w-full"
                />
                <button
                    onClick={handleAddPostIt}
                    className="bg-green-600 px-4 py-2 rounded"
                >
                    Adicionar
                </button>
            </div>

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
                        <h2 className="text-xl font-bold text-cyan-400">
                            {status === 'todo' ? 'A Fazer' : status === 'doing' ? 'Fazendo' : 'Feito'}
                        </h2>
                        {postIts.filter(postIt => postIt.status === status).map(postIt => (
                            <div
                                key={postIt.id}
                                className="bg-gray-700 p-4 rounded my-2"
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData('postItId', postIt.id)}
                            >
                                <p className="font-bold text-lg">{postIt.title}</p>
                                <p>{postIt.description}</p>
                                <p className="text-sm text-gray-300 mt-2">Criado por: {postIt.createdBy}</p>
                                {postIt.movedBy && (
                                    <p className="text-sm text-gray-400">Movido por: {postIt.movedBy}</p>
                                )}
                                <button
                                    onClick={() => handleDeletePostIt(postIt.id)}
                                    className="bg-red-600 px-3 py-1 rounded mt-2"
                                >Excluir</button>
                                <button
                                    onClick={() => handleUpdatePostIt(postIt.id, prompt('Novo conteúdo:', postIt.content))}
                                    className="bg-blue-600 px-3 py-1 rounded mt-2 ml-2"
                                >Editar</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
