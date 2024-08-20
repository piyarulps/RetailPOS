import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, FormArray, FormControl } from '@angular/forms';
// import { MatSnackBar } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { HelperService } from '../../../../services/helper.service';
import { ValidationService } from '../../../../services/validation/validation.service';
// import { ConnectionService } from 'ng-connection-service';
// import { MatInput } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog, MatExpansionPanel } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { tap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

export class TodoItemFlatNode {
	expandable: boolean;
	name: string;
	level: number;
	id: string;
	description: string;
	item_selling_rule_id: number;
}
export class TodoItemNode {
	id: string;
	description: string;
	item_selling_rule_id: number;
	name: string;
	children?: TodoItemNode[];
}

@Component({
	selector: 'app-item-merchandising-manage',
	templateUrl: './item-merchandising-manage.component.html',
	styleUrls: ['./item-merchandising-manage.component.scss']
})
export class ItemMerchandisingManageComponent implements OnInit {

	moduleName: string = '';
	displayModuleName: string = 'Merchandising';
	moduleAPI: string = '';
	moduleLink: string = '';
	myForm: FormGroup;
	submitted: boolean = false;
	message: string;
	editData: any = [];
	backupEditData: any = [];
	dialogTitle: string = "Merchandising";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Save";
	btnUpdateTxt: string = "Update";
	isSelectBox: boolean = false;
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;
	editIds: any = [];
	ItemID: string = '';
	isLoading: boolean = false;

	MerchandiseFunctionList: any = [];
	MerchandiseFunctionID: number;
	selectedTreeListID: any = [];
	selectedTreeListData: any = [];
	list_type: string;
	@ViewChild('tree') tree;
	dataChange = new BehaviorSubject<TodoItemNode[]>([]);
	get data(): TodoItemNode[] { return this.dataChange.value; }
	treeControl: NestedTreeControl<TodoItemNode>;
	treedataSource: MatTreeNestedDataSource<TodoItemNode>;
	checklistSelection = new SelectionModel<TodoItemNode>(true /* multiple */);
	merchandisedata: any = [];
	merchandiseTreedata: any = [];
	merchandiseTreeControl: any = [];
	merchandiseSelectedNode: any = [];
	merchandiseNames: any = [];

	constructor(
		public _helper: HelperService,
		public _hotkeysService: HotkeysService,
		public _dialogRef: MatDialogRef<ItemMerchandisingManageComponent>,
		private _dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public _editData: any
	) { }

	doManage() {
		if (this.merchandisedata.length) {
			let showMerchandisingData = '';
			this.merchandiseNames.forEach(
				value => {
					if (typeof value.group_name != 'undefined' && value.group_name.length) {
						if (showMerchandisingData != '') {
							showMerchandisingData += ', ';
						}
						showMerchandisingData += value.group_name.join(', ');
					}
				}
			)
			// console.log('showMerchandisingData', showMerchandisingData);
			this._dialogRef.close({ label: showMerchandisingData, data: this.merchandisedata });
		}
		else {
			this._helper.notify({ message: "Please select at least one checkbox.", messageType: 0 });
			return;
		}
	}

	private _transformer = (node: TodoItemNode, level: number) => {
		return {
			expandable: !!node.children && node.children.length > 0,
			name: node.name,
			level: level,
		};
	}

	getAllFunctionName() {
		this.isLoading = true;
		this._helper.apiGet('itemapis/merchandise').subscribe(
			data => {
				this.isLoading = false;
				if (data["status"] == 1) {
					this.MerchandiseFunctionList = data["result"];
					for (let i = 0; i < this.MerchandiseFunctionList.length; i++) {
						this.MerchandiseFunctionList[i].ismatepandable = false;
						this.merchandiseSelectedNode[this.MerchandiseFunctionList[i].id] = 0;
						this.merchandiseTreedata[this.MerchandiseFunctionList[i].id] = this.treedataSource;
						this.merchandiseTreeControl[this.MerchandiseFunctionList[i].id] = this.treeControl;
					}
				}
			},
			error => console.log(error)
		);
	}

	getItemList() {
		if (this.ItemID != '') {
			this.isLoading = true;
			this._helper.apiGet(`itemapis/item_basic_info/${this.ItemID}`).subscribe(
				data => {
					//console.log("data",data.result)
					this.isLoading = false;
					if (data["status"] == 1) {
						if (typeof (data.result.merchandise) != 'undefined' && data.result.merchandise != null) {
							if (data.result.merchandise.length) {
								this.merchandisedata = data.result.merchandise;
								for (let i = 0; i < this.merchandisedata.length; i++) {
									this.MerchandiseFunctionID = data.result.merchandise[i].function_id;
									this.merchandiseSelectedNode[this.MerchandiseFunctionID] = this.merchandisedata[i].no_of_selections;
									this.getTreeView(data.result.merchandise[i].function_id);
								}
							}
						}
					}
				},
				error => console.log(error)
			);
		}
	}

