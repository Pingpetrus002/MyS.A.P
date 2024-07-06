import FetchWraper from "./FetchWraper";
import JObject from "./JObject";

export const sendRapport = async (props) => {

    let jobj = new JObject();

    for (let key in props) {
        jobj.set(key, props[key]);
    }



    let fetchWraper = new FetchWraper();
    fetchWraper.url = "https://localhost:5001/auth/set_rapport";
    fetchWraper.method = "POST";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Origin", "*");

    const body = {
        id_user: props.idEtudiant,
        sujet: props.nomRapport,
        type: 'rapport',
        rapport_json: jobj.toJSON()
    };


    fetchWraper.body = JSON.stringify(body);


    try {
        const response = await fetchWraper.fetchw();
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du rapport');
        }
        console.log('Rapport envoyé avec succès');
        return true;
    } catch (error) {
        console.error('Erreur:', error);
    }

}

