import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
// import { MatSnackBar } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { ElasticsearchService } from '../../../../services/elasticsearch.service';
import { HelperService } from '../../../../services/helper.service';
import { ConnectionService } from 'ng-connection-service';
import { MatInput } from '@angular/material/input';
import { NgSelectComponent } from '@ng-select/ng-select';

export interface PageData {
	_editData: {
		data: [],
		newbrand: null
	}
}

@Component({
	selector: 'app-brands-manage',
	templateUrl: './brands-manage.component.html',
	styleUrls: ['./brands-manage.component.scss']
})
export class BrandsManageComponent implements OnInit, OnChanges {

	@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	@Input() pageData: PageData;
	@Output() getCommonData = new EventEmitter<{}>();
	@ViewChild('brandNameInput') brandNameInputField: MatInput;
	@ViewChild('brandNameSelect') brandNameSelectField: NgSelectComponent;

	moduleName: string = 'Brands';
	displayModuleName: string = 'Brand';
	moduleAPI: string = 'brands/';
	moduleLink: string = 'admin-mode/brands';
	myForm: FormGroup;
	mfgList: any = [];
	submitted: boolean = false;
	BrandsList: any[];
	message: string;
	editData: any = [];
	backupEditData: any = [];
	dialogTitle: string = "Add New Brand";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Create";
	btnUpdateTxt: string = "Update";
	BrandNameDropDownList: any = [];
	brandnameLoading: boolean = false;
	response: any;
	_source: any = {};
	private static readonly INDEX = 'brands_master';
	tempObj: any;
	private queryText = '';
	private lastKeypress = 0;
	tag: boolean;
	SearchField: any = ['BrandName', 'Manufacturer', 'Description'];
	isSelectBox: boolean = false;
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;
	isOpenSidebar: boolean = false;

	brandName: string = '';

	constructor(
		private _helper: HelperService,
		private _formBuilder: FormBuilder,
		public _formDirective: FormGroupDirective,
		public _elasticsearchService: ElasticsearchService,
		// public _snackBar: MatSnackBar,
		public _connectionService: ConnectionService,
		private _hotkeysService: HotkeysService
	) {
		this.isOnline = navigator.onLine;
		this._connectionService.monitor().subscribe(isConnected => {
			this.isOnline = isConnected;
			// console.log('App online status', this.isOnline);
		});
		this.validateForm();
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
	}

	onNoClick() {
		this.getCommonData.emit({ openSidebar: false, sidebarType: 'Brand' });
	}

	validateForm() {
		this.myForm = this._formBuilder.group({
			BrandName: [null, Validators.required],
			Parent: [''],
			Description: [null],
			GradeCode: [null],
			Manufacturer: [null]
		});
	}
	get f() {
		return this.myForm.controls;
	}

	onSelectBrandname(event) {
		//console.log("event",event);
		if (typeof (event) != "undefined") {
			if (typeof (event._source.tag) == "undefined") {
				this.mfgList = [];
				this.tempObj = {
					id: event._source.Manufacturer_ManufacturerName,
					text: event._source.Manufacturer_ManufacturerName
				};
				this.mfgList.push(this.tempObj);
				this.myForm.controls['Manufacturer'].setValue(event._source.Manufacturer_ManufacturerName);
				this.myForm.controls['Description'].setValue(event._source.Description);
			} else {
				this.myForm.controls['Manufacturer'].setValue(null);
				this.myForm.controls['Description'].setValue(null);
			}
		} else {
			this.myForm.controls['Manufacturer'].setValue(null);
			this.myForm.controls['Description'].setValue(null);
			this.getAllmfg();
		}
	}

	onSelectManufacturer(event) {
		//console.log("event",event);
		if (typeof (event) != "undefined") {
			// console.log("event.text", event.text);
			this.mfgList = [];
			this.tempObj = {
				id: event.text,
				text: event.text
			};
			this.mfgList.push(this.tempObj);
			this.myForm.controls['Manufacturer'].setValue(event.text);
		}
	}

	addTag(name) {
		this._source = {
			_source: { brand_name: name, tag: true }
		};
		return this._source;
	}