	hasChild = (_: number, node: TodoItemNode) => !!node.children && node.children.length > 0;
	private _getChildren = (node: TodoItemNode) => node.children;
	getTreeView(function_id: number) {
		// console.log('event', event);
		this.isLoading = true;
		this.MerchandiseFunctionID = function_id;
		this._helper.apiGet(`itemapis/merchandise_item_view/?function_id=${this.MerchandiseFunctionID}&list_type=tree_view&listing_type=isblocked&type_value=n&
		`).subscribe(
			res => {
				this.isLoading = false;
				if (res["status"] == 1) {
					const data = res["result"];
					// console.log("data",data);
					this.dataChange.next(data);
					// this.treeControl.expandAll();
					this.merchandiseTreeControl[this.MerchandiseFunctionID].expandAll();
					if (this.ItemID != null && this.ItemID != '') {
						if (this.merchandisedata.length) {
							let index = this.merchandisedata.findIndex(x => x.function_id === this.MerchandiseFunctionID);
							if (index >= 0) {
								this.selectedTreeListID = this.merchandisedata[index].group_id;
								const descendants = this.treeControl.getDescendants(this.treeControl.dataNodes[0]);
								if (descendants.length) {
									for (let i = 0; i < descendants.length; i++) {
										if (this.selectedTreeListID.includes(descendants[i].id)) {
											this.checklistSelection.toggle(descendants[i]);
										}
									}
								}
								// let index1 = this.MerchandiseFunctionList.findIndex(x => x.id === this.MerchandiseFunctionID);
								// this.MerchandiseFunctionList[index1].ismatepandable=true;
							}
						}
					}
					//this.selectedTreeListID=[];
					//this.selectedTreeListData=[];
				}
			},
			error => console.log(error)
		);
	}

	todoLeafItemSelectionToggle(node: TodoItemNode): void {
		this.selectedTreeListID = [];
		this.selectedTreeListData = [];
		this.checklistSelection.toggle(node);
		if (this.checklistSelection.isSelected(node)) {
			if (!this.selectedTreeListID.includes(node.id)) {
				const descendants = this.treeControl.getDescendants(this.treeControl.dataNodes[0]);
				if (descendants.length) {
					for (let i = 0; i < descendants.length; i++) {
						if (this.checklistSelection.isSelected(descendants[i])) {
							this.selectedTreeListID.push(descendants[i].id);
							this.selectedTreeListData.push(descendants[i].name);
						}
					}
				}
				let index = this.merchandisedata.findIndex(x => x.function_id === this.MerchandiseFunctionID);
				if (index >= 0) {
					this.merchandisedata[index].group_id = this.selectedTreeListID;
					this.merchandiseNames[index].group_name = this.selectedTreeListData;
				} else {
					let merchandisedata = {
						function_id: this.MerchandiseFunctionID,
						group_id: this.selectedTreeListID
					};
					let merchandisename = {
						function_id: this.MerchandiseFunctionID,
						group_name: this.selectedTreeListData
					};
					this.merchandisedata.push(merchandisedata);
					this.merchandiseNames.push(merchandisename);
				}
			}
		} else {
			//this.selectedTreeListID=this.selectedTreeListID.filter((list) => list != node.id);
			//this.selectedTreeListData=this.selectedTreeListData.filter((list) => list.id != node.id);
			let index = this.merchandisedata.findIndex(x => x.function_id === this.MerchandiseFunctionID);
			const descendants = this.treeControl.getDescendants(this.treeControl.dataNodes[0]);
			if (descendants.length) {
				for (let i = 0; i < descendants.length; i++) {
					if (this.checklistSelection.isSelected(descendants[i])) {
						this.selectedTreeListID.push(descendants[i].id);
						this.selectedTreeListData.push(descendants[i].name);
					}
				}
			}
			if (index >= 0) {
				this.merchandisedata[index].group_id = this.selectedTreeListID;
				this.merchandiseNames[index].group_name = this.selectedTreeListData;
			} else {
				let merchandisedata = {
					function_id: this.MerchandiseFunctionID,
					group_id: this.selectedTreeListID
				};
				let merchandisename = {
					function_id: this.MerchandiseFunctionID,
					group_name: this.selectedTreeListData
				};
				this.merchandisedata.push(merchandisedata);
				this.merchandiseNames.push(merchandisename);
			}
		}
		//console.log("selectedTreeListData",this.selectedTreeListID);
		//this.checkAllParentsSelection(node);
	}

	ngOnInit() {
		this.editData = this._editData.data;
		// console.log('this.editData', this.editData);
		this.editIds = this.editData.editIds;
		this.ItemID = this.editData.ItemID;
		this.getAllFunctionName();
		this.dataChange.subscribe(data => {
			this.treeControl = new NestedTreeControl<TodoItemNode>(this._getChildren);
			this.treedataSource = new MatTreeNestedDataSource();
			this.treeControl.dataNodes = data;
			this.treedataSource.data = data;
			this.merchandiseTreedata[this.MerchandiseFunctionID] = this.treedataSource;
			this.merchandiseTreeControl[this.MerchandiseFunctionID] = this.treeControl;
			//console.log("merchandiseTreedata",this.merchandiseTreedata);
			//console.log("merchandiseTreeControl",this.merchandiseTreeControl);
		});
		this.getItemList();
	}

}
