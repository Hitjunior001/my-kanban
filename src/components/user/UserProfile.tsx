import { signOut } from 'firebase/auth'
import { useEffect, useState } from 'react';
import { CiUser } from "react-icons/ci";
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config';
import FilteredInvites from '../invites/FilterInvites';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const UserProfileMenu = () => {
    const navigate = useNavigate()
    const [invites, setInvites] = useState<{
        id: string | null | undefined
        teamId: string
    }[]>([]);
    const [openProfile, setOpenProfile] = useState(false);
    const user = auth.currentUser

    const toggleProfile = () => {
        setOpenProfile(prev => !prev);
    }

    useEffect(() => {
        if (!user) return;
        
        const qInvites = query(collection(db, 'invites'), where('to', '==', user.uid))
        const unsubInvites = onSnapshot(qInvites, (snapshot) => {
            setInvites(snapshot.docs.map(doc => {
                const data = doc.data() as {
                    teamName: string; teamId: string 
}
                return {
                    id: doc.id,
                    teamId: data.teamId,
                    teamName: data.teamName
                }
            }))
        })
        console.log(invites)
        return () => {
            unsubInvites()
        }
    }, [user])

    const handleLogout = async () => {
        await signOut(auth)
        navigate('/login')
    }

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="relative">

            <button onClick={toggleProfile} className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
            <div className="relative">
            <CiUser size={28} className="text-white" />
                {invites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg">
                        {invites.length}
                    </span>
                )}
            </div>
                <span>{user.email}</span>
            </button>

            {openProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded shadow-lg py-2 z-10">
                    <div className="px-4 py-2 text-gray-400">Opções</div>
                    <div className="border-t border-gray-700 my-2"></div>
                    <FilteredInvites invites={invites} user={user} />
                    <button onClick={handleGoToDashboard} className="hover:bg-gray-600 block w-full text-left px-4 py-2">
                        Dashboard
                    </button>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                    >
                        Sair
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserProfileMenu
