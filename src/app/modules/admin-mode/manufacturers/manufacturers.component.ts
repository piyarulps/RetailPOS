import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatCheckbox } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HelperService } from '../../../services/helper.service';
import { tap } from 'rxjs/operators';

import { DialogsService } from '../../../services/dialogs.service';
import { HeaderSidebarComponent } from '../../ui/header-sidebar/header-sidebar.component';

export interface PeriodicElement {
	_id: string;
}
@Component({
	selector: 'app-manufacturers',
	templateUrl: './manufacturers.component.html',
	styleUrls: ['./manufacturers.component.scss']
})
export class ManufacturersComponent implements OnInit {

	moduleName: string = 'Manufacturer';
	displayModuleName: string = 'Manufacturer';
	moduleAPI: string = 'vendorlist/?partyrole=Vendor&vendortype=Manufacturer&';
	moduleFilterAPI: string = 'itemapis/filters/';
	moduleLink: string = 'admin-mode/manufacturers';
	displayedColumns = ['select', 'VendorStatus', 'LegalName', 'TradeName', 'FirstName', 'LastName', 'ReligionName', 'Party'];
	dataList: any[];
	dataSource = new MatTableDataSource<PeriodicElement>(this.dataList);
	selection = new SelectionModel<PeriodicElement>(true, []);
	paginationSetup: any = {
		pageLimitOptions: [25, 50, 100],
		pageLimit: 25,
		pageOffset: 0,
		totalRecord: 0
	};

	//const NeDB = require('nedb');

	selectedListData: any = [];
	selectedList: any = [];
	isLoading: boolean = false;
	pageData: any = {
		moduleName: this.moduleName,
		displayModuleName: this.displayModuleName,
		moduleAPI: this.moduleAPI,
		moduleLink: this.moduleLink,
		paginationSetup: this.paginationSetup,
		selectedListData: this.selectedListData
	};
	filterData: any = {
		moduleName: this.moduleName,
		displayModuleName: this.displayModuleName,
		moduleAPI: this.moduleAPI,
		moduleFilterAPI: this.moduleFilterAPI,
		moduleLink: this.moduleLink,
		paginationSetup: this.paginationSetup,
		openFilter: false
	};
	editData: any = {
		_editData: [],
		_pageData: this.pageData
	};
	colName: string = '';
	orderBy: string = '';
	listingType: string = '';
	typeValue: any = '';
	searchText: string = '';
	statusMessage: string;
	deleteMessage: string;
	objDeleteData: any = {};
	isNavOpen: boolean = false;
	mouseDownRowID: number;
	mouseUpRowID: number;
	mouseHit: any = {
		down: 0,
		up: 0
	};
	lastWay: string = '';
	filterParams: any = "";
	openSidebar: boolean = false;

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild('masterCheckbox') masterCheckbox: MatCheckbox;
	@ViewChild(HeaderSidebarComponent) headerSidebarComponent: HeaderSidebarComponent;

	constructor(
		private _helper: HelperService,
		private _dialog: DialogsService
	) {
		if (window.innerWidth >= 1400) {
			this.isNavOpen = true;
		}
		else {
			this.isNavOpen = false;
		}
	}

	setSelectClick(row, event) {
		// console.log('setSelectClick event', event);
		if (typeof (event.shiftKey) != 'undefined' && event.shiftKey) {
			this.setSelect(row);
		}
		else {
			if (this.selection.isSelected(row)) {
				this.setSelect(row, false);
			}
			else {
				this.selection.clear();
				this.dataSource.data.forEach((value, key) => {
					this.selectedList = this.selectedList.filter((list) => list != value._id);
					this.selectedListData = this.selectedListData.filter((list) => list._id != value._id);
				});
				this.setSelect(row);
			}
		}
	}

	changePage(way: string) {
		if (way == 'next') {
			this.paginator.nextPage();
		}
		else {
			this.paginator.previousPage();
		}
	}

	setSelectMD(i: number) {
		this.mouseDownRowID = i;
		this.mouseHit = {
			down: 0,
			up: 0
		};
		this.lastWay = '';
	}

	setSelectMU(i: number) {
		this.mouseUpRowID = i;
		this.setSelectMouse();
	}

