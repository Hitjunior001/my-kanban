// src/context/authContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../firebase/config'

// Defina o tipo do usuário
type User = {
  id: string;
  // outras propriedades do usuário aqui
}

// Defina o tipo do contexto
interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        alert("Usuário não autenticado")
        return
      }
  
      setUser(currentUser as unknown as User)
      setLoading(false)
    })
  
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
