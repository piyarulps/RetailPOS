import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
// import { MatSnackBar } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ConnectionService } from 'ng-connection-service';
import { MatInput } from '@angular/material/input';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Location } from '@angular/common';
import { MatDatepicker, MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { ElasticsearchService } from '../../../../services/elasticsearch.service';
import { HelperService } from '../../../../services/helper.service';
import { ContactDetailsDialogComponent } from '../../../ui/contact-details-dialog/contact-details-dialog.component';
import { ValidationService } from '../../../../services/validation/validation.service';

export interface PageData {
	_editData: {
		data: []
	}
}

@Component({
	selector: 'app-vendors-manage',
	templateUrl: './vendors-manage.component.html',
	styleUrls: ['./vendors-manage.component.scss']
})
export class VendorsManageComponent implements OnInit {

	@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	@Input() pageData: PageData;
	@Output() getCommonData = new EventEmitter<{}>();
	// @ViewChild('brandNameInput') brandNameInputField: MatInput;
	// @ViewChild('brandNameSelect') brandNameSelectField: NgSelectComponent;

	moduleName: string;
	displayModuleName: string;
	moduleAPI: string = 'vendorlist/';
	moduleLink: string;
	myForm: FormGroup;
	mfgList: any = [];
	submitted: boolean = false;
	BrandsList: any[];
	message: string;
	editData: any = [];
	editIds: any = [];
	backupEditData: any = [];
	dialogTitle: string = "Add Vendor";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Create";
	btnUpdateTxt: string = "Update";
	legalnameDropDownList: any = [];
	tradenameLoading: boolean = false;
	response: any;
	_source: any = {};
	private static readonly INDEX = 'master_manufacturer';
	tempObj: any;
	private queryText = '';
	private lastKeypress = 0;
	tag: boolean;
	SearchField: any = [];
	isSelectBox: boolean = false;
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;
	isOpenSidebar: boolean = false;

	partyType: string = '';
	partyId: number;
	vendorId: number;
	stepOneData: any = {};
	stepTwoData: any = {};
	stepThreeData: any = {}
	isLoading: boolean = false;
	LifestyleTypeCodeList: any = [];
	LegalStatusTypeList: any = [];
	ReligionNameList: any = [];
	BusinessActivityCodeList: any = [];
	LifeStageCodeList: any = [];
	RaceCodeList: any = [];
	EthnicityTypeCodeList: any = [];
	EducationLevelCodeList: any = [];
	OccupationTypeCodeList: any = [];
	AnnualIncomeRangeCodeList: any = [];
	PersonalityTypeCodeList: any = [];
	PersonalValueTypeCodeList: any = [];
	DisabilityImpairmentTypeCodeList: any = [];
	DietaryHabitTypeCodeList: any = [];
	MaritalStatusCodeList: any = [];
	EmploymentStatusTypeList: any = [];
	contactMethods: any = [];
	showContactMethods: any = [];
	LegalNameDropDownList: any = [];
	LegalOrganizationTypeList: any = [];
	GlobalBusinessSizeTypeList: any = [];
	SalutationList: any = [];
	GenderTypeList: any = [];
	countryList: any = [];
	languageList: any = [];
	ContactPurposeTypeCodeList: any[];
	ContactMethodTypeCodeList: any[];
	parentLink: string = '/dashboard/item-maintenance/';
	LegalNameLoading = false;
	organizationStatus: number;
	itemIds: any = [];
	returnUrl: string = '';
	otherIds: any = [];
	dobMinDate: any = new Date();
	orgFormSubmitted: boolean = false;
	perFormSubmitted: boolean = false;

	dialogConfig = new MatDialogConfig();

	@ViewChild('perFormDirective') perFormDirective: FormGroupDirective;
	perForm: FormGroup;
	@ViewChild('orgFormDirective') orgFormDirective: FormGroupDirective;
	orgForm: FormGroup;

	constructor(
		public _location: Location,
		private _helper: HelperService,
		private _formBuilder: FormBuilder,
		public _formDirective: FormGroupDirective,
		public _elasticsearchService: ElasticsearchService,
		// public _snackBar: MatSnackBar,
		public _connectionService: ConnectionService,
		private _hotkeysService: HotkeysService,
		private _dialog: MatDialog,
		public _validation: ValidationService,
	) {
		this.isOnline = navigator.onLine;
		this._connectionService.monitor().subscribe(isConnected => {
			this.isOnline = isConnected;
			// console.log('App online status', this.isOnline);
		});
		this.setOrgForm();
		this.setPerForm();
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
	}

	public contactDialog(data: any = []): Observable<any> {
		// console.log('data', data);
		this.dialogConfig.panelClass = 'add-pop';
		this.dialogConfig.data = data;
		let dialogRef: MatDialogRef<ContactDetailsDialogComponent>;
		dialogRef = this._dialog.open(ContactDetailsDialogComponent, this.dialogConfig);
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	_openCalendar(picker: MatDatepicker<Date>) {
		picker.open();
	}

	onNoClick() {
		this.getCommonData.emit({ openSidebar: false });
	}

	setOrgForm() {
		this.btnCreateTxt = "Create";
		this.btnUpdateTxt = "Update";
		this.isbtnLoaderShow = false;
		this.contactMethods = [];
		this.showContactMethods = [];
		this.orgForm = this._formBuilder.group({
			LegalName: [null, [Validators.required]],
			TradeName: [null],
			LegalStatusCode: [null],
			TaxExemptOrganizationTypeCode: [null],
			DUNSNumber: [null, [Validators.pattern(/^[0-9]{1,20}$/)]],
			FiscalYearEndDate: [null],
			LegalOrganizationTypeCode: [null],
			GlobalBusinessSizeTypeCode: [null],
			ReligionName: [null],
			BusinessActivityCode: [null],
			ActualOrgDescription: [null],
			EmployeeCountLocal: [null, [Validators.pattern(/^[0-9]{1,20}$/)]],
			EmployeeCountGlobal: [null, [Validators.pattern(/^[0-9]{1,20}$/)]],
			LocalAnnualRevenueAmount: [null, [Validators.pattern(/^[0-9]+(\.[0-9][0-9]?)?/)]],
			GlobalAnnualRevenueAmount: [null, [Validators.pattern(/^[0-9]+(\.[0-9][0-9]?)?/)]],
			OpenForBusinessDate: [null],
			ClosedForBusinessDate: [null],
			BankruptcyFlag: [null],
			BankruptcyDate: [null],
			BankruptcyEmergenceDate: [null],
			BankruptcyTypeCode: [null]
		},
			{
				validator: [
					this._validation.CostValidation('GlobalAnnualRevenueAmount', 'LocalAnnualRevenueAmount'),
					this._validation.CompareValidation('EmployeeCountGlobal', 'EmployeeCountLocal')
				]
			});
	}

	setPerForm() {
		this.perForm = this._formBuilder.group({
			Salutation: [null],
			FirstName: [null, [Validators.required]],
			MiddleNames: [null],
			LastName: [null],
			GenderTypeCode: [null],
			DateOfBirth: [null],
			Suffix: [null],
			MaritalStatusCode: [null],
			SortingName: [null],
			MailingName: [null],
			OfficialName: [null],
			LifeStageCode: [null],
			RaceCode: [null],
			EthnicityTypeCode: [null],
			ReligionName: [null],
			EducationLevelCode: [null],
			EmploymentStatusCode: [null],
			OccupationTypeCode: [null],
			AnnualIncomeRangeCode: [null],
			PersonalityTypeCode: [null],
			LifestyleTypeCode: [null],
			PersonalValueTypeCode: [null],
			ConsumerCreditScore: [null],
			ConsumerCreditRatingServiceName: [null],
			DisabilityImpairmentTypeCode: [null],
			DietaryHabitTypeCode: [null]
		});
	}

	onLegalNameSearch($event) {
		if ($event.timeStamp - this.lastKeypress > 100) {
			this.queryText = $event.target.value;

			this._elasticsearchService.fullTextSearch(
				VendorsManageComponent.INDEX,
				'ManufacturerName', this.queryText, this.SearchField).then(
					response => {
						// console.log("response", response);
						this.LegalNameDropDownList = response.hits.hits;
					}, error => {
						console.error(error);
					}).then(() => { });
		}
		this.lastKeypress = $event.timeStamp;
	}

	onSelectLegalName(event) {
		console.log("event", event);
		if (typeof (event) != "undefined") {
			this.orgForm.controls['TradeName'].setValue(event._source.ManufacturerName);
		} else {
			this.orgForm.controls['TradeName'].setValue(null);
		}
	}

	addTag(name) {
		this._source = {
			_source: { ManufacturerName: name, tag: true }
		};
		return this._source;
	}

	addTagCommon(id) {
		return id;
	}

	dropDownData() {
		this._helper.apiGetLocal('vendordropdownlists/').subscribe(
			data => {
				// console.log('dropDownData', data);
				this.countryList = data.result.Country;
				this.languageList = data.result.Language;
				this.LifestyleTypeCodeList = data.result.LifestyleTypeCode;
				this.LegalStatusTypeList = data.result.LegalStatusType;
				this.ReligionNameList = data.result.ReligionType;
				this.BusinessActivityCodeList = data.result.BusinessActivityReference;
				this.LifeStageCodeList = data.result.LifeStageType;
				this.RaceCodeList = data.result.RaceType;
				this.EthnicityTypeCodeList = data.result.EthnicityType;
				this.EducationLevelCodeList = data.result.EducationLevel;
				this.OccupationTypeCodeList = data.result.OccupationType;
				this.AnnualIncomeRangeCodeList = data.result.AnnualIncomeRange;
				this.PersonalityTypeCodeList = data.result.PersonalityType;
				this.PersonalValueTypeCodeList = data.result.PersonalValueType;
				this.DisabilityImpairmentTypeCodeList = data.result.DisabilityImpairmentType;
				this.DietaryHabitTypeCodeList = data.result.DietaryHabitType;
				this.MaritalStatusCodeList = data.result.MaritalStatus;
				this.EmploymentStatusTypeList = data.result.EmploymentStatusType;
				this.LegalOrganizationTypeList = data.result.LegalOrganizationTypeCode;
				this.GlobalBusinessSizeTypeList = data.result.GlobalBusinessSizeType;
				this.ContactPurposeTypeCodeList = data.result.ContactPurposeType;
				this.ContactMethodTypeCodeList = data.result.ContactMethodType;
				this.SalutationList = [
					{
						id: "Mr",
						Salutation: "Mr."
					},
					{
						id: "Ms",
						Salutation: "Ms."
					},
					{
						id: "Miss",
						Salutation: "Miss."
					},
					{
						id: "Dr",
						Salutation: "Dr."
					}
				];
				this.GenderTypeList = [
					{
						id: "Male",
						GenderTypeCode: "Male"
					},
					{
						id: "Female",
						GenderTypeCode: "Female"
					},
					{
						id: "Other",
						GenderTypeCode: "Other"
					}
				];
			},
			error => console.log(error)
		);
	}

	manageContactMethod() {
		this.contactDialog().subscribe(res => {
			if (res) {
				console.log(res);
				let contactDetails = res.data;
				let singleContactMethod = {
					label: `${res.contactPurpose} (${res.contactMethod})`,
					fullAddress: res.fullAddress,
					phone: contactDetails.phone,
					email: contactDetails.email,
					language: res.language,
				};
				this.contactMethods.push(contactDetails);
				this.showContactMethods.push(singleContactMethod);
			}
		}
		);
	}

	editContactMethod(i) {
		this.contactDialog({ data: [this.contactMethods[i]] }).subscribe(res => {
			if (res) {
				let contactDetails = res.data;
				let singleContactMethod = {
					label: `${res.contactPurpose} (${res.contactMethod})`,
					fullAddress: res.fullAddress,
					phone: contactDetails.phone,
					email: contactDetails.email,
					language: res.language,
				};
				this.contactMethods[i] = contactDetails;
				this.showContactMethods[i] = singleContactMethod;
			}
		}
		);
	}

	deleteContactMethod(i) {
		this.contactMethods.splice(i, 1);
		this.showContactMethods.splice(i, 1);
	}

	ngOnChanges(changes: SimpleChanges) {
		this.receivedData = {};
		this.editData = [];
		const change: SimpleChange = changes.pageData;
		this.receivedData = change.currentValue;
		// console.log(this.receivedData);
		if (typeof (this.receivedData._pageData) != 'undefined' && this.receivedData._pageData) {
			this.moduleName = this.receivedData._pageData.moduleName;
			this.displayModuleName = this.receivedData._pageData.displayModuleName;
			this.dialogTitle = "Add New " + this.displayModuleName;
		}
		if (typeof (this.receivedData._openSidebar) != 'undefined' && this.receivedData._openSidebar) {
			this.setOrgForm();
			this.setPerForm();
			if (typeof (this.receivedData._editData) != "undefined" && typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null && this.receivedData._editData.data.length) {
				// setTimeout(() => {
				// 	if (typeof (this.brandNameInputField) != 'undefined') {
				// 		this.brandNameInputField.focus();
				// 	}
				// }, 1000);
			}
			else {
				// setTimeout(() => {
				// 	if (typeof (this.brandNameSelectField) != 'undefined') {
				// 		this.brandNameSelectField.focus();
				// 	}
				// }, 1000);
			}
		}
		if (typeof (this.receivedData._editData) != "undefined") {
			if (typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null) {
				this.editData = this.receivedData._editData.data;
				this.backupEditData = this.receivedData._editData.data;
				if (this.editData.length) {
					// console.log('this.editData', this.editData);
					this.setOrgForm();
					this.setPerForm();
					if (typeof (this.editData[0].PartyData.PartyType) != 'undefined') {
						this.partyType = this.editData[0].PartyData.PartyType;
						this.setEditData();
					}
					this.dialogTitle = "Update " + this.displayModuleName;
				}
			}
		}
		// console.log('this.receivedData', this.receivedData);
	}

	setEditData() {
		// console.log('this.partyType', this.partyType);
		console.log('this.editData', this.editData);
		// console.log('this.editData[0].PartyData.FirstName', this.editData[0].PartyData.FirstName);
		if (this.editData.length == 1) {
			if (this.partyType == "Organization") {
				this.orgForm.setValue({
					LegalName: this.editData[0].PartyData.LegalName,
					TradeName: this.editData[0].PartyData.TradeName,
					LegalStatusCode: this.editData[0].PartyData.LegalStatusCode,
					TaxExemptOrganizationTypeCode: this.editData[0].PartyData.TaxExemptOrganizationTypeCode,
					DUNSNumber: this.editData[0].PartyData.DUNSNumber,
					FiscalYearEndDate: this.editData[0].PartyData.FiscalYearEndDate,
					LegalOrganizationTypeCode: this.editData[0].PartyData.LegalOrganizationTypeCode,
					GlobalBusinessSizeTypeCode: this.editData[0].PartyData.GlobalBusinessSizeTypeCode,
					ReligionName: this.editData[0].PartyData.ReligionName,
					BusinessActivityCode: this.editData[0].PartyData.BusinessActivityCode,
					ActualOrgDescription: this.editData[0].PartyData.ActualOrgDescription,
					EmployeeCountLocal: this.editData[0].PartyData.EmployeeCountLocal,
					EmployeeCountGlobal: this.editData[0].PartyData.EmployeeCountGlobal,
					LocalAnnualRevenueAmount: this.editData[0].PartyData.LocalAnnualRevenueAmount,
					GlobalAnnualRevenueAmount: this.editData[0].PartyData.GlobalAnnualRevenueAmount,
					OpenForBusinessDate: this.editData[0].PartyData.OpenForBusinessDate,
					ClosedForBusinessDate: this.editData[0].PartyData.ClosedForBusinessDate,
					BankruptcyFlag: this.editData[0].PartyData.BankruptcyFlag,
					BankruptcyDate: this.editData[0].PartyData.BankruptcyDate,
					BankruptcyEmergenceDate: this.editData[0].PartyData.BankruptcyEmergenceDate,
					BankruptcyTypeCode: this.editData[0].PartyData.BankruptcyTypeCode
				});
			}
			else {
				this.perForm.setValue({
					Salutation: this.editData[0].PartyData.Salutation,
					FirstName: this.editData[0].PartyData.FirstName,
					MiddleNames: this.editData[0].PartyData.MiddleNames,
					LastName: this.editData[0].PartyData.LastName,
					GenderTypeCode: this.editData[0].PartyData.GenderTypeCode,
					DateOfBirth: this.editData[0].PartyData.DateOfBirth,
					Suffix: this.editData[0].PartyData.Suffix,
					MaritalStatusCode: this.editData[0].PartyData.MaritalStatusCode,
					SortingName: this.editData[0].PartyData.SortingName,
					MailingName: this.editData[0].PartyData.MailingName,
					OfficialName: this.editData[0].PartyData.OfficialName,
					LifeStageCode: this.editData[0].PartyData.LifeStageCode,
					RaceCode: this.editData[0].PartyData.RaceCode,
					EthnicityTypeCode: this.editData[0].PartyData.EthnicityTypeCode,
					ReligionName: this.editData[0].PartyData.ReligionName,
					EducationLevelCode: this.editData[0].PartyData.EducationLevelCode,
					EmploymentStatusCode: this.editData[0].PartyData.EmploymentStatusCode,
					OccupationTypeCode: this.editData[0].PartyData.OccupationTypeCode,
					AnnualIncomeRangeCode: this.editData[0].PartyData.AnnualIncomeRangeCode,
					PersonalityTypeCode: this.editData[0].PartyData.PersonalityTypeCode,
					LifestyleTypeCode: this.editData[0].PartyData.LifestyleTypeCode,
					PersonalValueTypeCode: this.editData[0].PartyData.PersonalValueTypeCode,
					ConsumerCreditScore: this.editData[0].PartyData.ConsumerCreditScore,
					ConsumerCreditRatingServiceName: this.editData[0].PartyData.ConsumerCreditRatingServiceName,
					DisabilityImpairmentTypeCode: this.editData[0].PartyData.DisabilityImpairmentTypeCode,
					DietaryHabitTypeCode: this.editData[0].PartyData.DietaryHabitTypeCode
				});
				// console.log('this.perForm', this.perForm);
			}
			if (this.editData[0].ContactMethod && this.editData[0].ContactMethod.length) {
				this.editData[0].ContactMethod.forEach(value => {
					let fullAddress: string = '';
					for (let key in value) {
						let row = value[key];
						if (row != null && row != '') {
							if (key == 'AddressLine1' || key == 'AddressLine2' || key == 'AddressLine3') {
								if (fullAddress != '') {
									fullAddress += ', ';
								}
								fullAddress += row;
							}
						}
					}
					if (value['zipcode'] != '' && value['zipcode'] != null) {
						fullAddress += ', ' + value['zipcode'];
					}
					if (value['city'] != '' && value['city'] != null) {
						fullAddress += ', ' + value['city'];
					}
					if (value['state'] != '' && value['state'] != null) {
						fullAddress += ', ' + value['state'];
					}
					if (value['country_code'] != '' && value['country_code'] != null) {
						let countryId: number = value['country_code'];
						this.countryList.forEach((value) => {
							if (value.id == countryId) {
								fullAddress += ', ' + value.ITUCountryName;
							}
						})
					}

					let language: string = '';
					if (value['language'] != '' && value['language'] != null) {
						let languageId: number = value['language'];
						this.languageList.forEach((value) => {
							if (value.id == languageId) {
								language = value.Name;
							}
						})
					}

					let contactPurpose: string = '';
					if (value['ContactPurposeTypeCode'] != '' && value['ContactPurposeTypeCode'] != null) {
						let contactPurposeId: number = value['ContactPurposeTypeCode'];
						this.ContactPurposeTypeCodeList.forEach((value) => {
							if (value.id == contactPurposeId) {
								contactPurpose = value.ContactPurposeTypeCode;
							}
						})
					}

					let contactMethod: string = '';
					if (value['ContactMethodTypeCode'] != '' && value['ContactMethodTypeCode'] != null) {
						let contactMethodId: number = value['ContactMethodTypeCode'];
						this.ContactMethodTypeCodeList.forEach((value) => {
							if (value.id == contactMethodId) {
								contactMethod = value.ContactMethodTypeCode;
							}
						})
					}
					let contactDetails = value;
					let singleContactMethod = {
						label: `${contactPurpose} (${contactMethod})`,
						fullAddress: fullAddress,
						phone: contactDetails.phone,
						email: contactDetails.email,
						language: language,
					};
					this.contactMethods.push(contactDetails);
					this.showContactMethods.push(singleContactMethod);
				});
			}
		}
	}

	ngOnInit() {
		this.partyType = "Organization";
		this.dropDownData();
	}

	setPreData() {
		console.log('setPreData', this.editData);
		if (this.editData.length) {
			for (let i = 0; i < this.editData.length; i++) {
				if (this.partyType == 'Organization') {
					// basic
					this.editData[i].PartyData.LegalName = this.orgForm.value.LegalName != null ? this.orgForm.value.LegalName : this.editData[i].PartyData.LegalName;
					this.editData[i].PartyData.TradeName = this.orgForm.value.TradeName != null ? this.orgForm.value.TradeName : this.editData[i].PartyData.TradeName;
					this.editData[i].PartyData.LegalStatusCode = this.orgForm.value.LegalStatusCode != null ? this.orgForm.value.LegalStatusCode : this.editData[i].PartyData.LegalStatusCode;
					this.editData[i].PartyData.TaxExemptOrganizationTypeCode = this.orgForm.value.TaxExemptOrganizationTypeCode != null ? this.orgForm.value.TaxExemptOrganizationTypeCode : this.editData[i].PartyData.TaxExemptOrganizationTypeCode;
					this.editData[i].PartyData.DUNSNumber = this.orgForm.value.DUNSNumber != null ? this.orgForm.value.DUNSNumber : this.editData[i].PartyData.DUNSNumber;
					this.editData[i].PartyData.FiscalYearEndDate = this.orgForm.value.FiscalYearEndDate != null ? this.orgForm.value.FiscalYearEndDate : this.editData[i].PartyData.FiscalYearEndDate;
					this.editData[i].PartyData.LegalOrganizationTypeCode = this.orgForm.value.LegalOrganizationTypeCode != null ? this.orgForm.value.LegalOrganizationTypeCode : this.editData[i].PartyData.LegalOrganizationTypeCode;
					// advance
					this.editData[i].PartyData.GlobalBusinessSizeTypeCode = this.orgForm.value.GlobalBusinessSizeTypeCode != null ? this.orgForm.value.GlobalBusinessSizeTypeCode : this.editData[i].PartyData.GlobalBusinessSizeTypeCode;
					this.editData[i].PartyData.ReligionName = this.orgForm.value.ReligionName != null ? this.orgForm.value.ReligionName : this.editData[i].PartyData.ReligionName;
					this.editData[i].PartyData.BusinessActivityCode = this.orgForm.value.BusinessActivityCode != null ? this.orgForm.value.BusinessActivityCode : this.editData[i].PartyData.BusinessActivityCode;
					this.editData[i].PartyData.ActualOrgDescription = this.orgForm.value.ActualOrgDescription != null ? this.orgForm.value.ActualOrgDescription : this.editData[i].PartyData.ActualOrgDescription;
					this.editData[i].PartyData.EmployeeCountLocal = this.orgForm.value.EmployeeCountLocal != null ? this.orgForm.value.EmployeeCountLocal : this.editData[i].PartyData.EmployeeCountLocal;
					this.editData[i].PartyData.EmployeeCountGlobal = this.orgForm.value.EmployeeCountGlobal != null ? this.orgForm.value.EmployeeCountGlobal : this.editData[i].PartyData.EmployeeCountGlobal;
					this.editData[i].PartyData.LocalAnnualRevenueAmount = this.orgForm.value.LocalAnnualRevenueAmount != null ? this.orgForm.value.LocalAnnualRevenueAmount : this.editData[i].PartyData.LocalAnnualRevenueAmount;
					this.editData[i].PartyData.GlobalAnnualRevenueAmount = this.orgForm.value.GlobalAnnualRevenueAmount != null ? this.orgForm.value.GlobalAnnualRevenueAmount : this.editData[i].PartyData.GlobalAnnualRevenueAmount;
					this.editData[i].PartyData.OpenForBusinessDate = this.orgForm.value.OpenForBusinessDate != null ? this.orgForm.value.OpenForBusinessDate : this.editData[i].PartyData.OpenForBusinessDate;
					this.editData[i].PartyData.ClosedForBusinessDate = this.orgForm.value.ClosedForBusinessDate != null ? this.orgForm.value.ClosedForBusinessDate : this.editData[i].PartyData.ClosedForBusinessDate;
					this.editData[i].PartyData.BankruptcyFlag = this.orgForm.value.BankruptcyFlag != null ? this.orgForm.value.BankruptcyFlag : this.editData[i].PartyData.BankruptcyFlag;
					this.editData[i].PartyData.BankruptcyDate = this.orgForm.value.BankruptcyDate != null ? this.orgForm.value.BankruptcyDate : this.editData[i].PartyData.BankruptcyDate;
					this.editData[i].PartyData.BankruptcyEmergenceDate = this.orgForm.value.BankruptcyEmergenceDate != null ? this.orgForm.value.BankruptcyEmergenceDate : this.editData[i].PartyData.BankruptcyEmergenceDate;
					this.editData[i].PartyData.BankruptcyTypeCode = this.orgForm.value.BankruptcyTypeCode != null ? this.orgForm.value.BankruptcyTypeCode : this.editData[i].PartyData.BankruptcyTypeCode;
				}
				else if (this.partyType == 'Person') {
					// basic
					this.editData[i].PartyData.Salutation = this.perForm.value.Salutation != null ? this.perForm.value.Salutation : this.editData[i].PartyData.Salutation;
					this.editData[i].PartyData.FirstName = this.perForm.value.FirstName != null ? this.perForm.value.FirstName : this.editData[i].PartyData.FirstName;
					this.editData[i].PartyData.MiddleNames = this.perForm.value.MiddleNames != null ? this.perForm.value.MiddleNames : this.editData[i].PartyData.MiddleNames;
					this.editData[i].PartyData.LastName = this.perForm.value.LastName != null ? this.perForm.value.LastName : this.editData[i].PartyData.LastName;
					this.editData[i].PartyData.GenderTypeCode = this.perForm.value.GenderTypeCode != null ? this.perForm.value.GenderTypeCode : this.editData[i].PartyData.GenderTypeCode;
					this.editData[i].PartyData.DateOfBirth = this.perForm.value.DateOfBirth != null ? this.perForm.value.DateOfBirth : this.editData[i].PartyData.DateOfBirth;
					this.editData[i].PartyData.Suffix = this.perForm.value.Suffix != null ? this.perForm.value.Suffix : this.editData[i].PartyData.Suffix;
					this.editData[i].PartyData.MaritalStatusCode = this.perForm.value.MaritalStatusCode != null ? this.perForm.value.MaritalStatusCode : this.editData[i].PartyData.MaritalStatusCode;
					// advance
					this.editData[i].PartyData.SortingName = this.perForm.value.SortingName != null ? this.perForm.value.SortingName : this.editData[i].PartyData.SortingName;
					this.editData[i].PartyData.MailingName = this.perForm.value.MailingName != null ? this.perForm.value.MailingName : this.editData[i].PartyData.MailingName;
					this.editData[i].PartyData.OfficialName = this.perForm.value.OfficialName != null ? this.perForm.value.OfficialName : this.editData[i].PartyData.OfficialName;
					this.editData[i].PartyData.LifeStageCode = this.perForm.value.LifeStageCode != null ? this.perForm.value.LifeStageCode : this.editData[i].PartyData.LifeStageCode;
					this.editData[i].PartyData.RaceCode = this.perForm.value.RaceCode != null ? this.perForm.value.RaceCode : this.editData[i].PartyData.RaceCode;
					this.editData[i].PartyData.EthnicityTypeCode = this.perForm.value.EthnicityTypeCode != null ? this.perForm.value.EthnicityTypeCode : this.editData[i].PartyData.EthnicityTypeCode;
					this.editData[i].PartyData.ReligionName = this.perForm.value.ReligionName != null ? this.perForm.value.ReligionName : this.editData[i].PartyData.ReligionName;
					this.editData[i].PartyData.EducationLevelCode = this.perForm.value.EducationLevelCode != null ? this.perForm.value.EducationLevelCode : this.editData[i].PartyData.EducationLevelCode;
					this.editData[i].PartyData.EmploymentStatusCode = this.perForm.value.EmploymentStatusCode != null ? this.perForm.value.EmploymentStatusCode : this.editData[i].PartyData.EmploymentStatusCode;
					this.editData[i].PartyData.OccupationTypeCode = this.perForm.value.OccupationTypeCode != null ? this.perForm.value.OccupationTypeCode : this.editData[i].PartyData.OccupationTypeCode;
					this.editData[i].PartyData.AnnualIncomeRangeCode = this.perForm.value.AnnualIncomeRangeCode != null ? this.perForm.value.AnnualIncomeRangeCode : this.editData[i].PartyData.AnnualIncomeRangeCode;
					this.editData[i].PartyData.PersonalityTypeCode = this.perForm.value.PersonalityTypeCode != null ? this.perForm.value.PersonalityTypeCode : this.editData[i].PartyData.PersonalityTypeCode;
					this.editData[i].PartyData.LifestyleTypeCode = this.perForm.value.LifestyleTypeCode != null ? this.perForm.value.LifestyleTypeCode : this.editData[i].PartyData.LifestyleTypeCode;
					this.editData[i].PartyData.PersonalValueTypeCode = this.perForm.value.PersonalValueTypeCode != null ? this.perForm.value.PersonalValueTypeCode : this.editData[i].PartyData.PersonalValueTypeCode;
					this.editData[i].PartyData.ConsumerCreditScore = this.perForm.value.ConsumerCreditScore != null ? this.perForm.value.ConsumerCreditScore : this.editData[i].PartyData.ConsumerCreditScore;
					this.editData[i].PartyData.ConsumerCreditRatingServiceName = this.perForm.value.ConsumerCreditRatingServiceName != null ? this.perForm.value.ConsumerCreditRatingServiceName : this.editData[i].PartyData.ConsumerCreditRatingServiceName;
					this.editData[i].PartyData.DisabilityImpairmentTypeCode = this.perForm.value.DisabilityImpairmentTypeCode != null ? this.perForm.value.DisabilityImpairmentTypeCode : this.editData[i].PartyData.DisabilityImpairmentTypeCode;
					this.editData[i].PartyData.DietaryHabitTypeCode = this.perForm.value.DietaryHabitTypeCode != null ? this.perForm.value.DietaryHabitTypeCode : this.editData[i].PartyData.DietaryHabitTypeCode;
				}
			}
		}
	}

	doValidate() {
		let isValidForm: boolean = false;
		if (this.editData.length > 1) {
			const LegalNameControl = this.orgForm.get('LegalName');
			LegalNameControl.clearValidators();
			LegalNameControl.updateValueAndValidity();
			const FirstNameControl = this.perForm.get('FirstName');
			FirstNameControl.clearValidators();
			FirstNameControl.updateValueAndValidity();
		}
		if (this.partyType == 'Organization') {
			this.orgFormDirective.ngSubmit.emit();
			(this.orgFormDirective as any).submitted = true;
			this.orgFormSubmitted = true;
			if (this.orgFormDirective.valid) {
				isValidForm = true;
				this.stepOneData = this.orgFormDirective.value;
			}
		}
		else if (this.partyType == 'Person') {
			this.perFormDirective.ngSubmit.emit();
			(this.perFormDirective as any).submitted = true;
			this.perFormSubmitted = true;
			if (this.perFormDirective.valid) {
				isValidForm = true;
				this.stepOneData = this.perFormDirective.value;
			}
		}
		else if (this.partyType == '') {
			this._helper.notify({ message: "Choose party type and fill-up mandatory data to continue.", messageType: 0 });
		}
		console.log(this.orgForm.controls.GlobalAnnualRevenueAmount.errors);
		if (isValidForm) {
			this.isLoading = true;
			// console.log(this.stepOneData);
			this.doManage();
			this.isLoading = false;
		}
	}

	doManage() {
		this.btnCreateTxt = "Please Wait..";
		this.isbtnLoaderShow = true;
		let tempData = this.stepOneData;
		let allData: any = {
			PartyRole: "Vendor",
			VendorType: "",
			PartyData: {},
			ContactMethod: []
		};
		allData.VendorType = this.moduleName;
		allData.PartyData = tempData;
		allData.PartyData.PartyType = this.partyType;
		allData.ContactMethod = this.contactMethods;
		if (this.editData.length) {
			let updateData: any = [];
			for (let i = 0; i < this.editData.length; i++) {
				let tempUpdateData: any = {
					PartyRole: "Vendor",
					VendorType: "",
					PartyData: {},
					ContactMethod: []
				};
				// console.log('this.editData[i].PartyData.PartyType', this.editData[i].PartyData.PartyType);
				if (this.partyType == 'Organization') {
					// basic
					tempUpdateData.PartyData.LegalName = this.orgForm.value.LegalName != "" && this.orgForm.value.LegalName != null ? this.orgForm.value.LegalName : this.backupEditData[i].PartyData.LegalName;
					tempUpdateData.PartyData.TradeName = this.orgForm.value.TradeName != "" && this.orgForm.value.TradeName != null ? this.orgForm.value.TradeName : this.backupEditData[i].PartyData.TradeName;
					tempUpdateData.PartyData.LegalStatusCode = this.orgForm.value.LegalStatusCode != "" && this.orgForm.value.LegalStatusCode != null ? this.orgForm.value.LegalStatusCode : this.backupEditData[i].PartyData.LegalStatusCode;
					tempUpdateData.PartyData.TaxExemptOrganizationTypeCode = this.orgForm.value.TaxExemptOrganizationTypeCode != "" && this.orgForm.value.TaxExemptOrganizationTypeCode != null ? this.orgForm.value.TaxExemptOrganizationTypeCode : this.backupEditData[i].PartyData.TaxExemptOrganizationTypeCode;
					tempUpdateData.PartyData.DUNSNumber = this.orgForm.value.DUNSNumber != "" && this.orgForm.value.DUNSNumber != null ? this.orgForm.value.DUNSNumber : this.backupEditData[i].PartyData.DUNSNumber;
					tempUpdateData.PartyData.FiscalYearEndDate = this.orgForm.value.FiscalYearEndDate != "" && this.orgForm.value.FiscalYearEndDate != null ? this.orgForm.value.FiscalYearEndDate : this.backupEditData[i].PartyData.FiscalYearEndDate;
					tempUpdateData.PartyData.LegalOrganizationTypeCode = this.orgForm.value.LegalOrganizationTypeCode != "" && this.orgForm.value.LegalOrganizationTypeCode != null ? this.orgForm.value.LegalOrganizationTypeCode : this.backupEditData[i].PartyData.LegalOrganizationTypeCode;
					// advance
					tempUpdateData.PartyData.GlobalBusinessSizeTypeCode = this.orgForm.value.GlobalBusinessSizeTypeCode != "" && this.orgForm.value.GlobalBusinessSizeTypeCode != null ? this.orgForm.value.GlobalBusinessSizeTypeCode : this.backupEditData[i].PartyData.GlobalBusinessSizeTypeCode;
					tempUpdateData.PartyData.ReligionName = this.orgForm.value.ReligionName != "" && this.orgForm.value.ReligionName != null ? this.orgForm.value.ReligionName : this.backupEditData[i].PartyData.ReligionName;
					tempUpdateData.PartyData.BusinessActivityCode = this.orgForm.value.BusinessActivityCode != "" && this.orgForm.value.BusinessActivityCode != null ? this.orgForm.value.BusinessActivityCode : this.backupEditData[i].PartyData.BusinessActivityCode;
					tempUpdateData.PartyData.ActualOrgDescription = this.orgForm.value.ActualOrgDescription != "" && this.orgForm.value.ActualOrgDescription != null ? this.orgForm.value.ActualOrgDescription : this.backupEditData[i].PartyData.ActualOrgDescription;
					tempUpdateData.PartyData.EmployeeCountLocal = this.orgForm.value.EmployeeCountLocal != "" && this.orgForm.value.EmployeeCountLocal != null ? this.orgForm.value.EmployeeCountLocal : this.backupEditData[i].PartyData.EmployeeCountLocal;
					tempUpdateData.PartyData.EmployeeCountGlobal = this.orgForm.value.EmployeeCountGlobal != "" && this.orgForm.value.EmployeeCountGlobal != null ? this.orgForm.value.EmployeeCountGlobal : this.backupEditData[i].PartyData.EmployeeCountGlobal;
					tempUpdateData.PartyData.LocalAnnualRevenueAmount = this.orgForm.value.LocalAnnualRevenueAmount != "" && this.orgForm.value.LocalAnnualRevenueAmount != null ? this.orgForm.value.LocalAnnualRevenueAmount : this.backupEditData[i].PartyData.LocalAnnualRevenueAmount;
					tempUpdateData.PartyData.GlobalAnnualRevenueAmount = this.orgForm.value.GlobalAnnualRevenueAmount != "" && this.orgForm.value.GlobalAnnualRevenueAmount != null ? this.orgForm.value.GlobalAnnualRevenueAmount : this.backupEditData[i].PartyData.GlobalAnnualRevenueAmount;
					tempUpdateData.PartyData.OpenForBusinessDate = this.orgForm.value.OpenForBusinessDate != "" && this.orgForm.value.OpenForBusinessDate != null ? this.orgForm.value.OpenForBusinessDate : this.backupEditData[i].PartyData.OpenForBusinessDate;
					tempUpdateData.PartyData.ClosedForBusinessDate = this.orgForm.value.ClosedForBusinessDate != "" && this.orgForm.value.ClosedForBusinessDate != null ? this.orgForm.value.ClosedForBusinessDate : this.backupEditData[i].PartyData.ClosedForBusinessDate;
					tempUpdateData.PartyData.BankruptcyFlag = this.orgForm.value.BankruptcyFlag != "" && this.orgForm.value.BankruptcyFlag != null ? this.orgForm.value.BankruptcyFlag : this.backupEditData[i].PartyData.BankruptcyFlag;
					tempUpdateData.PartyData.BankruptcyDate = this.orgForm.value.BankruptcyDate != "" && this.orgForm.value.BankruptcyDate != null ? this.orgForm.value.BankruptcyDate : this.backupEditData[i].PartyData.BankruptcyDate;
					tempUpdateData.PartyData.BankruptcyEmergenceDate = this.orgForm.value.BankruptcyEmergenceDate != "" && this.orgForm.value.BankruptcyEmergenceDate != null ? this.orgForm.value.BankruptcyEmergenceDate : this.backupEditData[i].PartyData.BankruptcyEmergenceDate;
					tempUpdateData.PartyData.BankruptcyTypeCode = this.orgForm.value.BankruptcyTypeCode != "" && this.orgForm.value.BankruptcyTypeCode != null ? this.orgForm.value.BankruptcyTypeCode : this.backupEditData[i].PartyData.BankruptcyTypeCode;
					// other
					tempUpdateData.PartyData.OrganizationStatus = this.backupEditData[i].PartyData.OrganizationStatus;
				}
				else if (this.partyType == 'Person') {
					// basic
					tempUpdateData.PartyData.Salutation = this.perForm.value.Salutation != "" && this.perForm.value.Salutation != null ? this.perForm.value.Salutation : this.backupEditData[i].PartyData.Salutation;
					tempUpdateData.PartyData.FirstName = this.perForm.value.FirstName != "" && this.perForm.value.FirstName != null ? this.perForm.value.FirstName : this.backupEditData[i].PartyData.FirstName;
					tempUpdateData.PartyData.MiddleNames = this.perForm.value.MiddleNames != "" && this.perForm.value.MiddleNames != null ? this.perForm.value.MiddleNames : this.backupEditData[i].PartyData.MiddleNames;
					tempUpdateData.PartyData.LastName = this.perForm.value.LastName != "" && this.perForm.value.LastName != null ? this.perForm.value.LastName : this.backupEditData[i].PartyData.LastName;
					tempUpdateData.PartyData.GenderTypeCode = this.perForm.value.GenderTypeCode != "" && this.perForm.value.GenderTypeCode != null ? this.perForm.value.GenderTypeCode : this.backupEditData[i].PartyData.GenderTypeCode;
					tempUpdateData.PartyData.DateOfBirth = this.perForm.value.DateOfBirth != "" && this.perForm.value.DateOfBirth != null ? this.perForm.value.DateOfBirth : this.backupEditData[i].PartyData.DateOfBirth;
					tempUpdateData.PartyData.Suffix = this.perForm.value.Suffix != "" && this.perForm.value.Suffix != null ? this.perForm.value.Suffix : this.backupEditData[i].PartyData.Suffix;
					tempUpdateData.PartyData.MaritalStatusCode = this.perForm.value.MaritalStatusCode != "" && this.perForm.value.MaritalStatusCode != null ? this.perForm.value.MaritalStatusCode : this.backupEditData[i].PartyData.MaritalStatusCode;
					// advance
					tempUpdateData.PartyData.SortingName = this.perForm.value.SortingName != "" && this.perForm.value.SortingName != null ? this.perForm.value.SortingName : this.backupEditData[i].PartyData.SortingName;
					tempUpdateData.PartyData.MailingName = this.perForm.value.MailingName != "" && this.perForm.value.MailingName != null ? this.perForm.value.MailingName : this.backupEditData[i].PartyData.MailingName;
					tempUpdateData.PartyData.OfficialName = this.perForm.value.OfficialName != "" && this.perForm.value.OfficialName != null ? this.perForm.value.OfficialName : this.backupEditData[i].PartyData.OfficialName;
					tempUpdateData.PartyData.LifeStageCode = this.perForm.value.LifeStageCode != "" && this.perForm.value.LifeStageCode != null ? this.perForm.value.LifeStageCode : this.backupEditData[i].PartyData.LifeStageCode;
					tempUpdateData.PartyData.RaceCode = this.perForm.value.RaceCode != "" && this.perForm.value.RaceCode != null ? this.perForm.value.RaceCode : this.backupEditData[i].PartyData.RaceCode;
					tempUpdateData.PartyData.EthnicityTypeCode = this.perForm.value.EthnicityTypeCode != "" && this.perForm.value.EthnicityTypeCode != null ? this.perForm.value.EthnicityTypeCode : this.backupEditData[i].PartyData.EthnicityTypeCode;
					tempUpdateData.PartyData.ReligionName = this.perForm.value.ReligionName != "" && this.perForm.value.ReligionName != null ? this.perForm.value.ReligionName : this.backupEditData[i].PartyData.ReligionName;
					tempUpdateData.PartyData.EducationLevelCode = this.perForm.value.EducationLevelCode != "" && this.perForm.value.EducationLevelCode != null ? this.perForm.value.EducationLevelCode : this.backupEditData[i].PartyData.EducationLevelCode;
					tempUpdateData.PartyData.EmploymentStatusCode = this.perForm.value.EmploymentStatusCode != "" && this.perForm.value.EmploymentStatusCode != null ? this.perForm.value.EmploymentStatusCode : this.backupEditData[i].PartyData.EmploymentStatusCode;
					tempUpdateData.PartyData.OccupationTypeCode = this.perForm.value.OccupationTypeCode != "" && this.perForm.value.OccupationTypeCode != null ? this.perForm.value.OccupationTypeCode : this.backupEditData[i].PartyData.OccupationTypeCode;
					tempUpdateData.PartyData.AnnualIncomeRangeCode = this.perForm.value.AnnualIncomeRangeCode != "" && this.perForm.value.AnnualIncomeRangeCode != null ? this.perForm.value.AnnualIncomeRangeCode : this.backupEditData[i].PartyData.AnnualIncomeRangeCode;
					tempUpdateData.PartyData.PersonalityTypeCode = this.perForm.value.PersonalityTypeCode != "" && this.perForm.value.PersonalityTypeCode != null ? this.perForm.value.PersonalityTypeCode : this.backupEditData[i].PartyData.PersonalityTypeCode;
					tempUpdateData.PartyData.LifestyleTypeCode = this.perForm.value.LifestyleTypeCode != "" && this.perForm.value.LifestyleTypeCode != null ? this.perForm.value.LifestyleTypeCode : this.backupEditData[i].PartyData.LifestyleTypeCode;
					tempUpdateData.PartyData.PersonalValueTypeCode = this.perForm.value.PersonalValueTypeCode != "" && this.perForm.value.PersonalValueTypeCode != null ? this.perForm.value.PersonalValueTypeCode : this.backupEditData[i].PartyData.PersonalValueTypeCode;
					tempUpdateData.PartyData.ConsumerCreditScore = this.perForm.value.ConsumerCreditScore != "" && this.perForm.value.ConsumerCreditScore != null ? this.perForm.value.ConsumerCreditScore : this.backupEditData[i].PartyData.ConsumerCreditScore;
					tempUpdateData.PartyData.ConsumerCreditRatingServiceName = this.perForm.value.ConsumerCreditRatingServiceName != "" && this.perForm.value.ConsumerCreditRatingServiceName != null ? this.perForm.value.ConsumerCreditRatingServiceName : this.backupEditData[i].PartyData.ConsumerCreditRatingServiceName;
					tempUpdateData.PartyData.DisabilityImpairmentTypeCode = this.perForm.value.DisabilityImpairmentTypeCode != "" && this.perForm.value.DisabilityImpairmentTypeCode != null ? this.perForm.value.DisabilityImpairmentTypeCode : this.backupEditData[i].PartyData.DisabilityImpairmentTypeCode;
					tempUpdateData.PartyData.DietaryHabitTypeCode = this.perForm.value.DietaryHabitTypeCode != "" && this.perForm.value.DietaryHabitTypeCode != null ? this.perForm.value.DietaryHabitTypeCode : this.backupEditData[i].PartyData.DietaryHabitTypeCode;
				}
				tempUpdateData.VendorType = this.moduleName;
				tempUpdateData.PartyData.PartyType = this.partyType;
				tempUpdateData.PartyData.Party_id = this.backupEditData[i].PartyData.Party_id;
				tempUpdateData.PartyData.VendorID = this.backupEditData[i].PartyData.VendorID;
				tempUpdateData.PartyData._id = this.backupEditData[i]._id;
				if (this.editData.length && this.editData.length > 1) {
					tempUpdateData.ContactMethod = this.editData[i].ContactMethod;
					// tempUpdateData.ContactMethod.push(this.editData[i].ContactMethod);
				}
				else {
					tempUpdateData.ContactMethod = this.contactMethods;
					// tempUpdateData.ContactMethod.push(this.contactMethods);
				}
				updateData.push(tempUpdateData);
			}
			this._helper.apiPutLocal(updateData, this.moduleAPI).subscribe(
				res => {
					if (res.message) {
						this._helper.notify({ message: res.message, messageType: res.status });
					}
					if (res.status == 1) {
						this.submitted = false;
						this.isbtnLoaderShow = false;
						this.getCommonData.emit({ openSidebar: false, dataAdded: true, hitListAction: 'editSuccess', noSelectionCheck: true });
					}
					this.btnUpdateTxt = "Update";
					this.isbtnLoaderShow = false;
				},
				error => {
					console.log('error', error);
					this.btnUpdateTxt = "Update";
					this.isbtnLoaderShow = false;
				}
			);
		}
		else {
			console.log(allData);
			this._helper.apiPostLocal(allData, this.moduleAPI).subscribe(
				res => {
					if (res.message) {
						this._helper.notify({ message: res.message, messageType: res.status });
					}
					if (res.status == 1) {
						this.submitted = false;
						// this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
						this.isbtnLoaderShow = false;
						if (this.IsAnotherChecked == true) {
							this.submitted = false;
							// this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
							this.isbtnLoaderShow = false;
						} else {
							// this._dialogRef.close(this.myForm.value);
							this.getCommonData.emit({ openSidebar: false, dataAdded: allData });
						}
					}
					this.btnCreateTxt = "Create";
					this.isbtnLoaderShow = false;
				},
				error => {
					console.log('error', error);
					this.btnCreateTxt = "Create";
					this.isbtnLoaderShow = false;
				}
			);
		}
	}

}