	onBrandNameSearch($event) {
		if ($event.timeStamp - this.lastKeypress > 100) {
			this.queryText = $event.target.value;

			this._elasticsearchService.fullTextSearch(
				BrandsManageComponent.INDEX,
				'brand_name', this.queryText, this.SearchField).then(
					response => {
						this.BrandNameDropDownList = response.hits.hits;
					}, error => {
						console.error(error);
					}).then(() => {
						//console.log('Search Completed!');
					});
		}
		this.lastKeypress = $event.timeStamp;
	}

	ngOnChanges(changes: SimpleChanges) {
		this.dialogTitle = "Add New Brand";
		this.receivedData = {};
		this.editData = [];
		const change: SimpleChange = changes.pageData;
		this.receivedData = change.currentValue;
		// console.log('this.receivedData', this.receivedData);
		if (typeof (this.receivedData._openSidebar) != 'undefined' && this.receivedData._openSidebar) {
			this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
			if (typeof (this.receivedData._editData) != "undefined" && typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null && this.receivedData._editData.data.length) {
				setTimeout(() => {
					if (typeof (this.brandNameInputField) != 'undefined') {
						this.brandNameInputField.focus();
					}
				}, 1000);
			}
			else {
				setTimeout(() => {
					if (typeof (this.brandNameSelectField) != 'undefined') {
						this.brandNameSelectField.focus();
					}
				}, 1000);
			}
		}
		if (typeof (this.receivedData._editData) != "undefined") {
			if (typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null) {
				this.editData = this.receivedData._editData.data;
				this.backupEditData = this.receivedData._editData.data;
				// console.log(this.editData);
				if (this.editData.length) {
					this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
					//console.log('this.editData', this.editData);
					this.dialogTitle = "Update Brand";
					const BrandNameControl = this.myForm.get('BrandName');
					if (this.editData.length == 1) {
						BrandNameControl.setValidators([Validators.required]);
						this.myForm.setValue({
							BrandName: this.editData[0].BrandName,
							Description: this.editData[0].Description,
							GradeCode: this.editData[0].GradeCode,
							Manufacturer: this.editData[0].ManufacturerName,
							Parent: this.editData[0].ParentBrandName
						});
						this.isSelectBox = false;
					}
					else {
						this.isSelectBox = true;
						BrandNameControl.clearValidators();
					}
				}
			}
			if (typeof (this.receivedData._editData.newbrand) != "undefined" && this.receivedData._editData.newbrand != null) {
				if (typeof (event) != "undefined") {
					this.BrandNameDropDownList = [];
					this._source = {
						_source: { brand_name: this.receivedData._editData.newbrand, tag: true }
					};
					this.BrandNameDropDownList.push(this._source);
					this.myForm.controls['BrandName'].setValue(this.receivedData._editData.newbrand);
				}
			}
		}
		if (typeof (this.receivedData.preSetText) != "undefined" && this.receivedData.preSetText != null) {
			this.BrandNameDropDownList = [];
			this._source = {
				_source: { brand_name: this.receivedData.preSetText, tag: true }
			};
			this.BrandNameDropDownList.push(this._source);
			const BrandName = this.myForm.get('BrandName');
			BrandName.setValue(this.receivedData.preSetText);
			this.brandName = this.receivedData.preSetText;
			this.myForm.updateValueAndValidity();

		}
		// console.log('this.receivedData', this.receivedData);
	}

	ngOnInit() {
		this.getAllmfg();
		this.getAllBrand();
	}

	getAllmfg() {
		this._helper.apiGetLocal('manufacturers/').subscribe(
			data => {
				if (data.message) {
					this.mfgList = data["result"];
				}
			},
			error => console.log(error)
		);
	}

	getAllBrand() {
		this._helper.apiGetLocal('parentbrands/').subscribe(
			data => {
				if (data.message) {

				}
				this.BrandsList = data.result;
			},
			error => console.log(error)
		);
	}