	setSelectMouse(isSelect: boolean = true) {
		if ((this.mouseDownRowID || this.mouseDownRowID >= 0) && (this.mouseUpRowID || this.mouseUpRowID >= 0) && this.mouseDownRowID != this.mouseUpRowID) {
			let startRow: number;
			let endRow: number;
			let i: number;
			if (this.mouseDownRowID >= this.mouseUpRowID) {
				endRow = this.mouseDownRowID;
				startRow = this.mouseUpRowID;
			}
			else {
				startRow = this.mouseDownRowID;
				endRow = this.mouseUpRowID;
			}
			for (i = startRow; i <= endRow; i++) {
				if (typeof (this.dataSource.data[i]) != 'undefined') {
					this.setSelect(this.dataSource.data[i], isSelect);
				}
			}
		}
	}

	setSelectShift(way: string) {
		if (this.mouseUpRowID || this.mouseUpRowID >= 0) {
			// console.log(this.lastWay);
			// if (this.lastWay != '' && this.lastWay != way) {
			// 	if (way == 'down') {
			// 		this.setSelectMouse(false);
			// 		this.mouseDownRowID = this.mouseHit.up + 1;
			// 		this.mouseHit.up = this.mouseDownRowID;
			// 	}
			// 	else if (way == 'up') {
			// 		this.setSelectMouse(false);
			// 		this.mouseDownRowID = this.mouseUpRowID - 1;
			// 		this.mouseHit.down = this.mouseDownRowID;
			// 	}
			// }
			// else {
			// this.lastWay = way;
			if (way == 'up' && (this.mouseHit.up >= 1 || this.mouseDownRowID > 0)) {
				if (this.mouseHit.up >= 1) {
					this.mouseDownRowID = this.mouseHit.up - 1;
				}
				else {
					if (this.mouseDownRowID > this.mouseUpRowID) {
						// console.log('up this.mouseDownRowID > this.mouseUpRowID');
						this.mouseDownRowID = this.mouseUpRowID - 1;
					}
					else {
						// console.log('up this.mouseDownRowID < this.mouseUpRowID');
						this.mouseDownRowID = this.mouseDownRowID - 1;
					}
				}
				this.mouseHit.up = this.mouseDownRowID;
			}
			else if (way == 'down') {
				if (this.mouseHit.down > 0) {
					this.mouseDownRowID = this.mouseHit.down + 1;
				}
				else {
					if (this.mouseDownRowID < this.mouseUpRowID) {
						// console.log('down this.mouseDownRowID < this.mouseUpRowID');
						this.mouseDownRowID = this.mouseUpRowID + 1;
					}
					else {
						// console.log('down this.mouseDownRowID < this.mouseUpRowID');
						this.mouseDownRowID = this.mouseDownRowID + 1;
					}
				}
				this.mouseHit.down = this.mouseDownRowID;
			}
			// console.log(this.mouseDownRowID, this.mouseUpRowID);
			// console.log(this.dataSource.data[this.mouseDownRowID]);
			if (typeof (this.dataSource.data[this.mouseDownRowID]) != 'undefined') {
				this.setSelectMouse();
			}
			// }
		}
	}

	setSelectFirst() {
		if (!this.selection.isSelected(this.dataSource.data[0])) {
			this.selection.clear();
			this.dataSource.data.forEach((value, key) => {
				this.selectedList = this.selectedList.filter((list) => list != value._id);
				this.selectedListData = this.selectedListData.filter((list) => list._id != value._id);
			});
			this.setSelectMD(0);
			this.mouseUpRowID = 0;
			this.setSelect(this.dataSource.data[0], true);
		}
		else {
			this.selection.clear();
			this.dataSource.data.forEach((value, key) => {
				this.selectedList = this.selectedList.filter((list) => list != value._id);
				this.selectedListData = this.selectedListData.filter((list) => list._id != value._id);
			});
		}
		if (this.selectedList.length) {
			this.edit();
		}
		else {
			this.openSidebar = false;
		}
	}

	masterCheck() {
		// this.masterCheckbox.focus();
		this.masterCheckbox.toggle();
		this.masterToggle();
		// console.log(this.masterCheckbox);
	}

