// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { auth, db } from '../firebase/config'
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    updateDoc,
    doc,
    arrayUnion,
    deleteDoc
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()
    const [teamName, setTeamName] = useState('')
    const [teams, setTeams] = useState<{
        id: string | null | undefined
        name: string
        createdBy: string  
}[]>([]);
    const [invites, setInvites] = useState<{
        id: string | null | undefined
        teamId: string
}[]>([]);
    const user = auth.currentUser
    if (!user) {
        navigate('/login'); 
        return null;
      }

    useEffect(() => {
        if (!user) return

        const q = query(collection(db, 'teams'), where('members', 'array-contains', user.uid))
        const unsub = onSnapshot(q, (snapshot) => {
            setTeams(snapshot.docs.map(doc => {
                const data = doc.data() as { name: string, createdBy: string } 
                return {
                  id: doc.id,
                  name: data.name,
                  createdBy: data.createdBy
                }
              }))        })

        const qInvites = query(collection(db, 'invites'), where('to', '==', user.uid))
        const unsubInvites = onSnapshot(qInvites, (snapshot) => {
            setInvites(snapshot.docs.map(doc => {
                const data = doc.data() as { teamId: string }
                return {
                  id: doc.id,
                  teamId: data.teamId
                }
              }))        })

        return () => {
            unsub()
            unsubInvites()
        }
    }, [user])

    const handleLogout = async () => {
        await signOut(auth)
        navigate('/login')
    }

    const handleCreateTeam = async () => {
        if (!teamName.trim()) return

        try {
            await addDoc(collection(db, 'teams'), {
            name: teamName,
            createdBy: user.uid,
            members: [user.uid]
        })
        setTeamName('')
    }catch(err){
        console.log(err)
    }}

    const handleAcceptInvite = async (invite) => {
        const teamRef = doc(db, 'teams', invite.teamId)
        await updateDoc(teamRef, {
            members: arrayUnion(user.uid)
        })
        await deleteDoc(doc(db, 'invites', invite.id))
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-tech text-cyan-400">Painel do Robô</h1>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded">Sair</button>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl">Criar nova equipe</h2>
                <input
                    type="text"
                    placeholder="Nome da equipe"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    className="text-white p-2 rounded"
                />
                <button onClick={handleCreateTeam} className="bg-green-600 px-4 py-2 rounded ml-2">Criar</button>
            </div>

            <div>
                <h2 className="text-xl mb-2">Convites</h2>
                {invites.map(invite => (
                    <div key={invite.id} className="mb-2">
                        Convite para equipe <b>{invite.teamId}</b>
                        <button
                            onClick={() => handleAcceptInvite(invite)}
                            className="bg-blue-600 ml-2 px-3 py-1 rounded"
                        >Aceitar</button>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-xl mb-2">Minhas Equipes</h2>
                {teams.map(team => (
                    <div key={team.id} className="border p-3 rounded bg-gray-900 mb-2">
                        <div className='flex justify-between'>
                        <div>
                            <p><b>{team.name}</b></p>
                            <p className="text-sm text-gray-400">Dono: {team.createdBy === user.uid ? 'Você' : team.createdBy}</p>
                        </div>
                        <div className="mt-2">
                            <Link
                                to={`/kanban/${team.id}`}
                                className="text-cyan-400 hover:underline text-sm rounded bg-gray-900"
                                >Acessar quadro Kanban</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
