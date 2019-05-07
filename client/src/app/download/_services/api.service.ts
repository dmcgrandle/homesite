import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';

import { AuthService } from '../../user/_services/auth.service';

import { DlFile, FilenameChangedObj } from '../_helpers/classes';

@Injectable({ providedIn: 'root' })
export class APIService {
    that = this;

    constructor(private http: HttpClient, private auth: AuthService) {}

    public authGetDownloads(): Observable<DlFile[]> {
        return this.http.get<DlFile[]>('/api/downloads/list');
    }

    public downloadFile(file: DlFile): Observable<HttpEvent<any>> {
        const options = { responseType: 'blob', reportProgress: true };
        const req = new HttpRequest('GET', file.fullPath, options);
        return this.http.request(req);
    }

    public uploadFile(file: File): Observable<HttpEvent<any>> {
        // Note - this returns an EVENT, so we can track progress
        console.log('file is', file);
        const formData = new FormData();
        formData.append('upload', file);
        const params = new HttpParams();
        const options = { params: params, reportProgress: true };
        const req = new HttpRequest('POST', '/api/downloads/upload', formData, options);
        return this.http.request(req);
    }

    public deleteFile(file: DlFile): Observable<DlFile> {
        return this.http.delete<DlFile>('/api/downloads/' + file.filename);
    }

    public renameFile(filenameChangedObj: FilenameChangedObj): Observable<DlFile> {
        return this.http.post<DlFile>('/api/downloads/rename', filenameChangedObj);
    }

    public lastLoggedInUserLevel(): number {
        return this.auth.lastLoggedInUserLevel();
    }
}
