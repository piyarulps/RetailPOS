import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperService } from './helper.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private _currentUserSubject: BehaviorSubject<any>;
	public _currentUser: Observable<any>;

	constructor(
		private _http: HttpClient,
		private _helper: HelperService
	) {
		// localStorage.clear();
		this._currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
		this._currentUser = this._currentUserSubject.asObservable();
	}

	public get currentUserValue(): any {
		return this._currentUserSubject.value;
	}

	login(accessCode: string, userId: string) {
		const requestBody = {
			AccessPassword: accessCode,
			UserId: userId
		};
		// return this._http.post<any>('rposlogin/', JSON.stringify(requestBody))
		return this._http.post<any>(`${environment.localUrl}loginapi/`, requestBody)
			// return this._helper.apiPostLocal(requestBody, 'loginapi/')
			.pipe(map(response => {
				if (response.message) {
					this._helper.notify({ message: response.message, messageType: response.status });
				}
				if (response.status == 1 && response.token) {
					// fake start
					// this._helper.apiGetLocal('itemsync/').subscribe(
					// 	res => { },
					// 	error => console.log('error', error)
					// );
					// fake end
					response.token = `Token ${response['token']}`;
					localStorage.setItem('currentUser', JSON.stringify(response));
					this._currentUserSubject.next(response);
				}
				else if (response.status == 2) {
					return response;
				}
			}));
	}

	logout() {
		let currentUserString: any = localStorage.getItem('currentUser');
		if (typeof currentUserString != 'undefined' && currentUserString != null && JSON.parse(currentUserString)) {
			// let currentUser: Object = JSON.parse(currentUserString);
			this._helper.apiGetLocal('logout/').subscribe(
				res => {
					// console.log('logout response', res);
					if (res.status == 1 && typeof res.ElasticParameters != 'undefined') {
						this._helper.setPOSLog(res.ElasticParameters);
					}
				},
				error => console.log('error', error)
			);
		}
		// logging out
		localStorage.removeItem('currentUser');
		//localStorage.removeItem('signOnData');
		localStorage.removeItem('userDevices');
		localStorage.removeItem('isSyncing');
		this._currentUserSubject.next(null);
	}
}
