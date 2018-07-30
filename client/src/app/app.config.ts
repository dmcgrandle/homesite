import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IAppConfig } from './app.config.model';

@Injectable()
export class AppConfig {

    public const :IAppConfig;

    constructor(private http: HttpClient) {}

    load() {
        const jsonFile = `assets/config/config.${environment.confName}.json`;
        return new Promise<void>((resolve, reject) => { 
            this.http.get(jsonFile).subscribe(
                (res) => {
                    this.const = <IAppConfig>res;
                    resolve();
                },
                (err) => reject('Could not load file ' + jsonFile + ': ' + JSON.stringify(err))
            )
        });
    }
}
