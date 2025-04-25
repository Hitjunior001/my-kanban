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
    deleteDoc,
    getDocs
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()
    const [teamName, setTeamName] = useState('')
    const [teams, setTeams] = useState([])
    const [invites, setInvites] = useState([])
    const [inviteeId, setInviteeId] = useState('')
    const user = auth.currentUser

    useEffect(() => {
        if (!user) return

        const q = query(collection(db, 'teams'), where('members', 'array-contains', user.uid))
        const unsub = onSnapshot(q, (snapshot) => {
            setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })

        const qInvites = query(collection(db, 'invites'), where('to', '==', user.uid))
        const unsubInvites = onSnapshot(qInvites, (snapshot) => {
            setInvites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })

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
        await addDoc(collection(db, 'teams'), {
            name: teamName,
            createdBy: user.uid,
            members: [user.uid]
        })
        setTeamName('')
    }

    const handleInvite = async (teamId) => {
        try {
            if (!inviteeId.trim()) {
                console.warn('Email do convidado está vazio!')
                return
            }

            const q = query(collection(db, 'users'), where('email', '==', inviteeId.trim()))
            const snapshot = await getDocs(q)

            if (snapshot.empty) {
                alert('Usuário não encontrado com esse e-mail.')
                return
            }

            const docSnap = snapshot.docs[0]
            const inviteeUID = docSnap.id // ← Pega o UID corretamente

            await addDoc(collection(db, 'invites'), {
                teamId,
                from: user.uid,
                to: inviteeUID
            })

            setInviteeId('')
        } catch (err) {
            console.error('Erro ao convidar:', err)
            alert('Erro ao enviar convite. Verifique as permissões e tente novamente.')
        }
    }

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
                        <p><b>{team.name}</b></p>
                        <p className="text-sm text-gray-400">Dono: {team.createdBy === user.uid ? 'Você' : team.createdBy}</p>
                        {team.createdBy === user.uid && (
                            <div className="mt-2">
                                <input
                                    type="text"
                                    placeholder="Email do membro"
                                    value={inviteeId}
                                    onChange={e => setInviteeId(e.target.value)}
                                    className="text-white p-1 rounded"
                                />
                                <button
                                    onClick={() => handleInvite(team.id)}
                                    className="bg-cyan-600 px-3 py-1 rounded ml-2"
                                >Convidar</button>
                            </div>
                        )}
                        <div className="mt-2">
                            <Link
                                to={`/kanban/${team.id}`}
                                className="text-cyan-400 hover:underline text-sm"
                            >Acessar quadro Kanban</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
