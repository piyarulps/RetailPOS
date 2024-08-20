import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HelperService } from '../../../../services/helper.service';

@Component({
	selector: 'app-device-manage',
	templateUrl: './device-manage.component.html',
	styleUrls: ['./device-manage.component.scss']
})
export class DeviceManageComponent implements OnInit {

	message: string;
	dialogData: any = {};
	devices: any = [];
	dialogTitle: string = "";
	dialogMessage: string = "";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Done";
	btnUpdateTxt: string = "Update";
	isbtnLoaderShow = false;
	myForm: FormGroup;
	submitted: boolean = false;

	constructor(
		public _helper: HelperService,
		private _formBuilder: FormBuilder,
		public _hotkeysService: HotkeysService,
		public _dialogRef: MatDialogRef<DeviceManageComponent>,
		@Inject(MAT_DIALOG_DATA) public _dialogData: any,
	) {
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
		this.validateForm();
	}

	doManage() {
		if (this.myForm.invalid) {
			this.submitted = true;
		}
		else {
			this.submitted = false;
			this._dialogRef.close({ device: this.devices[this.myForm.controls['device'].value] });
		}
	}

	get f() {
		return this.myForm.controls;
	}

	validateForm() {
		this.myForm = this._formBuilder.group({
			device: ['', Validators.required]
		});
	}

	onNoClick(): void {
		this._dialogRef.close(false);
	}

	ngOnInit() {
		this.dialogData = this._dialogData.data;
		this.dialogTitle = this.dialogData.title;
		this.dialogMessage = this.dialogData.message;
		if (typeof this.dialogData.devices != 'undefined') {
			this.devices = this.dialogData.devices;
		}
		else {
			this._helper.apiGetLocal('connected_devices').subscribe(
				res => {
					// console.log('res', res);
					if (res.status == 1) {
						let data: any = res.data;
						let serialNumbers: any = [];
						data.forEach(
							(value, key) => {
								if (!serialNumbers.includes(value.serialNumber) && value.serialNumber != '' && typeof value.serialNumber != 'undefined') {
									serialNumbers.push(value.serialNumber);
									this.devices.push(data[key]);
								}
							});
					}
					else if (res.message) {
						this._helper.notify({ message: res.message, messageType: res.status });
					}
				},
				error => console.log('error', error)
			);
		}
	}

}
