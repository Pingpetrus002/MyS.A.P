import FetchWraper from "./FetchWraper";

export default class AlertCreator {
    constructor(props) {
        this.props = props;
    }

    checkForAlert() {
        if (this.props.alerteRE != null) {
            this.createAlert("Relation Entreprise", this.props.alerteRE);
        }
        
        if (this.props.alerteSP != null) {
            this.createAlert("Service Pedagogique", this.props.alerteSP);
        }
    }

    async createAlert(type, commentaire) {
        let fetchWraper = new FetchWraper();
        fetchWraper.url = "http://10.1.1.44:5000/auth/create_alert";
        fetchWraper.method = "POST";
        fetchWraper.headers.append("Content-Type", "application/json");
        fetchWraper.headers.append("Accept", "application/json");
        fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
        fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");
        
        const body = {
            type: type,
            commentaire: commentaire,
            id_user_cible: this.props.idEtudiant,
        };

        fetchWraper.body = JSON.stringify(body);

        try {
            const response = await fetchWraper.fetchw();
            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi de l\'alerte');
            }
            console.log('Alerte envoyée avec succès');
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
}

export async function getAlerts() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://10.1.1.44:5000/auth/get_alerts";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");

    const response = await fetchWraper.fetchw();
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des alertes');
    }
    return await response.json();
}
