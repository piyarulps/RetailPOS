import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig, MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
// import { webSocket } from 'rxjs/webSocket';
// const wsSubject = webSocket("ws://localhost:2752");

import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from '../modules/ui/confirm-dialog/confirm-dialog.component';
import { Globals } from '../globals';

export interface PublishData {
	identifier: string;
	mac: string;
	method: string;
	url: string;
	data: any;
	moduleName: string;
}

// Functions from custom.js (js included in angular.json)
declare function setTitleBar(params: any): void;
declare function getMac();
declare function saveLog(params: any): void;
declare function doPrint(params: any): void;
// Functions from p2p_connection.js (js included in angular.json)
declare function publish(params: any): void;

@Injectable({
	providedIn: 'root'
})
export class HelperService {

	myResponse: any;
	notifyConfig = new MatSnackBarConfig();
	dialogConfig = new MatDialogConfig();
	myMAC: any;
	publishData: PublishData;
	public moduleName: string;
	nonPublishableLinks: any = ['loginapi', 'pos-signon', 'item-purchase', 'check-database-latest'];
	nonPublishableModules: any = ['']; // Keep a blank value and add other module names

	// localUrl: string = 'http://192.168.0.107:52878/';
	localUrl: string = environment.localUrl;

	constructor(
		private _http: HttpClient,
		private _snackBar: MatSnackBar,
		private _dialog: MatDialog,
		private _globals: Globals
	) {
		this.notifyConfig.verticalPosition = 'bottom';
		this.notifyConfig.horizontalPosition = 'center';
		if (getMac()) {
			this.myMAC = getMac();
		}
		// wsSubject.subscribe(
		// 	(data: any) => {
		// 		// console.log('ws received data', data);
		// 		if (typeof data.message != 'undefined') {
		// 			this.notify({ message: data.message });
		// 		}
		// 	}, // Called whenever there is a message from the server.
		// 	err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
		// 	() => console.log('complete') // Called when connection is closed (for whatever reason).
		// );
	}

	getCientData({ dataIndex, isParse = false }: { dataIndex: string; isParse: boolean; }) {
		let value = localStorage.getItem(dataIndex);
		if (typeof value != 'undefined' && value != null && value != '' && value != undefined) {
			if (isParse) {
				return this.isJsonString(value) ? JSON.parse(value) : false;
			}
			else {
				return value;
			}
		}
		else {
			return false;
		}
	}

	setCientData({ dataIndex, data, isJsonToString = false }: { dataIndex: string; data: any; isJsonToString: boolean; }) {
		localStorage.setItem(dataIndex, isJsonToString ? JSON.stringify(data) : data);
	}

	handleError(methodName, requestData) {
		console.log(methodName, requestData);
	}

	apiRequest(method: string, url: string, params): Observable<any> {
		return this._http.request<any>(method, url, params)
			.pipe(
				catchError(params)
			);
	}

	apiPost(params, url: string): Observable<any> {
		// console.log('requestData', requestData);
		return this._http.post<any>(url, JSON.stringify(params))
			.pipe(
				catchError(params)
			);
	}

	apiGet(url: string): Observable<any> {
		return this._http.get<any>(url)
			.pipe();
	}

	apiPut(params, url): Observable<any> {
		var httpHeaders = new HttpHeaders();
		httpHeaders.append('Content-Type', 'application/json');
		return this._http.put(url, JSON.stringify(params), { headers: httpHeaders });
	}

	// Functions to call local server API start
	apiRequestLocal(method: string, url: string, params): Observable<any> {
		return this._http.request<any>(method, this.localUrl + url, params)
			.pipe(
				map(
					response => {
						this.preparePublish({ method: method, url: url, params: params });
						return response;
					}
				),
				catchError(params)
			);
	}

	apiPostLocal(params, url: string): Observable<any> {
		return this._http.post<any>(this.localUrl + url, JSON.stringify(params))
			.pipe(
				map(
					response => {
						this.preparePublish({ method: 'POST', url: url, params: params });
						return response;
					}
				),
				catchError(params)
			);
	}

