import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
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
	selector: 'app-sizes-manage',
	templateUrl: './sizes-manage.component.html',
	styleUrls: ['./sizes-manage.component.scss']
})
export class SizesManageComponent implements OnInit {

	@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	@Input() pageData: PageData;
	@Output() getCommonData = new EventEmitter<{}>();
	@ViewChild('sizeNameInput') sizeNameInputField: MatInput;
	@ViewChild('sizeNameSelect') sizeNameSelectField: NgSelectComponent;

	moduleName: string = 'Sizes';
	displayModuleName: string = 'Size';
	moduleAPI: string = 'sizes/';
	moduleLink: string = 'admin-mode/sizes';
	myForm: FormGroup;
	mfgList: any = [];
	submitted: boolean = false;
	sizeCodeList: any[];
	sizeFamilyList: any[];
	actualSizeCodeList: any[];
	message: string;
	editData: any = [];
	backupEditData: any = [];
	dialogTitle: string = "Add New Size";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Create";
	btnUpdateTxt: string = "Update";
	TableNameDropDownList: any = [];
	TableNameLoading: boolean = false;
	response: any;
	_source: any = {};
	private static readonly INDEX = 'size_master';
	tempObj: any;
	private queryText = '';
	private lastKeypress = 0;
	tag: boolean;
	SearchField: any = ['TableName', 'SizeFamily', 'Description'];
	isSelectBox: boolean = false;
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;

