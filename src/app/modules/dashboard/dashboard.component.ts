import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material';

import { Globals } from '../../globals';
import { HelperService } from '../../services/helper.service';
import { DeviceManageComponent } from '../sale-mode/dialogs/device-manage/device-manage.component';
import { UnlockComponent } from '../dialogs/unlock/unlock.component';
// import { ObEntryComponent } from '../sale-mode/dialogs/ob-entry/ob-entry.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	userName: string = '';
	devices: any = [];
	userDevices: any = {};
	currentUser: any = {};
	hasOpeningBalance: boolean = false;
	navigatingTo: any = {
		saleMode: false,
		nonSaleMode: false,
		reportMode: false,
		managerMode: false,
		adminMode: false,
	};

	constructor(
		private _hotkeysService: HotkeysService,
		private _globals: Globals,
		private _router: Router,
		private _helper: HelperService,
		private _dialog: MatDialog,
		private _authenticationService: AuthenticationService,
	) {
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_ADMIN_MODE, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			// this._router.navigate(['admin-mode/items']);
			this.enterAdminMode();
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			return e;
		}, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_SALE_MODE, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			// this._router.navigate(['sale-mode/terminal']);
			this.enterSaleMode();
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			return e;
		}, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
	}

	chooseDevice(data: any = {}, preSetData?: any): Observable<any> {
		// console.log('data', data);
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'del-pop';
		dialogConfig.data = { data: data, preSetData: preSetData };
		let dialogRef: MatDialogRef<DeviceManageComponent>;
		dialogRef = this._dialog.open(DeviceManageComponent, dialogConfig);
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	unlock(data: any = {}, preSetData?: any): Observable<any> {
		// console.log('data', data);
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'del-pop';
		dialogConfig.data = { data: data, preSetData: preSetData };
		let dialogRef: MatDialogRef<UnlockComponent>;
		dialogRef = this._dialog.open(UnlockComponent, dialogConfig);
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	// openingBalance(data: any = {}, preSetData?: any): Observable<any> {
	// 	// console.log('data', data);
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'del-pop';
	// 	dialogConfig.data = { data: data, preSetData: preSetData };
	// 	let dialogRef: MatDialogRef<ObEntryComponent>;
	// 	dialogRef = this._dialog.open(ObEntryComponent, dialogConfig);
	// 	dialogRef.disableClose = true;
	// 	return dialogRef.afterClosed();
	// }

	enterAdminMode() {
		setTimeout(() => {
			this._router.navigate(['admin-mode/items']);
		}, 1500);
	}

	enterSaleMode() {
		// this._router.navigate(['ob-entry']); return;
		if (this.currentUser.isLocked) {
			this._helper.notify({ message: 'Enter password to continue.' });
			let popUpData: any = {
				title: 'Enter Password'
			};
			this.unlock(popUpData).subscribe(
				res => {
					// console.log('res', res);
					if (res && typeof res.status != 'undefined' && res.status) {
						this.currentUser.isLocked = false;
						localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
						let temp: any = sessionStorage.getItem('terminalData');
						if (typeof temp != 'undefined' && temp != null && this._helper.isJsonString(temp)) {
							let terminalData: any = JSON.parse(temp);
							terminalData.unlockedTime = new Date();
							// console.log('dashboard terminalData', terminalData);
							sessionStorage.setItem('terminalData', JSON.stringify(terminalData));
						}
						this.enterSaleMode();
					}
				},
				error => console.log('error', error)
			);
		}
		else {
			if (!this.hasOpeningBalance) {
				this._helper.notify({ message: 'Enter Opening Balance to continue.' });
				// let popUpData: any = {
				// 	title: 'Enter Opening Balance'
				// };
				// this.openingBalance(popUpData).subscribe(
				// 	res => {
				// 		// console.log('res', res);
				// 		if (res && typeof res.status != 'undefined' && res.status) {
				// 			this.hasOpeningBalance = true;
				// 			this.enterSaleMode();
				// 		}
				// 	},
				// 	error => console.log('error', error)
				// );
				this._router.navigate(['ob-entry']);
			}
			else {
				this.navigatingTo.saleMode = true;
				setTimeout(() => {
					this._router.navigate(['sale-mode/terminal']);
				}, 1500);
			}
		}
		// User can't enter sale mode if scanner is not connected
		// if (this.userDevices.hasOwnProperty('scanner') && this.userDevices.scanner != '') {
		// 	this._router.navigate(['sale-mode/terminal']);
		// }
		// else {
		// 	let popUpData: any = {
		// 		type: 'scanner',
		// 		title: this._globals.APP_NAME,
		// 		message: 'Choose the device you will use to scan barcode. If your device is not listed, please re-attach the device and login again.'
		// 	};
		// 	this.chooseDevice(popUpData).subscribe(
		// 		res => {
		// 			if (res && typeof res.device != 'undefined') {
		// 				this.userDevices.scanner = res.device;
		// 				localStorage.setItem('userDevices', JSON.stringify(this.userDevices));
		// 				this.enterSaleMode();
		// 			}
		// 		},
		// 		error => console.log('error', error)
		// 	);
		// }
	}

	logout() {
		this._authenticationService.logout();
		this._router.navigate(['/login']);
	}

	ngOnInit() {
		// localStorage.removeItem('IsDownloadedForLocalNetworkPurpose');
		// this._helper.findDB();
		let currentUserString = localStorage.getItem('currentUser');
		this.currentUser = JSON.parse(currentUserString);
		this.userName = this.currentUser.name;
		let savedUserDevices = localStorage.getItem('userDevices');
		if (typeof savedUserDevices != 'undefined' && savedUserDevices != null && JSON.parse(savedUserDevices)) {
			this.userDevices = JSON.parse(savedUserDevices);
		}
		this._helper.apiGetLocal('check-till-balance').subscribe(
			response => {
				if (response.status == 1) {
					let savedSignOnData = localStorage.getItem('signOnData');
					if (typeof savedSignOnData != 'undefined' && savedSignOnData != null && JSON.parse(savedSignOnData)) {
						this.hasOpeningBalance = true;
					}
					// this.hasOpeningBalance = true;
				}
			}
		);
		this._helper.apiGetLocal('denomination-download').subscribe(
			response => { }
		);

		this._helper.setTitle({ section: 'dashboard', title: `Dashboard - ${this._globals.APP_NAME}` });
	}
}
