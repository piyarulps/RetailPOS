import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ElasticsearchService } from '../../../../services/elasticsearch.service';
// import { ColumnsService } from '../../../_services/columns.service';
import { HelperService } from '../../../../services/helper.service';
import { tap } from 'rxjs/operators';
import { Globals } from '../../../../globals';

export interface PeriodicElement {
	id: number;
}

@Component({
	selector: 'app-item-groups-manage-dialog',
	templateUrl: './item-groups-manage-dialog.component.html',
	styleUrls: ['./item-groups-manage-dialog.component.scss']
})
export class ItemGroupsManageDialogComponent implements OnInit {

	CustomFeildTypeList: any = [];
	addCustomFeildForm: FormGroup;
	isbtnLoaderShow = false;
	ItemIDs: string = '';
	CheckedValue: string = 'n';
	selectedCustomFeild = 'Text';
	isDivOpen: boolean = false;
	editData: any = [];
	customFeildID: number;
	btnText: string = "Create";
	ProductDropDownList: any = [];
	_source: any = {};
	ProductnameLoading: boolean = false;
	private static readonly INDEX = 'item_master';
	SearchField: any = ['UPC_A', 'POS_Name', 'Brand_Line', 'Container'];
	tempObj: any;
	private queryText = '';
	private lastKeypress = 0;
	stringConcat: string = "";
	seletedproductList: any = [];
	submitted: boolean = false;
	allColumns: any = [];
	singlecolInfo: any = [];
	filterDropDownList: any = [];
	moduleName: string = "GroupSelectItem";
	public contactList: FormArray;
	GroupItemID: number;
	dummyFromGroup: FormGroup;
	arrmodelName: any = [];
	selectedCols: any = [];
	links: any = ['Create', 'Preview'];
	activeLink = this.links[0];
	statusForTabview: string = this.links[0];
	isCreateORPreview: boolean = false;
	ItemsList: any;
	searchText: string = '';
	deleteMessage: string = "Do you want to delete this Item?";
	statusMessage: string = "Are you sure you want to activate/deactivate this Item?";
	displayedColumns: string[] = ['POSItemID', 'Description', 'BrandName', 'TableName', 'CurrentPackagePrice', 'cost', 'qty_on_hand', 'qty_in_case', 'margin'];
	dataSource = new MatTableDataSource<PeriodicElement>(this.ItemsList);
	selection = new SelectionModel<PeriodicElement>(true, []);
	limit: any = 25;
	page: any = 1;
	listingType: any = 'isblocked';
	typeValue: any = 'n';
	paginationSetup: any = {
		pageLimitOptions: [25, 50, 100],
		pageLimit: 25,
		pageOffset: 0,
		totalRecord: 0
	};
	dummyList: any = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
	filterParams: any = "";
	isSpinnerLoaderShow: boolean = false;
	strMsg: boolean = true;
	selected = 'AND';
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild('groupItemForm') basicInfoFormDirective: FormGroupDirective;
	dummydataSource = new MatTableDataSource<PeriodicElement>(this.dummyList);

	preSetData: any = null;
	swapViewBtnText: string = 'Preview';
	currentViewType: number = 0;

	charecterColumnConditions: any = [];
	numberColumnConditions: any = [];
	smallintColumnConditions: any = [];

	constructor(
		private _helper: HelperService,
		private _formBuilder: FormBuilder,
		public _dialogRef: MatDialogRef<ItemGroupsManageDialogComponent>,
		public elasticsearchService: ElasticsearchService,
		// public _columnsService: ColumnsService,
		@Inject(MAT_DIALOG_DATA) public _CustomFeildData: any,
		private _globals: Globals
	) {
		this.charecterColumnConditions = this._globals.charecterColumnConditions;
		this.numberColumnConditions = this._globals.numberColumnConditions;
		this.smallintColumnConditions = this._globals.smallintColumnConditions;

		this.addCustomFeildForm = this._formBuilder.group({
			// TypeCode: ["GSI", Validators.required],
			// description: [null, Validators.required],
			// upc: [["GSI"], Validators.required],
			filter: this._formBuilder.array([this.initItemRows()]),
			limit: [null],
			offset: [null],
			q: [null],
			colname: [null],
			order_by: [null]
		});
	}

