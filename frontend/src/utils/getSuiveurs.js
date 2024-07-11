import FetchWraper from "./FetchWraper";

export default async function getRoles() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "https://10.1.1.44:5001/auth/get_users/3";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");

    let result = await fetchWraper.fetchw();

    let data = await result.json() || [];

    return { "status": result.status, "data": data };

}