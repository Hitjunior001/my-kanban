import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import {Link, useParams } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import AddPostItForm from '../components/postIts/AddPostItForm';
import FilterPostIts from '../components/postIts/FilterPostIts';
import handleMovePostIt from '../components/postIts/handleMovePostIt';
import UserProfileMenu from '../components/user/UserProfile';
import InviteMember from '../components/invites/InviteMember';
import FilterComponent from '../components/FilterForm';

export default function KanbanBoard() {
    const { teamId } = useParams();
    const [postIts, setPostIts] = useState<any[]>([]);
    const [existingSprints, setExistingSprints] = useState<string[]>([]);
    const [selectedSprint, setSelectedSprint] = useState('');
    const [openAddTask, setOpenAddTask] = useState(false);
    const [openAddMember, setOpenAddMember] = useState(false);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState({ username: '', category: '' });


    useEffect(() => {
        const q = query(collection(db, 'postIts'), where('teamId', '==', teamId));
        const unsub = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))
            setPostIts(posts);
    
            const sprints = new Set<string>();
            const movedBySet = new Set<string>();
            const areaSet = new Set<string>();
    
            posts.forEach(post => {
                if (post.sprintName) sprints.add(post.sprintName);
                if (post.movedBy) movedBySet.add(post.movedBy);
                if (post.area) areaSet.add(post.area);
            });
    
            setExistingSprints(Array.from(sprints));
            setUsernames(Array.from(movedBySet));
            setCategories(Array.from(areaSet));
        });
        return () => unsub();
    }, [teamId]);

    const toggleAddTask = () => setOpenAddTask(prev => !prev);
    const toggleAddMember = () => setOpenAddMember(prev => !prev);

    const columnLabels: { [key: string]: string } = {
        todo: 'A Fazer',
        doing: 'Fazendo',
        teste: 'Em Teste',
        bugs: 'Com Bugs',
        finalizado: 'Concluído'
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-tech text-cyan-400">Quadro Kanban da Equipe</h1>
                <div className="space-x-4">
                    <UserProfileMenu />
                </div>
            </div>

            <button onClick={toggleAddTask} className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
                <span>Adicionar Task + </span>
            </button>


            {openAddTask && (
                <AddPostItForm
                    teamId={teamId}
                    setSelectedSprint={setSelectedSprint}
                    existingSprints={existingSprints}
                    selectedSprint={selectedSprint}
                />
            )}

            <button onClick={toggleAddMember} className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
                <span>Adicionar Membro + </span>
            </button>

            {openAddMember && <InviteMember />}

            <FilterComponent usernames={usernames}
                        categories={categories}
                        onFilterChange={setFilters}
                        
            />

            <div className="flex justify-end mb-4">
                <Link to="/document">
                    <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded shadow">
                        Documentação do Jogo
                    </button>
                </Link>
            </div>

            <div className="flex space-x-6 overflow-x-auto">
                {['todo', 'doing', 'teste', 'bugs', 'finalizado'].map((status) => (
                    <div
                        key={status}
                        className={`bg-gray-800 p-4 rounded w-1/3 min-w-[300px]`}
                        onDrop={(e) => {
                            const postItId = e.dataTransfer.getData('postItId');
                            handleMovePostIt(postItId, status);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <h2 className={`text-xl font-bold mb-2 ${
                            status === 'bugs' ? 'text-red-400' : 'text-cyan-400'
                        }`}>
                            {columnLabels[status]}
                        </h2>
                        <FilterPostIts postIts={postIts} status={status} filters={filters}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}