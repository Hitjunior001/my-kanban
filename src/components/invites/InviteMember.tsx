import { useState } from 'react'
import { getTeamNameById, sendInviteTeam } from '../../services/teams';
import { useParams } from 'react-router-dom';
import { getUidByEmail } from '../../services/user';

const InviteMember = () => {
    const { teamId } = useParams();

    const [emailInvite, setEmailInvite] = useState("");

    
    const handleSendInvite = async () => {
      const userUid = await getUidByEmail(emailInvite)
      const teamName = await getTeamNameById(teamId);
        sendInviteTeam({ to: userUid, teamId, teamName });
    }

  return (
    <form onSubmit={handleSendInvite} className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl text-white font-semibold text-center">Enviar convite para equipe</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="text-white text-sm font-semibold">Convidar membro</label>
          <input
            id="title"
            type="text"
            value={emailInvite}
            onChange={e => setEmailInvite(e.target.value)}
            className="text-black p-3 rounded-lg w-full border-2 border-gray-400 focus:outline-none focus:border-green-500"
          />
        </div>
    </div>
      <button className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg w-full mt-4" type="submit">
        Enviar
      </button>
    </form>
  )
}

export default InviteMember
