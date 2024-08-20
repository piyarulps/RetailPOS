import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, FormArray, FormControl } from '@angular/forms';
// import { MatSnackBar } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { HelperService } from '../../../../services/helper.service';
import { ValidationService } from '../../../../services/validation/validation.service';
// import { ConnectionService } from 'ng-connection-service';
// import { MatInput } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ItemAddCollectionManageComponent } from '../item-add-collection-manage/item-add-collection-manage.component';

export interface PageData {
	_editData: {
		data: []
	}
}

export interface PeriodicElement { }

export class Items {
	PerAssemblyCount: number;
	size: string;
	BrandName: string;
	Description: string;
	POSItemID: string;
	id: number;
	constructor(
		public _validation: ValidationService
	) {
	}
	static asFormGroup(item: Items): FormGroup {
		const fg = new FormGroup({
			size: new FormControl(item.size),
			PerAssemblyCount: new FormControl(item.PerAssemblyCount, Validators.compose(
				[Validators.pattern(/^(\d+)?([.]\d{0,9})?$/), Validators.required])),
			BrandName: new FormControl(item.BrandName),
			Description: new FormControl(item.Description),
			POSItemID: new FormControl(item.POSItemID),
			id: new FormControl(item.id),
		});
		return fg;
	}
}

@Component({
	selector: 'app-item-collection-manage',
	templateUrl: './item-collection-manage.component.html',
	styleUrls: ['./item-collection-manage.component.scss']
})
export class ItemCollectionManageComponent implements OnInit {

	moduleName: string = '';
	displayModuleName: string = 'Item';
	moduleAPI: string = '';
	moduleLink: string = '';
	myForm: FormGroup;
	submitted: boolean = false;
	message: string;
	editData: any = [];
	backupEditData: any = [];
	dialogTitle: string = "Item";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Save";
	btnUpdateTxt: string = "Update";
	isSelectBox: boolean = false;
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;
	selection = new SelectionModel<PeriodicElement>(true, []);
	selectedListData: any = [];
	selectedList: any = [];
	ItemData: any = [];
	ItemID: any = '';
	SelectedsupplerList: any = [];
	obj: any = {};
	strMsg: boolean = false;
	paginationSetup: any = {
		pageLimitOptions: [25, 50, 100],
		pageLimit: 25,
		pageOffset: 0,
		totalRecord: 0
	};
	colname: string = '';
	order_by: string = '';
	searchText: string = '';
	editItemID: any = [];
	isSpinnerLoaderShow: boolean = false;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	isLoading: boolean = false;
	ItemCollectionForm: FormGroup;
	@ViewChild('ItemCollectionTabForm') ItemCollectionDirective: FormGroupDirective;
	editIds: any = [];
	ItemCollectionList: any = [];
	ItemCollectiondataSource = new MatTableDataSource<PeriodicElement>(this.ItemCollectionList);
	ItemCollectionDisplayedColumns: any = ['select', 'POSItemID', 'Description', 'BrandName', 'TableName', 'PerAssemblyCount'];

	constructor(
		private _formBuilder: FormBuilder,
		public _formDirective: FormGroupDirective,
		public _validation: ValidationService,
		public _helper: HelperService,
		public _hotkeysService: HotkeysService,
		public _dialogRef: MatDialogRef<ItemCollectionManageComponent>,
		private _dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public _ItemData: any
	) { }

	manageItem() {
		// console.log('this.editIds', this.editIds);
		this.addItemFromList([], this.editIds).subscribe(
			response => {
				if (response) {
					console.log('manageItem > addItemFromList', response);
					if (response) {
						this.getItemCollection(response.is_multiple_update);
					}
				}
			}
		)
	}