	prepareMatTable() {
		this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataList);
	}

	setPreSelect() {
		this.dataSource.data.forEach((value, key) => {
			if (this.selectedList.includes(value._id)) {
				this.selection.select(value);
			}
		});
	}

	setSelect(row, isSelected?) {
		if (isSelected) {
			this.selection.select(row);
		}
		else {
			this.selection.toggle(row);
		}
		this.selectedList = this.selectedList.filter((list) => list != row._id);
		this.selectedListData = this.selectedListData.filter((list) => list._id != row._id);
		if (this.selection.isSelected(row)) {
			this.selectedList.push(row._id);
			this.selectedListData.push(row);
		}
		if (this.selectedList.length) {
			this.edit();
		}
		else {
			this.openSidebar = false;
		}
		return true;
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.isAllSelected()) {
			this.selection.clear();
			this.dataSource.data.forEach((value, key) => {
				this.selectedList = this.selectedList.filter((list) => list != value._id);
				this.selectedListData = this.selectedListData.filter((list) => list._id != value._id);
			});
		}
		else {
			this.dataSource.data.forEach((value, key) => {
				this.selection.select(value);
				if (!this.selectedList.includes(value._id)) {
					this.selectedList.push(value._id);
					this.selectedListData.push(value);
				}
			});
		}
		if (this.selectedList.length) {
			this.edit();
		}
		else {
			this.openSidebar = false;
		}
	}

	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	}

	sortData(event) {
		if (event.direction != "") {
			this.records(this.paginator.pageIndex, this.paginator.pageSize, event.active, event.direction);
		}
	}

	edit() {
		// this._dialog.sizeManageDialog(this.selectedListData).subscribe(res => {
		// 	if (res == undefined) {
		// 		//console.log("undefined");
		// 	}
		// 	else {
		// 		this.selection.clear();
		// 		this.selectedList = [];
		// 		this.selectedListData = [];
		// 		this.records();
		// 	}
		// }
		// );
		if (this.openSidebar) {
			this.editData = {
				_editData: {
					data: this.selectedListData
				}
			};
		}
		else {
			this.editData = {
				_editData: {
					data: this.selectedListData
				},
				_openSidebar: true
			};
			this.openSidebar = true;
		}
	}

	editSuccess() {
		this.selection.clear();
		this.selectedList = [];
		this.selectedListData = [];
		this.records();
	}

	records(pageOffset: number = this.paginationSetup.pageOffset, pageLimit: number = this.paginationSetup.pageLimit, colName: string = this.colName, orderBy = this.orderBy) {
		this.syncData();
		this.mouseDownRowID = undefined;
		this.mouseUpRowID = undefined;
		this.mouseHit = {
			down: 0,
			up: 0
		};
		this.lastWay = '';
		this.colName = colName;
		this.orderBy = orderBy;
		this.paginationSetup.pageOffset = pageOffset;
		this.paginationSetup.pageLimit = pageLimit;
		pageOffset = pageOffset + 1;
		let url = `${this.moduleAPI}offset=${pageOffset}&limit=${pageLimit}&colname=${colName}&order_by=${orderBy}&`;
		if (this.filterParams != '') {
			url = `${this.moduleFilterAPI}?offset=${pageOffset}&limit=${pageLimit}&colname=${colName}&order_by=${orderBy}&filterParams=${this.filterParams}&`;
		}
		this.isLoading = true;
		this._helper.apiGetLocal(url).subscribe(
			data => {
				this.isLoading = false;
				this.dataList = data.result;
				//console.log(this.dataList);

				this.paginationSetup.totalRecord = data.RecordsCount;
				this.selection.clear();
				this.prepareMatTable();
				this.setPreSelect();
			},
			error => console.log(error)
		);
	}

	delete() {
		this.deleteMessage = `Do you want to delete ${this.selectedListData.length} ${this.displayModuleName}(s)?`;
		this._helper.confirmDialog({ message: this.deleteMessage }).subscribe(res => {
			if (res) {
				//var deleteData = this.selection.selected;
				let deleteData: any = [];
				this.selectedListData.forEach(value => {
					deleteData.push({
						PartyRole: "Vendor",
						_id: value._id,
						VendorID: value.PartyData.VendorID,
						VendorType: this.moduleName
					});
				});
				deleteData = JSON.stringify(deleteData);
				// console.log('deleteData', deleteData);
				this._helper.apiRequestLocal('delete', this.moduleAPI, { body: deleteData }).subscribe(res => {
					// console.log("res", res);
					if (res.message) {
						this._helper.notify({ message: res.message, messageType: res.status });
					}
					if (res.status == 1) {
						this.selection.clear();
						this.selectedList = [];
						this.selectedListData = [];
						this.records();
					}
					/*if (res.message) {
						this._globalService.notify({ message: res.message, messageType: res.status });
					}*/
				});
			}
		});
	}

	status(status: number) {
		if (status == 1) {
			this.statusMessage = `Are you sure you want to enable ${this.selectedListData.length} ${this.displayModuleName}(s)?`;
		}
		else {
			this.statusMessage = `Are you sure you want to disable ${this.selectedListData.length} ${this.displayModuleName}(s)?`;
		}
		this._helper.confirmDialog({ message: this.statusMessage }).subscribe(res => {
			if (res) {
				let statusData: any = [];
				this.selectedListData.forEach(value => {
					statusData.push({
						PartyData: {
							VendorID: value.PartyData.VendorID,
							_id: value._id,
							isblocked: status == 1 ? 'n' : 'y'
						},
						PartyRole: "Vendor",
						VendorType: this.moduleName
					});
				});
				this._helper.apiPutLocal(statusData, this.moduleAPI).subscribe(
					res => {
						if (res.message) {
							this._helper.notify({ message: res.message, messageType: res.status });
						}
						if (res.status == 1) {
							this.selection.clear();
							this.selectedList = [];
							this.selectedListData = [];
							this.records();
						}
					},
					error => {
						console.log('error', error);

					}
				);
			}
		});
	}

	loadPage() {
		this.records(this.paginator.pageIndex, this.paginator.pageSize, this.colName, this.orderBy);
	}

	getCommonData(event) {
		// console.log('getCommonData', event);
		let isReset: boolean = false;
		if (typeof (event.isNavOpen) != 'undefined' && event.isNavOpen != null) {
			this.isNavOpen = event.isNavOpen;
		}
		if (typeof (event.isLoading) != 'undefined' && event.isLoading != null) {
			this.isLoading = event.isLoading;
		}
		if (typeof (event.ListingData) != 'undefined' && event.ListingData != null) {
			this.dataList = event.ListingData;
			isReset = true;
		}
		if (typeof (event.displayedColumns) != 'undefined' && event.displayedColumns != null) {
			this.displayedColumns = event.displayedColumns;
		}
		if (typeof (event.SearchText) != 'undefined' && event.SearchText != null) {
			this.searchText = event.SearchText;
		}
		if (typeof (event.RecordsCount) != 'undefined' && event.RecordsCount != null) {
			this.paginationSetup.totalRecord = event.RecordsCount;
			isReset = true;
		}
		if (typeof (event.FilterParams) != 'undefined' && event.FilterParams != null) {
			this.filterParams = event.FilterParams;
		}
		// if (typeof (event.listingType) != 'undefined' && event.listingType != null && typeof (event.typeValue) != 'undefined' && event.typeValue != null) {
		// 	this.listingType = event.listingType;
		// 	this.typeValue   = event.typeValue;
		// }
		if (typeof (event.dataAdded) != 'undefined' && event.dataAdded != null) {
			this.records();
		}
		if (typeof (event.hitListAction) != 'undefined' && event.hitListAction != null && (this.selectedList.length || event.noSelectionCheck)) {
			if (typeof (event.hitListActionValue) != 'undefined' && event.hitListActionValue != null) {
				this[event.hitListAction](event.hitListActionValue);
			}
			else {
				this[event.hitListAction]();
			}
		}
		if (typeof (event.openSidebar) != 'undefined' && event.openSidebar != null) {
			this.openSidebar = event.openSidebar;
			this.editData = {
				_openSidebar: this.openSidebar
			};
		}
		if (typeof (event.openFilter) != 'undefined' && event.openFilter != null) {
			const filterData = this.filterData;
			filterData.openFilter = event.openFilter;
			this.filterData = filterData;
		}
		if (isReset) {
			this.selectedList = [];
			this.selectedListData = [];
			this.selection.clear();
			this.prepareMatTable();
			this.setPreSelect();
		}
	}

	ngAfterViewInit() {
		if (typeof (this.paginator) != 'undefined' && typeof (this.paginator.page) != 'undefined') {
			this.paginator.page
				.pipe(
					tap(() => this.loadPage())
				)
				.subscribe();
		}
	}
	syncData() {
		this._helper.apiGetLocal('manufacturersync/').subscribe(
			res => { },
			error => {
				console.log('error', error);

			}
		);
	}
	ngOnInit() {
		// this._dataBaseService.thisDb().brands().insert({ BrandName: "jghjgjk", Manufacturer: "Chameli" }, function (err, cb) {
		// 	console.log(cb);
		// });

		// this._dataBaseService.thisDb().brands().find({ BrandName: "jghjgjk" }, function (err, cb) {
		// 	console.log(cb);
		// 	let message = "";
		// 	for (let i = 0; i < cb.length; i++) {
		// 		message += cb[i].BrandName + " - _id: " + cb[i]._id + "\n";
		// 	}
		// 	console.log(message);
		// });

		this.records();
		// this.syncData();
		this.dataSource.sort = this.sort;
	}
}
