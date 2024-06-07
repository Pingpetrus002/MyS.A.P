import { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => setData(data.message))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>React with Flask Backend</h1>
            {data ? <p>{data}</p> : <p>Loading...</p>}
        </div>
    );
}

export default App;