	swapView() {
		if (this.currentViewType == 0) {
			this.currentViewType = 1;
			this.swapViewBtnText = 'Conditions';
		}
		else {
			this.currentViewType = 0;
			this.swapViewBtnText = 'Preview';
		}
		this.getStatuswiseDate(this.currentViewType);
	}

	setText(formIndex, field, eventValue) {
		// console.log(field, eventValue);
		// console.log('typeof eventValue', typeof eventValue);
		let tempValue = this.getContactsFormGroup(formIndex).controls['text'].value;
		let showName = typeof tempValue != 'undefined' && typeof tempValue.showName != 'undefined' ? tempValue.showName : '';
		let showOperator = typeof tempValue != 'undefined' && typeof tempValue.showOperator != 'undefined' ? tempValue.showOperator : '';
		let showValue = typeof tempValue != 'undefined' && typeof tempValue.showValue != 'undefined' ? tempValue.showValue : '';
		if (field == 'showName') {
			showName = eventValue;
		}
		if (field == 'showOperator') {
			showOperator = eventValue;
		}
		if (field == 'showValue') {
			if (typeof eventValue.target != 'undefined' && eventValue.target.type == 'text') {
				showValue = eventValue.target.value;
			}
			else if (typeof eventValue == 'object' && eventValue.length) {
				showValue = '';
				eventValue.forEach((value, key) => {
					if (showValue != '') {
						showValue += ', ';
					}
					showValue += value.text;
				});
			}
			else {
				showValue = '';
			}
		}
		this.getContactsFormGroup(formIndex).controls['text'].setValue({
			showName: showName,
			showOperator: showOperator,
			showValue: showValue
		});
		// console.log(this.getContactsFormGroup(formIndex).controls['text'].value);
	}

	resetForm() {
		this.addCustomFeildForm = this._formBuilder.group({
			TypeCode: ["GSI", Validators.required],
			// description: [null, Validators.required],
			upc: [["GSI"], Validators.required],
			filter: this._formBuilder.array([this.initItemRows()])
		});
	}

	ngOnInit() {
		console.log('this._CustomFeildData', this._CustomFeildData);
		this.apiGetColumn();
		this.editData = this._CustomFeildData.data;
		this.preSetData = this._CustomFeildData.preSetData;
	}

	get formArr() {
		return this.addCustomFeildForm.get('filter') as FormArray;
	}

	initItemRows() {
		return this._formBuilder.group({
			field: ['', Validators.required],
			type: ['', Validators.required],
			value: ['', Validators.required],
			condition: ['', Validators.required],
			text: [{}, Validators.required]
		});
	}

	get f() {
		return this.addCustomFeildForm.controls;
	}

	getContactsFormGroup(index): FormGroup {
		this.contactList = this.addCustomFeildForm.get('filter') as FormArray;
		const formGroup = this.contactList.controls[index] as FormGroup;
		return formGroup;
	}

	addNewRow() {
		this.formArr.push(this.initItemRows());
	}

	initItemRowsWithValues(field, type, value, condition, text, index) {
		if (index == 0) {
			this.dummyFromGroup = this.getContactsFormGroup(index);
			this.dummyFromGroup.controls['field'].setValue(field);
			this.dummyFromGroup.controls['type'].setValue(type);
			this.dummyFromGroup.controls['value'].setValue(value);
			this.dummyFromGroup.controls['condition'].setValue(condition);
			this.dummyFromGroup.controls['text'].setValue(text);
		} else {
			this.formArr.push(this._formBuilder.group({
				field: [field],
				type: [type],
				value: [value],
				condition: [condition],
				text: [text]
			}));
		}
	}

