import React, { useState, useEffect } from 'react';

function ListChannel() {
    const [channels, setChannels] = useState(["Channel1", "Channel2", "Channel3"])

    return (
        <>
            <p>Listes des channel</p>
            <div>
                {channels.map(channel => (
                    <p>{channel}</p>
                ))}
            </div>
        </>
    )
}

export default ListChannel