	apiGetLocal(url: string): Observable<any> {
		return this._http.get<any>(this.localUrl + url)
			.pipe();
	}

	apiPutLocal(params, url): Observable<any> {
		var httpHeaders = new HttpHeaders();
		httpHeaders.append('Content-Type', 'application/json');
		return this._http.put(this.localUrl + url, JSON.stringify(params), { headers: httpHeaders }).pipe(
			map(
				response => {
					this.preparePublish({ method: 'PUT', url: url, params: params });
					return response;
				}
			),
			catchError(params)
		);
	}
	// Functions to call local server API end

	async preparePublish({ method, url, params }: { method: string; url: string; params: object }) {
		if (await this.isPublishable(url, this.moduleName)) {
			this.publishData = {
				mac: this.myMAC,
				identifier: '',
				method: method.toUpperCase(),
				url: url,
				data: params,
				moduleName: this.moduleName
			}
			publish(this.publishData);
		}
	}

	async isPublishable(url, moduleName) {
		if (this.nonPublishableModules.includes(moduleName)) {
			return false;
		}
		else {
			let isMatchFound: boolean = false;
			await this.nonPublishableLinks.forEach(element => {
				if (url.search(element) >= 0) {
					isMatchFound = true;
				}
			});
			return !isMatchFound;
		}
	}

	findDB() {
		this.apiGetLocal('check-database-latest').subscribe(
			response => {
				if (typeof response.status != 'undefined' && response.status == 0) {
					this.publishData = {
						mac: this.myMAC,
						identifier: '',
						method: 'FINDING_DB',
						url: '',
						data: '',
						moduleName: ''
					}
					publish(this.publishData);
				}
			}
		)
	}

	showSuccess(msg) {
		alert(msg);
	}

	showError(msg) {
		alert(msg);
	}

	public notify({ message, messageType = 1 }: { message: string; messageType?: number; }): void {
		this.notifyConfig.panelClass = messageType == 1 ? 'success' : 'error';
		this.notifyConfig.duration = messageType == 1 ? 2000 : 4000;
		this._snackBar.open(message, messageType == 1 ? '' : 'Close', this.notifyConfig);
	}

	public confirmDialog(data: any = {}): Observable<any> {
		// console.log('data', data);
		this.dialogConfig.panelClass = 'del-pop';
		this.dialogConfig.data = data;
		let dialogRef: MatDialogRef<ConfirmDialogComponent>;
		dialogRef = this._dialog.open(ConfirmDialogComponent, this.dialogConfig);
		return dialogRef.afterClosed();
	}

	public validateTerminalItemQty(event) {
		// console.log('validateTerminalItemQty event', event);
		// console.log('validateTerminalItemQty event.key', event.key);
		// console.log('validateTerminalItemQty parseInt(event.key)', parseInt(event.key));
		// console.log('validateTerminalItemQty event.target.value', event.target.value);
		// console.log('validateTerminalItemQty parseInt(event.target.value)', parseInt(event.target.value));
		// console.log('validateTerminalItemQty event.target.value.length', event.target.value.length);
		if (
			typeof event.keyCode != 'undefined' &&
			(
				(event.keyCode >= 48 && event.keyCode <= 57) ||
				(event.keyCode >= 96 && event.keyCode <= 105) ||
				event.keyCode == 8 || event.keyCode == 46
			)
		) {
			if (
				(event.target.value == '' || !parseInt(event.target.value)) &&
				event.key == '0' && parseInt(event.key) == 0
			) {
				this.notify({ message: 'Enter a valid quantity', messageType: 0 });
				return false;
			}
			else if (
				event.target.value.length == 1 &&
				(event.keyCode == 8 || event.keyCode == 46)
			) {
				this.notify({ message: 'Enter a valid quantity', messageType: 0 });
			}
		}
		else {
			return false;
		}
	}

