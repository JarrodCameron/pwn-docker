import axios from "axios";

const AXIOS_DEFAULT_CONFIG = {
    baseURL: location.protocol + "//" + location.host,
}

// The minimal version for AxiosClient
class AxiosClient {
    constructor() {

        this.client = axios.create(AXIOS_DEFAULT_CONFIG);

        this.status_handlers = {};

        this.client.interceptors.response.use(
            (response) => this.#successInterceptor(response),
            (error) => this.#errorInterceptor(error),
        );
    }

    async post(url, data={}, config={}) {
        return this.client.post(url, data, config);
    }

    async get(url, data={}, config={}) {
        return this.client.get(url, data, config);
    }

    async request(config) {
        return this.client.request(config);
    }

    /* Runs a specific function when a specifc status code is receive.
     * Corrently, only useful for error status codes
     */
    setStatusHandler(status_id, status_handler) {
        this.status_handlers[status_id] = status_handler;
    }

    #successInterceptor(response) {

        const status_id = response.status;
        if (status_id in this.status_handlers) {
            const handler = this.status_handlers[status_id];
            handler(response);
        }

        return response;
    }

    #errorInterceptor(error) {

        const status_id = error.response.status;
        if (status_id in this.status_handlers) {
            const handler = this.status_handlers[status_id];
            handler(error);
        }

        return error;
    }

}

export default AxiosClient;
