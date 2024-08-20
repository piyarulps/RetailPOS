import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
// import { MatSnackBar } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DatePipe, DecimalPipe } from '@angular/common';

import { HelperService } from '../../../../services/helper.service';
import { ValidationService } from '../../../../services/validation/validation.service';
// import { ConnectionService } from 'ng-connection-service';
// import { MatInput } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';

export interface PageData {
	_editData: {
		data: []
	}
}

@Component({
	selector: 'app-item-pricing-manage',
	templateUrl: './item-pricing-manage.component.html',
	styleUrls: ['./item-pricing-manage.component.scss']
})
export class ItemPricingManageComponent implements OnInit {

	moduleName: string = '';
	displayModuleName: string = 'Pricing';
	moduleAPI: string = '';
	moduleLink: string = '';
	myForm: FormGroup;
	submitted: boolean = false;
	message: string;
	editData: any = [];
	backupEditData: any = [];
	dialogTitle: string = "Pricing";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Save";
	btnUpdateTxt: string = "Update";
	isSelectBox: boolean = false;
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;
	item_price: any = "0.00";
	item_cost: any = "0.00";
	item_margin: any = "0.00";
	item_Profit: any = "0.00";
	item_markup: any = "0.00";

	constructor(
		private _formBuilder: FormBuilder,
		public _formDirective: FormGroupDirective,
		public _validation: ValidationService,
		public _helper: HelperService,
		public _hotkeysService: HotkeysService,
		public _dialogRef: MatDialogRef<ItemPricingManageComponent>,
		@Inject(MAT_DIALOG_DATA) public _editData: any,
		public _datePipe: DatePipe,
		public _decimalPipe: DecimalPipe
	) {
		this.validateForm();
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
	}

	_openCalendar(picker: MatDatepicker<Date>) {
		picker.open();
	}

	calculateprofitmargin(event) {
		if (!parseInt(event.key) && event.keyCode != 8 && event.keyCode != 46) return false;
		let margin: number;
		let priceorcostOrProfitOrMargin = this.item_price;
		let price = parseFloat(this.item_price);
		let cost = parseFloat(this.item_cost);
		margin = this.Margin(price, cost);
		let profit = price - cost;
		this.item_margin = margin;
		this.item_Profit = profit;
		this.item_markup = this.MarkUp(price, cost);
	}

	calculateAspermargin(event) {
		if (!parseInt(event.key) && event.keyCode != 8 && event.keyCode != 46) return false;
		let Margin = this.item_margin;
		Margin = parseFloat(Margin);
		let cost = parseFloat(this.item_cost);
		let price = this.PriceFromMargin(Margin, cost);
		this.item_price = price;
		let priceInput = parseFloat(this.item_price);
		let costInput = parseFloat(this.item_cost);
		let profit = parseFloat((priceInput - costInput).toString()).toFixed(2);
		this.item_Profit = profit;
	}

	calculateAsperProfit(event) {
		if (!parseInt(event.key) && event.keyCode != 8 && event.keyCode != 46) return false;
		let margin: number;
		let profit = this.item_Profit;
		profit = parseFloat(profit);
		let cost = parseFloat(this.item_cost);
		let price = parseFloat(cost + profit);
		margin = this.Margin(price, cost);
		let priceInput = this.PriceFromMargin(margin, cost);
		this.item_price = priceInput;
		this.item_margin = margin;
	}

	calculateAsperMarkup(event) {
		if (!parseInt(event.key) && event.keyCode != 8 && event.keyCode != 46) return false;
		this.item_price = this.PriceFromMarkup(this.item_markup, this.item_cost);
	}

	MarkUp(aPrice: number, aCost: number) {
		let result: any;
		if (aCost == 0) {
			result = 0
		}
		else {
			result = (aPrice / aCost) - 1;
		}
		return result;
	}

	Margin(aPrice: number, aCost: number) {
		let result: any;
		if (aPrice == 0 || aCost == 0) {
			result = 0;
		} else {
			result = 1 - (aCost / aPrice);
		}
		return result;
	}

	PriceFromMarkup(aMarkup: number, aCost: number) {
		let result: any;
		if (aCost == 0 || aMarkup == 0) {
			result = 0;
		} else {
			result = aCost * (1 + aMarkup / 100);
		}
		return result;
	}

