import { Injectable } from '@angular/core';
import { Model<%= capSchemaName %> } from './Model<%= capSchemaName %>';
import { ApiService, ApiResponse, ApiResponseList } from './api.service';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class Api<%= capSchemaName %>Service {
    endPoint = '<%= lowSchemaName %>';

    constructor(private api: ApiService, private http: HttpClient) {}

    GetAll(): Observable<Model<%= capSchemaName %>[]> {
        const url = this.api.NormalizeEndpoint(`api/${this.endPoint}s`);
        return this.http
            .get<ApiResponseList<Model<%= capSchemaName %>>>(url, this.api.httpOptions)
            .pipe(
                map(data => {
                    return data.data.data;
                })
            );
    }

    Get(id: string): Observable<Model<%= capSchemaName %>> {
        const url = this.api.NormalizeEndpoint(`api/${this.endPoint}/${id}`);
        return this.http.get<ApiResponse<Model<%= capSchemaName %>>>(url, this.api.httpOptions).pipe(
            map(data => {
                return data.data;
            })
        );
    }

    Create(data: Model<%= capSchemaName %>): Observable<Model<%= capSchemaName %>> {
        const url = this.api.NormalizeEndpoint(`api/${this.endPoint}`);
        return this.http
            .post<ApiResponse<Model<%= capSchemaName %>>>(
                url,
                JSON.stringify({
                    data: data
                }),
                this.api.httpOptions
            )
            .pipe(
                map(mdata => {
                    return mdata.data;
                })
            );
    }

    Edit(id: string, data: Model<%= capSchemaName %>): Observable<Model<%= capSchemaName %>> {
        const url = this.api.NormalizeEndpoint(`api/${this.endPoint}/${id}`);
        return this.http
            .put<ApiResponse<Model<%= capSchemaName %>>>(
                url,
                JSON.stringify({
                    data: data
                }),
                this.api.httpOptions
            )
            .pipe(
                map(mdata => {
                    return mdata.data;
                })
            );
    }

    Delete(id: string): Observable<any> {
        const url = this.api.NormalizeEndpoint(`api/${this.endPoint}/${id}`);
        return this.http.delete<any>(url, this.api.httpOptions).pipe(
            map(mdata => {
                return mdata.data;
            })
        );
    }


    Search(
        searchStr: string,
        skip: Number = 0,
        limit: Number = 100
    ): Observable<Model<%= capSchemaName %>[]> {
        const url = this.api.NormalizeEndpoint(
            `api/${
                this.endPoint
            }s/search?keyword=${searchStr}&skip=${skip}&limit=${limit}`
        );
        return this.http
            .get<ApiResponseList<Model<%= capSchemaName %>>>(url, this.api.httpOptions)
            .pipe(
                map(data => {
                    return data.data.data;
                })
            );
    }

    SearchAdvanced(
        searchObj: any,
        skip: Number = 0,
        limit: Number = 100
    ): Observable<Model<%= capSchemaName %>[]> {
        const url = this.api.NormalizeEndpoint(
            `api/${this.endPoint}s/search?skip=${skip}&limit=${limit}`
        );
        return this.http
            .post<ApiResponseList<Model<%= capSchemaName %>>>(
                url,
                JSON.stringify({
                    data: searchObj
                }),
                this.api.httpOptions
            )
            .pipe(
                map(data => {
                    return data.data.data;
                })
            );
    }
}
