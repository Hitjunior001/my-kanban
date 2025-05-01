import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';

export default function DocumentPage() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Carregar documento ao abrir a página
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(db, 'sharedDocs', 'mainDoc');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setContent(snap.data().content || '');
        }
      } catch (error: any) {
        console.error('Erro ao carregar:', error);
        setLoadError('Erro ao carregar documento');
      }
    };
    fetchDocument();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'sharedDocs', 'mainDoc');
      await setDoc(docRef, { content });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar. Verifique as permissões no Firebase.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-tech text-cyan-400">Documentação do Jogo</h1>
        <Link to="/dashboard">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Voltar para o Kanban
          </button>
        </Link>
      </div>

      {loadError && <p className="text-red-500">{loadError}</p>}

      <textarea
        className="w-full h-[70vh] bg-gray-900 text-white p-4 rounded resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder="Digite aqui a documentação compartilhada..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded bg-purple-700 hover:bg-purple-800 text-white shadow ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}
