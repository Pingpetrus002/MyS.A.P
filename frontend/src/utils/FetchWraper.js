
// FetchWraper.js

export default class FetchWraper {

    constructor() {
        this.url = "";
        this.method = "";
        this.headers = new Headers();
        this.body = null;
    }

    async fetchw() {
        //console.log("FetchWraper", this.url, this.method, this.data);
        let requestOptions = {
            method: this.method,
            headers: this.headers,
            redirect: "follow",
            credentials: "include"
        };
        if (this.method != "GET" && this.method != "HEAD") {
            requestOptions.body = this.body;
        }
        return fetch(this.url, requestOptions)
            //.then(response => response.json())
            .then((data) => {
                //console.log("FetchWraper", result);
                return data;
            })
            .catch((error) => {
                console.error("FetchWraper error: ", error);
                return error;
            });

    }

}