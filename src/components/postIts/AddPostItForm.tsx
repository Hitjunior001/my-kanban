import { useState } from 'react';
import { addPostIt } from '../../services/postIts';

const AddPostItForm = ({ teamId, setSelectedSprint, existingSprints, selectedSprint }) => {
  const [title, setTitleState] = useState('');
  const [description, setDescriptionState] = useState('');
  const [area, setAreaState] = useState('developers');
  const [sprintName, setSprintNameState] = useState('');
  const [sprintStartDate, setSprintStartDateState] = useState('');
  const [sprintEndDate, setSprintEndDateState] = useState('');

  const handleAddPostIt = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('O título é obrigatório.');
    if (!sprintName.trim()) return alert('Informe um nome de Sprint.');

    const postItData = {
      title,
      description,
      area,
      sprintName,
      sprintStartDate,
      sprintEndDate,
      teamId,
    };

    await addPostIt(postItData);

    setTitleState('');
    setDescriptionState('');
    setAreaState('developers');
    setSprintNameState('');
    setSprintStartDateState('');
    setSprintEndDateState('');
  };

  return (
    <form onSubmit={handleAddPostIt} className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl text-white font-semibold text-center"> Criar Task</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="text-white text-sm font-semibold">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitleState(e.target.value)}
            className="text-black p-3 rounded-lg w-full border-2 border-gray-400 focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="text-white text-sm font-semibold">Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescriptionState(e.target.value)}
            className="text-black p-3 rounded-lg w-full border-2 border-gray-400 focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="area" className="text-white text-sm font-semibold">Área</label>
          <select
            id="area"
            value={area}
            onChange={e => setAreaState(e.target.value)}
            className="text-black p-3 rounded-lg w-full border-2 border-gray-400 focus:outline-none focus:border-green-500"
          >
            <option value="developers">Developers</option>
            <option value="design">Design</option>
            <option value="engenheiro">Engenheiro</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="selectedSprint" className="text-white text-sm font-semibold">Sprint</label>
          <select
            id="selectedSprint"
            value={selectedSprint}
            onChange={(e) => {
              setSelectedSprint(e.target.value);
              setSprintNameState(e.target.value);
            }}
            className="text-black p-3 rounded-lg w-full border-2 border-gray-400 focus:outline-none focus:border-green-500"
          >
            <option value="">Nova Sprint</option>
            {existingSprints.map(sprint => (
              <option key={sprint} value={sprint}>
                {sprint}
              </option>
            ))}
          </select>

          {!selectedSprint && (
            <>
              <div>
                <label htmlFor="sprintName" className="text-white text-sm font-semibold">Nome da Sprint</label>
                <input
                  id="sprintName"
                  type="text"
                  value={sprintName}
                  onChange={e => setSprintNameState(e.target.value)}
                  className="text-black p-3 rounded-lg w-full border-2 border-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sprintStartDate" className="text-white text-sm font-semibold">Data de Início</label>
                  <input
                    id="sprintStartDate"
                    type="date"
                    value={sprintStartDate}
                    onChange={e => setSprintStartDateState(e.target.value)}
                    className="text-black p-3 rounded-lg w-full border-2 border-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="sprintEndDate" className="text-white text-sm font-semibold">Data de Fim</label>
                  <input
                    id="sprintEndDate"
                    type="date"
                    value={sprintEndDate}
                    onChange={e => setSprintEndDateState(e.target.value)}
                    className="text-black p-3 rounded-lg w-full border-2 border-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <button className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg w-full mt-4" type="submit">
        Adicionar Task
      </button>
    </form>
  );
};

export default AddPostItForm;