	PriceFromMargin(aMargin: number, aCost: number) {
		let result: any;
		if (aCost == 0 || aMargin == 0) {
			result = 0;
		} else {
			result = aCost / (1 - (aMargin * 0.99999999999) / 100);
		}
		return result;
	}

	validateForm() {
		this.myForm = this._formBuilder.group({
			price: [0],
			cost: [0],
			margin: [0],
			markup: [0],
			profit: [0],
			begin_date: [null],
			end_date: [null],
			msrp: [0, [Validators.pattern(this._validation.pattern_isDecimal)]],
			msrp_date: [null],
			compare_at_sale_unit_price: [0],
			ItemSellingPrices: [null],
			// selling_price_type: [null],
			selling_price_type: [null, [Validators.required]],
			CurrentSaleUnitReturnPrice: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			MinimumAdvertisedRetailUnitPrice: [null, [Validators.pattern(this._validation.pattern_isDecimal)]],
			MinimumAdvertisedRetailUnitPriceEffectiveDate: [null]
		}, {
			validator: [
				this._validation.DateValidation('begin_date', 'end_date')
			]
		});
	}

	get f() {
		return this.myForm.controls;
	}

	doManage() {
		this.btnCreateTxt = "Please Wait..";
		this.submitted = true;
		if (this.myForm.invalid) {
			this.btnCreateTxt = "Save";
			this.isDisabled = false;
			return;
		}
		else {
			if (this.f.begin_date.errors != null) {
				if (this.f.begin_date.errors.isInvalid) {
					this._helper.notify({ message: "Begin date should be less than end date", messageType: 0 });
					this.btnCreateTxt = "Save";
					this.isDisabled = false;
					return;
				}
			}
			if (this.f.price.errors != null) {
				if (this.f.price.errors.isInvalid) {
					this._helper.notify({ message: "Price should be greater than cost", messageType: 0 });
					this.btnCreateTxt = "Save";
					this.isDisabled = false;
					return;
				}
			}
			this.isbtnLoaderShow = true;
			let showPricingData = "Type, Price, Cost, Margin(%), Profit, Begin date, End Date, MSRP, MSRP Date, Compare At Sale Unitprice, Current Sale UnitReturnPrice, Minimum Retail UnitPrice, Minimum Retail UnitPrice EffectiveDate";

			let type = '';
			if (this.myForm.value['selling_price_type'] != '' && this.myForm.value['selling_price_type'] != null) {
				type = 'Type';
				// type += ': ' + this.myForm.value['selling_price_type'];
				type += ': Regular Price';
			}

			let price: string = '';
			if (this.myForm.value['price'] != '' && this.myForm.value['price'] != null) {
				price = ', Price';
				price += ': $' + this._decimalPipe.transform(this.myForm.value['price'], '1.2-2');
			}

			let cost: string = '';
			if (this.myForm.value['cost'] != '' && this.myForm.value['cost'] != null) {
				cost = ', Cost';
				cost += ': $' + this._decimalPipe.transform(this.myForm.value['cost'], '1.2-2');
			}

			let margin: string = '';
			if (this.myForm.value['margin'] != '' && this.myForm.value['margin'] != null) {
				margin = ', Margin';
				margin += ': ' + this._decimalPipe.transform(this.myForm.value['margin'], '1.2-2') + '%';
			}

			let markup: string = '';
			if (this.myForm.value['markup'] != '' && this.myForm.value['markup'] != null) {
				markup = ', Markup';
				markup += ': ' + this._decimalPipe.transform(this.myForm.value['markup'], '1.2-2') + '%';
			}

			let profit: string = '';
			if (this.myForm.value['profit'] != '' && this.myForm.value['profit'] != null) {
				profit = ', Profit';
				profit += ': $' + this._decimalPipe.transform(this.myForm.value['profit'], '1.2-2');
			}

			let beginDate: string = '';
			if (this.myForm.value['begin_date'] != '' && this.myForm.value['begin_date'] != null) {
				beginDate = ', Begin date';
				beginDate += ': ' + this._datePipe.transform(this.myForm.value['begin_date'], 'MM/dd/yyyy');
			}

			let endDate: string = '';
			if (this.myForm.value['end_date'] != '' && this.myForm.value['end_date'] != null) {
				endDate = ', End date';
				endDate += ': ' + this._datePipe.transform(this.myForm.value['end_date'], 'MM/dd/yyyy');
			}

			let msrp: string = '';
			if (this.myForm.value['msrp'] != '' && this.myForm.value['msrp'] != null) {
				msrp = ', MSRP';
				msrp += ': $' + this._decimalPipe.transform(this.myForm.value['msrp'], '1.2-2');
			}

			let msrpDate: string = '';
			if (this.myForm.value['msrp_date'] != '' && this.myForm.value['msrp_date'] != null) {
				msrpDate = ', MSRP date';
				msrpDate += ': ' + this._datePipe.transform(this.myForm.value['msrp_date'], 'MM/dd/yyyy');
			}

			let compareAtSaleUnitprice: string = '';
			if (this.myForm.value['compare_at_sale_unit_price'] != '' && this.myForm.value['compare_at_sale_unit_price'] != null) {
				compareAtSaleUnitprice = ', Compare At Sale Unitprice';
				compareAtSaleUnitprice += ': ' + this.myForm.value['compare_at_sale_unit_price'];
			}

			let currentSaleUnitReturnPrice: string = '';
			if (this.myForm.value['CurrentSaleUnitReturnPrice'] != '' && this.myForm.value['CurrentSaleUnitReturnPrice'] != null) {
				currentSaleUnitReturnPrice = ', Current Sale Unit Return Price';
				currentSaleUnitReturnPrice += ': ' + this.myForm.value['CurrentSaleUnitReturnPrice'];
			}

			let minimumRetailUnitPrice: string = '';
			if (this.myForm.value['MinimumAdvertisedRetailUnitPrice'] != '' && this.myForm.value['MinimumAdvertisedRetailUnitPrice'] != null) {
				minimumRetailUnitPrice = ', Minimum Retail Unit Price';
				minimumRetailUnitPrice += ': ' + this.myForm.value['MinimumAdvertisedRetailUnitPrice'];
			}

			let minimumRetailUnitPriceEffectiveDate: string = '';
			if (this.myForm.value['MinimumAdvertisedRetailUnitPriceEffectiveDate'] != '' && this.myForm.value['MinimumAdvertisedRetailUnitPriceEffectiveDate'] != null) {
				minimumRetailUnitPriceEffectiveDate = ', Minimum Retail Unit Price Effective Date';
				minimumRetailUnitPriceEffectiveDate += ': ' + this._datePipe.transform(this.myForm.value['MinimumAdvertisedRetailUnitPriceEffectiveDate'], 'MM/dd/yyyy');
			}

			showPricingData = type + price + cost + margin + markup + profit + beginDate + endDate + msrp + msrpDate + compareAtSaleUnitprice + currentSaleUnitReturnPrice + minimumRetailUnitPrice + minimumRetailUnitPriceEffectiveDate;

			this._dialogRef.close({ label: showPricingData, data: this.myForm.value });
		}
	}

