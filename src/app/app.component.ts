import { Component } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ConnectionService } from 'ng-connection-service';
import { Router } from '@angular/router';

import { AuthenticationService } from './services/authentication.service';
import { HelperService } from './services/helper.service';
import { Globals } from './globals';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    isOnline: boolean = false;
    moduleAPI_brand: string = 'itemapis/brands/';
    moduleAPI_size: string = 'itemapis/sizes/';
    connection: any;
    err: any;
    identifierLength: number = 32;
    syncModules: any = [];
    syncedModules: any = [];
    syncModuleLinks: any = {};
    syncIndex: number = 0;
    constructor(
        public _connectionService: ConnectionService,
        public _helper: HelperService,
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _hotkeysService: HotkeysService,
        private _globals: Globals
    ) {
        this._connectionService.monitor().subscribe(isConnected => {
            this.isOnline = isConnected;
            console.log('App online status', this.isOnline);
        });
        this._hotkeysService.add(new Hotkey(this._globals.SKEY_DASHBOARD, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.goToDashboard();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false;
            return e;
        }, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
        this._hotkeysService.add(new Hotkey(this._globals.SKEY_LOGOUT, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.logout();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false;
            return e;
        }, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
        // this.setIdentifier(this.identifierLength);
        // localStorage.clear();
        localStorage.removeItem('currentUser');
        this.setAutoUpdate();
    }

    setAutoUpdate() {
        this._helper.apiGetLocal('modulelists').subscribe(
            async (data) => {
                await data.forEach(element => {
                    this.syncModuleLinks[element.ModuleName] = {
                        DownloadingApi: element.DownloadingApi,
                        DisplayModuleName: element.DisplayModuleName
                    };
                });
                // console.log('syncModuleLinks', this.syncModuleLinks);
                setInterval(() => {
                    if (typeof localStorage.getItem('syncRecord') != 'undefined' && localStorage.getItem('syncRecord') != null && localStorage.getItem('syncRecord') != '') {
                        this.syncedModules = JSON.parse(localStorage.getItem('syncRecord'));
                        // console.log('syncedModules', this.syncedModules);
                    }
                    this.syncIndex = 0;
                    this.syncModules = [];
                    this._helper.apiGetLocal('check-server-update').subscribe(
                        async (response) => {
                            for (let obj in response) {
                                if (response.hasOwnProperty(obj)) {
                                    if (response[obj] > 0 && this.syncedModules.includes(obj)) {
                                        this.syncModules.push({
                                            ModuleName: obj,
                                            DownloadingApi: this.syncModuleLinks[obj].DownloadingApi,
                                            DisplayModuleName: this.syncModuleLinks[obj].DisplayModuleName,
                                            DataCount: response[obj]
                                        });
                                    }
                                }
                            }
                            // console.log('syncModules', this.syncModules);
                            this.doUpdate();
                        },
                        error => console.log('check-server-update error', error)
                    )
                }, 1000 * 60 * 10);
            }
        );
    }

    doUpdate() {
        // localStorage.setItem('isSyncing', 'isSyncing ');
        if (this.syncModules.length) {
            if (typeof this.syncModules[this.syncIndex] != 'undefined') {
                this._helper.apiGetLocal(this.syncModules[this.syncIndex].DownloadingApi).subscribe(
                    res => {
                        this._helper.notify({ message: this.syncModules[this.syncIndex].DataCount + ' ' + this.syncModules[this.syncIndex].DisplayModuleName + ' synced with server.' })
                        this.syncIndex++;
                        this.doUpdate();
                    },
                    error => {
                        console.log('error', error);
                    }
                );
            }
            else {
                // this._helper.apiGetLocal('backup-database').subscribe(
                //     (response) => {
                //         console.log('backup-database', response);
                //     },
                //     error => console.log('backup-database error', error)
                // )
            }
        }
    }

    setIdentifier(length: number) {
        if (typeof localStorage.getItem('identifier') == 'undefined' || localStorage.getItem('identifier') == null || localStorage.getItem('identifier') == '') {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            localStorage.setItem('identifier', result);
            return result;
        }
        else {
            return false;
        }
    }

    goToDashboard() {
        this._router.navigate(['/dashboard']);
    }

    logout() {
        this._authenticationService.logout();
        this._router.navigate(['/login']);
    }
}
