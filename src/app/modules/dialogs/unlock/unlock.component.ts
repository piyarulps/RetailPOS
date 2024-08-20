import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HelperService } from '../../../services/helper.service';

@Component({
	selector: 'app-unlock',
	templateUrl: './unlock.component.html',
	styleUrls: ['./unlock.component.scss']
})
export class UnlockComponent implements OnInit {

	@ViewChild('passwordInput') passwordInputField: ElementRef;

	message: string;
	dialogData: any = {};
	dialogTitle: string = "";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Unlock";
	btnUpdateTxt: string = "Unlock";
	isbtnLoaderShow = false;
	myForm: FormGroup;
	submitted: boolean = false;

	constructor(
		public _helper: HelperService,
		private _formBuilder: FormBuilder,
		public _hotkeysService: HotkeysService,
		public _dialogRef: MatDialogRef<UnlockComponent>,
		@Inject(MAT_DIALOG_DATA) public _dialogData: any,
	) {
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
		this.validateForm();
	}

	validateNumber(event) {
		if (!parseInt(event.key) && event.keyCode != 8 && event.keyCode != 46 && event.key != 'Tab' && event.key != 'Enter') return false;
	}

	doManage() {
		if (this.myForm.invalid) {
			this.submitted = true;
		}
		else {
			this.submitted = false;
			this.btnCreateTxt = "Please Wait..";
			this.isDisabled = true;
			this._helper.apiPostLocal({ password: this.myForm.controls.password.value }, 'pos-unlock').subscribe(
				res => {
					if (res.message) {
						this._helper.notify({ message: res.message, messageType: res.status });
					}
					if (res.status == 1) {
						this._dialogRef.close({ status: true });
					}
					this.btnCreateTxt = "Unlock";
					this.isDisabled = false;
					// console.log('res', res);
				},
				error => console.log('error', error)
			);
		}
	}

	get f() {
		return this.myForm.controls;
	}

	validateForm() {
		this.myForm = this._formBuilder.group({
			password: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(15)]]
		});
	}

	onNoClick(): void {
		this._dialogRef.close(false);
	}

	ngOnInit() {
		this.dialogData = this._dialogData.data;
		this.dialogTitle = this.dialogData.title;
		setTimeout(() => {
			this.passwordInputField.nativeElement.focus();
		}, 500);
	}

}
