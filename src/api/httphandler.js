import TOKEN from './token';
import {TOKEN_HEADER_NAME, TIHLDE_API} from '../settings';

export class IRequest {
    constructor(method, url, data={}, withAuth=true, args={}) {
        this.method = method;
        this.data = data;
        this.headers = {'Content-Type': 'application/json'}
        this.url = TIHLDE_API.URL + url;
        this.args = args;

        if (withAuth) {
            this.headers[TOKEN_HEADER_NAME] = TOKEN.get();
        }

        for (const key in args) {
            this.headers[key] = args[key];
        }
    }

    response() {
        if (this.method === 'GET') {
            return new IResponse(getRequest(this.method, this.url, this.headers, this.data));
        } else {
            return new IResponse(request(this.method, this.url, this.headers, this.data));
        }
    }
}

class IResponse {
    constructor(response) {
        this.response = response.then((data) => {
            if (!data) {
                data = {};
            }

            this.isError = !data.ok;
            this.status = data.status;
            
            return (data.json)? data.json() : data;
        }).catch((error) => console.log(error));
    }

    then(method) {
        return this.response.then(method);
    }
}

const request = (method, url, headers, data) => {
    return fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(data),
    })
    .catch((error) => console.log(error));
};

const getRequest = (method, url, headers, args) => {
    return fetch(url+argsToParams(args), {
        method: method,
        headers: headers,
    })
    .catch((error) => console.log(error));
};

const argsToParams = (data) => {
    let args = '?';
    for (let key in data) {
        if (Array.isArray(data[key]) ) {
            for (let value in data[key]) {
            args += '&' + key + '=' + data[key][value];
            }
        } else {
            args += '&' + key + '=' + data[key];
        }
    }
    return args;
};

