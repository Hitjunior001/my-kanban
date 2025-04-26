import { db } from '../config'
import { doc, updateDoc, arrayUnion, collection, getDocs, addDoc  } from 'firebase/firestore'

export async function createTeam(name, userId) {
  const docRef = await addDoc(collection(db, 'teams'), {
    name,
    createdBy: userId,
    members: [userId],
  })
  return docRef.id
}

export async function addMemberToTeam(teamId, memberId) {
    const teamRef = doc(db, 'teams', teamId)
    await updateDoc(teamRef, {
      members: arrayUnion(memberId)
    })
}

export async function getAllTeams() {
    const snapshot = await getDocs(collection(db, 'teams'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
  
  export async function getTeamTasks(teamId) {
    const snapshot = await getDocs(collection(db, 'teams', teamId, 'tasks'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}