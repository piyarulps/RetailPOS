import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
// import { MatSnackBar } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { HelperService } from '../../../../services/helper.service';
import { ValidationService } from '../../../../services/validation/validation.service';
// import { ConnectionService } from 'ng-connection-service';
// import { MatInput } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { tap } from 'rxjs/operators';

export interface PageData {
	_editData: {
		data: []
	}
}

export interface PeriodicElement {
	id: number
}

@Component({
	selector: 'app-item-add-supplier-manage',
	templateUrl: './item-add-supplier-manage.component.html',
	styleUrls: ['./item-add-supplier-manage.component.scss']
})
export class ItemAddSupplierManageComponent implements OnInit {

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
	selectedListData: any = [];
	selectedList: any = [];
	supllierdisplayedColumns: any = ['select', 'SupplierID', 'LegalName', 'FirstName'];
	arrSupplierID: any = [];
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

	constructor(
		public _formDirective: FormGroupDirective,
		public _validation: ValidationService,
		public _helper: HelperService,
		public _hotkeysService: HotkeysService,
		public _dialogRef: MatDialogRef<ItemAddSupplierManageComponent>,
		@Inject(MAT_DIALOG_DATA) public _ItemData: any
	) { }

	ngOnInit() {
		// console.log('this._ItemData', this._ItemData);
		this.editItemID = this._ItemData.itemid;
		// console.log('this.editItemID', this.editItemID);
		if (this.editItemID.length == 1) {
			if (typeof this.editItemID[0].ItemID != 'undefined') {
				this.ItemID = this.editItemID[0].ItemID;
			}
			else {
				this.ItemID = this.editItemID[0]._id;
			}
		} else {
			this.editItemID.forEach((value, key) => {
				if (this.ItemID == '') {
					if (typeof this.editItemID[key].ItemID != 'undefined') {
						this.ItemID = this.editItemID[key].ItemID;
					}
					else {
						this.ItemID = this.editItemID[key]._id;
					}
				}
				else {
					if (typeof this.editItemID[key].ItemID != 'undefined') {
						this.ItemID += "," + this.editItemID[key].ItemID;
					}
					else {
						this.ItemID += "," + this.editItemID[key]._id;
					}
				}
			});
		}
		this.getSupplierList();
		//this.ItemID = this._ItemData.itemid;
		//console.log("this.ItemID",this.ItemID);

	}

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
		this.getSelectedSupplierList();
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

	getSupplierList(pageOffset: number = this.paginationSetup.pageOffset, pageLimit: number = this.paginationSetup.pageLimit, colname: string = this.colname, order_by = this.order_by) {
		this.paginationSetup.pageLimit = pageLimit;
		pageOffset = pageOffset + 1;
		this.isLoading = true;
		this._helper.apiGetLocal(`vendorlist/?vendortype=Supplier&offset=${pageOffset}&limit=${pageLimit}&q=${this.searchText}&partyrole=Vendor&`).subscribe(
			data => {
				this.isLoading = false;
				//console.log("data",data)
				if (data["status"] == 1) {
					this.supplerList = data["result"];
					this.selection.clear();
					this.prepareMatTable();
					this.strMsg = true;
					this.paginationSetup.totalRecord = data.RecordsCount;
					this.colname = "";
					this.order_by = "";
					this.isSpinnerLoaderShow = true;
				}
			},
			error => console.log(error)
		);
	}

	getSelectedSupplierList() {
		let itemsIDforAddandupdate = 0;
		// console.log('this.editItemID.length', this.editItemID.length);
		if (this.editItemID.length == 1) {
			itemsIDforAddandupdate = this.ItemID;
		} else {
			itemsIDforAddandupdate = 0;
		}
		this._helper.apiGetLocal(`supplier_update/?item=${itemsIDforAddandupdate}`).subscribe(
			data => {
				//console.log("data",data)
				if (data["status"] == 1) {
					this.SelectedsupplerList = data["result"];
					this.SelectedsupplerList.forEach((value, key) => {
						this.selectedList.push(value.Supplier);
					});
					this.setPreSelect();
				}
			},
			error => console.log(error)
		);
	}

	addSupplier() {
		this.selectedListData.forEach((value, key) => {
			this.arrSupplierID.push(value.PartyData.SupplierID);
		});
		if (!this.selectedListData.length) {
			this._helper.notify({ message: "Please select at least one checkbox.", messageType: 0 });
			return;
		}
		var savedObject = { "supplier_ids": this.arrSupplierID };
		this._helper.apiPutLocal(savedObject, `supplier_update/${this.ItemID}/`).subscribe(
			res => {
				if (res["message"]) {
					this._helper.notify({ message: res["message"], messageType: res["status"] });
				}
				if (res["status"] == 1) {
					//this.selection.clear();
					//this.selectedList = [];
					//this.selectedListData = [];
					//this.brands();
					this._dialogRef.close(res);
				}
			},
			error => {
				console.log('error', error);

			}
		);
	}

	loadPage() {
		this.getSupplierList(this.paginator.pageIndex, this.paginator.pageSize);
	}

	ngAfterViewInit() {
		if (typeof (this.paginator) != 'undefined') {
			this.paginator.page
				.pipe(
					tap(() => this.loadPage())
				)
				.subscribe();
		}
	}

	resetSearch() {
		this.searchText = "";
		this.getSupplierList(0, 25);
	}

	search(e) {
		if (this.searchText.length) {
			this.loadPage()
		}
		else {
			this.getSupplierList(0, 25);
		}
	}

	// addNewSupplier() {
	// 	let supplierids : any = []; 
	// 	// this.SelectedsupplerList.forEach((value, key) => {
	// 	// 	supplierids.push(value.Supplier);
	// 	// });
	// 	let sendData: any = {
	// 		itemIds: this.editItemID,
	// 		returnUrl: "/dashboard/item-maintenance/add-single-item",
	// 		supplierids :this.selectedList
	// 	};
	// 	//console.log("sendData",sendData);return;
	// 	let navigationExtras: NavigationExtras = {
	// 		queryParams: {
	// 			"sendData": btoa(JSON.stringify(sendData))
	// 		}
	// 	};
	// 	let url: any = `/dashboard/item-maintenance/manage/supplier`;
	// 	this._router.navigate([url], navigationExtras);
	// 	this.dialogRef.close(true);
	// }

}
