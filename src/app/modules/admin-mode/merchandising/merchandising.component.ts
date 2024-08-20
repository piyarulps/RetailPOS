import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatCheckbox } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HelperService } from '../../../services/helper.service';
import { tap } from 'rxjs/operators';

import { HeaderSidebarComponent } from '../../ui/header-sidebar/header-sidebar.component';
import { DialogsService } from '../../../services/dialogs.service';

export interface PeriodicElement {
	id: number;
}

@Component({
	selector: 'app-merchandising',
	templateUrl: './merchandising.component.html',
	styleUrls: ['./merchandising.component.scss']
})
export class MerchandisingComponent implements OnInit {

	moduleName: string = 'merchandise_group_add_edit'; // GroupSelectItem
	displayModuleName: string = 'Merchandising';
	moduleAPI: string = 'itemapis/merchandise_group_add_edit/?function_id=0&list_type=tree_view&';
	moduleFilterAPI: string = 'itemapis/merchandise_group_add_edit/?function_id=0&list_type=tree_view&';
	moduleLink: string = 'admin-mode/merchandising';
	displayedColumns = ['select', 'ChildMerchandiseHierarchyGroup', 'ParentMerchandiseHierarchyGroup', 'description'];
	dataList: any[];
	dataSource = new MatTableDataSource<PeriodicElement>(this.dataList);
	selection = new SelectionModel<PeriodicElement>(true, []);
	paginationSetup: any = {
		pageLimitOptions: [25, 50, 100],
		pageLimit: 25,
		pageOffset: 0,
		totalRecord: 0
	};
	selectedListData: any = [];
	selectedList: any = [];
	isLoading: boolean = false;
	pageData: any = {
		moduleName: this.moduleName,
		displayModuleName: this.displayModuleName,
		moduleAPI: this.moduleAPI,
		moduleLink: this.moduleLink,
		paginationSetup: this.paginationSetup
	};
	editData: any = {
		_editData: []
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
	colName: string = '';
	orderBy: string = '';
	listingType: string = '';
	typeValue: any = '';
	searchText: string = '';
	statusMessage: string;
	deleteMessage: string;
	isNavOpen: boolean = false;
	mouseDownRowID: number;
	mouseUpRowID: number;
	mouseHit: any = {
		down: 0,
		up: 0
	};
	lastWay: string = '';
	openSidebar: boolean = false;
	filterParams: any = "";

	arrDeleteItemID: any = [];
	MerchandiseFunctionList: any = [];
	MerchandiseFunctionID: number;
	SelectedMerchandiseFunctionID: any = [];
	childComponentSetup: any = {};
	isTreeView: boolean = false;
	selectedTreeListID: any = [];
	selectedTreeListData: any = [];
	list_type: string;
	functionListForDisplaycol: any = [];
	RootNodeID: number;
	isRootNode: boolean = false;

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
					this.selectedList = this.selectedList.filter((list) => list != value.id);
					this.selectedListData = this.selectedListData.filter((list) => list.id != value.id);
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
	}

	setSelectMU(i: number) {
		this.mouseUpRowID = i;
		this.setSelectMouse();
	}

