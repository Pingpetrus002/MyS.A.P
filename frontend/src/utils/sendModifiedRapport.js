import FetchWraper from "./FetchWraper";
import JObject from "./JObject";
import AlertCreator from './AlertCreator';

export const sendModifiedRapport = async (props) => {
    let jobj = new JObject();

    // Prepare the JObject with updated data
    for (let key in props) {
        jobj.set(key, props[key]);
    }

    // Prepare the FetchWrapper instance
    let fetchWraper = new FetchWraper();
    fetchWraper.url = `https://localhost:5001/auth/edit_rapport/${props.rapportId}`; // Assuming rapportId is passed in props
    fetchWraper.method = "POST";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Origin", "*");

    // Construct the body for the request
    const body = {
        sujet: props.nomRapport,
        rapport_json: jobj.toJSON(),
        type: 'rapport'
    };

    fetchWraper.body = JSON.stringify(body);

    try {
        const response = await fetchWraper.fetchw();
        if (!response.ok) {
            throw new Error('Erreur lors de la modification du rapport');
        }
        // Report edited successfully
        let alertCreator = new AlertCreator(props);
        alertCreator.checkForAlert();
        return true;
    } catch (error) {
        console.error('Erreur:', error);
        return false;
    }
}
