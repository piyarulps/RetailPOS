import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatDatepicker } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';

import { ElasticsearchService } from '../../../../services/elasticsearch.service';
import { HelperService } from '../../../../services/helper.service';
import { ValidationService } from '../../../../services/validation/validation.service';
import { ConnectionService } from 'ng-connection-service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DialogsService } from '../../../../services/dialogs.service';
import { Globals } from '../../../../globals';

export interface PeriodicElement {
	id: number;
}

export interface PageData {
	_editData: {
		data: []
	}
}

@Component({
	selector: 'app-items-manage',
	templateUrl: './items-manage.component.html',
	styleUrls: ['./items-manage.component.scss']
})
export class ItemsManageComponent implements OnInit, AfterViewInit {

	@Input() pageData: PageData;
	@Output() getCommonData = new EventEmitter<{}>();

	displayedColumns: any = ['position', 'department', 'name', 'parent', 'description'];

	moduleName: string = "Item";
	displayModuleName: string = "Items";
	addModuleForm: FormGroup;
	SupplierForm: FormGroup;
	addCustomFeildForm: FormGroup;
	AdvanceDetailsForm: FormGroup;
	ShelfDetailsForm: FormGroup;

	submitted: boolean = false;
	error;
	stepperConfig: any = {
		currentStep: 1,
		initStep: 1,
		maxStep: 5,
		isDisabled: false,
		doneBtnText: 'Next',
		tab_name: 'Basic_Info'
	};
	ProductDropDownList: any = [];
	ProductDropDownDescription: any = [];
	SellingRuleList: any = [];
	POSDepartmentList: any = [];
	ProductnameLoading: boolean = false;
	ProductdescriptionLoading: boolean = false;
	response: any;
	_source: any = {};
	private static readonly INDEX = 'item_master';
	tempObj: any;
	private queryText = '';
	private lastKeypress = 0;
	tag: boolean;
	SearchField: any = ['UPC_A', 'POS_Name', 'Brand_Line', 'Container'];
	isSelectBox: boolean = true;
	BrandList: any[];
	SizeList: any[];
	SubBrandList: any = [];
	BrandBackupList: any[];
	SizeBackupList: any[];
	SubBrandBackupList: any[];
	POSDepartmentListBackupList: any[];
	TobeselectedValue: any;
	stepOneData: any = {};
	isLoading: boolean = false;
	supplerList: any[];
	dataSource = new MatTableDataSource<PeriodicElement>(this.supplerList);
	selection = new SelectionModel<PeriodicElement>(true, []);
	supllierdisplayedColumns: any = ['select', 'LegalName', 'Reorder', 'SalePerUnit', 'Basecost'];
	selectedListData: any = [];
	selectedList: any = [];
	isbtnLoaderShow: boolean = false;
	ItemID: string = '';
	searchText: string = '';
	strMsg: boolean = false;
	arrSupplierID: any = [];
	suplierData: any = [];
	editIds: any = [];
	seletedproductList: any = [];
	selectedSize: any;
	selectedProductDescription: string;
	selectedSuplierList: any = [];
	SavedCustomFeildTypeList: any = [];
	settings: any = [];
	RetailPackageSizeList: any = [];
	RetailPackageSizeBackupList: any = [];
	ItemTypeList: any = [];
	PriceLineList: any = [];
	HeaderName: string = 'Add New Item';
	currentDate = new Date();
	previosuStep: number = 1;
	isDateValidattionRequired: boolean = true;
	isSpinnerLoaderShow: boolean = true;
	merchandisedata: any = [];
	MerchandiseFunctionList: any = [];
	MerchandiseFunctionID: number;
	receivedData: any;
	isOpenSidebar: boolean = false;
	editData: any = [];
	backupEditData: any = [];
	inventoryData: any = {
		selling_rule_id: null,
		min_inventory_level: 0,
		max_inventory_level: 0,
		desired_inventory_level: 0,
	};
	pricingData: any = {
		price: 0,
		cost: 0,
		margin: 0,
		markup: 0,
		profit: 0,
		begin_date: null,
		end_date: null,
		msrp: 0,
		msrp_date: null,
		compare_at_sale_unit_price: 0,
		ItemSellingPrices: null,
		selling_price_type: null,
		CurrentSaleUnitReturnPrice: null,
		MinimumAdvertisedRetailUnitPrice: null,
		MinimumAdvertisedRetailUnitPriceEffectiveDate: null
	};
	supplierSendData: any = {
		editIds: this.editIds,
		ItemID: this.ItemID
	};
	// supplierData: any = [];
	itemCollectionSendData: any = {
		editIds: this.editIds,
		ItemID: this.ItemID
	};
	itemCollectionData: any = {};

	@ViewChild('basicInfoForm') basicInfoFormDirective: FormGroupDirective;
	@ViewChild('advanceDetailsInfoForm') advanceDetailsFormDirective: FormGroupDirective;
	@ViewChild('ShelfDetailsFeildForm') ShelfDetailsFormDirective: FormGroupDirective;
	@ViewChild('advanceDetailsFeildForm') addCustomFeildFormDirective: FormGroupDirective;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild('upcSelect') upcSelectField: NgSelectComponent;

	paginationSetup: any = {
		pageLimitOptions: [25, 50, 100],
		pageLimit: 25,
		pageOffset: 0,
		totalRecord: 0
	};
	colname: string = 'POSItemID';
	order_by: string = 'asc';
	stringConcat: string = "";
	closeOnTruFalse: boolean = true;
	item_price: any = "0.00";
	item_cost: any = "0.00";
	item_margin: any = "0.00";
	item_Profit: any = "0.00";
	item_markup: any = "0.00";
	ImageBase64urls = [];
	ImageNameFromServer = [];
	ItemTypeCode: string = '';
	MainItemTypeCode: string = '';
	Tax_Exempt_Code: any = [];
	Useage_Code: any = [];
	Kit_Set_Code: any = [];
	Order_Collection_Code: any = [];

	showInventoryData: any = "Manage Inventory";
	// Selling Rule, Tax, Min Inventory Level, Max Inventory Level, Desired Inventory Level
	showPricingData: any = "Manage Pricing";
	// Type, Price, Cost, Margin(%), Profit, Begin date, End Date, MSRP, MSRP Date, Compare At Sale Unit price, Current Sale Unit Return Price, Minimum Retail Unit Price, Minimum Retail Unit Price Effective Date
	showMerchandisingData: any = "Manage Merchandising";
	// Merchandising Function
	showSupplierData: any = "Manage Supplier";
	// Supplier#, Supplier Name
	showItemCollectionData: any = "Manage Item Collection";
	// Product#, Description, Brand, Size, Qty in Mother

	constructor(
		private _formBuilder: FormBuilder,
		private route: Router,
		private _route: ActivatedRoute,
		public formDirective: FormGroupDirective,
		public elasticsearchService: ElasticsearchService,
		public _location: Location,
		public _validation: ValidationService,
		public _helper: HelperService,
		public _dialog: DialogsService,
		private _globals: Globals
	) {
		this.validateForm();
		this.validateAdvanceForm();
		this.validateShelfForm();
		this.Tax_Exempt_Code = this._globals.Tax_Exempt_Code;
		this.Useage_Code = this._globals.Useage_Code;
		this.Kit_Set_Code = this._globals.Kit_Set_Code;
		this.Order_Collection_Code = this._globals.Order_Collection_Code;
	}

	manageInventory() {
		this._dialog.itemInventoryManageDialog(this.inventoryData).subscribe(
			response => {
				if (response) {
					// console.log('manageInventory', response);
					if (response.label != '') this.showInventoryData = response.label;
					this.inventoryData = response.data;
				}
			}
		)
	}

	managePricing() {
		this._dialog.itemPricingManageDialog(this.pricingData).subscribe(
			response => {
				if (response) {
					// console.log('pricingData', response);
					if (response.label != '') this.showPricingData = response.label;
					this.pricingData = response.data;
				}
			}
		)
	}

	manageMerchandising() {
		let sendData = {
			editIds: this.editIds,
			ItemID: this.ItemID
		};
		this._dialog.itemMerchandisingManageDialog(sendData).subscribe(
			response => {
				if (response) {
					// console.log('manageMerchandising', response);
					if (response.label != '') this.showMerchandisingData = response.label;
					this.merchandisedata = response.data;
				}
			}
		)
	}

