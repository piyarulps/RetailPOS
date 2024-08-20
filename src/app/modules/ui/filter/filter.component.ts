import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { FormGroupDirective, Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
import { Globals } from 'src/app/globals';

export interface PageData {
	moduleName: string,
	displayModuleName: string,
	moduleAPI: string,
	moduleLink: string,
	paginationSetup: {
		pageLimitOptions: [25, 50, 100],
		pageLimit: number,
		pageOffset: number,
		totalRecord: number
	},
	openFilter: boolean
}

@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {

	receivedData: any = {};
	apiLink: string = '';
	apiFilterLink: string = '';
	@ViewChild('columnlistform') columnlistformdirective: FormGroupDirective;
	@ViewChild('filterform') filterformdirective: FormGroupDirective;
	ListingData: any[];
	isShowFilterDropDown: boolean = false;
	moduleName: string;
	isDropDown: boolean = false;
	singlecolInfo: any = [];
	addModuleForm: FormGroup;
	filterDropDownList: any = [];
	defaulticon: string = "icon-equals";
	defaultcondition: string = "equals";
	searchList: any = [];
	arrObj: any = {};
	dumyText: string;
	strMsg: boolean = true;
	allColumns: any = [];
	submitted: boolean = false;
	RecordsCount: any;
	charecterColumnConditions: any = [{ name: 'equals', class: 'icon-equals', displayname: 'Equlals' },
	{ name: 'doesnotequals', class: 'icon-not-equals', displayname: 'Does Not Equals' },
	{ name: 'startswith', class: 'icon-start-contains', displayname: 'Starts with' },
	{ name: 'endswith', class: 'icon-end-contains', displayname: 'Ends with' },
	{ name: 'contains', class: 'icon-contains', displayname: 'Contains' },
	{ name: 'doesnotcontains', class: 'icon-not-contains', displayname: 'Does not contain' }
	];
	numberColumnConditions: any = [{ name: 'equals', class: 'icon-equals', displayname: 'Equlals' },
	{ name: 'greaterequals', class: 'icon-greater-equal', displayname: 'Greater Equals' },
	{ name: 'lessequals', class: 'icon-less-equal', displayname: 'Less Equals' }];
	smallintColumnConditions: any = [{ name: 'equals', class: 'icon-equals', displayname: 'Equlals' },
	{ name: 'doesnotequals', class: 'icon-not-equals', displayname: 'Does Not Equals' }];
	searchColumnName: string = '';
	isFilterbarShow: boolean = false;
	addFilterTxt: string = 'Add Filter';

	@Input() pageData: PageData;
	@Output() getCommonData = new EventEmitter<{}>();

	constructor(
		private _helper: HelperService,
		private _formBuilder: FormBuilder,
		private _globals: Globals
	) {
		this.addModuleFormValidation();
	}

	getLink() {
		let apiLink: string = this.receivedData.moduleAPI;
		let length: number = apiLink.length;
		let lastChar: string = apiLink.charAt(length - 1);
		if (lastChar == '&') {
			this.apiLink = apiLink;
		}
		else {
			this.apiLink = `${apiLink}?`;
		}
		return this.apiLink;
	}

	getFilterLink() {
		let apiLink: string = this.receivedData.moduleFilterAPI;
		let length: number = apiLink.length;
		let lastChar: string = apiLink.charAt(length - 1);
		if (lastChar == '&') {
			this.apiFilterLink = apiLink;
		}
		else {
			this.apiFilterLink = `${apiLink}?`;
		}
		return this.apiFilterLink;
	}

	/*-------FILTER START-------*/
	addModuleFormValidation() {
		this.addModuleForm = this._formBuilder.group({
			value: [null, Validators.required]
		});
	}
	get f() {
		return this.addModuleForm.controls;
	}

	funOpenDialog(dbName: string, modelname: string) {
		this.defaulticon = "icon-equals";
		this.defaultcondition = "equals";
		this.filterDropDownList = [];
		this.isDropDown = true;
		this.singlecolInfo = this.allColumns.filter((list) => list.dbName == dbName && list.model == modelname)[0];
		// console.log('this.singlecolInfo', this.singlecolInfo);
		let lookUpUrls = this.singlecolInfo.urlslookup;
		let Lookuplength: number = lookUpUrls.length;
		let lastCharUrls: string = lookUpUrls.charAt(Lookuplength - 1);
		if (lastCharUrls == '&') {
			lookUpUrls = `${this.singlecolInfo.urlslookup}` + `colname=${this.singlecolInfo.fieldname}&modulename=${this.moduleName}&`;
		} else {
			lookUpUrls = `${this.singlecolInfo.urlslookup}` + `?colname=${this.singlecolInfo.fieldname}&modulename=${this.moduleName}&`;
		}
		if (this.singlecolInfo.urlslookup != null) {
			this._helper.apiGet(`${lookUpUrls}`).subscribe(
				data => {
					if (data["status"] == 1) {
						this.filterDropDownList = data["data"];
					} else {
						this._helper.notify({ message: data["message"], messageType: data["status"] });
					}
				},
				error => console.log(error)
			);
		}
	}

	funReOpenDialog(index: number) {
		this.defaulticon = this.searchList[index].operator;
		this.defaultcondition = this.searchList[index].condition;
		this.filterDropDownList = [];
		this.isDropDown = true;
		this.allColumns.forEach((value, key) => {
			if (value.fieldname == this.searchList[index].fieldname) {
				this.singlecolInfo = this.allColumns[key];
				this.allColumns[key].filterDisplay = true;
			}
		});
		let lookUpUrls = this.singlecolInfo.urlslookup;
		let Lookuplength: number = lookUpUrls.length;
		let lastCharUrls: string = lookUpUrls.charAt(Lookuplength - 1);
		if (lastCharUrls == '&') {
			lookUpUrls = `${this.singlecolInfo.urlslookup}` + `colname=${this.singlecolInfo.fieldname}&modulename=${this.moduleName}&`;
		} else {
			lookUpUrls = `${this.singlecolInfo.urlslookup}` + `?colname=${this.singlecolInfo.fieldname}&modulename=${this.moduleName}&`;
		}
		if (this.singlecolInfo.urlslookup != null) {
			this._helper.apiGet(`${lookUpUrls}`).subscribe(
				data => {
					if (data["status"] == 1) {
						this.filterDropDownList = data["data"];
					} else {
						this._helper.notify({ message: data["message"], messageType: data["status"] });
					}
				},
				error => console.log(error)
			);
		}
		this.addModuleForm.setValue({
			value: this.searchList[index].value
		});
		this.searchList = this.searchList.filter((list) => list.fieldname != this.singlecolInfo.fieldname);
		// if (this.searchList.length == 0) {
		// 	this.isShowSaveFilterBtn = false;
		// }
	}

	funNewFilter(isFilterDisplayResetable: number) {
		this.searchList = [];
		// this.isShowSaveFilterBtn = false;
		this.isShowFilterDropDown = false
		if (isFilterDisplayResetable == 2) {
			this.allColumns.forEach((value, key) => {
				this.allColumns[key].filterDisplay = true;
			});
		}
		// this.funResetForm(this.filterformdirective, this.saveFilterForm, "saveFilterFormValidation");
		this.funResetForm(this.filterformdirective);
	}

	getText(event) {
		this.dumyText = event.target.value;
	}

	getValue(event) {
		let target = event.source.selected._element.nativeElement;
		let selectedData = {
			value: event.value,
			text: target.innerText.trim()
		};
		this.dumyText = selectedData.text;

	}

	ngSelectedele(event) {
		this.dumyText = "";
		event.forEach((value, key) => {
			if (this.dumyText == null || this.dumyText == "") {
				this.dumyText = event[key].text;
			} else {
				this.dumyText += "," + event[key].text;
			}
		});
	}

	funRemoveEle(colname: string) {
		//console.log("colname",colname,"serch",this.searchList);
		this.searchList = this.searchList.filter((list) => list.field != colname);
		//console.log("feild",this.allColumns);
		this.allColumns.forEach((value, key) => {
			if (value.searchfield == colname) {
				this.allColumns[key].filterDisplay = true;
			}
		});
		this.onfilter(2);
	}

	funChangeIcon(changeicon, condition) {
		this.defaulticon = changeicon;
		this.defaultcondition = condition;
	}

	funResetForm(_formGroupDirective: FormGroupDirective, _formGroup?: FormGroup, _functionName?: string): void {
		_formGroupDirective.resetForm();
		if (_formGroup) {
			_formGroup.reset();
		}
		if (_functionName) {
			this[_functionName]();
		}
	}

	onfilter(filteroption: number) {
		this.apiFilterLink = this.getFilterLink();
		this.searchColumnName = '';
		this.isFilterbarShow = false;
		if (filteroption == 1) {
			if (this.addModuleForm.invalid) {
				this.submitted = true;
				return;
			}
			this.isDropDown = false;
			this.allColumns.forEach((value, key) => {
				if (value.fieldname == this.singlecolInfo.fieldname) {
					this.allColumns[key].filterDisplay = false;
				}
			});
			this.addModuleForm = this._formBuilder.group({
				...this.addModuleForm.controls,
				'field': new FormControl(this.singlecolInfo.searchfield),
				'operator': new FormControl(this.defaulticon),
				'dumytext': new FormControl(this.dumyText),
				'originalcolumnname': new FormControl(this.singlecolInfo.name),
				'condition': new FormControl(this.defaultcondition),
				'moduleName': new FormControl(this.receivedData.moduleName),
				'model': new FormControl(this.singlecolInfo.model),
				'urlslookup': new FormControl(this.singlecolInfo.urlslookup),
				'fieldname': new FormControl(this.singlecolInfo.fieldname)
			});
			this.searchList.push(this.addModuleForm.value);
			this.funResetForm(this.columnlistformdirective, this.addModuleForm, "addModuleFormValidation");
		} else {
			this.isDropDown = false;
			this.searchList.forEach((searchvalue, key) => {
				this.allColumns.forEach((value, key) => {
					if (value.fieldname == searchvalue.fieldname) {
						this.allColumns[key].filterDisplay = false;
					}
				});
			});

		}
		if (this.searchList.length > 0) {
			this.addFilterTxt = 'Add More Filter';
			// this.isShowSaveFilterBtn = true;
			var filterParams = encodeURIComponent(JSON.stringify(this.searchList));
			// console.log('filterParams', filterParams);
			this._helper.apiRequest('get', `${this.apiFilterLink}offset=1&limit=${this.receivedData.paginationSetup.pageLimit}&filterParams=${filterParams}&`, {}).subscribe(res => {
				this.ListingData = res["result"];
				this.RecordsCount = res["RecordsCount"];
				this.getCommonData.emit({ displayedColumns: null, ListingData: this.ListingData, RecordsCount: this.RecordsCount, FilterParams: filterParams });
				this.strMsg = false;
			});
		} else {
			this.addFilterTxt = 'Add Filter';
			this.getCommonData.emit({ FilterParams: "" });
			// this.isShowSaveFilterBtn = false;
			this.getListingData();
		}
	}

	funClosePopup() {
		this.isDropDown = false;
		// this.IsShowSaveFiterPopup = false;
		this.submitted = false;
		this.dumyText = "";
		this.funResetForm(this.columnlistformdirective, this.addModuleForm, "addModuleFormValidation");
	}

	getListingData() {
		this.apiLink = this.getLink();
		this._helper.apiGet(`${this.apiLink}offset=${this.receivedData.paginationSetup.pageOffset + 1}&limit=${this.receivedData.paginationSetup.pageLimit}&`).subscribe(
			data => {
				if (data["status"] == 1) {
					this.ListingData = data["result"];
					this.RecordsCount = data["RecordsCount"];
					this.getCommonData.emit({ displayedColumns: null, ListingData: this.ListingData, RecordsCount: this.RecordsCount });
				} else {
					this._helper.notify({ message: data["message"], messageType: data["status"] });
				}

			},
			error => console.log(error)
		);
	}

	getColoumnList() {
		this._helper.apiGet(`itemapis/column-details/?ModuleName=${this.receivedData.moduleName}&`).subscribe(
			data => {
				// console.log(data);
				this.allColumns = data.data_type;
				if (this.allColumns) {
					this.allColumns.forEach((value, key) => {
						if (value.urlslookup != null) {
							this.allColumns[key].condition = this.smallintColumnConditions;
						}
						else if (value.coltype == "Integer" || value.coltype == "Decimal") {
							this.allColumns[key].condition = this.numberColumnConditions;
						} else if (value.coltype == "Character" || value.coltype == "Text") {
							this.allColumns[key].condition = this.charecterColumnConditions;
						} else if (value.coltype == "SmallInteger") {
							this.allColumns[key].condition = this.smallintColumnConditions;
						}
					});
				}
			},
			error => console.log(error)
		);
	}

	toggleFilter() {
		this.receivedData.openFilter = false;
		this.getCommonData.emit({ openFilter: this.receivedData.openFilter });
	}

	/*-------FILTER END-------*/

	ngOnChanges(changes: SimpleChanges) {
		const change: SimpleChange = changes.pageData;
		this.receivedData = change.currentValue;
		// console.log('this.receivedData', this.receivedData);
	}

	ngOnInit() {
		this.receivedData = this.pageData;
		// console.log(this.receivedData);
		this.getColoumnList();
	}

}