	deleteRow(index: number, dbName: string) {
		if (dbName != null)
			this.selectedCols = this.selectedCols.filter((list) => list != dbName);
		this.formArr.removeAt(index);
	}

	addTag(name) {
		var zeroRemove = parseInt(name);
		var removeZeroQuantity = zeroRemove.toString();
		this._source = {
			_source: { UPC_A: removeZeroQuantity, tag: true }
		};
		return this._source;
	}

	onProductNameSearch($event) {
		if (($event.timeStamp - this.lastKeypress > 100)) {
			this.queryText = $event.target.value;
			this.elasticsearchService.fullTextSearch(
				ItemGroupsManageDialogComponent.INDEX,
				'UPC_A', this.queryText, this.SearchField).then(
					response => {
						this.ProductnameLoading = false;
						this.ProductDropDownList = response.hits.hits;
					}, error => {
						console.error(error);
					}).then(() => {
						//console.log('Search Completed!');
					});

		} else {
			if ($event.key.length == 1) {
				this.stringConcat = this.stringConcat.concat($event.key);
			}
			if ($event.key === 'Enter') {
				this.queryText = this.stringConcat;
				if (!this.addCustomFeildForm.value.upc.includes(this.stringConcat) && $event.target.value != '' && !this.addCustomFeildForm.value.upc.includes($event.target.value)) {
					this._source = { UPC_A: this.queryText };

					this.elasticsearchService.fullTextSearch(
						ItemGroupsManageDialogComponent.INDEX,
						'UPC_A', this.queryText, this.SearchField).then(
							(response: any) => {
								this.ProductnameLoading = false;
								this.ProductDropDownList = response.hits.hits;

								this.stringConcat = "";
								this.seletedproductList = [...this.seletedproductList, this.queryText];
								//this.onSelectProduct(this.ProductDropDownList);
							}, error => {
								console.error(error);
							}).then(() => {

							});
				} else if (this.addCustomFeildForm.value.upc.includes(this.stringConcat)) {
					if (this.seletedproductList[0] === this.stringConcat) {
						this.elasticsearchService.fullTextSearch(
							ItemGroupsManageDialogComponent.INDEX,
							'UPC_A', this.queryText, this.SearchField).then(
								(response: any) => {
									this.ProductnameLoading = false;
									this.ProductDropDownList = response.hits.hits;
									this.stringConcat = "";
									//this.onSelectProduct(this.ProductDropDownList);
								}, error => {
									console.error(error);
								}).then(() => {

								});
					}
				}
			}

		}
		this.lastKeypress = $event.timeStamp;
	}

	funOpenDialog(dbName: string, modelname: string, index: number) {
		this.singlecolInfo[index] = this.allColumns.filter((list) => list.dbName == dbName && list.model == modelname)[0];
		this.selectedCols[index] = dbName;
		this.arrmodelName[index] = this.singlecolInfo[index].model;
		let lookUpUrls = this.singlecolInfo[index].urlslookup;
		if (lookUpUrls != null) {
			let Lookuplength: number = lookUpUrls.length;
			let lastCharUrls: string = lookUpUrls.charAt(Lookuplength - 1);
			if (lastCharUrls == '&') {
				lookUpUrls = `${this.singlecolInfo[index].urlslookup}` + `colname=${this.singlecolInfo[index].fieldname}&modulename=${this.moduleName}&listing_type=isdeleted&type_value=n&`;
			} else {
				lookUpUrls = `${this.singlecolInfo[index].urlslookup}` + `?colname=${this.singlecolInfo[index].fieldname}&modulename=${this.moduleName}&listing_type=isdeleted&type_value=n&`
			}
			this._helper.apiGet(lookUpUrls).subscribe(
				data => {
					//console.log("data",data);
					if (data["status"] == 1) {
						this.filterDropDownList[index] = data["data"];
					} else {
						this._helper.notify({ message: data["message"], messageType: data["status"] });
					}
				},
				error => console.log(error)
			);
		}

	}

