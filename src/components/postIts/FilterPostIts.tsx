const getColorByArea = (area: string) => {
    switch (area) {
        case 'developers':
            return 'bg-blue-600';
        case 'design':
            return 'bg-pink-500';
        case 'engenheiro':
            return 'bg-yellow-500';
        default:
            return 'bg-gray-700';
    }
};

function formatRelativeTime(timestamp: { seconds: number, nanoseconds: number }) {
    const createdAt = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Agora mesmo';
    if (diffMinutes < 60) return `${diffMinutes} min atrás`;
    if (diffHours < 24) return `${diffHours} h atrás`;
    return `${diffDays} d atrás`;
}


const FilterPostIts = ({ postIts, status, filters }) => {
    return (
        postIts
            .filter(postIt => postIt.status === status)
            .filter(postIt => 
                (!filters.username || postIt.movedBy === filters.username) &&
                (!filters.category || postIt.area === filters.category)
            )
            .map(postIt => (
                <div key={postIt.id}
                    className={`
                        ${getColorByArea(postIt.area)} 
                        p-4 rounded my-2 
                        ${postIt.status === 'finalizado' ? 'opacity-60 cursor-default line-through' : 'cursor-move hover:scale-105'}
                        transition-all shadow-lg
                    `}
                    draggable={postIt.status !== 'finalizado'}
                    onDragStart={(e) => {
                        if (postIt.status !== 'finalizado') {
                            e.dataTransfer.setData('postItId', postIt.id);
                        }
                    }}
                >
                    <div className="flex justify-between items-center">
                        <p className={`font-bold text-xl mb-2 ${postIt.status === 'finalizado' ? 'text-green-300' : '' }`}>
                            {postIt.title}
                        </p>
                        {postIt.status === 'finalizado' && (
                            <span className="text-sm bg-green-700 text-white px-2 py-1 rounded">Finalizado ✅</span>
                        )}
                    </div>
                    <hr className="border-t-2 border-white opacity-30 my-2" />
                    <p className="text-base text-white leading-relaxed mb-2">
                        <span className="font-bold">Missão: </span> {postIt.description}
                    </p>
                    <hr className="border-t-2 border-white opacity-30 my-2" />
                    <div className="text-sm text-gray-100 space-y-1">
                        {postIt.movedBy && (
                            <p><strong>Movido por:</strong> {postIt.movedBy}</p>
                        )}
                        {postIt.sprintName && (
                            <p><strong>Sprint:</strong> {postIt.sprintName}</p>
                        )}
                    </div>
                    {postIt.status === 'bugs' && postIt.bugDescription && (
                    <div className="mt-3 border-l-4 border-red-500 bg-red-900 bg-opacity-20 p-3 rounded">
                        <p className="text-red-400 font-semibold flex items-center mb-1">
                            <span className="mr-2">🐞</span> Descrição do Bug
                        </p>
                        <p className="text-red-200 text-sm">{postIt.bugDescription}</p>
                    </div>
                    )}
                        <p className="text-xs text-gray-400">

                        {formatRelativeTime(postIt.createdAt)}
                    </p>
                </div>
            ))
    );
}

export default FilterPostIts;
