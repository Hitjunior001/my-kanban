import { useState } from "react";

export default function FilterComponent({ usernames, categories, onFilterChange }) {
    const [username, setUsername] = useState('');
    const [category, setCategory] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        onFilterChange({ username: e.target.value, category });
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        onFilterChange({ username, category: e.target.value });
    };

    return (
<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-gray-800 rounded-xl shadow-md">
    <div className="flex flex-col">
        <label htmlFor="responsavel" className="text-white font-semibold mb-1">Responsável:</label>
        <select
            id="responsavel"
            onChange={handleUsernameChange}
            className="bg-gray-900 text-white p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
        >
            <option value="">Todos</option>
            {usernames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
            ))}
        </select>
    </div>

    <div className="flex flex-col">
        <label htmlFor="categoria" className="text-white font-semibold mb-1">Categoria:</label>
        <select
            id="categoria"
            onChange={handleCategoryChange}
            className="bg-gray-900 text-white p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
        >
            <option value="">Todas</option>
            {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
            ))}
        </select>
    </div>
</div>

    );
}