	saveDetails() {
		this.submitted = true;
		this.isbtnLoaderShow = true;
		this.basicInfoFormDirective.ngSubmit.emit();
		(this.basicInfoFormDirective as any).submitted = true;
		if (this.addCustomFeildForm.invalid) {
			this.isbtnLoaderShow = false;
			return;
		}
		let arrFilterData: any = [];
		arrFilterData = this.addCustomFeildForm.value.filter;
		arrFilterData.forEach((value, key) => {
			this.dummyFromGroup = this.getContactsFormGroup(key);
			this.dummyFromGroup.addControl('modelname', new FormControl('', Validators.required));
			this.dummyFromGroup.controls['modelname'].setValue(this.arrmodelName[key]);
		});
		// console.log("this.addCustomFeildForm.value", this.addCustomFeildForm.value); return;
		this._dialogRef.close(this.addCustomFeildForm.value); return;
		// if (this.editData.length) {
		// 	this._helper.apiPut(this.addCustomFeildForm.value, `itemapis/item_basic_info/${this.GroupItemID}/`).subscribe(
		// 		res => {
		// 			if (res["message"]) {
		// 				this.isbtnLoaderShow = false;
		// 				this.snackBar.open(res["message"]);
		// 			}
		// 			if (res["status"] == 1) {
		// 				this._dialogRef.close(true);
		// 			}
		// 		},
		// 		error => {
		// 			console.log('error', error);
		// 			this.isbtnLoaderShow = false;
		// 		}
		// 	);
		// } else {
		// 	this._helper.apiPost(this.addCustomFeildForm.value, 'itemapis/item_add/').subscribe(
		// 		res => {
		// 			if (res["message"]) {
		// 				this.isbtnLoaderShow = false;
		// 				this.snackBar.open(res["message"]);
		// 			}
		// 			if (res["status"] == 1) {
		// 				this._dialogRef.close(true);
		// 			}
		// 		},
		// 		error => {
		// 			console.log('error', error);
		// 			this.isbtnLoaderShow = false;
		// 		}
		// 	);
		// }

	}

	apiGetColumn() {
		let allColumns = [];
		let moduleName: string = 'Items';
		this._helper.apiGet(`itemapis/column-details/?ModuleName=${moduleName}&`).subscribe(
			data => {
				if (data["status"] == 1) {
					allColumns = data["data_type"];
					allColumns.forEach((value, key) => {
						if (value.urlslookup != null) {
							allColumns[key].condition = this.smallintColumnConditions;
						}
						else if (value.coltype == "Integer" || value.coltype == "Decimal") {
							allColumns[key].condition = this.numberColumnConditions;
						} else if (value.coltype == "Character" || value.coltype == "Text") {
							allColumns[key].condition = this.charecterColumnConditions;
						} else if (value.coltype == "SmallInteger") {
							allColumns[key].condition = this.smallintColumnConditions;
						}
					});
				}
				this.allColumns = allColumns;
				if (typeof this.preSetData != 'undefined' && typeof this.preSetData.filter != 'undefined' && this.preSetData.filter.length) {
					// console.log('calling setConditions');
					this.setConditions(this.preSetData.filter);
				}
				else if (this.editData.length != 0) {
					if (this.editData != "undefined" || this.editData != null) {
						this.btnText = "Update";
						this.GroupItemID = this.editData[0];
						this.getGroupItemList();
					}
				}
				// console.log('this.allColumns', this.allColumns);
			},
			error => console.log(error)
		);

	}

	getGroupItemList() {
		this._helper.apiGet(`itemapis/item_basic_info/${this.GroupItemID}`).subscribe(
			data => {
				console.log("getGroupItemList", data);
				if (data["status"] == 1) {
					this.setConditions(data.result.group_item_filter);
				}
			},
			error => console.log(error)
		);
	}

