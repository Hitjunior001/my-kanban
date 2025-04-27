import { arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/config"


const FilteredInvites = ({invites, user}) => {
    console.log(invites)
    const handleAcceptInvite = async (invite) => {
        const teamRef = doc(db, 'teams', invite.teamId)
        await updateDoc(teamRef, {
            members: arrayUnion(user.uid)
        })
        await deleteDoc(doc(db, 'invites', invite.id))
    }

    return (
        <div>
            {invites.length > 0 && (
                <>
                <span className="block w-full text-left px-4 py-2">Convites: </span>
                {invites.map(invite => (
                    <div key={invite.id} className="mb-2">
                        Convite para equipe <b>{invite.teamName}</b>
                        <button
                            onClick={() => handleAcceptInvite(invite)}
                            className="bg-blue-600 ml-2 px-3 py-1 rounded"
                            >Aceitar</button>
                    </div>
                ))}
                </>
            )}
        </div>
    )
}

export default FilteredInvites;