	setSelectMouse() {
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
					this.setSelect(this.dataSource.data[i], true);
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
		}
	}

	setSelectFirst() {
		if (!this.selection.isSelected(this.dataSource.data[0])) {
			this.selection.clear();
			this.dataSource.data.forEach((value, key) => {
				this.selectedList = this.selectedList.filter((list) => list != value.id);
				this.selectedListData = this.selectedListData.filter((list) => list.id != value.id);
			});
			this.setSelectMD(0);
			this.mouseUpRowID = 0;
			this.setSelect(this.dataSource.data[0], true);
		}
		else {
			this.selection.clear();
			this.dataSource.data.forEach((value, key) => {
				this.selectedList = this.selectedList.filter((list) => list != value.id);
				this.selectedListData = this.selectedListData.filter((list) => list.id != value.id);
			});
		}
		// if (this.selectedList.length) {
		// 	this.edit();
		// }
		// else {
		// 	this.openSidebar = false;
		// }
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
			if (this.selectedList.includes(value.id)) {
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
		this.selectedList = this.selectedList.filter((list) => list != row.id);
		this.selectedListData = this.selectedListData.filter((list) => list.id != row.id);
		if (this.selection.isSelected(row)) {
			this.selectedList.push(row.id);
			this.selectedListData.push(row);
		}
		// if (this.selectedList.length) {
		// 	this.edit();
		// }
		// else {
		// 	this.openSidebar = false;
		// }
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
				this.selectedList = this.selectedList.filter((list) => list != value.id);
				this.selectedListData = this.selectedListData.filter((list) => list.id != value.id);
			});
		}
		else {
			this.dataSource.data.forEach((value, key) => {
				this.selection.select(value);
				if (!this.selectedList.includes(value.id)) {
					this.selectedList.push(value.id);
					this.selectedListData.push(value);
				}
			});
		}
		// if (this.selectedList.length) {
		// 	this.edit();
		// }
		// else {
		// 	this.openSidebar = false;
		// }
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

	edit(GroupItemID) {
		if (this.openSidebar) {
			this.editData = {
				_editData: {
					data: {
						GroupItemID: GroupItemID
					}
				}
			};
		}
		else {
			this.editData = {
				_editData: {
					data: {
						GroupItemID: GroupItemID
					}
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
		this.mouseDownRowID = undefined;
		this.mouseUpRowID = undefined;
		this.mouseHit = {
			down: 0,
			up: 0
		};
		this.colName = colName;
		this.orderBy = orderBy;
		this.paginationSetup.pageOffset = pageOffset;
		this.paginationSetup.pageLimit = pageLimit;
		pageOffset = pageOffset + 1;
		let url = `${this.moduleAPI}offset=${pageOffset}&limit=${pageLimit}&colname=${colName}&order_by=${orderBy}&`;
		if (this.filterParams != '') {
			url = `${this.moduleFilterAPI}offset=${pageOffset}&limit=${pageLimit}&colname=${colName}&order_by=${orderBy}&filterParams=${this.filterParams}&`;
		}
		this.isLoading = true;
		this._helper.apiGet(url).subscribe(
			data => {
				this.isLoading = false;
				// console.log(data);
				this.dataList = data.result;
				this.dataList = this.dataList.filter((list) => list.isdeleted == "n");
				this.paginationSetup.totalRecord = data.RecordsCount;
				this.selection.clear();
				this.prepareMatTable();
				this.setPreSelect();
			},
			error => console.log(error)
		);
	}

	deleteOrStatusChange(type, status, delactinc, GroupItemID) {
		console.log('this.selectedList', this.selectedList);
		console.log('this.selectedListData', this.selectedListData);
		var deleteobject = {
			ids: this.selectedList,
			group_item_id: parseInt(GroupItemID),
			type: type,
			value: status
		};
		let popupMessage: string = '';
		if (delactinc == 1) {
			popupMessage = "delete";
		} else if (delactinc == 2) {
			popupMessage = "enable";
		} else {
			popupMessage = "disable";
		}
		this.deleteMessage = `Do you want to ${popupMessage} ${this.selectedListData.length} items(s)?`;
		if (this.selectedListData[0].child_available == "y") {
			this.deleteMessage = `Child nodes already exists.Do you want to ${popupMessage} parent node with child nodes`;
		} else {
			this.deleteMessage = `Do you want to ${popupMessage} ${this.selectedListData.length} nodes(s)?`;
		}
		this._helper.confirmDialog({ message: this.deleteMessage }).subscribe(res => {
			// console.log(res);
			if (res) {
				var deleteData = JSON.stringify(deleteobject);
				this._helper.apiRequest('delete', `itemapis/merchandise_group_add_edit/?function_id=${this.MerchandiseFunctionID}&`, { body: deleteData }).subscribe(res => {
					if (res["status"] == 1) {
						this.selectedList = [];
						this.selectedListData = [];
						this.arrDeleteItemID = [];
						this.records(this.paginationSetup.pageOffset, this.paginationSetup.pageLimit);
					}
					if (res["message"]) {
						this._helper.notify({ message: res["message"], messageType: res["status"] });
					}
				});
			}
		}
		);
	}

	delete() {
		this.deleteOrStatusChange('delete', 'y', 1, this.MerchandiseFunctionID);
	}

	status(status: number) {
		if (status == 1) {
			this.deleteOrStatusChange('status', 'n', 2, this.MerchandiseFunctionID);
		}
		else if (status == 0) {
			this.deleteOrStatusChange('status', 'y', 3, this.MerchandiseFunctionID);
		}
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
			this.getAllFunctionName();
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

	getHierarchy(function_id) {
		// itemapis/merchandise_group_add_edit/?function_id=0&list_type=tree_view&
		this.list_type = 'list_view';
		this.MerchandiseFunctionID = function_id;
		this.moduleAPI = `itemapis/merchandise_group_add_edit/?function_id=${this.MerchandiseFunctionID}&list_type=${this.list_type}&`;
		this.moduleFilterAPI = `itemapis/filters/?merchandise_group_add_edit/?function_id=${this.MerchandiseFunctionID}&list_type=${this.list_type}&`;
		this.pageData = {
			moduleName: this.moduleName,
			displayModuleName: this.displayModuleName,
			moduleAPI: this.moduleAPI,
			moduleLink: this.moduleLink,
			paginationSetup: this.paginationSetup
		};
		this.filterData = {
			moduleName: this.moduleName,
			displayModuleName: this.displayModuleName,
			moduleAPI: this.moduleAPI,
			moduleFilterAPI: this.moduleFilterAPI,
			moduleLink: this.moduleLink,
			paginationSetup: this.paginationSetup,
			openFilter: false
		};
		this.records(this.paginationSetup.pageOffset, this.paginationSetup.pageLimit);
		//this.getTreeView();
	}

	addMerchandiseLabel() {
		// this._dialogsService.MerchandiseAddEditDialog().subscribe(res => {
		// 	//this.loadPage();
		// 	this.getAllFunctionName();
		// });
	}
	editMerchandise(MerchandiseFunctionid) {
		// this.SelectedMerchandiseFunctionID = [];
		// this.SelectedMerchandiseFunctionID.push(MerchandiseFunctionid);
		// this._dialogsService.MerchandiseAddEditDialog(this.SelectedMerchandiseFunctionID).subscribe(res => {
		// 	if (res != undefined) {
		// 		//this.selection.clear();
		// 		//this.selectedList = [];
		// 		//this.selectedListData = [];
		// 		this.getAllFunctionName();
		// 		this.loadPage();
		// 		this.getTreeView();
		// 	}
		// });
	}

	getAllFunctionName() {
		this._helper.apiGet('itemapis/merchandise').subscribe(
			data => {
				//console.log("data",data);
				if (data["status"] == 1) {
					this.MerchandiseFunctionList = data["result"];
					if (this.MerchandiseFunctionList.length) {
						this.MerchandiseFunctionID = this.MerchandiseFunctionList[0].id;
						this.getHierarchy(this.MerchandiseFunctionID);
						this.childComponentSetup.treeListView = false;
						this.childComponentSetup.Status = false;
					} else {
						this.getHierarchy(0);
						this.childComponentSetup.treeListView = true;
						this.childComponentSetup.Status = true;
					}
				}
			},
			error => console.log(error)
		);
	}

	deletehierarchyFunction(type, status, delactinc, MerchandiseFunctionID) {
		this.arrDeleteItemID.push(MerchandiseFunctionID);
		var deleteobject = {
			ids: this.arrDeleteItemID,
			type: type,
			value: status
		};

		this.deleteMessage = `Do you want to delete ${this.arrDeleteItemID.length} merchandise function?`;
		this._helper.confirmDialog({ message: this.deleteMessage }).subscribe(res => {
			if (res) {
				var deleteData = JSON.stringify(deleteobject);
				this._helper.apiRequest('delete', `/itemapis/merchandise_add_edit/`, { body: deleteData }).subscribe(res => {
					if (res["message"]) {
						this._helper.notify({ message: res["message"], messageType: res["status"] });
					}
					if (res["status"] == 1) {
						this.getAllFunctionName();
						this.arrDeleteItemID = [];
					}
				});
			}
		}
		);
	}

	isRootNodeChk(data, list_type) {
		if (list_type == "L") {
			if (data.ChildMerchandiseHierarchyGroup.id == this.RootNodeID) {
				this.isRootNode = true;
			} else {
				this.isRootNode = false;
			}
		} else {
			if (data.id == this.RootNodeID) {
				this.isRootNode = true;
			} else {
				this.isRootNode = false;
			}
		}
	}

	ngOnInit() {
		this.getAllFunctionName();
		this.dataSource.sort = this.sort;
	}

}