	public validateTerminalDecimal(event) {
		// console.log('validateTerminalItemQty event', event);
		if (
			typeof event.keyCode != 'undefined' &&
			(
				(event.keyCode >= 48 && event.keyCode <= 57) ||
				(event.keyCode >= 96 && event.keyCode <= 105) ||
				event.keyCode == 8 || event.keyCode == 46 ||
				event.keyCode == 110 || event.keyCode == 190
			)
		) {
			// if (
			// 	(event.target.value == '' || !parseInt(event.target.value)) &&
			// 	event.key == '0' && parseInt(event.key) == 0
			// ) {
			// 	this.notify({ message: 'Enter a valid amount', messageType: 0 });
			// 	return false;
			// }
			// else
			if (
				event.target.value.length == 1 &&
				(event.keyCode == 8 || event.keyCode == 46)
			) {
				this.notify({ message: 'Enter a valid amount', messageType: 0 });
			}
		}
		else {
			return false;
		}
	}

	public defaultCurrency() {
		return this._globals.CURRENCY;
	}

	public defaultCurrencyCode() {
		return this._globals.CURRENCY_CODE;
	}

	public dtISO() {
		let now = new Date();
		return now.toISOString();
	}

	public deviceDetails(): Observable<any> {
		return this.apiGetLocal('device_details').pipe(
			map(
				data => {
					return data;
				}
			)
		);
	}

	public getCurrentDateTime() {
		var today = new Date();
		var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateTime = date + ' ' + time;
		return {
			date: date,
			time: time,
			dateTime: dateTime.toString()
		};
	}

	public setTitle(params) {
		setTitleBar(params);
	}

	public setPOSLog(params) {
		saveLog(params);
	}

	public isJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	public encryptCodes(content, passcode: string = this._globals.PASSCODE) {
		content = JSON.stringify(content);
		var result = []; var passLen = passcode.length;
		for (var i = 0; i < content.length; i++) {
			var passOffset = i % passLen;
			var calAscii = (content.charCodeAt(i) + passcode.charCodeAt(passOffset));
			result.push(calAscii);
		}
		return JSON.stringify(result);
	}

	public decryptCodes(content, passcode: string = this._globals.PASSCODE) {
		var result = []; var str = '';
		var codesArr = JSON.parse(content); var passLen = passcode.length;
		for (var i = 0; i < codesArr.length; i++) {
			var passOffset = i % passLen;
			var calAscii = (codesArr[i] - passcode.charCodeAt(passOffset));
			result.push(calAscii);
		}
		for (var i = 0; i < result.length; i++) {
			var ch = String.fromCharCode(result[i]); str += ch;
		}
		return JSON.parse(str);
	}

	public timeDiff(fromDateTime, toDateTime) {
		fromDateTime = new Date(fromDateTime);
		toDateTime = new Date(toDateTime);
		if (toDateTime < fromDateTime) {
			toDateTime.setDate(toDateTime.getDate() + 1);
		}
		let diff: any = toDateTime - fromDateTime;
		let msec: number = diff;
		let hh = Math.floor(msec / 1000 / 60 / 60);
		// msec -= hh * 1000 * 60 * 60;
		let mm: number = Math.floor(msec / 1000 / 60);
		// msec -= mm * 1000 * 60;
		let ss: number = Math.floor(msec / 1000);
		// msec -= ss * 1000;
		return {
			hours: hh,
			seconds: ss,
			minutes: mm,
			miliSeconds: diff
		}
	}

	doPrint(orderDetails) {
		doPrint(orderDetails);
	}

	colorClasses(myLength: number) {
		let colors: any = this._globals.COLOR_SET.sort(() => Math.random() - 0.5);
		let temp: any = [];
		let colorsIndex: number = 0;
		for (let index = 0; index < myLength; index++) {
			if (typeof colors[colorsIndex] == 'undefined') colorsIndex = 0;
			temp.push(colors[colorsIndex]);
			colorsIndex++;
		}
		// console.log('colorClasses', myLength, temp);
		return temp;
	}

}