	manageSupplier() {
		this.supplierSendData = {
			editIds: this.editIds,
			ItemID: this.ItemID
		};
		// console.log('this.supplierSendData', this.supplierSendData);
		this._dialog.itemSupplierManageDialog(this.supplierSendData).subscribe(
			response => {
				if (response) {
					// console.log('manageSupplier', response);
					if (response.label != '') this.showSupplierData = response.label;
					this.suplierData = response.supplierData;
					this.selectedListData = response.selectedListData;
				}
			}
		)
	}

	manageItemCollection() {
		this.itemCollectionSendData = {
			editIds: this.editIds,
			ItemID: this.ItemID
		};
		this._dialog.itemItemCollectionManageDialog(this.itemCollectionSendData).subscribe(
			response => {
				if (response) {
					// console.log('manageItemCollection', response);
					if (response.label != '') this.showItemCollectionData = response.label;
					this.itemCollectionData = response.itemCollectionData;
					// this.selectedListData = response.selectedListData;
					this.MainItemTypeCode = response.MainItemTypeCode;
				}
			}
		)
	}

	validateForm() {
		this.addModuleForm = this._formBuilder.group({
			upc: [null, Validators.required],
			size: [null],
			description: [null, Validators.required],
			pos_department_name: [null],
			brand_name: [null],
			sub_brand: [null],
			retail_package_size: [null],
			merchandise: [null]
			// price: [0],
			// cost: [0],
			// margin: [0],
			// profit: [0],
			// begin_date: [null],
			// end_date: [null],
			// msrp: [0, [Validators.pattern(this._validation.pattern_isDecimal)]],
			// msrp_date: [null],
			// compare_at_sale_unit_price: [0],
			// ItemSellingPrices: [null],
			// selling_price_type: [null],
			// CurrentSaleUnitReturnPrice: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			// MinimumAdvertisedRetailUnitPrice: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			// MinimumAdvertisedRetailUnitPriceEffectiveDate: [null]
		}, {
			// validator: [this._validation.DateValidation('begin_date', 'end_date')]
			// this._validation.CostValidation('price', 'cost')
		});
	}

	validateAdvanceForm() {
		this.AdvanceDetailsForm = this._formBuilder.group({
			TypeCode: [null],
			LongDescription: [null],
			PriceLine_id: [null],
			TaxExemptCode: [null],
			UsageCode: [null],
			KitSetCode: [null],
			OrderCollectionCode: [null],
			counting: [null],
			sale_weight_or_unit_count_code: [null],
			unit_price_factor: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			available_for_sale_date: [null],
			bulk_to_selling_unit_waste_factor_percent: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			bulk_to_selling_unit_waste_type_code: [null],
			flag: [null],
			abv: [null, [Validators.pattern(this._validation.pattern_isDecimal)]]
		});
	}

	validateShelfForm() {
		this.ShelfDetailsForm = this._formBuilder.group({
			facings_count: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			staple_perishable_type_code: [null],
			shelf_life_day_count: [null, [Validators.pattern(this._validation.pattern_integer)]],
			consumer_package_depth: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			consumer_package_height: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			consumer_package_width: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			consumer_package_diameter: [null, [Validators.pattern(this._validation.pattern_integer)]],
			consumer_package_size_uomcode: [null],
			consumer_package_gross_weight: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			consumer_package_net_weight: [null, [Validators.pattern(this._validation.pattern_integer)]],
			consumer_package_drained_weight: [null, [Validators.pattern(this._validation.pattern_integer)]],
			consumer_package_tare_weight: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			consumer_package_weight_uomcode: [null],
			consumer_package_net_content: [null, [Validators.pattern(this._validation.pattern_integer)]],
			consumer_package_contents_uomcode: [null],
			peg_horizontal_distance: [null, [Validators.pattern(this._validation.pattern_integer)]],
			peg_vertical_distance: [null, [Validators.pattern(this._validation.pattern_integer)]],
			peg_distance_uomcode: [null]
		});
	}

	get f() {
		return this.addModuleForm.controls;
	}

	get shelfDetailsform() { return this.ShelfDetailsForm.controls; }

	get AdvanceDetailsform() { return this.AdvanceDetailsForm.controls; }

	ngOnChanges(changes: SimpleChanges) {
		this.receivedData = {};
		this.editData = [];
		const change: SimpleChange = changes.pageData;
		let tempData = change.currentValue;
		if (typeof (tempData._preSetText) != 'undefined' && tempData._preSetText != null && typeof (tempData._preSetTextType) != 'undefined' && tempData._preSetTextType != null) {
			if (tempData._preSetTextType == 'POSDepartment') {
				this.TobeselectedValue = tempData._preSetText;
				this.getPOSDepartmentList(null, null, 1);
			}
			else if (tempData._preSetTextType == 'Brand') {
				this.TobeselectedValue = tempData._preSetText;
				this.getBrandList(1);
			}
			else if (tempData._preSetTextType == 'Size') {
				this.TobeselectedValue = tempData._preSetText;
				this.getSizeList(1);
			}
			return;
		}
		this.receivedData = tempData;
		this.ItemID = '';
		this.editIds = [];
		this.merchandisedata = [];
		this.stepperConfig = {
			currentStep: 1,
			initStep: 1,
			maxStep: 5,
			isDisabled: false,
			doneBtnText: 'Next',
			tab_name: 'Basic_Info'
		};
		this.submitted = false;
		this.inventoryData = {
			selling_rule_id: null,
			min_inventory_level: 0,
			max_inventory_level: 0,
			desired_inventory_level: 0,
		};
		this.pricingData = {
			price: 0,
			cost: 0,
			margin: 0,
			markup: 0,
			profit: 0,
			begin_date: null,
			end_date: null,
			msrp: 0,
			msrp_date: null,
			compare_at_sale_unit_price: 0,
			ItemSellingPrices: null,
			selling_price_type: null,
			CurrentSaleUnitReturnPrice: null,
			MinimumAdvertisedRetailUnitPrice: null,
			MinimumAdvertisedRetailUnitPriceEffectiveDate: null
		};
		this.showInventoryData = "Manage Inventory";
		this.showPricingData = "Manage Pricing";
		this.showMerchandisingData = "Manage Merchandising";
		this.showSupplierData = "Manage Supplier";
		this.showItemCollectionData = "Manage Item Collection";
		this.ImageBase64urls = [];
		this.ImageNameFromServer = [];
		this.validateForm();
		this.validateAdvanceForm();
		this.validateShelfForm();
		// console.log(this.receivedData);
		if (typeof (this.receivedData._pageData) != 'undefined' && this.receivedData._pageData) {
			this.moduleName = this.receivedData._pageData.moduleName;
			this.displayModuleName = this.receivedData._pageData.displayModuleName;
		}
		if (typeof (this.receivedData._openSidebar) != 'undefined' && this.receivedData._openSidebar) {
			// this.validateForm();
			// this.validateAdvanceForm();
			// this.validateShelfForm();
			if (typeof (this.receivedData._editData) != "undefined" && typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null && this.receivedData._editData.data.length) { }
			else { }
		}
		if (typeof (this.receivedData._editData) != "undefined") {
			if (typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null) {
				this.editData = this.receivedData._editData.data;
				this.backupEditData = this.receivedData._editData.data;
				if (this.editData.length) {
					// console.log('this.editData', this.editData);
					this.isDateValidattionRequired = false;
					const upcControl = this.addModuleForm.get('upc');
					const descriptionControl = this.addModuleForm.get('description');
					this.editIds = this.editData;
					if (this.editIds.length == 1) {
						this.isSpinnerLoaderShow = false;
						this.ItemID = this.editIds[0]._id;
						this.getItemList();
					} else {
						this.editIds.forEach((value, key) => {
							if (this.ItemID == '')
								this.ItemID = this.editIds[key]._id;
							else
								this.ItemID += "," + this.editIds[key]._id;
						});
						upcControl.clearValidators();
						descriptionControl.clearValidators();
					}
				}
			}
		}
		// console.log('this.receivedData', this.receivedData);
	}

