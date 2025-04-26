import  { useState } from 'react';
import { addPostIt } from '../../services/postIts';

const AddPostItForm = ({teamId, setSelectedSprint, existingSprints, selectedSprint }) => {
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
        <form onSubmit={handleAddPostIt}>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={e => setTitleState(e.target.value)} 
                    className="text-white bg-gray-800 p-2 rounded w-full"
                />
                <textarea
                    placeholder="Descrição"
                    value={description}
                    onChange={e => setDescriptionState(e.target.value)} 
                    className="text-white bg-gray-800 p-2 rounded w-full"
                />
                <select
                    value={area}
                    onChange={e => setAreaState(e.target.value)} 
                    className="text-white bg-gray-800 p-2 rounded w-full"
                >
                    <option value="developers">Developers</option>
                    <option value="design">Design</option>
                    <option value="engenheiro">Engenheiro</option>
                </select>

                <div className="space-y-2">
                    <select
                        value={selectedSprint}
                        onChange={(e) => {
                            setSelectedSprint(e.target.value); 
                            setSprintNameState(e.target.value); 
                        }}
                        className="text-white bg-gray-800 p-2 rounded w-full"
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
                            <input
                                type="text"
                                placeholder="Nome da Sprint"
                                value={sprintName}
                                onChange={e => setSprintNameState(e.target.value)}
                                className="text-white bg-gray-800 p-2 rounded w-full"
                            />
                            <input
                                type="date"
                                value={sprintStartDate}
                                onChange={e => setSprintStartDateState(e.target.value)} 
                                className="text-white bg-gray-800 p-2 rounded w-full"
                            />
                            <input
                                type="date"
                                value={sprintEndDate}
                                onChange={e => setSprintEndDateState(e.target.value)} 
                                className="text-white bg-gray-800 p-2 rounded w-full"
                            />
                        </>
                    )}
                </div>
            </div>
            <button type="submit">Adicionar Post-It</button>
        </form>
    );
};

export default AddPostItForm;
