import { DialogsService } from '../../../../services/dialogs.service';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { ElasticsearchService } from '../../../../services/elasticsearch.service';
import { HelperService } from '../../../../services/helper.service';
import { ConnectionService } from 'ng-connection-service';
import { NacsListComponent } from '../../dialogs/nacs-list/nacs-list.component';
export interface PageData {
	_editData: {
		data: [],
		newbrand: null
	}
}
export interface PeriodicElement {
	id: number;
}

@Component({
	selector: 'app-posdepartment-manage',
	templateUrl: './posdepartment-manage.component.html',
	styleUrls: ['./posdepartment-manage.component.scss']
})
export class PosdepartmentManageComponent implements OnInit {
	@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	@Input() pageData: PageData;
	@Output() getCommonData = new EventEmitter<{}>();

	moduleName: string = 'POS Department';
	displayModuleName: string = 'Pos Department';
	moduleAPI: string = 'itemapis/posdepartmentcreate/';
	moduleLink: string = 'admin-mode/posdepartment';
	myForm: FormGroup;
	mfgList: any = [];
	submitted: boolean = false;
	BrandsList: any[];
	message: string;
	editData: any = [];
	dialogTitle: string = "Add New Pos Department";
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
	public dataSource = new MatTableDataSource<PeriodicElement>();
	isSelectBox: boolean = false;
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;
	isOpenSidebar: boolean = false;
	processMode: { id: string; text: string; }[];
	parentPOSDepartment: any;
	retailStore: any;
	sellingRuleList: any;
	sellingRuleListBk: any;
	nacsData: any[];
	updateData: any;
	public updateValue = {
		id: [],
		data: null,
		nacs: [],
		previous: []
	};
	TobeselectedValue: any;

	constructor(
		private _helper: HelperService,
		private _formBuilder: FormBuilder,
		public _formDirective: FormGroupDirective,
		public _elasticsearchService: ElasticsearchService,
		public _connectionService: ConnectionService,
		private _hotkeysService: HotkeysService,
		private dialog: MatDialog,
		private dialogsService: DialogsService
	) {
		this.isOnline = navigator.onLine;
		this._connectionService.monitor().subscribe(isConnected => {
			this.isOnline = isConnected;
		});
		this.validateForm();
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
	}

	onNoClick() {
		this.getCommonData.emit({ openSidebar: false, sidebarType: 'POSDepartment' });
	}

