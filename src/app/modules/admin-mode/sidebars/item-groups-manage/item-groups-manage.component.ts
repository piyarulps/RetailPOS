import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
// import { MatSnackBar } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MatInput } from '@angular/material/input';

import { ElasticsearchService } from '../../../../services/elasticsearch.service';
import { HelperService } from '../../../../services/helper.service';
import { ConnectionService } from 'ng-connection-service';
import { DialogsService } from '../../../../services/dialogs.service';

export interface PageData {
	_editData: {
		data: []
	}
}

@Component({
	selector: 'app-item-groups-manage',
	templateUrl: './item-groups-manage.component.html',
	styleUrls: ['./item-groups-manage.component.scss']
})
export class ItemGroupsManageComponent implements OnInit {

	@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	@Input() pageData: PageData;
	@Output() getCommonData = new EventEmitter<{}>();
	@ViewChild('groupNameInput') groupNameInputField: MatInput;

	moduleName: string = 'GroupSelectItem'; // GroupSelectItem
	displayModuleName: string = 'Item Groups';
	moduleAPI: string = 'itemapis/items/?group_item=0&';
	moduleLink: string = 'admin-mode/item-groups';
	myForm: FormGroup;
	submitted: boolean = false;
	message: string;
	editData: any = [];
	backupEditData: any = [];
	dialogTitle: string = "Add Group Item";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Create";
	btnUpdateTxt: string = "Update";
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;
	isOpenSidebar: boolean = false;

	GroupItemID: any = null;
	conditionsData: any = {};
	SelectedGroupItemID: any = [];

	showConditionsData: string = 'Manage Conditions';

	constructor(
		private _dialog: DialogsService,
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

	showConditions(conditions: any) {
		if (conditions.length) {
			this.showConditionsData = '';
			conditions.forEach((value, key) => {
				// console.log('showConditions value', value);
				let conditionType = value.condition;
				let textSet = value.text;
				if (key != 0) {
					this.showConditionsData += ` <span class="font-weight-bold">${conditionType}</span> `;
				}
				this.showConditionsData += `${textSet.showName} ${textSet.showOperator} To ${textSet.showValue}`;
			});
		}
		// console.log('this.showConditionsData', this.showConditionsData);
	}

	manageGroupItem() {
		// console.log('manageGroupItem this.GroupItemID', this.GroupItemID);
		if (this.GroupItemID != 'undefined' && this.GroupItemID != null) {
			this.SelectedGroupItemID = [];
			this.SelectedGroupItemID.push(this.GroupItemID);
			this._dialog.itemGroupsManageDialog(this.SelectedGroupItemID).subscribe(res => {
				if (res != undefined) {
					// console.log('manageGroupItem edit', res);
					if (res) {
						this.conditionsData = res;
						this.showConditions(this.conditionsData.filter);
					}
				}
			});
		}
		else {
			// console.log('this.conditionsData', this.conditionsData);
			this._dialog.itemGroupsManageDialog([], this.conditionsData).subscribe(res => {
				if (res != undefined) {
					// console.log('manageGroupItem add', res);
					if (res) {
						this.conditionsData = res;
						this.showConditions(this.conditionsData.filter);
					}
				}
			});
		}
	}

	onNoClick() {
		this.getCommonData.emit({ openSidebar: false });
	}

	validateForm() {
		this.myForm = this._formBuilder.group({
			description: [null, Validators.required],
			TypeCode: ["GSI", Validators.required],
			upc: [["GSI"], Validators.required],
		});
	}

	get f() {
		return this.myForm.controls;
	}

	ngOnChanges(changes: SimpleChanges) {
		this.dialogTitle = "Add Group Item";
		this.showConditionsData = "Manage Conditions";
		this.receivedData = {};
		this.editData = [];
		this.conditionsData = {};
		this.GroupItemID = null;
		const change: SimpleChange = changes.pageData;
		this.receivedData = change.currentValue;
		// console.log('this.receivedData', this.receivedData);
		if (typeof (this.receivedData._openSidebar) != 'undefined' && this.receivedData._openSidebar) {
			this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
			if (typeof (this.receivedData._editData) != "undefined" && typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null && this.receivedData._editData.data.length) {
				setTimeout(() => {
					if (typeof (this.groupNameInputField) != 'undefined') {
						this.groupNameInputField.focus();
					}
				}, 1000);
			}
		}
		if (typeof (this.receivedData._editData) != "undefined") {
			if (typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null) {
				this.editData = this.receivedData._editData.data;
				this.backupEditData = this.receivedData._editData.data;
				console.log(this.editData);
				if (typeof this.editData.GroupItemID != 'undefined' && this.editData.GroupItemID != null) {
					this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
					// console.log('this.editData', this.editData);
					this.GroupItemID = this.editData.GroupItemID;
					this.dialogTitle = "Update Group Item";
					// this.myForm.setValue({
					// 	description: this.editData.description
					// });
					this.getGroupItemList();
				}
			}
		}
		// console.log('this.receivedData', this.receivedData);
	}

	getGroupItemList() {
		// console.log("getGroupItemList");
		this._helper.apiGet(`itemapis/item_basic_info/${this.GroupItemID}`).subscribe(
			data => {
				// console.log("getGroupItemList data", data);
				if (data["status"] == 1) {
					this.myForm.controls['description'].setValue(data.result.Description);
					this.myForm.controls['TypeCode'].setValue(data.result.TypeCode);
					this.myForm.controls['upc'].setValue(data.result.ItemID);
					// this.setConditions(data.result.group_item_filter);
					let conditions: any = data.result.group_item_filter;
					this.showConditions(conditions);
				}
			},
			error => console.log(error)
		);
	}

	ngOnInit() { }

	doManage() {
		if (this.GroupItemID != null) {
			this.isbtnLoaderShow = true;
			this.btnUpdateTxt = "Please Wait..";
			let formData = Object.assign(this.myForm.value, this.conditionsData);
			this._helper.apiPut(formData, `itemapis/item_basic_info/${this.GroupItemID}/`).subscribe(
				res => {
					if (res.message) {
						this._helper.notify({ message: res.message, messageType: res.status });
					}
					if (res.status == 1) {
						this.submitted = false;
						this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
						this.isbtnLoaderShow = false;
						// this._dialogRef.close(true);
						this.getCommonData.emit({ openSidebar: false, dataAdded: true, hitListAction: 'editSuccess', noSelectionCheck: true });
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
			let formData = Object.assign(this.myForm.value, this.conditionsData);
			this._helper.apiPost(formData, 'itemapis/item_add/').subscribe(
				res => {
					if (res.message) {
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
							this.getCommonData.emit({ openSidebar: false, dataAdded: this.myForm.value });
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

	resetForm(_formGroupDirective: FormGroupDirective, _formGroup: FormGroup, _functionName: string): void {
		//console.log("reset");
		_formGroupDirective.resetForm();
		_formGroup.reset();
		this[_functionName]();
	}

}