	setPreData() {
		// console.log('setPreData', this.editData);
		if (this.editData.length) {
			for (let i = 0; i < this.editData.length; i++) {
				this.editData[i].BrandName = this.myForm.value.BrandName != null ? this.myForm.value.BrandName : this.editData[i].BrandName;
				this.editData[i].Description = this.myForm.value.Description != null ? this.myForm.value.Description : this.editData[i].Description;
				this.editData[i].GradeCode = this.myForm.value.GradeCode != null ? this.myForm.value.GradeCode : this.editData[i].GradeCode;
				this.editData[i].Manufacturer = this.myForm.value.ManufacturerName != null ? this.myForm.value.ManufacturerName : this.editData[i].ManufacturerName;
				this.editData[i].Parent = this.myForm.value.Parent != null ? this.myForm.value.Parent : this.editData[i].Parent;
			}
		}
	}

	doManage() {
		if (this.editData.length) {
			this.isbtnLoaderShow = true;
			this.btnUpdateTxt = "Please Wait..";
			for (let i = 0; i < this.editData.length; i++) {
				this.editData[i].BrandName = this.myForm.value.BrandName != "" && this.myForm.value.BrandName != null ? this.myForm.value.BrandName : this.backupEditData[i].BrandName;
				this.editData[i].Description = this.myForm.value.Description != "" && this.myForm.value.Description != null ? this.myForm.value.Description : this.backupEditData[i].Description;
				this.editData[i].GradeCode = this.myForm.value.GradeCode != "" && this.myForm.value.GradeCode != null ? this.myForm.value.GradeCode : this.backupEditData[i].GradeCode;
				this.editData[i].Manufacturer = this.myForm.value.Manufacturer != "" && this.myForm.value.Manufacturer != null ? this.myForm.value.Manufacturer : this.backupEditData[i].Manufacturer;
				this.editData[i].Parent = this.myForm.value.Parent != "" && this.myForm.value.Parent != null ? this.myForm.value.Parent : this.backupEditData[i].Parent;
			}
			this._helper.apiPutLocal(this.editData, this.moduleAPI).subscribe(
				res => {
					let preSetText = this.myForm.get('BrandName').value;
					if (res.message) {
						// this._snackBar.open(res.message);
						this._helper.notify({ message: res.message, messageType: res.status });
					}
					if (res.status == 1) {
						this.submitted = false;
						this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
						this.isbtnLoaderShow = false;
						// this._dialogRef.close(true);
						this.getCommonData.emit({ openSidebar: false, dataAdded: true, hitListAction: 'editSuccess', noSelectionCheck: true, sidebarType: 'Brand', preSetText: preSetText });
					}
					this.btnUpdateTxt = "Update";
					this.isbtnLoaderShow = false;
				},
				error => {
					console.log('error', error);
					this.btnUpdateTxt = "Update";
				}
			);
		}
		else {
			this.btnCreateTxt = "Please Wait..";
			this.submitted = true;
			if (this.myForm.invalid) {
				this.btnCreateTxt = "Create";
				this.isDisabled = false;
				return;
			}
			this.isbtnLoaderShow = true;
			this._helper.apiPostLocal(this.myForm.value, this.moduleAPI).subscribe(
				res => {
					let preSetText = this.myForm.get('BrandName').value;
					if (res.message) {
						// this._snackBar.open(res.message);
						this._helper.notify({ message: res.message, messageType: res.status });
					}
					if (res.status == 1) {
						this.submitted = false;
						this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
						this.isbtnLoaderShow = false;
						if (this.IsAnotherChecked == true) {
							this.submitted = false;
							this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
							this.isbtnLoaderShow = false;
						} else {
							// this._dialogRef.close(this.myForm.value);
							this.getCommonData.emit({ openSidebar: false, dataAdded: this.myForm.value, sidebarType: 'Brand', preSetText: preSetText });
						}
					}
					this.btnCreateTxt = "Create";
					this.isbtnLoaderShow = false;
				},
				error => {
					console.log('error', error);
					this.btnCreateTxt = "Create";
				}
			);
		}
	}

	// funIschecked() {
	// 	if (this.IsAnotherChecked == false) {
	// 		this.IsAnotherChecked = true;
	// 	} else {
	// 		this.IsAnotherChecked = false;
	// 	}

	// }

	resetForm(_formGroupDirective: FormGroupDirective, _formGroup: FormGroup, _functionName: string): void {
		//console.log("reset");
		_formGroupDirective.resetForm();
		_formGroup.reset();
		this[_functionName]();
		this.BrandNameDropDownList = [];
	}

}
