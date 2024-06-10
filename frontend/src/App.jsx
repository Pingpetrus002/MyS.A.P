import { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://172.20.0.2:80/data')
            .then(response => response.json())
            .then(data => setData(data.message))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    console.log(data);

    return (
        <div>
            <h1>Hello, World!</h1>
            <p>{data}</p>
        </div>
    );
}

export default App;
