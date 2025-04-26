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


const FilterPostIts = ({postIts }) => {

    return (
            postIts.filter(postIt => postIt.status === status).map(postIt => (
                <div
                    key={postIt.id}
                    className={`${getColorByArea(postIt.area)} p-4 rounded my-2 cursor-move transition-all hover:scale-105 shadow-lg`}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('postItId', postIt.id)}
                >

                    <p className="font-bold text-xl mb-2">{postIt.title}</p>

                    <hr className="border-t-2 border-white opacity-30 my-2" />

                    <p className="text-base text-white leading-relaxed mb-2"><p className='font-bold'>Missão: </p> {postIt.description}</p>

                    <hr className="border-t-2 border-white opacity-30 my-2" />

                    <div className="text-sm text-gray-100 space-y-1">
                        {postIt.movedBy && (
                            <p><strong>Movido por:</strong> {postIt.movedBy}</p>
                        )}
                        {postIt.sprintName && (
                            <p><strong>Sprint:</strong> {postIt.sprintName}</p>
                        )}
                    </div>
                    <p className="text-xs text-gray-400">
                        {formatRelativeTime(postIt.createdAt)}
                    </p>
                </div>
            ))
    )
}

export default FilterPostIts;