	ngOnInit() {
		this.getBrandList();
		this.getSizeList();
		// this.getSellingRuleList();
		this.getRetailPackageSize();
		this.getItemType();
		this.getPriceLine();
		this._route.queryParams.subscribe(params => {
			// if (typeof (params.editData) != 'undefined' && params.editData != '' && atob(params.editData) && JSON.parse(atob(params.editData))) {
			// 	this.HeaderName = "Edit Item";
			// 	this.isDateValidattionRequired = false;
			// 	const upcControl = this.addModuleForm.get('upc');
			// 	const descriptionControl = this.addModuleForm.get('description');
			// 	this.editIds = JSON.parse(atob(params.editData));
			// 	if (this.editIds.length == 1) {
			// 		this.isSpinnerLoaderShow = false;
			// 		this.ItemID = this.editIds[0].ItemID;
			// 		this.getItemList();
			// 	} else {
			// 		this.editIds.forEach((value, key) => {
			// 			if (this.ItemID == '')
			// 				this.ItemID = this.editIds[key].ItemID;
			// 			else
			// 				this.ItemID += "," + this.editIds[key].ItemID;
			// 		});
			// 		upcControl.clearValidators();
			// 		descriptionControl.clearValidators();
			// 	}
			// }
			if ((params.referer) == 'supplier' && (params.supplierids) != 'undefined') {
				if (typeof (params.id) != 'undefined') {
					this.addRefererSupplier(params.id, params.supplierids);
				} else {
					this.getSupplierList();
				}
				this.stepperConfig.currentStep++;
			}
			if ((params.referer) == 'posdepartment' && (params.POSDID) != 'undefined') {
				if (typeof (params.editData) != 'undefined') {
					this.editIds = JSON.parse(atob(params.editData));
					if (this.editIds.length == 1) {
						this.ItemID = this.editIds[0].ItemID;
						this.getItemList();
					}
				}
				this.TobeselectedValue = params.POSName;
				this.getPOSDepartmentList(null, null, 1);
			}
		});
	}

	_openCalendar(picker: MatDatepicker<Date>) {
		picker.open();
	}