	addItemFromList(data: any = [], itemids: any = []): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, itemid: itemids };
		let dialogRef: MatDialogRef<ItemAddCollectionManageComponent>;
		dialogRef = this._dialog.open(ItemAddCollectionManageComponent, dialogConfig);
		//dialogRef.componentInstance.id = id;
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	getAll(is_multiple_update: string = 'n', pageOffset: number = this.paginationSetup.pageOffset, pageLimit: number = this.paginationSetup.pageLimit, colname: string = this.colname, order_by = this.order_by): Observable<Items[]> {
		this.paginationSetup.pageLimit = pageLimit;
		pageOffset = pageOffset + 1;
		let itemsIDforAddandupdate;
		// console.log('is_multiple_update', is_multiple_update);
		if (is_multiple_update == 'n') {
			// console.log('this.editIds.length', this.editIds.length);
			if (this.editIds.length == 1) {
				itemsIDforAddandupdate = this.ItemID;
			} else {
				itemsIDforAddandupdate = 0;
			}
		} else {
			itemsIDforAddandupdate = this.ItemID;
		}
		const url = `itemapis/items/?parent=${itemsIDforAddandupdate}&offset=${pageOffset}&limit=${pageLimit}&q=${this.searchText}&partyrole=Vendor&listing_type=isblocked&type_value=n&tem_type=AGI`;
		// return this._http.get<any>(url)
		// 	.pipe(map((items: any) => {
		// 		let itemCollecttion: any;
		// 		items.result.forEach((value, key) => {

		// 			itemCollecttion = {
		// 				POSItemID: value.business_unit_group_item[0].site_identity[0].POSItemID,
		// 				Description: value.Description,
		// 				BrandName: (value.BrandName === null) ? '--' : value.BrandName.BrandName,
		// 				size: value.size,
		// 				PerAssemblyCount: value.PerAssemblyCount,
		// 				id: value.id
		// 			};
		// 			this.ItemCollectionList.push(itemCollecttion);
		// 		});
		// 		return this.ItemCollectionList;
		// 	}));
		return this._helper.apiGet(url).pipe(
			map((items: any) => {
				this.ItemCollectionList = [];
				let itemCollecttion: any;
				items.result.forEach((value, key) => {

					itemCollecttion = {
						POSItemID: value.business_unit_group_item[0].site_identity[0].POSItemID,
						Description: value.Description,
						BrandName: (value.BrandName === null) ? '--' : value.BrandName.BrandName,
						size: value.size,
						PerAssemblyCount: value.PerAssemblyCount,
						id: value.id
					};
					this.ItemCollectionList.push(itemCollecttion);
				});
				return this.ItemCollectionList;
			}
			));
	}

	getAllAsFormArray(): Observable<FormArray> {
		return this.getAll().pipe(map((items: Items[]) => {
			// Maps all the albums into a formGroup defined in tge album.model.ts
			const fgs = items.map(Items.asFormGroup);
			return new FormArray(fgs);
		}));
	}

	getItemCollection(is_multiple_update: string = 'n', pageOffset: number = this.paginationSetup.pageOffset, pageLimit: number = this.paginationSetup.pageLimit, colname: string = this.colname, order_by = this.order_by) {
		this.isLoading = true;
		this.getAllAsFormArray().subscribe(items => {
			this.isLoading = false;
			this.ItemCollectionForm.setControl('settingItemCollection', items);
		});
	}

	search(e) {
		if (this.searchText.length) {
			this.loadPage()
		}
		else {
			this.getItemCollection('n', 0, 25);
		}
	}

	loadPage() {
		this.getItemCollection('n', this.paginator.pageIndex, this.paginator.pageSize);
	}

	addItem(direction: string = null, currentStep: number = null, isSavedOnpopupOpened: boolean = null) {
		// console.log('this.ItemCollectionForm.value', this.ItemCollectionForm.get('settingItemCollection').value); return;
		if (!this.selectedListData.length) {
			this._helper.notify({ message: "Please select at least one checkbox.", messageType: 0 });
			return;
		}
		this.submitted = true;
		this.ItemCollectionDirective.ngSubmit.emit();
		(this.ItemCollectionDirective as any).submitted = true;
		if (this.ItemCollectionDirective.invalid) {
			return;
		}
		// console.log("value", this.ItemCollectionDirective.value); return;
		let ItemCollectionData =
		{
			item_id: this.ItemID,
			// memberData: this.ItemCollectionForm.get('settingItemCollection').value
			memberData: []
		};
		this.selectedListData.forEach(
			(value) => {
				ItemCollectionData.memberData.push(value.value);
			}
		);
		this.isbtnLoaderShow = true;
		this._helper.apiPost(ItemCollectionData, 'itemapis/item-collection-add-edit/').subscribe(
			res => {
				this.isbtnLoaderShow = false;
				// console.log('doManage res', res);
				if (res["message"]) {
					this._helper.notify({ message: res["message"], messageType: res["status"] });
				}
				if (res["status"] == 1) {
					let showItemCollectionData = '';
					if (this.ItemCollectionForm.get('settingItemCollection').value.length) {
						let tempItemData = this.ItemCollectionForm.get('settingItemCollection').value;
						tempItemData.forEach(
							value => {
								if (showItemCollectionData != '') {
									showItemCollectionData += ', ';
								}
								showItemCollectionData += `${value.POSItemID} (${value.Description})`;
							}
						);
					}
					this._dialogRef.close({ label: showItemCollectionData, selectedListData: this.selectedListData, itemData: this.ItemCollectionForm.get('settingItemCollection').value, MainItemTypeCode: res.item_type });
				}
				// if (res["status"] == 1) {
				// 	if (direction == "Save") {
				// 		this.route.navigate(['/dashboard/item-maintenance/items']);
				// 	} else {
				// 		if (currentStep != null) {
				// 			this.stepperConfig.currentStep = currentStep;
				// 			if (isSavedOnpopupOpened) {
				// 				this._dialogsService.AddSupplierDailog([], this.editIds).subscribe(res => {
				// 					if (res) {
				// 						this.getItemCollection(res.is_multiple_update);
				// 					}
				// 				});
				// 			}
				// 		}
				// 		else
				// 			this.stepperConfig.currentStep++;

				// 		this.previosuStep = this.stepperConfig.currentStep;
				// 		this.tabWiseRetriveData(this.stepperConfig.currentStep);
				// 	}
				// 	//this.stepperConfig.tab_name="advanced_details";//custom feild
				// 	//this.getAllFeild();//For custom feild
				// }
			},
			error => {
				console.log('error', error);
			}
		);

	}

	get settingItemCollection(): FormArray {
		return this.ItemCollectionForm.get('settingItemCollection') as FormArray;
	}

	ngOnInit() {
		this.ItemCollectionForm = this._formBuilder.group({
			settingItemCollection: this._formBuilder.array([])
		});
		// console.log('this._ItemData', this._ItemData);
		this.editItemID = this._ItemData.data.editIds;
		this.editIds = this.editItemID;
		// console.log('this.editItemID', this.editItemID);
		if (this.editItemID.length == 1) {
			if (typeof this.editItemID[0].ItemID != 'undefined') {
				this.ItemID = this.editItemID[0].ItemID;
			}
			else {
				this.ItemID = this.editItemID[0].id;
			}
		} else {
			this.editItemID.forEach((value, key) => {
				if (this.ItemID == '') {
					if (typeof this.editItemID[key].ItemID != 'undefined') {
						this.ItemID = this.editItemID[key].ItemID;
					}
					else {
						this.ItemID = this.editItemID[key].id;
					}
				}
				else {
					if (typeof this.editItemID[key].ItemID != 'undefined') {
						this.ItemID += "," + this.editItemID[key].ItemID;
					}
					else {
						this.ItemID += "," + this.editItemID[key].id;
					}
				}
			});
		}
		//this.ItemID = this._ItemData.itemid;
		// console.log("this.ItemID", this.ItemID);
		this.getItemCollection();
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.ItemCollectionForm.get('settingItemCollection')["controls"].length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		// this.isAllSelected() ?
		// 	this.selection.clear() :
		// 	this.dataSource.data.forEach(row => this.selection.select(row));
		// console.log('this.settingItemCollection.controls', this.settingItemCollection.controls);
		if (this.isAllSelected()) {
			this.selection.clear();
			this.ItemCollectionForm.get('settingItemCollection')["controls"].forEach((value, key) => {
				this.selectedList = this.selectedList.filter((list) => list != value["value"]["id"]);
				this.selectedListData = this.selectedListData.filter((list) => list["value"]["id"] != value["value"]["id"]);
			});
		}
		else {
			this.ItemCollectionForm.get('settingItemCollection')["controls"].forEach((value, key) => {
				this.selection.select(value);
				if (!this.selectedList.includes(value["value"]["id"])) {
					this.selectedList.push(value["value"]["id"]);
					this.selectedListData.push(value);
				}
			});
		}
		console.log('this.selectedList', this.selectedList);
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	}

	prepareMatTable() {
		this.ItemCollectiondataSource = new MatTableDataSource<PeriodicElement>(this.ItemCollectionList);
		// this.getSelectedSupplierList();
	}

	setPreSelect() {
		this.ItemCollectiondataSource.data.forEach((value, key) => {
			if (this.selectedList.includes(this.ItemCollectiondataSource.data[key]["value"]["id"])) {
				this.selection.select(value);
				var ObjSupplierID = { PartyData: { SupplierID: this.ItemCollectiondataSource.data[key]["value"]["id"] }, id: this.ItemCollectiondataSource.data[key]["value"]["id"] };
				this.selectedListData.push(ObjSupplierID);
			}
		});

	}

	setSelect(row) {
		// console.log('setSelect row', row);
		// console.log('this.selection', this.selection);
		this.selection.toggle(row);
		if (this.selection.isSelected(row)) {
			this.selectedList.push(row["value"]["id"]);
			this.selectedListData.push(row);
		}
		else {
			this.selectedList = this.selectedList.filter((list) => list != row["value"]["id"]);
			this.selectedListData = this.selectedListData.filter((list) => list["value"]["id"] != row["value"]["id"]);
		}
	}

}
