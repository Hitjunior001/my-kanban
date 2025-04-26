// src/firebase/tasks.js
import { db } from '../config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function createTask(teamId, title, userId) {
  const taskRef = collection(db, 'teams', teamId, 'tasks')
  await addDoc(taskRef, {
    title,
    status: 'todo',
    createdAt: serverTimestamp(),
    createdBy: userId,
  })
}

// src/firebase/tasks.js
import { doc, updateDoc } from 'firebase/firestore'

export async function updateTaskStatus(teamId, taskId, newStatus) {
  const taskRef = doc(db, 'teams', teamId, 'tasks', taskId)
  await updateDoc(taskRef, {
    status: newStatus,
  })
}