	validateForm() {
		this.myForm = this._formBuilder.group({
			departmentName: ['', Validators.required],
			departmentNumber: [null, [Validators.min(0), Validators.max(999999999), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
			parentDepartment: [''],
			store: [''],
			descripition: [''],
			sellingRule: [null]
		});
	}
	get f() {
		return this.myForm.controls;
	}

	onSelectBrandname(event) {
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

	ngOnChanges(changes: SimpleChanges) {
		this.dataSource.data = [];
		this.receivedData = {};
		this.editData = [];
		const change: SimpleChange = changes.pageData;
		this.receivedData = change.currentValue;
		if (typeof (this.receivedData._editData) != "undefined") {
			if (typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null) {
				this.editData = this.receivedData._editData.data;

				this.getForupdateData(this.editData);
			}
		}
		else {
			this.dialogTitle = "Add POS Department";
			this.myForm.reset();
			// if(this.myForm.value!=null)
			// {
			//   this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
			// }

		}
		if (typeof (this.receivedData.preSetText) != "undefined" && this.receivedData.preSetText != null) {
			const departmentName = this.myForm.get('departmentName');
			departmentName.setValue(this.receivedData.preSetText);
			this.myForm.updateValueAndValidity();
		}
	}

	ngOnInit() {
		this.dropDownData();
		this.getSellingRuleList();
	}
	public getForupdateData(pageData) {
		this.editData = pageData;
		if (this.editData.length) {
			this.dialogTitle = "Update POS Department";
			const departmentName = this.myForm.get('departmentName');
			const departmentNumber = this.myForm.get('departmentNumber');
			if (this.editData.length == 1) {
				this.pushAllIdInArray(this.editData)
				this._helper.apiPost(this.updateValue.id, `itemapis/poscheckequal/`).subscribe(data => {
					this.updateData = data.data;
					departmentName.setValidators([Validators.required]);
					departmentNumber.setValidators([Validators.maxLength(10)]);
					this.setCommonDataInForm();
					departmentName.patchValue(this.updateData.departmentName);
					departmentNumber.patchValue(this.updateData.departmentNumber);
					if (data.nacs.length && data.nacs.length != 0) {
						this.dataSource.data = [];
						this.dataSource.data = data.nacs as PeriodicElement[];
					}
				});
			}
			else {
				departmentName.clearValidators();
				departmentNumber.clearValidators();
				this.pushAllIdInArray(this.editData)
				this._helper.apiPost(this.updateValue.id, `itemapis/poscheckequal/`).subscribe(data => {
					this.updateData = data.data;
					this.setCommonDataInForm();
					if (data.nacs.length && data.nacs.length != 0) {
						this.dataSource.data = [];
						this.dataSource.data = data.nacs as PeriodicElement[];
					}
				});
			}
		}
	}
	public setCommonDataInForm() {
		this.myForm.patchValue({
			parentDepartment: this.updateData.parentDepartmentID == null ? "" : this.updateData.parentDepartmentID,
			sellingRule: this.updateData.itemSellingRuleID == null ? "" : this.updateData.itemSellingRuleID,
			descripition: this.updateData.descripition == null ? "" : this.updateData.descripition,
			store: this.updateData.store == null ? "" : this.updateData.storeid,
		});
	}
	public pushAllIdInArray(allId) {
		this.updateValue.id = [];
		for (let edit of allId) {
			this.updateValue.id.push(edit.id);
		}
	}

	public dropDownData() {
		this._helper.apiGet('itemapis/poslist/?colname=RetailStore&').subscribe(
			data => {
				this.retailStore = data.result;
			},
			error => console.log(error)
		);
		this._helper.apiGet('itemapis/poslist/?colname=ParentPOSDepartment&').subscribe(
			data => {
				this.parentPOSDepartment = data.result;
			},
			error => console.log(error)
		);
		this.processMode = [
			{ id: 'Active', text: 'Active' },
			{ id: 'Discontinued', text: 'Discontinued' },
			{ id: 'Seasonal', text: 'Seasonal' },
			{ id: 'To be discontinued', text: 'To be discontinued' },
			{ id: 'Held for future release', text: 'Held for future release' }
		];
	}
	getSellingRuleList(isSelectionRequired: number = 0) {
		this._helper.apiGet('itemapis/poslist/?colname=ItemSellingRule&').subscribe(
			data => {
				if (data["status"] == 1) {
					this.sellingRuleList = data["result"];
					this.sellingRuleListBk = this.sellingRuleList;
				}
				if (isSelectionRequired != 0) {
					this.myForm.controls['sellingRule'].setValue(this.TobeselectedValue);
				}
			},
			error => console.log(error)
		);
	}
	clear() {
		this.sellingRuleList = this.sellingRuleListBk;
	}

	getAllmfg() {
		this._helper.apiGet('itemapis/manufacturers').subscribe(
			data => {
				if (data.message) {
					this.mfgList = data["result"];
				}
			},
			error => console.log(error)
		);
	}

	doManage() {
		if (this.editData.length) {
			this.isbtnLoaderShow = true;
			this.btnUpdateTxt = "Please Wait..";
			// if (this.myForm.invalid) {
			//   this.myForm.controls.departmentName.markAsTouched();
			//   this.myForm.controls.departmentNumber.markAsTouched();
			//   this.btnUpdateTxt = "Update";
			//   this.isbtnLoaderShow = false;
			//   return;
			// }
			this.pushAllIdInArray(this.editData)
			this.updateValue.data = this.myForm.value;
			this.updateValue.nacs = this.dataSource.data;
			this.updateValue.previous = this.updateData;
			this._helper.apiPut(this.updateValue, `itemapis/posdepartmentcreate/`).subscribe(
				res => {
					let preSetText = this.myForm.get('departmentName').value;
					this._helper.notify({ message: res.message, messageType: res.status });
					if (res.status == 1) {
						this.submitted = false;
						this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
						this.isbtnLoaderShow = false;
						// this._dialogRef.close(true);
						this.getCommonData.emit({ openSidebar: false, dataAdded: true, hitListAction: 'editSuccess', noSelectionCheck: true, sidebarType: 'POSDepartment', preSetText: preSetText });
					}
					this.btnUpdateTxt = "Update";
					this.isbtnLoaderShow = false;
				},
				error => {
					console.log('error', error);
					this.isbtnLoaderShow = false;
					this.btnUpdateTxt = "Update";
				},
				() => {
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
			if (this.isOnline) {
				var postValue = this.myForm.value;
				postValue.nacs = this.dataSource.data;
				this._helper.apiPost(postValue, this.moduleAPI).subscribe(
					res => {
						let preSetText = this.myForm.get('departmentName').value;
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
								this.getCommonData.emit({ openSidebar: false, dataAdded: this.myForm.value, sidebarType: 'POSDepartment', preSetText: preSetText });
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
			else {
				// var myThis = this;
				// this._helper.thisDb().brands().find({ BrandName: myThis.myForm.value.BrandName }, function (err, data) {
				//   myThis.btnCreateTxt = "Create";
				//   myThis.isbtnLoaderShow = false;
				//   if (!data.length) {
				//     myThis._helper.thisDb().brands().insert(myThis.myForm.value, function (err, data) {
				//       // console.log('insert', data);
				//       this.getCommonData.emit({ openSidebar: false, dataAdded: this.myForm.value });
				//       // myThis._snackBar.open('Brand created successfully.');
				//       this._helper.notify({ message: 'Brand created successfully.', messageType: 1 });
				//     });
				//   }
				//   else {
				//     // myThis._snackBar.open('Brand already exist.');
				//     this._helper.notify({ message: 'Brand already exist.', messageType: 0 });
				//   }
				// });
			}
		}
	}
	resetForm(_formGroupDirective: FormGroupDirective, _formGroup: FormGroup, _functionName: string): void {
		_formGroupDirective.resetForm();
		_formGroup.reset();
		this[_functionName]();
	}
	//Start:Open NACS Dialog
	public openDialog() {
		this.NacsListDialog(this.dataSource.data).subscribe(res => {
			if (res) {
				this.nacsData = [];
				this.dataSource.data = res as PeriodicElement[];
			}
		}
		);
	}
	public NacsListDialog(data: any = []): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'mid-pop';
		dialogConfig.data = { data: data };
		let dialogRef: MatDialogRef<NacsListComponent>;
		dialogRef = this.dialog.open(NacsListComponent, dialogConfig);
		return dialogRef.afterClosed();
	}
	//Start:Open NACS Dialog


	onSelectSellingRuleName(event) {
		if (typeof (event) != "undefined") {
			if (typeof (event.id) != "undefined") {
				this.sellingRuleList = [];
				this.tempObj = {
					id: event.id,
					text: event.text
				};
				this.sellingRuleList = this.sellingRuleListBk;
				this.sellingRuleList.push(this.tempObj);
				this.myForm.controls['sellingRule'].setValue(event.id);
			} else {
				this.addSellingRule(event.text);
			}
		}
	}
	addSellingRule(newSellingRuleName) {
		this.dialogsService.sellingRuleAddEditDialog([], newSellingRuleName).subscribe(res => {
			if (res) {
				this.TobeselectedValue = res.SellingRuleId;
			}
			this.getSellingRuleList(1);
		}
		);
	}

}
