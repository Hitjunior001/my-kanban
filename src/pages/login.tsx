// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Credenciais inválidas')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-cyan-500">
        <h1 className="text-3xl font-bold text-cyan-400 font-tech mb-6 text-center">LOGIN - NÚCLEO ROBÔ</h1>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            className="bg-gray-900 border border-cyan-500 p-3 rounded-lg focus:outline-none text-white"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="bg-gray-900 border border-cyan-500 p-3 rounded-lg focus:outline-none text-white"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 rounded-lg transition-all shadow-md">
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Não tem conta? <Link to="/register" className="text-cyan-400 hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
