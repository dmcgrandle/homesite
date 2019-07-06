import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FileDownloadComponent } from 'shared/file-download/file-download.component';
import { APIService } from '../_services/api.service';
import { DlFile } from '../_helpers/classes';

@Component({
  selector: 'download-get-file',
  templateUrl: './get-file.component.html',
  styleUrls: ['./get-file.component.scss']
})
export class GetFileComponent implements OnInit, AfterViewInit {
    dlFilename = 'none';
    file: DlFile;
    fileToDownload$: Observable<HttpEvent<any>>;

    @ViewChild(FileDownloadComponent) private fileDownloadChild: FileDownloadComponent;

    constructor(
        public api: APIService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        // Set up the observable which is passed to FileDownloadComponent to get the download parameter
        // from the router and use that to create a DlFile object, then retrieve it using the api service.
        this.fileToDownload$ = this.route.paramMap.pipe(
            switchMap(params => {
                this.dlFilename = params.get('download');
                if (this.dlFilename) {
                    this.file = {
                        fullPath: `/protected/downloads/${this.dlFilename}`,
                        filename: this.dlFilename
                    } as DlFile;
                    return this.api.downloadFile(this.file);
                } else {
                    return throwError(new Error('No download name given in url'));
                }
            })
        );
    }

    ngAfterViewInit() {
        // call the component's click method programatically but wait a tick to avoid devMode
        // error for changing this.file within observable above inside child during same tick.
        setTimeout(() => this.fileDownloadChild.onClick(), 0);
    }

    finished() {
        this.router.navigate(['/download']);
    }

}