	setConditions(conditions: any) {
		console.log('conditions', conditions);
		if (conditions.length >= 1) {
			conditions.forEach((value, key) => {
				this.funOpenDialog(conditions[key].field, conditions[key].modelname, key);
			});
		}
		if (conditions.length >= 1) {
			conditions.forEach((value, key) => {
				this.initItemRowsWithValues(conditions[key].field, conditions[key].type, conditions[key].value, conditions[key].condition, conditions[key].text, key);
			});
		}
	}

	getStatuswiseDate(status: number) {
		// console.log('getStatuswiseDate status', status);
		if (status == 0) {
			this.statusForTabview = this.links[status];
			this.isCreateORPreview = false;
			this.activeLink = this.links[0];
		}
		else if (status == 1) {
			this.statusForTabview = this.links[status];
			this.getPreview({ 'limit': this.paginationSetup.pageLimit, 'offset': this.paginationSetup.pageOffset, 'listing_type': this.listingType, 'type_value': this.typeValue });
		}
	}

	getPreview(params: any) {
		// console.log('getPreview');
		this.isSpinnerLoaderShow = true;
		this.basicInfoFormDirective.ngSubmit.emit();
		(this.basicInfoFormDirective as any).submitted = true;
		if (this.addCustomFeildForm.invalid) {
			this.isbtnLoaderShow = false;
			return;
		}
		this.isCreateORPreview = true;
		this.activeLink = this.links[1];
		this.paginationSetup.pageOffset = params.offset;
		this.paginationSetup.pageLimit = params.limit;
		params.offset = params.offset + 1;
		let arrFilterData: any = [];
		arrFilterData = this.addCustomFeildForm.value.filter;
		arrFilterData.forEach((value, key) => {
			this.dummyFromGroup = this.getContactsFormGroup(key);
			this.dummyFromGroup.addControl('modelname', new FormControl('', Validators.required));
			this.dummyFromGroup.controls['modelname'].setValue(this.arrmodelName[key]);
		});
		// this.addCustomFeildForm.addControl('limit', new FormControl(params.limit, Validators.required));
		// this.addCustomFeildForm.addControl('offset', new FormControl(params.offset, Validators.required));
		// this.addCustomFeildForm.addControl('q', new FormControl(''));
		// this.addCustomFeildForm.addControl('colname', new FormControl('id'));
		// this.addCustomFeildForm.addControl('order_by', new FormControl('asc'));
		this.addCustomFeildForm.controls['limit'].setValue(params.limit);
		this.addCustomFeildForm.controls['offset'].setValue(params.offset);
		this.addCustomFeildForm.controls['q'].setValue('');
		this.addCustomFeildForm.controls['colname'].setValue('id');
		this.addCustomFeildForm.controls['order_by'].setValue('asc');
		this._helper.apiPost(this.addCustomFeildForm.value, 'itemapis/group-item-preview/').subscribe(
			res => {
				// console.log('getPreview res', res);
				this.isSpinnerLoaderShow = false;
				if (res["status"] == 1) {
					this.ItemsList = res['result'];
					this.paginationSetup.totalRecord = res.RecordsCount;
					this.prepareMatTable();
				}
			},
			error => {
				console.log('error', error);
				this.isbtnLoaderShow = false;
			}
		);

	}

	prepareMatTable() {
		this.dataSource = new MatTableDataSource<PeriodicElement>(this.ItemsList);
	}

	loadPage() {
		this.getPreview({ 'limit': this.paginator.pageSize, 'offset': this.paginator.pageIndex, 'listing_type': this.listingType, 'type_value': this.typeValue });
	}

	ngAfterViewInit() {
		this.paginator.page
			.pipe(
				tap(() => this.loadPage())
			)
			.subscribe();
	}

}
