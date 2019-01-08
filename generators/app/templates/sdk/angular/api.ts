import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    apiHost = 'http://localhost:3000';
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor() {}

    public NormalizeEndpoint(endpoint: string): string {
        let str = endpoint.trim();
        str = str[0] !== '/' ? '/' + str : str;
        return this.apiHost + str;
    }
}

export class ApiResponse<T> {
    status: String;
    message: String;
    data: T;
}

export class ApiResponseList<T> {
    status: String;
    message: String;
    data: {
        data: T[];
        count: Number;
    };
}
