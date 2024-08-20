import { Component, OnInit, HostListener, ElementRef, ViewChild, OnChanges, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { HelperService } from './../../services/helper.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { Globals } from '../../globals';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges {

	// @ViewChild('userIdInput') userIdInputField: ElementRef;
	// @ViewChild('passwordInput') passwordInputField: ElementRef;
	// @ViewChild('oldPasswordInput') oldPasswordInputField: ElementRef;
	// @ViewChild('newPasswordInput') newPasswordInputField: ElementRef;
	returnUrl: string;
	error = '';
	allowedKeys: any = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	eventType: string = 'userId';
	eventModel: any = 'userId';
	userId: string = '1234';
	password: string = '5678';
	accessCode: string = '';
	oldPassword: string = '';
	newPassword: string = '';
	loginHeading: string = 'Enter Your User ID';
	resetHeading: string = 'Change Password';
	activeView: string = 'login';
	activeSubView: string = 'userId';

	constructor(
		private _helper: HelperService,
		private _router: Router,
		private _authenticationService: AuthenticationService,
		private _globals: Globals
	) { }

	deviceDetails() {
		this._helper.deviceDetails().subscribe(
			res => {
				console.log('devices res', res);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	toArray(currentModel) {
		let myString: string = this[currentModel];
		let myArray: any = myString.split('');
		for (let index = 0; index <= 3; index++) {
			if (typeof myArray[index] == 'undefined') {
				myArray[index] = '';
			}
		}
		return myArray;
	}

	manageView(view: string, subView: string) {
		this.activeView = view;
		this.activeSubView = subView;
		// console.log('manageView hit', this.activeView, this.activeSubView);
		setTimeout(() => {
			if (this.activeView == 'login') {
				if (this.activeSubView == 'userId') {
					this.loginHeading = 'Enter your User ID';
					// this.userId = '';
					this.eventType = 'userId';
					this.eventModel = 'userId';
				}
				else if (this.activeSubView == 'password') {
					this.loginHeading = 'Enter your Password';
					// this.password = '';
					this.eventType = 'password';
					this.eventModel = 'password';
				}
				else if (this.activeSubView == 'accessCode') {
					this.loginHeading = 'Enter your access code';
					// this.password = '';
					this.eventType = 'accessCode';
					this.eventModel = 'accessCode';
				}
			}
			else if (this.activeView == 'resetPassword') {
				// this.oldPassword = '';
				// this.newPassword = '';
				if (this.activeSubView == 'userId') {
					this.loginHeading = 'Enter your User ID';
					// this.userId = '';
					this.eventType = 'userId';
					this.eventModel = 'userId';
				}
				else if (this.activeSubView == 'oldPassword') {
					this.loginHeading = 'Enter your Old Password';
					// this.oldPassword = '';
					this.eventType = 'password';
					this.eventModel = 'oldPassword';
				}
				else if (this.activeSubView == 'newPassword') {
					this.loginHeading = 'Enter your New Password';
					// this.newPassword = '';
					this.eventType = 'password';
					this.eventModel = 'newPassword';
				}
			}
			// console.log('manageView after', this.activeView, this.activeSubView);
		}, 100);
	}

	ignoreFocus(event) {
		// console.log('ignoreFocus event', event);
		event.stopImmediatePropagation();
		event.preventDefault();
	}

	doManage() {
		// console.log('doManage', this.activeView, this.activeSubView);
		if (this.activeView == 'login') {
			if (this.activeSubView === 'userId') {
				if (this.userId.length >= 4 && this.userId.length <= 8) {
					this.manageView('login', 'password');
				}
				else {
					this._helper.notify({ message: "Please enter valid User ID.", messageType: 0 });
				}
			}
			else if (this.activeSubView == 'accessCode') {
				if (this.accessCode.length == 6) {
					this.tryLogin();
				}
				else {
					this._helper.notify({ message: "Please enter 6 digit access code.", messageType: 0 });
				}
			}
			else {
				this.tryLogin();
			}
		}
		else if (this.activeView == 'resetPassword') {
			if (this.activeSubView === 'userId') {
				if (this.userId.length >= 4 && this.userId.length <= 8) {
					this.manageView('resetPassword', 'oldPassword');
				}
				else {
					this._helper.notify({ message: "Please enter valid User ID.", messageType: 0 });
				}
			}
			else if (this.activeSubView === 'oldPassword') {
				if (this.oldPassword.length >= 4 && this.oldPassword.length <= 10) {
					this.manageView('resetPassword', 'newPassword');
				}
				else {
					this._helper.notify({ message: "Please enter valid old password.", messageType: 0 });
				}
			}
			else {
				this.resetPassword();
			}
		}
	}

	validateNumber(event) {
		if (!parseInt(event.key) && event.keyCode != 8 && event.keyCode != 46 && event.key != 'Tab') return false;
	}

	typeCheck(type: string, model: any) {
		this.eventType = type;
		this.eventModel = model;
	}

	enterAccessCode(enteredDigit: string) {
		if (this.eventType === 'userId' && this.userId.length === 8) {
			return false;
		}
		if (this.eventType === 'password' && this.password.length === 10) {
			return false;
		}
		if (this.eventType != '' && this.eventModel != '') {
			this[this.eventModel] += enteredDigit;
		}
		// console.log('enter', this.eventModel, this[this.eventModel]);
	}


	removeAccessCode() {
		if (this.eventType != '' && this.eventModel != '') {
			var temp = this[this.eventModel];
			if (temp.length) {
				this[this.eventModel] = temp.substr(0, temp.length - 1);
			}
		}
		// console.log('remove', this.eventModel, this[this.eventModel]);
	}

	tryLogin() {
		// this.manageView('login', 'accessCode'); return;
		if (this.userId.length >= 4 && this.userId.length <= 8 && this.password.length >= 4 && this.password.length <= 10) {
			const loginData = {
				accessCode: this.password,
				UserId: this.userId
			}
			this._authenticationService.login(this.password, this.userId)
				.pipe(first())
				.subscribe(
					data => {
						if (data && data.status == 2) {
							this.manageView('resetPassword', 'userId');
						}
						if (data && data.status == 3) {
							this.manageView('login', 'accessCode');
						}
						else {
							this._router.navigate([this.returnUrl]);
						}
					},
					error => {
						this.error = error;
					});
		} else {
			this._helper.notify({ message: "Please enter valid User ID and Password.", messageType: 0 });
		}
	}

	resetPassword() {
		if (this.userId.length < 4 || this.userId.length > 8) {
			this._helper.notify({ message: "Please enter valid User ID.", messageType: 0 });
		}
		else if (this.oldPassword.length < 4 || this.oldPassword.length > 10) {
			this._helper.notify({ message: "Please enter valid old password.", messageType: 0 });
		}
		else if (this.newPassword.length < 4 || this.newPassword.length > 10) {
			this._helper.notify({ message: "Password length should be within 4 to 10 digits.", messageType: 0 });
		}
		else {
			let postData = {
				UserId: this.userId,
				OldPassword: this.oldPassword,
				NewPassword: this.newPassword
			}
			this._helper.apiPost(postData, 'password-change-transaction/').subscribe(
				res => {
					if (res.message) {
						this._helper.notify({ message: res.message, messageType: res.status });
					}
					if (res.status == 1) {
						this.manageView('login', 'userId');
					}
					else {
						this.oldPassword = '';
						this.newPassword = '';
					}
				},
				error => console.log('error', error)
			);
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		console.log('changes', changes);
	}

	ngOnInit() {
		// reset login status
		this._authenticationService.logout();
		// get return url from route parameters or default to '/'
		// this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
		this.returnUrl = '/dashboard';
		this.deviceDetails();
		// this._helper.apiGetLocal('share-database/').subscribe(
		// 	response => {
		// 		console.log('share-database response', response)
		// 	},
		// 	error => {
		// 		console.log('share-database error', error)
		// 	}
		// )

		this._helper.setTitle({ section: 'login', title: `Login - ${this._globals.APP_NAME}` });
	}

	@HostListener('window:keyup', ['$event'])
	keyEvent(event: KeyboardEvent) {
		// this.allowedKeys.forEach(value => {
		// 	if (event.key == value) {
		// 		this.enterAccessCode(event.key);
		// 		return false;
		// 	}
		// });
		if (this.allowedKeys.includes(event.key)) {
			this.enterAccessCode(event.key);
			return false;
		}
		if (event.key == 'Backspace') {
			this.removeAccessCode();
			return false;
		}
		else if (event.key == 'Enter') {
			this.doManage();
		}
	}

}