	search(e) {
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
		if (typeof (this.paginator) != 'undefined') {
			this.paginator.page
				.pipe(
					tap(() => this.loadPage())
				)
				.subscribe();
		}
		// setTimeout(() => {
		// if (typeof (this.upcSelectField) != 'undefined') {
		// 	this.upcSelectField.focus();
		// }
		// }, 1000);
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

	stepperNavigate(direction: string) {
		// console.log('stepperNavigate direction', direction);
		if (direction == 'next' || direction == 'Save') {
			if (this.stepperConfig.currentStep == this.stepperConfig.initStep) {
				this.stepOneValidation(direction);
			}
			else if (this.stepperConfig.currentStep == this.stepperConfig.initStep + 1) {
				this.stepTwoValidation(direction);
			}
			else if (this.stepperConfig.currentStep == this.stepperConfig.initStep + 2) {
				//this.stepThreeValidation();
			}
			else if (this.stepperConfig.currentStep == this.stepperConfig.initStep + 3) {
				this.stepFourValidation(direction);
			}
			else if (this.stepperConfig.currentStep == this.stepperConfig.maxStep) {
				this.stepFiveValidation(direction);
			}
		}

		if (direction == 'back' && this.stepperConfig.currentStep != this.stepperConfig.initStep) {
			if (this.stepperConfig.currentStep == 4) {
				// this.stepperConfig.currentStep = this.stepperConfig.currentStep - 2;
				this.stepperConfig.currentStep = this.stepperConfig.currentStep - 3;
			} else {
				this.stepperConfig.currentStep--;
			}
			this.btnTxtChange();
			// this.getItemList();
		}
	}

	stepOneValidation(direction: string = null, currentStep: number = null) {
		// console.log('stepOneValidation');
		this.submitted = true;
		let isValidForm: boolean = false;
		this.basicInfoFormDirective.ngSubmit.emit();
		(this.basicInfoFormDirective as any).submitted = true;
		if (this.basicInfoFormDirective.valid) {
			isValidForm = true;
			this.stepOneData = this.basicInfoFormDirective.value;
		}
		if (this.ImageBase64urls.length > 0) {
			this.addModuleForm.addControl('uploadedImage', new FormControl(this.ImageBase64urls));
		} else {
			this.addModuleForm.addControl('uploadedImage', new FormControl(''));
		}
		if (isValidForm) {
			this.isLoading = true;
			this.stepperConfig.isDisabled = true;
			this.stepperConfig.isDisabled = false;
			this.isLoading = false;
			this.isbtnLoaderShow = true;
			if (this.merchandisedata.length) {
				this.addModuleForm.controls['merchandise'].setValue(this.merchandisedata);
			}
			if (this.editIds.length > 1) {
				this.addModuleForm.controls['upc'].setValue(null);
				this.addModuleForm.controls['description'].setValue(null);
			}
			let tempData = Object.assign(this.addModuleForm.value, this.inventoryData);
			let itemData = Object.assign(tempData, this.pricingData);
			if (this.ItemID != null && this.ItemID != '') {
				// this._helper.apiPut(this.addModuleForm.value, `itemapis/item_basic_info/${this.ItemID}/`).subscribe(
				this._helper.apiPutLocal(itemData, `getsingleitem/${this.ItemID}/`).subscribe(
					res => {
						// console.log('apiPutLocal');
						this.isbtnLoaderShow = false;
						if (res["message"]) {
							this._helper.notify({ message: res["message"], messageType: res["status"] });
						}
						if (res["status"] == 1) {
							this.ImageBase64urls = [];
							// this.saveSupplier();
							if (direction == "Save") {
								this.route.navigate(['/dashboard/item-maintenance/items']);
							} else {
								if (currentStep != null) {
									this.stepperConfig.currentStep = currentStep;
								} else {
									// this.getCommonData.emit({ dataAdded: true, hitListAction: 'records', noSelectionCheck: true });
									this.getCommonData.emit({ dataAdded: true });
									this.stepperConfig.currentStep = 4;
								}
								this.previosuStep = this.stepperConfig.currentStep;
								//this.stepperConfig.tab_name="Supplier";//custom feild
								this.tabWiseRetriveData(this.stepperConfig.currentStep);
								this.btnTxtChange();
							}
						}
					},
					error => {
						console.log('error', error);
					}
				);
			} else {
				// this._helper.apiPost(this.addModuleForm.value, 'itemapis/item_add/').subscribe(
				this._helper.apiPostLocal(itemData, 'itemlist/').subscribe(
					res => {
						// console.log('apiPostLocal');
						this.isbtnLoaderShow = false;
						if (res["message"]) {
							this._helper.notify({ message: res["message"], messageType: res["status"] });
						}
						if (res["status"] == 1) {
							this.ImageBase64urls = [];
							// this.saveSupplier();
							if (direction == "Save") {
								this.route.navigate(['/dashboard/item-maintenance/items']);
							} else {
								this.editIds.push({ ItemID: res.item_id });
								this.ItemID = res.item_id;
								// console.log('this.editIds', this.editIds);
								// console.log('this.ItemID', this.ItemID);
								if (currentStep != null) {
									this.stepperConfig.currentStep = currentStep;
								}
								else {
									// this.getCommonData.emit({ dataAdded: true, hitListAction: 'records', noSelectionCheck: true });
									this.getCommonData.emit({ dataAdded: true });
									this.stepperConfig.currentStep = 4;
								}
								this.previosuStep = this.stepperConfig.currentStep;
								//this.stepperConfig.tab_name="Supplier";//custom feild
								this.tabWiseRetriveData(this.stepperConfig.currentStep);
								this.btnTxtChange();
							}
						}
					},
					error => {
						console.log('error', error);
					}
				);
			}
		}
	}

	saveSupplier() {
		let isValidSupplierDetail: boolean = false;
		// console.log('this.suplierData', this.suplierData);
		if (typeof this.selectedListData == 'undefined' || !this.selectedListData.length) return;
		this.selectedListData.forEach((value, key) => {
			var SalePerUnit = this.suplierData[value.PartyData.SupplierID + "_SalePerUnit"];
			var Basecost = this.suplierData[value.PartyData.SupplierID + "_Basecost"];
			var reoreorder = this.suplierData[value.PartyData.SupplierID + "_reorder"];
			// console.log(SalePerUnit, Basecost, reoreorder);
			if (!this.isDecimalNumbar(SalePerUnit) || !this.isDecimalNumbar(Basecost)) {
				isValidSupplierDetail = true;
			}
			if (!isValidSupplierDetail) {
				var suplierobj = {
					id: value.PartyData.supplier_item_data.id,
					LastReceiptSaleUnitBaseCost: Basecost,
					LastReceiptSaleByUnitCount: SalePerUnit,
					re_order: reoreorder
				}
				this.selectedSuplierList.push(suplierobj);
			}
		});
		// if (isValidSupplierDetail) {
		// 	this._helper.notify({ message: "Supplier is not saved. Please enter decimal value.", messageType: 0 });
		// 	return;
		// }
		var supllierData = { suplierData: this.selectedSuplierList };
		this.isbtnLoaderShow = true;
		this._helper.apiPost(supllierData, 'itemapis/supplier_update/').subscribe(
			res => {
				console.log('res', res);
				this.isbtnLoaderShow = false;
				if (res["message"]) {
					this._helper.notify({ message: res["message"], messageType: res["status"] });
				}
				if (res["status"] == 1) { }
			},
			error => {
				console.log('error', error);
			}
		);
	}

	stepTwoValidation(direction: string = null, currentStep: number = null, isSavedOnpopupOpened: boolean = null) {
		// let isValidSupplierDetail: boolean = false;
		// this.selectedListData.forEach((value, key) => {
		// 	var SalePerUnit = this.suplierData[value.PartyData.SupplierID + "_SalePerUnit"];
		// 	var Basecost = this.suplierData[value.PartyData.SupplierID + "_Basecost"];
		// 	var reoreorder = this.suplierData[value.PartyData.SupplierID + "_reorder"];
		// 	if (!this.isDecimalNumbar(SalePerUnit) || !this.isDecimalNumbar(Basecost)) {
		// 		isValidSupplierDetail = true;
		// 	}
		// 	if (!isValidSupplierDetail) {
		// 		var suplierobj = {
		// 			id: value.PartyData.supplier_item_data.id,
		// 			LastReceiptSaleUnitBaseCost: Basecost,
		// 			LastReceiptSaleByUnitCount: SalePerUnit,
		// 			re_order: reoreorder
		// 		}
		// 		this.selectedSuplierList.push(suplierobj);
		// 	}
		// });
		// if (isValidSupplierDetail) {
		// 	this._helper.notify({ message: "Please enter decimal value.", messageType: 0 });
		// 	return;
		// }
		// var supllierData = { suplierData: this.selectedSuplierList };
		// this.isbtnLoaderShow = true;
		// this._helper.apiPost(supllierData, 'itemapis/supplier_update').subscribe(
		// 	res => {
		// 		this.isbtnLoaderShow = false;
		// 		if (res["message"]) {
		// 			this._helper.notify({ message: res["message"], messageType: res["status"] });
		// 		}
		// 		if (res["status"] == 1) {
		// 			if (direction == "Save") {
		// 				this.route.navigate(['/dashboard/item-maintenance/items']);
		// 			} else {
		// 				if (currentStep != null) {
		// 					this.stepperConfig.currentStep = currentStep;
		// 					if (isSavedOnpopupOpened) {
		// 						this._dialog.AddSupplierDailog([], this.editIds).subscribe(res => {
		// 							if (res) {
		// 								this.getSupplierList(res.is_multiple_update);
		// 							}
		// 						});
		// 					}
		// 				}
		// 				else
		// 					this.stepperConfig.currentStep++;

		// 				this.previosuStep = this.stepperConfig.currentStep;
		// 				this.tabWiseRetriveData(this.stepperConfig.currentStep);
		// 			}
		// 			//this.stepperConfig.tab_name="advanced_details";//custom feild
		// 			//this.getAllFeild();//For custom feild
		// 		}
		// 	},
		// 	error => {
		// 		console.log('error', error);
		// 	}
		// );
	}

	stepFourValidation(direction: string = null, currentStep: number = null) {
		this.advanceDetailsFormDirective.ngSubmit.emit();
		(this.advanceDetailsFormDirective as any).submitted = true;
		this.isbtnLoaderShow = true;
		if (this.advanceDetailsFormDirective.invalid) {
			this.isbtnLoaderShow = false;
			return;
		}
		//let arrCustomFeild=this.addCustomFeildForm.get('setting').value;//custom Feiled
		this._helper.apiPutLocal(this.AdvanceDetailsForm.value, `advanced_field_save/${this.ItemID}/`).subscribe(
			res => {
				if (res["message"]) {
					this._helper.notify({ message: res["message"], messageType: res["status"] });
				}
				if (res["status"] == 1) {
					this.saveSupplier();
					// this.stepperConfig.tab_name="shelf_detail";
					if (direction == "Save") {
						this.getCommonData.emit({ openSidebar: false, dataAdded: this.addModuleForm.value });
					} else {
						this.isbtnLoaderShow = false;

						if (currentStep != null) {
							this.stepperConfig.currentStep = currentStep;
						}
						else {
							if (this.ItemTypeCode != "SI") {
								this.getCommonData.emit({ openSidebar: false, dataAdded: this.addModuleForm.value });
							}
							else {
								this.stepperConfig.currentStep++;
							}
						}
						this.previosuStep = this.stepperConfig.currentStep;
						this.tabWiseRetriveData(this.stepperConfig.currentStep);
						this.btnTxtChange();
					}
				}
			},
			error => {
				console.log('error', error);
			}
		);
	}

	stepFiveValidation(direction: string = null, currentStep: number = null) {
		this.ShelfDetailsFormDirective.ngSubmit.emit();
		(this.ShelfDetailsFormDirective as any).submitted = true;
		this.isbtnLoaderShow = true;
		if (this.ShelfDetailsFormDirective.invalid) {
			this.isbtnLoaderShow = false;
			return;
		}
		//let arrCustomFeild=this.addCustomFeildForm.get('setting').value;//custom Feiled
		this._helper.apiPutLocal(this.ShelfDetailsForm.value, `shelf_field_save/${this.ItemID}/`).subscribe(
			res => {
				if (res["message"]) {
					this._helper.notify({ message: res["message"], messageType: res["status"] });
				}
				if (res["status"] == 1) {
					//this.stepperConfig.tab_name="shelf_detail";
					//this.apiGetFeild();
					this.isbtnLoaderShow = false;
					if (currentStep != null)
						this.stepperConfig.currentStep = currentStep;
					else
						// this.route.navigate(['/dashboard/item-maintenance/items']);
						this.getCommonData.emit({ openSidebar: false, dataAdded: this.addModuleForm.value });
					this.previosuStep = this.stepperConfig.currentStep;
					this.btnTxtChange();
				}
			},
			error => {
				console.log('error', error);
			}
		);
	}

	btnTxtChange() {
		if (this.stepperConfig.currentStep == this.stepperConfig.maxStep || (this.ItemTypeCode != "SI" && this.stepperConfig.currentStep == 4)) {
			this.stepperConfig.doneBtnText = 'Save';
		}
		else {
			this.stepperConfig.doneBtnText = 'Next';
		}
	}

	tabWiseRetriveData(tabnumber) {
		if (tabnumber == 1) {
			this.getItemList();
		} else if (tabnumber == 2) {
			this.getSupplierList();
		} else if (tabnumber == 4) {
			if (this.editIds.length == 1) {
				this.getAdvanceDetails();
			}
		} else if (tabnumber == 5) {
			if (this.editIds.length == 1) {
				this.getShelfDetails();
			}
		}
	}

	getTabWiseDetails(currentStep: number) {
		// console.log('getTabWiseDetails currentStep', currentStep);
		/*For saving open tab value*/
		if (this.ItemID != null && this.ItemID != '') {
			if (this.previosuStep == 1) {
				this.stepOneValidation(null, currentStep);
			} else if (this.previosuStep == 2) {
				this.stepTwoValidation(null, currentStep);
			} else if (this.previosuStep == 4) {
				this.stepFourValidation(null, currentStep);
			} else if (this.previosuStep == 5) {
				this.stepFiveValidation(null, currentStep);
			}
		}
	}

	getSupplierList(is_multiple_update: string = 'n', pageOffset: number = this.paginationSetup.pageOffset, pageLimit: number = this.paginationSetup.pageLimit, colname: string = this.colname, order_by = this.order_by) {
		this.paginationSetup.pageLimit = pageLimit;
		// this._globalService.setPageSetup(pageOffset, pageLimit);
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
		this._helper.apiGet(`itemapis/organizations/?vendortype=Supplier&item=${itemsIDforAddandupdate}&offset=${pageOffset}&limit=${pageLimit}&q=${this.searchText}&`).subscribe(
			data => {
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
	openSupplierDialog() {
		//   this._dialogsService.AddSupplierDailog([],this.editIds).subscribe(res => {
		// 		if(res){
		// 		this.getSupplierList(res.is_multiple_update);
		// 		}
		//   });
		this.stepTwoValidation(null, 2, true);
	}
	onProductNameSearch($event) {
		console.log("event", this.seletedproductList.length);
		if (this.seletedproductList.length == 0) {
			if (($event.timeStamp - this.lastKeypress > 100)) {
				this.queryText = $event.target.value;
				this.elasticsearchService.fullTextSearch(
					ItemsManageComponent.INDEX,
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
					if (!this.addModuleForm.value.upc.includes(this.stringConcat) && $event.target.value != '' && !this.addModuleForm.value.upc.includes($event.target.value)) {
						this._source = { UPC_A: this.queryText };

						this.elasticsearchService.fullTextSearch(
							ItemsManageComponent.INDEX,
							'UPC_A', this.queryText, this.SearchField).then(
								(response: any) => {
									this.ProductnameLoading = false;
									this.ProductDropDownList = response.hits.hits;

									this.stringConcat = "";
									this.seletedproductList = [...this.seletedproductList, this.queryText];
									this.onSelectProduct(this.ProductDropDownList);
								}, error => {
									console.error(error);
								}).then(() => {

								});
					} else if (this.addModuleForm.value.upc.includes(this.stringConcat)) {
						if (this.seletedproductList[0] === this.stringConcat) {
							this.elasticsearchService.fullTextSearch(
								ItemsManageComponent.INDEX,
								'UPC_A', this.queryText, this.SearchField).then(
									(response: any) => {
										this.ProductnameLoading = false;
										this.ProductDropDownList = response.hits.hits;
										this.stringConcat = "";
										this.onSelectProduct(this.ProductDropDownList);
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
	}

	onSelectProduct(event: any) {
		if (typeof (event[0]) != "undefined") {
			if (typeof (event[0]._source.tag) == "undefined") {
				this.tempObj = {
					id: event[0]._source.Brand_Line,
					text: event[0]._source.Brand_Line
				};
				this.BrandList.push(this.tempObj);

				this.tempObj = {
					id: event[0]._source.Container,
					text: event[0]._source.Container
				};
				this.SizeList.push(this.tempObj);
				if (event[0]._source.POS_Name != "" && event[0]._source.POS_Name != null) {
					this.ProductDropDownDescription = [];
					var tempData = {
						_source: {
							POS_Name: event[0]._source.POS_Name
						}
					};
					this.tempObj = {
						_source: tempData
					};
					this.ProductDropDownDescription = [...this.ProductDropDownDescription, tempData];
					this.selectedProductDescription = event[0]._source.POS_Name;
				}
				console.log("event", event[0]);
				this.addModuleForm.controls['size'].setValue(event[0]._source.Container);
				this.addModuleForm.controls['brand_name'].setValue(event[0]._source.Brand_Line);
				if (this.editIds.length <= 1)
					this.getPOSDepartmentList(event[0]._source.NACS_Major, event[0]._source.NACS_Minor);
				this.isSelectBox = true;
			} else {
				this.ProductDropDownDescription = [];
				this.selectedProductDescription = null;
				this.addModuleForm.controls['size'].setValue(null);
				this.addModuleForm.controls['brand_name'].setValue(null);
				this.isSelectBox = false;
			}
		} else {
			this.ProductDropDownDescription = [];
			this.selectedProductDescription = null;
			this.ProductDropDownList = [];
			this.seletedproductList = [];
			this.addModuleForm.controls['size'].setValue(null);
			this.addModuleForm.controls['description'].setValue(null);
			this.addModuleForm.controls['brand_name'].setValue(null);
			this.BrandList = this.BrandBackupList;
			this.SizeList = this.SizeBackupList;

		}
		this.ProductDropDownList = [];
	}

	addTag(name) {
		var zeroRemove = name.replace(/^0+/, '');
		var removeZeroQuantity = zeroRemove.toString();
		this._source = {
			_source: { UPC_A: removeZeroQuantity, tag: true },
			display: name
		};
		return this._source;
	}

	//For description master serch
	onProductNameDescriptionSearch($event) {
		this.ProductdescriptionLoading = true;
		if ($event.timeStamp - this.lastKeypress > 100) {
			this.queryText = $event.target.value;

			this.elasticsearchService.fullTextSearch(
				ItemsManageComponent.INDEX,
				'POS_Name', this.queryText, this.SearchField).then(
					response => {
						this.ProductdescriptionLoading = false;
						this.ProductDropDownDescription = response.hits.hits;
						//console.log("aa",this.ProductDropDownList);
					}, error => {
						console.error(error);
					}).then(() => {
						//console.log('Search Completed!');
					});
		}
		this.lastKeypress = $event.timeStamp;
	}

	onSelectProductDescription(event: any) {
		if (typeof (event) != "undefined") {
			if (typeof (event._source.tag) == "undefined") {

				// this.BrandList=[];
				this.tempObj = {
					id: event._source.Brand_Line,
					text: event._source.Brand_Line
				};
				this.BrandList.push(this.tempObj);

				// this.SizeList=[];
				this.tempObj = {
					id: event._source.Container,
					text: event._source.Container
				};
				this.SizeList.push(this.tempObj);
				if (event._source.UPC_A != "" && event._source.UPC_A != null) {
					this.ProductDropDownList = [];
					this.seletedproductList = [];
					var tempData = {
						_source: {
							UPC_A: event._source.UPC_A
						}
					};
					this.tempObj = {
						_source: tempData
					};

					this.ProductDropDownList = [...this.ProductDropDownList, tempData];
					this.seletedproductList = [...this.seletedproductList, event._source.UPC_A];
				}

				// console.log("event._source",this.ProductDropDownList,"seletedproductList",this.seletedproductList);
				this.addModuleForm.controls['size'].setValue(event._source.Container);
				//this.addModuleForm.controls['upc'].setValue(event._source.UPC_A);
				//this.addModuleForm.controls['pos_department_name'].setValue(event._source.POS_Name);
				this.addModuleForm.controls['brand_name'].setValue(event._source.Brand_Line);
				if (this.editIds.length <= 1)
					this.getPOSDepartmentList(event._source.NACS_Major, event._source.NACS_Minor);

			} else {
				this.addModuleForm.controls['size'].setValue(null);
				// this.addModuleForm.controls['upc'].setValue(null);
				//this.addModuleForm.controls['pos_department_name'].setValue(null);
				this.addModuleForm.controls['brand_name'].setValue(null);
				// console.log("WWW=",event._source.tag);
				//this.ProductDropDownList = [];
				//this.seletedproductList  = [];
				//this.ProductDropDownDescription = [];
				//this.selectedProductDescription = null;
			}
		} else {
			this.addModuleForm.controls['size'].setValue(null);
			this.addModuleForm.controls['upc'].setValue(null);
			//this.addModuleForm.controls['pos_department_name'].setValue(null);
			this.addModuleForm.controls['brand_name'].setValue(null);
			this.ProductDropDownList = [];
			this.seletedproductList = [];
			this.ProductDropDownDescription = [];
			this.selectedProductDescription = null;
			this.BrandList = this.BrandBackupList;
			this.SizeList = this.SizeBackupList;
		}
	}
	addTagDescription(name) {
		//console.log("name",name);
		this._source = {
			_source: { POS_Name: name, tag: true }
		};
		return this._source;
	}
	addTagPOSDepartment(name) {
		return { text: name, tag: true };
	}

	onSubmit() {
		this.submitted = true;
		if (this.addModuleForm.invalid) {
			return;
		}
		this._helper.apiPostLocal(this.addModuleForm.value, 'itemlist/').subscribe(
			res => {
				if (res["message"]) {
					this._helper.notify({ message: res["message"], messageType: res["status"] });
				}
				if (res["status"] == 1) {
					this.route.navigate(['/dashboard/item-maintenance/items']);
				}
			},
			error => {
				console.log('error', error);
			}
		);
	}
	getBrandList(isSelectionRequired: number = 0) {
		this._helper.apiGetLocal('branddropdown/').subscribe(
			data => {
				if (data["status"] == 1) {
					this.BrandList = data["result"];
					this.BrandBackupList = this.BrandList;
					if (isSelectionRequired != 0) {
						this.addModuleForm.controls['brand_name'].setValue(this.TobeselectedValue);
					}
				}
			},
			error => console.log(error)
		);
	}

	getSizeList(isSelectionRequired: number = 0) {
		this._helper.apiGetLocal('sizedropdown/').subscribe(
			data => {
				if (data["status"] == 1) {
					this.SizeList = data["result"];
					this.SizeBackupList = this.SizeList;
				}
				if (isSelectionRequired != 0) {
					this.addModuleForm.controls['size'].setValue(this.TobeselectedValue);
				}
			},
			error => console.log(error)
		);
	}

	getSubBrandList(brandid: number) {
		this._helper.apiGet('itemapis/brand_lookup/' + brandid).subscribe(
			data => {
				//console.log("data="+data);
				if (data["status"] == 1) {
					this.SubBrandList = data["result"];
					this.SubBrandBackupList = this.SubBrandList;
				}
			},
			error => console.log(error)
		);
	}

	getRetailPackageSize(isSelectionRequired: number = 0) {
		this._helper.apiGetLocal('uomdropdown/').subscribe(
			data => {
				//console.log("data="+data);
				if (data["status"] == 1) {
					this.RetailPackageSizeList = data["result"];
					this.RetailPackageSizeBackupList = this.RetailPackageSizeList;
					if (isSelectionRequired != 0) {
						this.addModuleForm.controls['retail_package_size'].setValue(this.TobeselectedValue);
					}
				}
			},
			error => console.log(error)
		);
	}

	getItemType() {
		this._helper.apiGet('itemapis/item_type_list').subscribe(
			data => {
				if (data["status"] == 1) {
					this.ItemTypeList = data["result"];
				}
			},
			error => console.log(error)
		);
	}

	getPriceLine(isSelectionRequired: number = 0) {
		this._helper.apiGet('itemapis/priceline_list').subscribe(
			data => {
				if (data["status"] == 1) {
					this.PriceLineList = data["result"];
				}
				if (isSelectionRequired != 0) {
					this.AdvanceDetailsForm.controls['PriceLine_id'].setValue(this.TobeselectedValue);
				}
			},
			error => console.log(error)
		);
	}

	onSelectBrandName(event) {
		// console.log("onSelectBrandName", event)
		if (typeof (event) != "undefined") {
			if (typeof (event.id) != "undefined") {
				// this.BrandList=[];
				this.tempObj = {
					id: event.text,
					text: event.text
				};
				this.BrandList.push(this.tempObj);
				this.addModuleForm.controls['brand_name'].setValue(event.text);
				this.getSubBrandList(event.id);
			} else {
				this.addBrand(event.text);
			}
		}
	}

	onSelectSizeName(event) {
		if (typeof (event) != "undefined") {
			if (typeof (event.id) != "undefined") {
				this.tempObj = {
					id: event.text,
					text: event.text
				};
				this.SizeList.push(this.tempObj);
				this.addModuleForm.controls['size'].setValue(event.text);
			} else {
				this.addSize(event.text);
			}
		}
	}

	onSelectSubBrandName(event) {
		if (typeof (event) != "undefined") {
			this.tempObj = {
				id: event.text,
				text: event.text
			};
			this.SubBrandList.push(this.tempObj);
			this.addModuleForm.controls['sub_brand'].setValue(event.text);
		}
	}

	onSelectPriceline(event) {
		if (typeof (event.id) == "undefined") {
			this.addNewPriceline(event.text);
		}
	}
	onSelectRetailsPackageSize(event) {
		if (typeof (event.id) == "undefined") {
			this.addNewRetailPackageSize(event.text);
		}
	}

	onSelectPOSDepartment(event) {
		// console.log("onSelectPOSDepartment", event)
		if (typeof (event.id) == "undefined") {
			this.addNewPOSDepartment(event.text);
		}
	}

	clear(event: any) {
		if (event == 'brand') {
			this.BrandList = this.BrandBackupList;
			this.addModuleForm.controls['brand_name'].setValue(null);
		} else if (event == 'subbrand') {
			this.SubBrandList = this.SubBrandBackupList;
			this.addModuleForm.controls['sub_brand'].setValue(null);
		} else if (event == 'size') {
			this.SizeList = this.SizeBackupList;
			this.addModuleForm.controls['size'].setValue(null);
		} else if (event == 'pos') {
			this.addModuleForm.controls['pos_department_name'].setValue(null);
			this.POSDepartmentList = this.POSDepartmentListBackupList;
		} else if (event == 'RPS') {
			this.addModuleForm.controls['retail_package_size'].setValue(null);
			this.RetailPackageSizeList = this.RetailPackageSizeBackupList;
		}

	}

	addBrand(newbrandName) {
		// 	this._dialogsService.brandAddEditDialog([],newbrandName).subscribe(res => {
		//   if(res){
		//     this.TobeselectedValue = res.BrandName;
		//     this.getBrandList(1);
		//   }
		// 	}
		// 	);
		this.getCommonData.emit({ openSidebar: true, sidebarType: 'Brand', preSetText: newbrandName });
	}

	addSize(newsizeName) {
		// 	this._dialogsService.sizeAddEditDialog([],newsizeName).subscribe(res => {
		//   if(res){
		//     this.TobeselectedValue = res.TableName;
		//     this.getSizeList(1);
		//   }
		// 	}
		// 	);
		this.getCommonData.emit({ openSidebar: true, sidebarType: 'Size', preSetText: newsizeName });
	}

	addNewPriceline(newPriceline) {
		// 	this._dialogsService.PriceLineAddEditDialog([],newPriceline).subscribe(res => {
		//   if(res){
		//     this.TobeselectedValue = res.priceline_id;
		//     this.getPriceLine(1);
		//   }
		// 	}
		// 	);
	}

	addNewRetailPackageSize(RetailPackageSize) {
		// this._dialogsService.addEditunitOfMeasurement([],RetailPackageSize).subscribe( res => {
		// 	if(res){
		// 		this.TobeselectedValue = res.UOMid;
		// this.getRetailPackageSize(1);
		// 	}
		// });
	}

	addNewPOSDepartment(newPOSDepartment) {
		// this._dialogsService.posDepartmentAddEditDialog([],newPOSDepartment).subscribe( res => {
		// 		if(res){
		// 			this.TobeselectedValue = res;
		//     this.getPOSDepartmentList(null,null,1);
		// 		}
		// 	});
		this.getCommonData.emit({ openSidebar: true, sidebarType: 'POSDepartment', preSetText: newPOSDepartment });
	}

	goBack() {
		this._location.back();
	}

	// getSellingRuleList(isSelectionRequired: number = 0) {
	// 	this._helper.apiGet(`itemapis/poslist/?colname=ItemSellingRule&`).subscribe(
	// 		data => {
	// 			if (data["status"] == 1) {
	// 				this.SellingRuleList = data["result"];
	// 			}
	// 			if (isSelectionRequired != 0) {
	// 				this.addModuleForm.controls['selling_rule_id'].setValue(this.TobeselectedValue);
	// 			}
	// 		},
	// 		error => console.log(error)
	// 	);
	// }

	getPOSDepartmentList(caregory: string = null, subcategory: string = null, isSelectionRequired: number = 0) {
		this._helper.apiGetLocal(`posdeptdropdown/`).subscribe(
			data => {
				//console.log("data",data);
				if (data["status"] == 1) {
					this.POSDepartmentList = data["result"];
					this.POSDepartmentListBackupList = this.POSDepartmentList;
					if (isSelectionRequired != 0) {
						this.addModuleForm.controls['pos_department_name'].setValue(this.TobeselectedValue);
					}
				}
			},
			error => console.log(error)
		);
	}

	getItemList() {
		this.isSpinnerLoaderShow = false;
		this._helper.apiGetLocal(`getsingleitem/${this.ItemID}`).subscribe(
			data => {
				//console.log("data",data.result)
				if (data["status"] == 1) {
					this.ProductDropDownList = [];
					this.MainItemTypeCode = data.result.TypeCode;
					this.ItemTypeCode = data.result.stock_item_type;
					var arr = data.result.ItemID;
					let tempData;
					if (this.editIds.length <= 1) {
						if (typeof (data.result.POSDepartment) != 'undefined' && data.result.POSDepartment != null) {
							this.getPOSDepartmentList(data.result.POSDepartment.nacs_category, data.result.POSDepartment.nacs_sub_category);
						} else {
							this.getPOSDepartmentList('', '');
						}
					}
					arr.forEach((value, key) => {
						if (key == 0) {
							tempData = {
								_source: {
									UPC_A: value,
									POS_Name: (typeof (data.result.POSDepartment) != 'undefined' && data.result.POSDepartment != null) ? data.result.POSDepartment.Name : null,

									Brand_Line: (typeof (data.result.BrandName) != 'undefined' && data.result.BrandName != null) ? data.result.Description : null,

									Container: (typeof (data.result.size) != 'undefined' && data.result.size != null) ? data.result.size : null
								}
							};
						} else {
							tempData = {
								_source: {
									UPC_A: value
								}
							};
						}

						this.tempObj = {
							_source: tempData
						};
						this.ProductDropDownList = [...this.ProductDropDownList, tempData];
					});
					this.ProductDropDownDescription = [];
					tempData = {
						_source: {
							POS_Name: data.result.Description
						}
					};
					this.tempObj = {
						_source: tempData
					};
					this.ProductDropDownDescription = [...this.ProductDropDownDescription, tempData];
					this.selectedProductDescription = data.result.Description;
					this.addModuleForm.controls['description'].setValue(data.result.Description);
					this.seletedproductList = data.result.ItemID;
					this.ProductDropDownDescription = [...this.ProductDropDownDescription, tempData];

					if (typeof (data.result.size) != 'undefined' && data.result.size != null)
						this.addModuleForm.controls['size'].setValue(data.result.size);

					if (typeof (data.result.POSDepartment) != 'undefined' && data.result.POSDepartment != null)
						this.addModuleForm.controls['pos_department_name'].setValue(data.result.POSDepartment.POSDepartmentName);

					if (typeof (data.result.SubBrand) != 'undefined' && data.result.SubBrand != null)
						this.addModuleForm.controls['sub_brand'].setValue(data.result.SubBrand.BrandName);

					if (typeof (data.result.BrandName) != 'undefined' && data.result.BrandName != null)
						this.addModuleForm.controls['brand_name'].setValue(data.result.BrandName.BrandName);

					if (typeof (data.result.retail_package_size) != 'undefined' && data.result.retail_package_size != null)
						this.addModuleForm.controls['retail_package_size'].setValue(data.result.retail_package_size);

					if (typeof (data.result.min_inventory_level) != 'undefined' && data.result.min_inventory_level != null) {
						this.inventoryData.min_inventory_level = data.result.min_inventory_level;
					}
					if (typeof (data.result.max_inventory_level) != 'undefined' && data.result.max_inventory_level != null) {
						this.inventoryData.max_inventory_level = data.result.max_inventory_level;
					}
					if (typeof (data.result.desired_inventory_level) != 'undefined' && data.result.desired_inventory_level != null) {
						this.inventoryData.desired_inventory_level = data.result.desired_inventory_level;
					}
					if (typeof (data.result.ItemSellingRule) != 'undefined' && data.result.ItemSellingRule != null) {
						if (data.result.ItemSellingRule.id != 'undefined' && data.result.ItemSellingRule.id != null) {
							this.inventoryData.selling_rule_id = data.result.ItemSellingRule.id;
						}
					}
					if (typeof (data.result.ItemSellingPrices) != 'undefined' && data.result.ItemSellingPrices != null) {
						this.pricingData.selling_price_type = data.result.ItemSellingPrices.selling_price_type;
						this.pricingData.price = data.result.ItemSellingPrices.CurrentPackagePrice;
						this.pricingData.cost = data.result.ItemSellingPrices.cost;
						this.pricingData.margin = data.result.ItemSellingPrices.margin;
						this.pricingData.markup = data.result.ItemSellingPrices.markup;
						this.pricingData.profit = data.result.ItemSellingPrices.profit;
						this.pricingData.begin_date = data.result.ItemSellingPrices.CurrentSaleUnitRetailPriceEffectiveDate;
						this.pricingData.end_date = data.result.ItemSellingPrices.CurrentSaleUnitRetailPriceExpirationDate;
						this.pricingData.msrp = data.result.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount;
						this.pricingData.msrp_date = data.result.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate;
						this.pricingData.compare_at_sale_unit_price = data.result.ItemSellingPrices.CompareAtSaleUnitRetailPriceAmount;
						this.pricingData.ItemSellingPrices = data.result.ItemSellingPrices.id;
						this.pricingData.CurrentSaleUnitReturnPrice = data.result.ItemSellingPrices.CurrentSaleUnitReturnPrice;
						this.pricingData.MinimumAdvertisedRetailUnitPrice = data.result.ItemSellingPrices.MinimumAdvertisedRetailUnitPrice;
						this.pricingData.MinimumAdvertisedRetailUnitPriceEffectiveDate = data.result.ItemSellingPrices.MinimumAdvertisedRetailUnitPriceEffectiveDate;
					}
					if (typeof (data.result.images) != 'undefined' && data.result.images != null && data.result.images != '') {
						// this.ImageNameFromServer = data.result.item_image.split(",");
						this.ImageNameFromServer = data.result.images;
					}
				}
			},
			error => console.log(error)
		);
		this.isSpinnerLoaderShow = true;
	}

	isDecimalNumbar(cost: string) {
		var reg = /^(\d+)?([.]\d{0,9})?$/;
		return reg.test(cost);
	}

	validateTextBox(event: any, element: any) {
		let textBoxValue = event.target.value;
		var reg = /^(\d+)?([.]\d{0,9})?$/;
		if (!reg.test(textBoxValue)) {
			this._helper.notify({ message: "Please enter decimal value", messageType: 0 });
		}
		var hasMatch = this.selectedListData.find(function (value) {
			return value["PartyData"]["SupplierID"] == element["PartyData"]["SupplierID"];
		}
		);
		if (typeof (hasMatch) == "undefined")
			this.SetSupplierSelection(element);
	};

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

	addNewSellingRule() {
		// this._dialogsService.sellingRuleAddEditDialog().subscribe(res => {
		//   if(res){
		//     // console.log("res",res);
		//     this.TobeselectedValue = res.SellingRuleId;
		//     this.getSellingRuleList(1);
		//   }
		// });
	}

	addRefererSupplier(supplierid: number, selectedsuplierid: any) {
		// console.log("this.editIds",this.editIds) 
		this.arrSupplierID = selectedsuplierid;
		this.arrSupplierID.push(supplierid);
		var savedObject = { "supplier_ids": this.arrSupplierID };
		this._helper.apiPutLocal(savedObject, `supplier_update/${this.ItemID}`).subscribe(
			res => {
				if (res["message"]) {
					this._helper.notify({ message: res["message"], messageType: res["status"] });
				}
				if (res["status"] == 1) {
					this.getSupplierList();
				}
			},
			error => {
				console.log('error', error);
			}
		);
	}

	/* custom Advance Details*/

	addEditCustomFieldPopup() {
		//   this._dialogsService.addEditCustomFieldPopup([],this.ItemID,this.moduleName,this.stepperConfig.tab_name).subscribe(res => {
		//     this.apiGetFeild();
		//     });
	}
	apiGetFeild() {
		this.SavedCustomFeildTypeList = [];
		this.settings = [];
		this._helper.apiGet(`itemapis/custom_field_viewset/?module_name=${this.moduleName}&tab_name=${this.stepperConfig.tab_name}&module_record_id=${this.ItemID}&isblocked=n&`).subscribe(
			data => {
				if (data["status"] == 1) {
					this.customFormValidation();
					this.SavedCustomFeildTypeList = data["result"];
					this.patchForm();
				}
			},
			error => console.log(error)
		);
	}

	get setting(): FormArray {
		return this.addCustomFeildForm.get('setting') as FormArray;
	}

	customFormValidation() {
		this.addCustomFeildForm = this._formBuilder.group({
			setting: this._formBuilder.array([])
		});

	}

	patchForm() {
		this.settings = this.addCustomFeildForm.get('setting') as FormArray;
		const arr_setting = this.SavedCustomFeildTypeList.map(s => {
			if (s.isrequired == true) {
				this.settings.push(this._formBuilder.group({
					value: [s.values.value, Validators.required],
					id: s.id
				}));
			} else {
				this.settings.push(this._formBuilder.group({
					value: [s.values.value],
					id: s.id
				}));
			}
		});
	}
	/* custom Advance Details*/

	/* static Advance Details*/
	getAdvanceDetails() {
		this._helper.apiGetLocal(`advanced_field_save/${this.ItemID}`).subscribe(
			data => {
				if (data["status"] == 1) {
					// console.log("result",data.result);
					if (data.result.TypeCode != "undefined" && data.result.TypeCode != null) {
						this.ItemTypeCode = data.result.TypeCode;
						this.AdvanceDetailsForm.controls['TypeCode'].setValue(data.result.TypeCode);
					}
					if (data.result.LongDescription != "undefined" && data.result.LongDescription != null) {
						this.AdvanceDetailsForm.controls['LongDescription'].setValue(data.result.LongDescription);
					}
					if (data.result.PriceLine_id != "undefined" && data.result.PriceLine_id != null) {
						this.AdvanceDetailsForm.controls['PriceLine_id'].setValue(data.result.PriceLine_id);
					}
					if (data.result.TaxExemptCode != "undefined" && data.result.TaxExemptCode != null) {
						this.AdvanceDetailsForm.controls['TaxExemptCode'].setValue(data.result.TaxExemptCode);
					}
					if (data.result.UsageCode != "undefined" && data.result.UsageCode != null) {
						this.AdvanceDetailsForm.controls['UsageCode'].setValue(data.result.UsageCode);
					}
					if (data.result.KitSetCode != "undefined" && data.result.KitSetCode != null) {
						this.AdvanceDetailsForm.controls['KitSetCode'].setValue(data.result.KitSetCode);
					}

					if (data.result.OrderCollectionCode != "undefined" && data.result.OrderCollectionCode != null) {
						this.AdvanceDetailsForm.controls['OrderCollectionCode'].setValue(data.result.OrderCollectionCode);
					}
					if (data.result.counting != "undefined" && data.result.counting != null) {
						this.AdvanceDetailsForm.controls['counting'].setValue(data.result.counting);
					}
					if (data.result.sale_weight_or_unit_count_code != "undefined" && data.result.sale_weight_or_unit_count_code != null) {
						this.AdvanceDetailsForm.controls['sale_weight_or_unit_count_code'].setValue(data.result.sale_weight_or_unit_count_code);
					}
					if (data.result.unit_price_factor != "undefined" && data.result.unit_price_factor != null) {
						this.AdvanceDetailsForm.controls['unit_price_factor'].setValue(data.result.unit_price_factor);
					}
					if (data.result.available_for_sale_date != "undefined" && data.result.available_for_sale_date != null) {
						this.AdvanceDetailsForm.controls['available_for_sale_date'].setValue(data.result.available_for_sale_date);
					}
					if (data.result.bulk_to_selling_unit_waste_factor_percent != "undefined" && data.result.bulk_to_selling_unit_waste_factor_percent != null) {
						this.AdvanceDetailsForm.controls['bulk_to_selling_unit_waste_factor_percent'].setValue(data.result.bulk_to_selling_unit_waste_factor_percent);
					}
					if (data.result.bulk_to_selling_unit_waste_type_code != "undefined" && data.result.bulk_to_selling_unit_waste_type_code != null) {
						this.AdvanceDetailsForm.controls['bulk_to_selling_unit_waste_type_code'].setValue(data.result.bulk_to_selling_unit_waste_type_code);
					}
					if (data.result.flag != "undefined" && data.result.flag != null) {
						this.AdvanceDetailsForm.controls['flag'].setValue(data.result.flag);
					}
					if (data.result.abv != "undefined" && data.result.abv != null) {
						this.AdvanceDetailsForm.controls['abv'].setValue(data.result.abv);
					}
				}
			},
			error => console.log(error)
		);
	}

	getShelfDetails() {
		this._helper.apiGetLocal(`shelf_field_save/${this.ItemID}`).subscribe(
			data => {
				if (data["status"] == 1) {
					if (data.result.facings_count != "undefined" && data.result.facings_count != null) {
						this.ShelfDetailsForm.controls['facings_count'].setValue(data.result.facings_count);
					}
					if (data.result.staple_perishable_type_code != "undefined" && data.result.staple_perishable_type_code != null) {
						this.ShelfDetailsForm.controls['staple_perishable_type_code'].setValue(data.result.staple_perishable_type_code);
					}
					if (data.result.shelf_life_day_count != "undefined" && data.result.shelf_life_day_count != null) {
						this.ShelfDetailsForm.controls['shelf_life_day_count'].setValue(data.result.shelf_life_day_count);
					}
					if (data.result.consumer_package_depth != "undefined" && data.result.consumer_package_depth != null) {
						this.ShelfDetailsForm.controls['consumer_package_depth'].setValue(data.result.consumer_package_depth);
					}
					if (data.result.consumer_package_height != "undefined" && data.result.consumer_package_height != null) {
						this.ShelfDetailsForm.controls['consumer_package_height'].setValue(data.result.consumer_package_height);
					}
					if (data.result.consumer_package_width != "undefined" && data.result.consumer_package_width != null) {
						this.ShelfDetailsForm.controls['consumer_package_width'].setValue(data.result.consumer_package_width);
					}

					if (data.result.consumer_package_diameter != "undefined" && data.result.consumer_package_diameter != null) {
						this.ShelfDetailsForm.controls['consumer_package_diameter'].setValue(data.result.consumer_package_diameter);
					}
					if (data.result.consumer_package_size_uomcode != "undefined" && data.result.consumer_package_size_uomcode != null) {
						this.ShelfDetailsForm.controls['consumer_package_size_uomcode'].setValue(data.result.consumer_package_size_uomcode.id);
					}

					if (data.result.consumer_package_gross_weight != "undefined" && data.result.consumer_package_gross_weight != null) {
						this.ShelfDetailsForm.controls['consumer_package_gross_weight'].setValue(data.result.consumer_package_gross_weight);
					}
					if (data.result.consumer_package_net_weight != "undefined" && data.result.consumer_package_net_weight != null) {
						this.ShelfDetailsForm.controls['consumer_package_net_weight'].setValue(data.result.consumer_package_net_weight);
					}
					if (data.result.consumer_package_drained_weight != "undefined" && data.result.consumer_package_drained_weight != null) {
						this.ShelfDetailsForm.controls['consumer_package_drained_weight'].setValue(data.result.consumer_package_drained_weight);
					}
					if (data.result.consumer_package_tare_weight != "undefined" && data.result.consumer_package_tare_weight != null) {
						this.ShelfDetailsForm.controls['consumer_package_tare_weight'].setValue(data.result.consumer_package_tare_weight);
					}
					if (data.result.consumer_package_weight_uomcode != "undefined" && data.result.consumer_package_weight_uomcode != null) {
						this.ShelfDetailsForm.controls['consumer_package_weight_uomcode'].setValue(data.result.consumer_package_weight_uomcode.id);
					}
					if (data.result.consumer_package_net_content != "undefined" && data.result.consumer_package_net_content != null) {
						this.ShelfDetailsForm.controls['consumer_package_net_content'].setValue(data.result.consumer_package_net_content);
					}

					if (data.result.consumer_package_contents_uomcode != "undefined" && data.result.consumer_package_contents_uomcode != null) {
						this.ShelfDetailsForm.controls['consumer_package_contents_uomcode'].setValue(data.result.consumer_package_contents_uomcode.id);
					}
					if (data.result.peg_horizontal_distance != "undefined" && data.result.peg_horizontal_distance != null) {
						this.ShelfDetailsForm.controls['peg_horizontal_distance'].setValue(data.result.peg_horizontal_distance);
					}
					if (data.result.peg_vertical_distance != "undefined" && data.result.peg_vertical_distance != null) {
						this.ShelfDetailsForm.controls['peg_vertical_distance'].setValue(data.result.peg_vertical_distance);
					}
					if (data.result.peg_distance_uomcode != "undefined" && data.result.peg_distance_uomcode != null) {
						this.ShelfDetailsForm.controls['peg_distance_uomcode'].setValue(data.result.peg_distance_uomcode.id);
					}
				}
			},
			error => console.log(error)
		);
	}

	onSelectFile(event) {
		if (event.target.files && event.target.files[0]) {
			var filesAmount = event.target.files.length;
			for (let i = 0; i < filesAmount; i++) {
				var reader = new FileReader();
				reader.onload = (event: any) => {
					this.ImageBase64urls.push(event.target.result);
				}
				reader.readAsDataURL(event.target.files[i]);
			}
		}
	}

	removeImage(index: number, ImageName: string = null) {
		if (this.ItemID == '') {
			this.ImageBase64urls.splice(index, 1);
		}
		else {
			var deleteobject = {
				ids: [this.ItemID],
				type: 'delete',
				value: 'y',
				img: ImageName
			};
			this._helper.confirmDialog({ message: 'Do you want to delete this image?' }).subscribe(res => {
				if (res) {
					var deleteData = JSON.stringify(deleteobject);
					this._helper.apiRequest('delete', '/itemapis/items/', { body: deleteData }).subscribe(res => {
						if (res["status"] == 1) {
							if (res["result"] == "") {
								this.ImageNameFromServer = [];
							} else {
								this.ImageNameFromServer = res["result"].split(",");
							}
						}
						if (res["message"]) {
							this._helper.notify({ message: res["message"], messageType: res["status"] });
						}
					});
				}
			});
		}
	}

	getItemTypeOnchange(event: any) {
		this.ItemTypeCode = event.value;
		if (this.ItemTypeCode != "BI") {
			this.AdvanceDetailsForm.controls['bulk_to_selling_unit_waste_type_code'].setValue(null);
			this.AdvanceDetailsForm.controls['bulk_to_selling_unit_waste_factor_percent'].setValue(null);
		}
		this.btnTxtChange();
	}

	onNoClick() {
		this.getCommonData.emit({ openSidebar: false });
	}

}