	sizeName: string = '';

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
		this.myForm = this._formBuilder.group({
			TableName: [null, Validators.required],
			Description: [''],
			SizeFamily: ['']
		});
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
	}

	onNoClick() {
		this.getCommonData.emit({ openSidebar: false, sidebarType: 'Size' });
	}

	get f() {
		return this.myForm.controls;
	}

	onSelectTableName(event) {
		//console.log("event", event);
		if (typeof (event) != "undefined") {
			if (typeof (event._source.tag) == "undefined") {
				// console.log("event._source", event._source.tag);
				//console.log("else");
				this.sizeFamilyList = [];
				this.tempObj = {
					id: event._source.SizeFamilyName,
					SizeFamilyName: event._source.SizeFamilyName
				};
				this.sizeFamilyList.push(this.tempObj);
				this.myForm.controls['SizeFamily'].setValue(event._source.SizeFamilyName);
				this.myForm.controls['Description'].setValue(event._source.Description);
			} else {
				this.myForm.controls['SizeFamily'].setValue('');
				this.myForm.controls['Description'].setValue('');
			}
		} else {
			this.myForm.controls['SizeFamily'].setValue('');
			this.myForm.controls['Description'].setValue('');
			this.dropDownData();
		}
	}

	addTag(name) {
		this._source = {
			_source: { TableName: name, tag: true }
		};
		return this._source;
	}

	onTableNameSearch($event) {
		if ($event.timeStamp - this.lastKeypress > 100) {
			this.queryText = $event.target.value;

			this._elasticsearchService.fullTextSearch(
				SizesManageComponent.INDEX,
				'TableName', this.queryText, this.SearchField).then(
					response => {
						this.TableNameDropDownList = response.hits.hits;
					}, error => {
						console.error(error);
					}).then(() => {
						//console.log('Search Completed!');
					});
		}
		this.lastKeypress = $event.timeStamp;
	}

	ngOnChanges(changes: SimpleChanges) {
		this.dialogTitle = "Add New Size";
		this.receivedData = {};
		this.editData = [];
		const change: SimpleChange = changes.pageData;
		this.receivedData = change.currentValue;
		// console.log(this.receivedData);
		if (typeof (this.receivedData._openSidebar) != 'undefined' && this.receivedData._openSidebar) {
			this.resetForm();
			if (typeof (this.receivedData._editData) != "undefined" && typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null && this.receivedData._editData.data.length) {
				setTimeout(() => {
					if (typeof (this.sizeNameInputField) != 'undefined') {
						this.sizeNameInputField.focus();
					}
				}, 1000);
			}
			else {
				setTimeout(() => {
					if (typeof (this.sizeNameSelectField) != 'undefined') {
						this.sizeNameSelectField.focus();
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
					this.resetForm();
					//console.log('this.editData', this.editData);
					this.dialogTitle = "Update Size";
					const TableNameControl = this.myForm.get('TableName');
					if (this.editData.length == 1) {
						TableNameControl.setValidators([Validators.required]);
						this.myForm.setValue({
							TableName: this.editData[0].TableName,
							Description: this.editData[0].Description,
							SizeFamily: this.editData[0].SizeFamilyName
						});
						TableNameControl.patchValue(this.editData[0].TableName);
					}
					else {
						TableNameControl.clearValidators();
					}
				}
			}
			if (typeof (this.receivedData._editData.newSize) != "undefined" && this.receivedData._editData.newSize != null) {
				if (typeof (event) != "undefined") {
					this.TableNameDropDownList = [];
					this._source = {
						_source: { TableName: this.receivedData._editData.newSize, tag: true }
					};
					this.TableNameDropDownList.push(this._source);
					this.myForm.controls['TableName'].setValue(this.receivedData._editData.newSize);
				}
			}
		}
		if (typeof (this.receivedData.preSetText) != "undefined" && this.receivedData.preSetText != null) {
			this.TableNameDropDownList = [];
			this._source = {
				_source: { TableName: this.receivedData.preSetText, tag: true }
			};
			this.TableNameDropDownList.push(this._source);
			const TableName = this.myForm.get('TableName');
			TableName.setValue(this.receivedData.preSetText);
			this.sizeName = this.receivedData.preSetText;
			this.myForm.updateValueAndValidity();
		}
	}


	ngOnInit() {
		// this.editData = this._editData.data;
		// if (this.editData.length) {
		// 	// console.log('this.editData', this.editData);
		// 	this.dialogTitle = "Update Size";
		// 	const TableNameControl = this.myForm.get('TableName');
		// 	if (this.editData.length == 1) {
		// 		TableNameControl.setValidators([Validators.required]);
		// 		this.myForm.setValue({
		// 			TableName: this.editData[0].TableName,
		// 			Description: this.editData[0].Description,
		// 			SizeFamily: this.editData[0].SizeFamily
		// 		});
		// 		TableNameControl.patchValue(this.editData[0].TableName);
		// 	}
		// 	else {
		// 		TableNameControl.clearValidators();
		// 	}
		// }
		// if (typeof (this._editData.newSize) != "undefined" && this._editData.newSize != null) {
		// 	if (typeof (event) != "undefined") {
		// 		this.TableNameDropDownList = [];
		// 		this._source = {
		// 			_source: { TableName: this._editData.newSize, tag: true }
		// 		};
		// 		this.TableNameDropDownList.push(this._source);
		// 		this.myForm.controls['TableName'].setValue(this._editData.newSize);
		// 	}
		// }
		this.dropDownData();

	}

	dropDownData() {
		this._helper.apiGetLocal('sizefamilies/').subscribe(
			data => {
				this.sizeFamilyList = data;
			},
			error => console.log(error)
		);
		this.sizeCodeList = [
			{ id: '1', name: 'S01' },
			{ id: '2', name: 'S02' },
			{ id: '3', name: 'S03' }
		];
		this.actualSizeCodeList = [
			{ id: '1', name: 'AS01' },
			{ id: '2', name: 'AS02' },
			{ id: '3', name: 'AS03' }
		];
	}

	setPreData() {
		// console.log('setPreData', this.editData);
		if (this.editData.length) {
			for (let i = 0; i < this.editData.length; i++) {
				this.editData[i].TableName = this.myForm.value.TableName != null ? this.myForm.value.TableName : this.editData[i].TableName;
				this.editData[i].Description = this.myForm.value.Description != null ? this.myForm.value.Description : this.editData[i].Description;
				this.editData[i].SizeFamily = this.myForm.value.SizeFamily != null ? this.myForm.value.SizeFamily : this.editData[i].SizeFamily;
			}
		}
	}

	doManage() {
		// console.log(this.myForm.value); return;
		this.isDisabled = true;
		if (this.editData.length) {
			this.isbtnLoaderShow = true;
			this.btnUpdateTxt = "Please Wait..";
			for (let i = 0; i < this.editData.length; i++) {
				this.editData[i].TableName = this.myForm.value.TableName != "" && this.myForm.value.TableName != null ? this.myForm.value.TableName : this.backupEditData[i].TableName;
				this.editData[i].Description = this.myForm.value.Description != "" && this.myForm.value.Description != null ? this.myForm.value.Description : this.backupEditData[i].Description;
				this.editData[i].SizeFamily = this.myForm.value.SizeFamily != "" && this.myForm.value.SizeFamily != null ? this.myForm.value.SizeFamily : this.backupEditData[i].SizeFamily;
			}
			// console.log("update", this.editData);
			this._helper.apiPutLocal(this.editData, this.moduleAPI).subscribe(
				res => {
					let preSetText = this.myForm.get('TableName').value;
					if (res["message"]) {
						this._helper.notify({ message: res["message"], messageType: res["status"] });
					}
					if (res["status"] == 1) {
						this.submitted = false;
						this.resetForm();
						this.isbtnLoaderShow = false;
						// this._dialogRef.close(true);
						this.getCommonData.emit({ openSidebar: false, dataAdded: true, hitListAction: 'editSuccess', noSelectionCheck: true, sidebarType: 'Size', preSetText: preSetText });
					}
					this.isDisabled = false;
					this.btnUpdateTxt = "Update";
					this.isbtnLoaderShow = false;
				},
				error => {
					console.log('error', error);
					this.isDisabled = false;
					this.btnUpdateTxt = "Update";

				},
				() => {
					// this.pubSubService.changeMessage(this.defaultMessage);
					// this.snackBar.open(this.message);
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
			// let addData: any = this.myForm.value;
			// // console.log('addData', addData);
			// addData['TableCode'] = '';
			// addData['ActualSizeCode'] = '';
			// addData['ActualSizeTypeDescription'] = '';
			// addData['ActualSizeProportionDescription'] = '';
			this._helper.apiPostLocal(this.myForm.value, this.moduleAPI).subscribe(
				res => {
					let preSetText = this.myForm.get('TableName').value;
					if (res["message"]) {
						this._helper.notify({ message: res["message"], messageType: res["status"] });
					}
					if (res["status"] == 1) {
						this.submitted = false;
						this.resetForm();
						this.isbtnLoaderShow = false;
						if (this.IsAnotherChecked == true) {
							this.submitted = false;
							this.resetForm();
							this.isbtnLoaderShow = false;
						} else {
							// this._dialogRef.close(this.myForm.value);
							this.getCommonData.emit({ openSidebar: false, dataAdded: this.myForm.value, sidebarType: 'Size', preSetText: preSetText });
						}
					}
					this.isDisabled = false;
					this.btnCreateTxt = "Create";
					this.isbtnLoaderShow = false;
				},
				error => {
					console.log('error', error);
					this.isDisabled = false;
					this.btnCreateTxt = "Create";

				},
				() => {
					// this.pubSubService.changeMessage(this.defaultMessage);
					// this.snackBar.open(this.message);
				}
			);
		}
	}

	// funIschecked() {
	// 	//console.log("aaa");
	// 	if (this.IsAnotherChecked == false) {
	// 		this.IsAnotherChecked = true;
	// 	} else {
	// 		this.IsAnotherChecked = false;
	// 	}

	// }

	resetForm(): void {
		this.formGroupDirective.resetForm();
		this.myForm.reset();
		this.myForm = this._formBuilder.group({
			TableName: [null, Validators.required],
			Description: [''],
			SizeFamily: ['']
		});
	}

}
