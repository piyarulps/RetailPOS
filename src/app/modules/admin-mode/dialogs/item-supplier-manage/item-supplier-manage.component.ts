import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
// import { MatSnackBar } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { HelperService } from '../../../../services/helper.service';
import { ValidationService } from '../../../../services/validation/validation.service';
// import { ConnectionService } from 'ng-connection-service';
// import { MatInput } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ItemAddSupplierManageComponent } from '../../dialogs/item-add-supplier-manage/item-add-supplier-manage.component';

export interface PageData {
	_editData: {
		data: []
	}
}

export interface PeriodicElement {
	id: number
}

@Component({
	selector: 'app-item-supplier-manage',
	templateUrl: './item-supplier-manage.component.html',
	styleUrls: ['./item-supplier-manage.component.scss']
})
export class ItemSupplierManageComponent implements OnInit {

	moduleName: string = '';
	displayModuleName: string = 'Supplier';
	moduleAPI: string = '';
	moduleLink: string = '';
	myForm: FormGroup;
	submitted: boolean = false;
	message: string;
	editData: any = [];
	backupEditData: any = [];
	dialogTitle: string = "Supplier";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Save";
	btnUpdateTxt: string = "Update";
	isSelectBox: boolean = false;
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;
	supplerList: any[];
	dataSource = new MatTableDataSource<PeriodicElement>(this.supplerList);
	selection = new SelectionModel<PeriodicElement>(true, []);
	supllierdisplayedColumns: any = ['select', 'LegalName', 'Reorder', 'SalePerUnit', 'Basecost'];
	selectedListData: any = [];
	selectedList: any = [];
	paginationSetup: any = {
		pageLimitOptions: [25, 50, 100],
		pageLimit: 25,
		pageOffset: 0,
		totalRecord: 0
	};
	colname: string = '';
	order_by: string = '';
	selectedTreeListID: any = [];
	selectedTreeListData: any = [];
	list_type: string;
	editIds: any = [];
	ItemID: string = '';
	searchText: string = '';
	strMsg: boolean = false;
	supplierData: any = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	isLoading: boolean = false;

	supplierSendData: any = {};

	constructor(
		private _formBuilder: FormBuilder,
		public _formDirective: FormGroupDirective,
		public _validation: ValidationService,
		public _helper: HelperService,
		public _hotkeysService: HotkeysService,
		public _dialogRef: MatDialogRef<ItemSupplierManageComponent>,
		private _dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public _editData: any
	) {
		// this.validateForm();
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
	}

	manageSupplier() {
		// this.supplierSendData = {
		// 	editIds: this.editIds,
		// 	ItemID: this.ItemID
		// };
		// console.log('this.editIds', this.editIds);
		this.addSupplier([], this.editIds).subscribe(
			response => {
				if (response) {
					// console.log('manageSupplier > addSupplier', response);
					if (response) {
						this.getSupplierList(response.is_multiple_update);
					}
					// this.supplierData = response.supplierData;
					// this.selectedListData = response.selectedListData;
				}
			}
		)
	}

