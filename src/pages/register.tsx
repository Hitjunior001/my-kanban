import { useState } from 'react'
import { auth, db } from '../firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {setDoc, doc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!username.trim()) {
        throw new Error('Por favor, forneça um nome de usuário')
      }
      if(confirmPassword != password){
        console.log("Senhas diferentes")
      }
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
  
      console.log('User ID:', user.uid)
      console.log('Username:', username)
    
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email, 
      })
    
      navigate('/dashboard')
    } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "message" in err) {
          const error = err as { message: string };
          console.error(error.message);
          setError(error.message)
        } else {
          console.error("Ocorreu um erro desconhecido");
        }
        
  }
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500">
        <h1 className="text-3xl font-bold text-purple-400 font-tech mb-6 text-center">CADASTRO - NÚCLEO ROBÔ</h1>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            className="bg-gray-900 border border-purple-500 p-3 rounded-lg focus:outline-none text-white"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="bg-gray-900 border border-purple-500 p-3 rounded-lg focus:outline-none text-white"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            className="bg-gray-900 border border-purple-500 p-3 rounded-lg focus:outline-none text-white"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="username"
            className="bg-gray-900 border border-purple-500 p-3 rounded-lg focus:outline-none text-white"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="bg-purple-500 hover:bg-purple-400 text-black font-bold py-2 rounded-lg transition-all shadow-md">
            Criar Conta
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Já tem conta? <Link to="/login" className="text-purple-400 hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
