import React, { useState } from 'react';
// import {useUnit} from 'effector-react'

const Withbd: React.FC = () => {
    // const [user] = useUnit([$user]);
    const [data, setData] = useState<any>(null);

    const fetchData = async () => {
        const url = `http://localhost:3001/api/chats/${data.userId}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
            setData(responseData);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            {/*<button onClick={fetchData}>Fetch Data</button>*/}
            {data && (
                <div>
                    <h2>Received Data:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Withbd;