	ngOnInit() {
		this.editData = this._editData.data;
		console.log('this.editData', this.editData);
		if (typeof this.editData.price != 'undefined') {
			// console.log('this.editData', this.editData);
			this.myForm.setValue({
				price: this.editData.price,
				cost: this.editData.cost,
				margin: this.editData.margin,
				markup: this.editData.markup,
				profit: this.editData.profit,
				begin_date: this.editData.begin_date,
				end_date: this.editData.end_date,
				msrp: this.editData.msrp,
				msrp_date: this.editData.msrp_date,
				compare_at_sale_unit_price: this.editData.compare_at_sale_unit_price,
				ItemSellingPrices: this.editData.ItemSellingPrices,
				selling_price_type: this.editData.selling_price_type == '' || this.editData.selling_price_type == null ? null : this.editData.selling_price_type,
				CurrentSaleUnitReturnPrice: this.editData.CurrentSaleUnitReturnPrice,
				MinimumAdvertisedRetailUnitPrice: this.editData.MinimumAdvertisedRetailUnitPrice,
				MinimumAdvertisedRetailUnitPriceEffectiveDate: this.editData.MinimumAdvertisedRetailUnitPriceEffectiveDate
			});
			this.item_price = this.editData.price;
			this.item_cost = this.editData.cost;
			this.item_margin = this.editData.margin;
			this.item_Profit = this.editData.profit;
			this.item_markup = this.editData.markup;
		}
	}

}
