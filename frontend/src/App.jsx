import { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://10.1.1.89:80/data')
            .then(response => response.json())
            .then(data => setData(data.message))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    console.log(data);

    return (
        <div>
            <p>{data}</p>
        </div>
    );
}

export default App;
