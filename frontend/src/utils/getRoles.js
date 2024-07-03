import FetchWraper from "./FetchWraper";

export default async function getRoles() {
    let fetchWraper = new FetchWraper();
    fetchWraper.url = "http://localhost:5000/auth/roles/list";
    fetchWraper.method = "GET";
    fetchWraper.headers.append("Content-Type", "application/json");
    fetchWraper.headers.append("Accept", "application/json");
    fetchWraper.headers.append("Access-Control-Allow-Origin", window.location.origin);
    fetchWraper.headers.append("Access-Control-Allow-Credentials", "true");

    let result = await fetchWraper.fetchw();

    let data = await result.json() || [];

    return { "status": result.status, "data": data.roles };

}