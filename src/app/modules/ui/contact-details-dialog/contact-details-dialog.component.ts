import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HelperService } from '../../../services/helper.service';

@Component({
	selector: 'app-contact-details-dialog',
	templateUrl: './contact-details-dialog.component.html',
	styleUrls: ['./contact-details-dialog.component.scss']
})
export class ContactDetailsDialogComponent implements OnInit {

	@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	moduleName: string;
	addModuleForm: FormGroup;
	countryList: any[];
	languageList: any[];
	ContactPurposeTypeCodeList: any[];
	ContactMethodTypeCodeList: any[];
	editData: any = [];
	dialogTitle: string = "Add Contact Info";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Create";
	btnUpdateTxt: string = "Update";
	IsAnotherChecked: boolean = false;
	submitted: boolean = false;

	constructor(
		private _formBuilder: FormBuilder,
		private _helper: HelperService,
		public _dialogRef: MatDialogRef<ContactDetailsDialogComponent>,
		public dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public _dialogData: any
	) {
		this.addModuleForm = this._formBuilder.group({
			ContactPurposeTypeCode: [null],
			ContactMethodTypeCode: [null],
			language: [null],
			AddressLine1: [null],
			AddressLine2: [null],
			AddressLine3: [null],
			AddressLine4: [null],
			email: [null, [Validators.pattern(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/)]],
			country_code: [null],
			phone: [null, [Validators.pattern(/^(\+?)?(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/)]],
			// phone: [null, [Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]],
			zipcode: [null, [Validators.pattern(/^[A-Za-z0-9]{0,10}$/)]],
			state: [null, [Validators.pattern(/^[A-Za-z0-9]{0,50}$/)]],
			city: [null, [Validators.pattern(/^[A-Za-z0-9]{0,50}$/)]],
		});
	}

	get f() {
		return this.addModuleForm.controls;
	}

	ngOnInit() {
		// console.log("this._dialogData", this._dialogData);
		this.editData = this._dialogData.data;
		this.moduleName = this._dialogData.modulename;
		if (this.editData && this.editData.length) {
			// console.log('this.editData', this.editData);
			this.dialogTitle = "Update Contact Info";
			this.btnCreateTxt = "Update";
			if (this.editData.length == 1) {
				this.addModuleForm.setValue({
					ContactPurposeTypeCode: this.editData[0].ContactPurposeTypeCode,
					ContactMethodTypeCode: this.editData[0].ContactMethodTypeCode,
					language: this.editData[0].language,
					AddressLine1: this.editData[0].AddressLine1,
					AddressLine2: this.editData[0].AddressLine2,
					AddressLine3: this.editData[0].AddressLine3,
					AddressLine4: this.editData[0].AddressLine4,
					email: this.editData[0].email,
					country_code: this.editData[0].country_code,
					phone: this.editData[0].phone,
					zipcode: this.editData[0].zipcode,
					state: this.editData[0].state,
					city: this.editData[0].city,
				});
			}
			// else {}
		}
		this.dropDownData();
	}

	dropDownData() {
		this._helper.apiGet('itemapis/organization-relations').subscribe(
			data => {
				// console.log('dropDownData', data);
				this.countryList = data.result.Country;
				this.languageList = data.result.Language;
				this.ContactPurposeTypeCodeList = data.result.ContactPurposeType;
				this.ContactMethodTypeCodeList = data.result.ContactMethodType;
			},
			error => console.log(error)
		);
	}

	onSubmit() {
		let fullAddress: string = '';
		let isEmpty = true;
		for (let key in this.addModuleForm.value) {
			let value = this.addModuleForm.value[key];
			if (value != null && value != '') {
				isEmpty = false;
				if (key == 'AddressLine1' || key == 'AddressLine2' || key == 'AddressLine3') {
					if (fullAddress != '') {
						fullAddress += ', ';
					}
					fullAddress += value;
				}
			}
		}
		if (this.addModuleForm.value['zipcode'] != '' && this.addModuleForm.value['zipcode'] != null) {
			if (fullAddress != '') {
				fullAddress += ', ';
			}
			fullAddress += this.addModuleForm.value['zipcode'];
		}
		if (this.addModuleForm.value['city'] != '' && this.addModuleForm.value['city'] != null) {
			if (fullAddress != '') {
				fullAddress += ', ';
			}
			fullAddress += this.addModuleForm.value['city'];
		}
		if (this.addModuleForm.value['state'] != '' && this.addModuleForm.value['state'] != null) {
			if (fullAddress != '') {
				fullAddress += ', ';
			}
			fullAddress += this.addModuleForm.value['state'];
		}
		if (this.addModuleForm.value['country_code'] != '' && this.addModuleForm.value['country_code'] != null) {
			let countryId: number = this.addModuleForm.value['country_code'];
			this.countryList.forEach((value) => {
				if (value.id == countryId) {
					if (fullAddress != '') {
						fullAddress += ', ';
					}
					fullAddress += value.ITUCountryName;
				}
			})
		}

		let language: string = '';
		if (this.addModuleForm.value['language'] != '' && this.addModuleForm.value['language'] != null) {
			let languageId: number = this.addModuleForm.value['language'];
			this.languageList.forEach((value) => {
				if (value.id == languageId) {
					language = value.Name;
				}
			})
		}

		let contactPurpose: string = '';
		if (this.addModuleForm.value['ContactPurposeTypeCode'] != '' && this.addModuleForm.value['ContactPurposeTypeCode'] != null) {
			let contactPurposeId: number = this.addModuleForm.value['ContactPurposeTypeCode'];
			this.ContactPurposeTypeCodeList.forEach((value) => {
				if (value.id == contactPurposeId) {
					contactPurpose = value.ContactPurposeTypeCode;
				}
			})
		}

		let contactMethod: string = '';
		if (this.addModuleForm.value['ContactMethodTypeCode'] != '' && this.addModuleForm.value['ContactMethodTypeCode'] != null) {
			let contactMethodId: number = this.addModuleForm.value['ContactMethodTypeCode'];
			this.ContactMethodTypeCodeList.forEach((value) => {
				if (value.id == contactMethodId) {
					contactMethod = value.ContactMethodTypeCode;
				}
			})
		}
		// console.log(this.addModuleForm.value); return;
		this.isDisabled = true;
		if (!isEmpty) {
			if (this.editData && this.editData.length) {
				this.btnCreateTxt = "Please Wait..";
				this.submitted = true;
				if (this.addModuleForm.invalid) {
					this.btnCreateTxt = "Update";
					this.isDisabled = false;
					return;
				}
				var formValue = this.addModuleForm.value;
				// console.log("update", formValue);
				this._dialogRef.close({ data: formValue, fullAddress: fullAddress, language: language, contactPurpose: contactPurpose, contactMethod: contactMethod });
			}
			else {
				this.btnCreateTxt = "Please Wait..";
				this.submitted = true;
				if (this.addModuleForm.invalid) {
					this.btnCreateTxt = "Create";
					this.isDisabled = false;
					return;
				}
				var formValue = this.addModuleForm.value;
				// console.log("add", formValue);
				this._dialogRef.close({ data: formValue, fullAddress: fullAddress, language: language, contactPurpose: contactPurpose, contactMethod: contactMethod });
			}
		}
		else {
			this._dialogRef.close(false);
		}
	}

}