	addSupplier(data: any = [], itemids: any = []): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, itemid: itemids };
		let dialogRef: MatDialogRef<ItemAddSupplierManageComponent>;
		dialogRef = this._dialog.open(ItemAddSupplierManageComponent, dialogConfig);
		//dialogRef.componentInstance.id = id;
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	isDecimalNumbar(cost: string) {
		var reg = /^(\d+)?([.]\d{0,9})?$/;
		return reg.test(cost);
	}

	validateTextBox(event: any, element: any, isDecimal: string) {
		let textBoxValue = event.target.value;
		let message: string;
		if (isDecimal == "decimal") {
			var reg = /^(\d+)?([.]\d{0,9})?$/;
			message = "Please enter decimal value";
		} else {
			var reg = /^[0-9]{1,20}$/;
			message = "Please enter integer value";
		}
		if (!reg.test(textBoxValue)) {
			this._helper.notify({ message: message, messageType: 0 });
		}
		var hasMatch = this.selectedListData.find(function (value) {
			return value["PartyData"]["SupplierID"] == element["PartyData"]["SupplierID"];
		}
		);
		if (typeof (hasMatch) == "undefined")
			this.SetSupplierSelection(element);
	}

	SetSupplierSelection(element: any) {
		this.dataSource.data.forEach((value, key) => {
			{
				if (element["PartyData"]["SupplierID"] == this.dataSource.data[key]["PartyData"]["SupplierID"]) {
					this.selection.select(value);
					var ObjSupplierID = {
						PartyData: {
							SupplierID: this.dataSource.data[key]["PartyData"]["SupplierID"],
							supplier_item_data: { id: element.PartyData.supplier_item_data.id }
						},
						id: this.dataSource.data[key]["PartyData"]["SupplierID"]
					};
					this.selectedListData.push(ObjSupplierID);
				}
			}
		});
	}

	getSupplierList(is_multiple_update: string = 'n', pageOffset: number = this.paginationSetup.pageOffset, pageLimit: number = this.paginationSetup.pageLimit, colname: string = this.colname, order_by = this.order_by) {
		// console.log("is_multiple_update",is_multiple_update);
		this.paginationSetup.pageLimit = pageLimit;
		pageOffset = pageOffset + 1;
		let itemsIDforAddandupdate;
		if (is_multiple_update == 'n') {
			if (this.editIds.length == 1) {
				itemsIDforAddandupdate = this.ItemID;
			} else {
				itemsIDforAddandupdate = 0;
			}
		} else {
			itemsIDforAddandupdate = this.ItemID;
		}
		this.isLoading = true;
		this._helper.apiGetLocal(`item_supplier_list/?item=${itemsIDforAddandupdate}`).subscribe(

			//this._helper.apiGet(`itemapis/organizations/?vendortype=Supplier&item=${itemsIDforAddandupdate}&offset=${pageOffset}&limit=${pageLimit}&q=${this.searchText}&partyrole=Vendor&`).subscribe(
			data => {
				this.isLoading = false;
				if (data["status"] == 1) {
					this.supplerList = data["result"];
					this.selection.clear();
					this.prepareMatTable();
					this.paginationSetup.totalRecord = data.RecordsCount;
					this.colname = "";
					this.order_by = "";
					this.strMsg = true;
				}
			},
			error => console.log(error)
		);
	}

	search(e) {
		//console.log("this.searchText",this.searchText);
		if (this.searchText.length) {
			this.loadPage()
		}
		else {
			this.getSupplierList('n', 0, 25);
		}
	}

	loadPage() {
		this.getSupplierList('n', this.paginator.pageIndex, this.paginator.pageSize);
	}

	ngAfterViewInit() {
		if (typeof this.paginator != 'undefined' && typeof this.paginator.page != 'undefined') {
			this.paginator.page
				.pipe(
					tap(() => this.loadPage())
				)
				.subscribe();
		}
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		// this.isAllSelected() ?
		// 	this.selection.clear() :
		// 	this.dataSource.data.forEach(row => this.selection.select(row));
		if (this.isAllSelected()) {
			this.selection.clear();
			this.dataSource.data.forEach((value, key) => {
				this.selectedList = this.selectedList.filter((list) => list != value["PartyData"]["SupplierID"]);
				this.selectedListData = this.selectedListData.filter((list) => list["PartyData"]["SupplierID"] != value["PartyData"]["SupplierID"]);
			});
		}
		else {
			this.dataSource.data.forEach((value, key) => {
				this.selection.select(value);
				if (!this.selectedList.includes(value["PartyData"]["SupplierID"])) {
					this.selectedList.push(value["PartyData"]["SupplierID"]);
					this.selectedListData.push(value);
				}
			});
		}
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	}

	prepareMatTable() {
		this.dataSource = new MatTableDataSource<PeriodicElement>(this.supplerList);
	}

	setPreSelect() {
		this.dataSource.data.forEach((value, key) => {
			if (this.selectedList.includes(this.dataSource.data[key]["PartyData"]["SupplierID"])) {
				this.selection.select(value);
				var ObjSupplierID = { PartyData: { SupplierID: this.dataSource.data[key]["PartyData"]["SupplierID"] }, id: this.dataSource.data[key]["PartyData"]["SupplierID"] };
				this.selectedListData.push(ObjSupplierID);
			}
		});

	}

	setSelect(row) {
		// console.log("row",row);
		this.selection.toggle(row);
		if (this.selection.isSelected(row)) {
			this.selectedList.push(row.PartyData.SupplierID);
			this.selectedListData.push(row);
		}
		else {
			this.selectedList = this.selectedList.filter((list) => list != row.PartyData.SupplierID);
			this.selectedListData = this.selectedListData.filter((list) => list.PartyData.SupplierID != row.PartyData.SupplierID);
		}
	}

	// validateForm() { }

	doManage() {
		// console.log('this.selectedListData', this.selectedListData);
		let showSupplierData = '';
		if (this.supplerList.length) {
			this.supplerList.forEach(
				value => {
					if (typeof value.PartyData != 'undefined' && typeof value.PartyData.PartyType != 'undefined') {
						if (showSupplierData != '') {
							showSupplierData += ', ';
						}
						if (value.PartyData.PartyType == 'Person') {
							showSupplierData += value.PartyData.FirstName;
						}
						else {
							showSupplierData += value.PartyData.TradeName;
						}
					}
				}
			)
		}
		if (this.selectedListData.length) {
			this._dialogRef.close({ label: showSupplierData, selectedListData: this.selectedListData, supplierData: this.supplierData });
		}
		else {
			this._dialogRef.close({ label: showSupplierData });
		}
	}

	ngOnInit() {
		this.editData = this._editData.data;
		// console.log('this.editData', this.editData);
		this.editIds = this.editData.editIds;
		this.ItemID = this.editData.ItemID;
		this.getSupplierList();
	}

}
