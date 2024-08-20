import { Injectable } from '@angular/core';
// import { ErrorDialogService } from '../error-dialog/errordialog.service';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HelperService } from "../services/helper.service";
import { Globals } from "../globals";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    // public errorDialogService: ErrorDialogService
    constructor(
        private _globals: Globals,
        private _helper: HelperService
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const apiURL: string = 'http://httpbin.org/';
        const apiURL: string = environment.mainUrl;
        // const apiURL: string = 'http://192.168.0.167:8080/irsbackend/';

        let reqUrl: string = request.url;
        let spy: string = environment.localUrl;
        // console.log(reqUrl.search(spy));
        if (reqUrl.search(spy) >= 0) {
            if (this._globals.ENABLE_ENCRYPTION) {
                if (request.method.toLowerCase() == 'put' || request.method.toLowerCase() == 'post') {
                    let requestEncrypt: any = this._helper.encryptCodes(request.body);
                    request = request.clone({ body: requestEncrypt });
                }
            }
        }
        else {
            request = request.clone({ url: apiURL + request.url });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        if (!request.headers.has('Accept')) {
            request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                    if (this._globals.ENABLE_ENCRYPTION) {
                        let responseDecrypt: any = this._helper.decryptCodes(JSON.stringify(event.body));
                        if (this._helper.isJsonString(responseDecrypt)) {
                            responseDecrypt = JSON.parse(responseDecrypt);
                        }
                        event = event.clone({ body: responseDecrypt });
                    }
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                data = {
                    reason: error && error.error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                // console.log('error--->>>', data);
                return throwError(error);
            }));
    }
}