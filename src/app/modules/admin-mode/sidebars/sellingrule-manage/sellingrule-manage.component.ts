
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatTableDataSource, MatDatepicker } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ElasticsearchService } from '../../../../services/elasticsearch.service';
import { HelperService } from '../../../../services/helper.service';
import { ConnectionService } from 'ng-connection-service';
export interface PageData {
  _editData: {
    data: [],
    newbrand: null
  }
}
export interface PeriodicElement {
  id: number;
}
@Component({
  selector: 'app-sellingrule-manage',
  templateUrl: './sellingrule-manage.component.html',
  styleUrls: ['./sellingrule-manage.component.scss']
})
export class SellingruleManageComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Input() pageData: PageData;
  @Output() getCommonData = new EventEmitter<{}>();

  moduleName: string = 'ItemSellingRule';
  displayModuleName: string = 'Selling Rule';
  moduleAPI: string = 'itemapis/sellingrule/';
  moduleLink: string = 'admin-mode/sellingrule';
  myForm: FormGroup;
  mfgList: any = [];
  submitted: boolean = false;
  BrandsList: any[];
  message: string;
  editData: any = [];
  dialogTitle: string = "Add New Selling Rule";
  isDisabled: boolean = false;
  btnCreateTxt: string = "Create";
  btnUpdateTxt: string = "Update";
  BrandNameDropDownList: any = [];
  brandnameLoading: boolean = false;
  response: any;
  _source: any = {};
  tempObj: any;
  tag: boolean;
  public dataSource = new MatTableDataSource<PeriodicElement>();
  isSelectBox: boolean = false;
  isbtnLoaderShow = false;
  IsAnotherChecked: boolean = false;
  isOnline: boolean = true;
  receivedData: any;
  isOpenSidebar: boolean = false;
  processMode: { id: string; text: string; }[];
  parentPOSDepartment: any;
  retailStore: any;
  sellingRuleList: any;
  sellingRuleListBk: any;
  nacsData: any[];
  updateData: any;
  public updateValue = {
    id: [],
    data: null,
    nacs: [],
    previous: []
  };
  typeCode: any;
  localCurrency: any;
  ISOCurrency: any;
  currencyType: any;
  businessSite: any;
  showTypeCodeRelatedField: boolean;
  operatingParty: any;
  SelectedOperationPartyValue: any;
  businessGroup: any;
  businessGroupBk: any;
  operatingPartyBk: any;
  SelectedValue: any;
  itemTenderRestrictionGroupCode: any;
  couponRestricted: number;
  allowMulCopValueBk: any;
  checked = false;
  disabled = false;
  onChange(value) {
    console.log("toggle change");
  }
  onChangeCouponRestricted(value) {
    if (value.checked === true) {
      this.couponRestricted = 1;
      this.allowMulCopValueBk = this.myForm.value.allowMultipleCoupon
      this.myForm.patchValue({
        allowMultipleCoupon: false,
      });
    } else {
      this.myForm.patchValue({
        allowMultipleCoupon: this.allowMulCopValueBk,
      });
    }
  }
  onChangeAllowMultipleCoupon(value) {
    if (this.myForm.value.couponRestricted === true) {
      this.myForm.patchValue({
        allowMultipleCoupon: false,
      });
    };
  }

  constructor(
    private _helper: HelperService,
    private _formBuilder: FormBuilder,
    public _formDirective: FormGroupDirective,
    public _elasticsearchService: ElasticsearchService,
    public _connectionService: ConnectionService,
    private _hotkeysService: HotkeysService,
  ) {
    this.isOnline = navigator.onLine;
    this._connectionService.monitor().subscribe(isConnected => {
      this.isOnline = isConnected;
    });

    this.validateForm();
    this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
      this.doManage();
      return false; // Prevent bubbling
    }));
  }

  onNoClick() {
    this.getCommonData.emit({ openSidebar: false });
  }

  validateForm() {
    this.myForm = this._formBuilder.group({
      sellingName: ['', Validators.required],
      sellingDescription: [''],
      processMode: [''],
      quantityKeyActionMode: [''],
      itemTenderRestrictionGroupCode: [''],
      couponRestricted: [false],
      allowFoodStamp: [false],
      allowMultipleCoupon: [false],
      returnProhibited: [false],
      allowWIC: [false],
      allowGiveAway: [false],
      requiresPriceEntry: [false],
      electronicsCoupon: [false],
      requiresWeightEntry: [false],
      allowEmployeeDiscount: [false],
      repeatKeyProhibited: [false],
      mustVerifyPrice: [false],
      frequentShopperPointEligible: [false],
      frequentShopperPointCount: [null, [Validators.pattern(/^^\d+(\.\d{1,3})?$/)]],
      passMaxAmount: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      passModifierQuantity: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      passOpen: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      passFoodStamp: [''],
      passDiscount: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      passDiscountType: ['percentage'],
      passQuantityNotAllow: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      passQuantityRequired: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      passQuantityRequiredType: ['pound'],
      sappMayNotBeSold: [false],
      sappIsNotReturnable: [false],
      sappTax1: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      sappTax2: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      sappTax3: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      sappTax4: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      sappCheckId1: [''],
      sappCheckId2: [''],
      sappFoodStamp: [''],
      sappFractionalQuantity: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      sappOpen: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      sappSpecialDiscountAllow: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      sappBlueLaw1Apple: [false],
      sappBlueLaw2Apple: [false],
      sappDepartmentSpecialDiscount: [null, Validators.pattern(/^^\d+(\.\d{1,3})?$/)],
      sappLottoTracking: [''],
      sappModifyItem: [false],
      sappItemNotCachedOnPos: [false]
    });
  }
  get f() {
    return this.myForm.controls;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.dataSource.data = [];
    this.receivedData = {};
    this.editData = [];
    const change: SimpleChange = changes.pageData;
    this.receivedData = change.currentValue;
    if (typeof (this.receivedData._editData) != "undefined") {
      if (typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null) {
        this.editData = this.receivedData._editData.data;

        this.getForupdateData(this.editData);
      }
    }
    else {
      this.dialogTitle = "Add  Selling Rule";
      this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
    }
  }

  ngOnInit() {
    this.dropDownData();
  }

  public getForupdateData(pageData) {
    this.editData = pageData;
    if (this.editData.length) {
      this.dialogTitle = "Update Selling Rule";
      const sellingName = this.myForm.get('sellingName');
      const sellingDescription = this.myForm.get('sellingDescription');
      if (this.editData.length == 1) {
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/commonelement/`).subscribe(data => {
          this.updateData = data.data;
          sellingName.setValidators([Validators.required]);
          this.setCommonDataInForm();
          sellingName.patchValue(this.updateData.name == null ? "" : this.updateData.name.toString());
          sellingDescription.patchValue(this.updateData.description == null ? "" : this.updateData.description.toString());
        });
      }
      else {
        sellingName.clearValidators();
        sellingDescription.clearValidators();
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/commonelement/`).subscribe(data => {
          this.updateData = data.data;
          this.setCommonDataInForm();
        });
      }
    }
  }
  public setCommonDataInForm() {
    this.myForm.patchValue({
      processMode: this.updateData.processMode == null ? "" : this.updateData.processMode.toString(),
      quantityKeyActionMode: this.updateData.quantityKeyActionMode == null ? "" : this.updateData.quantityKeyActionMode.toString(),
      itemTenderRestrictionGroupCode: this.updateData.itemTenderRestrictionGroupCode == null ? "" : this.updateData.itemTenderRestrictionGroupCode,
      couponRestricted: this.updateData.couponRestricted == null ? "" : this.updateData.couponRestricted.toString(),
      allowFoodStamp: this.updateData.allowFoodStamp == null ? "" : this.updateData.allowFoodStamp.toString(),
      allowMultipleCoupon: this.updateData.allowMultipleCoupon == null ? "" : this.updateData.allowMultipleCoupon.toString(),
      returnProhibited: this.updateData.returnProhibited == null ? "" : this.updateData.returnProhibited.toString(),
      allowWIC: this.updateData.allowWIC == null ? "" : this.updateData.allowWIC.toString(),
      allowGiveAway: this.updateData.allowGiveAway == null ? "" : this.updateData.allowGiveAway.toString(),
      requiresPriceEntry: this.updateData.requiresPriceEntry == null ? "" : this.updateData.requiresPriceEntry.toString(),
      electronicsCoupon: this.updateData.electronicsCoupon == null ? "" : this.updateData.electronicsCoupon.toString(),
      requiresWeightEntry: this.updateData.requiresWeightEntry == null ? "" : this.updateData.requiresWeightEntry.toString(),
      allowEmployeeDiscount: this.updateData.allowEmployeeDiscount == null ? 0 : this.updateData.allowEmployeeDiscount,
      repeatKeyProhibited: this.updateData.repeatKeyProhibited == null ? "" : this.updateData.repeatKeyProhibited.toString(),
      mustVerifyPrice: this.updateData.mustVerifyPrice == null ? "" : this.updateData.mustVerifyPrice.toString(),
      frequentShopperPointEligible: this.updateData.repeatKeyProhibited == null ? null : this.updateData.frequentShopperPointEligible,
      frequentShopperPointCount: this.updateData.frequentShopperPointCount == null ? "" : this.updateData.frequentShopperPointCount.toString(),
      passMaxAmount: this.updateData.passMaxAmount == null ? "" : this.updateData.passMaxAmount.toString(),
      passModifierQuantity: this.updateData.passModifierQuantity == null ? "" : this.updateData.passModifierQuantity.toString(),
      passOpen: this.updateData.passOpen == null ? "" : this.updateData.passOpen.toString(),
      passFoodStamp: this.updateData.passFoodStamp == null ? "" : this.updateData.passFoodStamp.toString(),
      passDiscount: this.updateData.passDiscount == null ? "" : this.updateData.passDiscount.toString(),
      passDiscountType: this.updateData.passDiscountType == null ? "" : this.updateData.passDiscountType.toString(),
      passQuantityRequiredType: this.updateData.passQuantityRequiredType == null ? "" : this.updateData.passQuantityRequiredType.toString(),
      passQuantityNotAllow: this.updateData.passQuantityNotAllow == null ? "" : this.updateData.passQuantityNotAllow.toString(),
      sappMayNotBeSold: this.updateData.sappMayNotBeSold == null ? 0 : this.updateData.sappMayNotBeSold,
      sappIsNotReturnable: this.updateData.sappIsNotReturnable == null ? 0 : this.updateData.sappIsNotReturnable,
      passQuantityRequired: this.updateData.passQuantityRequired == null ? "" : this.updateData.passQuantityRequired.toString(),
      sappTax1: this.updateData.sappTax1 == null ? "" : this.updateData.sappTax1.toString(),
      sappTax2: this.updateData.sappTax2 == null ? "" : this.updateData.sappTax2.toString(),
      sappTax3: this.updateData.sappTax3 == null ? "" : this.updateData.sappTax3.toString(),
      sappTax4: this.updateData.sappTax4 == null ? "" : this.updateData.sappTax4.toString(),
      sappCheckId1: this.updateData.sappCheckId1 == null ? "" : this.updateData.sappCheckId1.toString(),
      sappCheckId2: this.updateData.sappCheckId2 == null ? "" : this.updateData.sappCheckId2.toString(),
      sappFractionalQuantity: this.updateData.sappFractionalQuantity == null ? "" : this.updateData.sappFractionalQuantity.toString(),
      sappOpen: this.updateData.sappOpen == null ? "" : this.updateData.sappOpen.toString(),
      sappSpecialDiscountAllow: this.updateData.sappSpecialDiscountAllowed == null ? null : this.updateData.sappSpecialDiscountAllowed,
      sappBlueLaw1Apple: this.updateData.sappBlueLaw1Applies == null ? 0 : this.updateData.sappBlueLaw1Applies,
      sappBlueLaw2Apple: this.updateData.sappBlueLaw2Applies == null ? 0 : this.updateData.sappBlueLaw2Applies,
      sappDepartmentSpecialDiscount: this.updateData.sappDepartmentSpecialDiscount == null ? "" : this.updateData.sappDepartmentSpecialDiscount.toString(),
      sappLottoTracking: this.updateData.sappLottoTracking == null ? "" : this.updateData.sappLottoTracking.toString(),
      sappModifyItem: this.updateData.sappModifyItem == null ? 0 : this.updateData.sappModifyItem,
      sappItemNotCachedOnPos: this.updateData.sappItemNotCachedOnPos == null ? 0 : this.updateData.sappItemNotCachedOnPos,
    });
  }
  public pushAllIdInArray(allId) {
    this.updateValue.id = [];
    for (let edit of allId) {
      this.updateValue.id.push(edit.id);
    }
  }

  public dropDownData() {
    this._helper.apiGet('itemapis/poslist/?colname=ItemTenderRestrictionGroupCode&').subscribe(
      data => {
        this.itemTenderRestrictionGroupCode = data.result;
      },
      error => console.log(error)
    );
    this.processMode = [
      { id: 'Active', text: 'Active' },
      { id: 'Discontinued', text: 'Discontinued' },
      { id: 'Seasonal', text: 'Seasonal' },
      { id: 'To be discontinued', text: 'To be discontinued' },
      { id: 'Held for future release', text: 'Held for future release' }
    ];
  }
  //end:dropdown Data List
  public onTypeCodechange(event) {
    if (event == 1) {
      this.showTypeCodeRelatedField = false;
    }
    else {
      this.showTypeCodeRelatedField = true;
    }
  }

  doManage() {
    if (this.editData.length) {
      this.isbtnLoaderShow = true;
      this.btnUpdateTxt = "Please Wait..";
      // if (this.myForm.invalid) {
      //   this.myForm.controls.departmentName.markAsTouched();
      //   this.myForm.controls.departmentNumber.markAsTouched();
      //   this.btnUpdateTxt = "Update";
      //   this.isbtnLoaderShow = false;
      //   return;
      // }
      this.pushAllIdInArray(this.editData)
      this.updateValue.data = this.myForm.value;
      this.updateValue.nacs = this.dataSource.data;
      this.updateValue.previous = this.updateData;
      this._helper.apiPut(this.updateValue, this.moduleAPI).subscribe(
        res => {
          this._helper.notify({ message: res.message, messageType: res.status });
          if (res.status == 1) {
            this.submitted = false;
            this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
            this.isbtnLoaderShow = false;
            // this._dialogRef.close(true);
            this.getCommonData.emit({ openSidebar: false, dataAdded: true, hitListAction: 'editSuccess', noSelectionCheck: true });
          }
          this.btnUpdateTxt = "Update";
          this.isbtnLoaderShow = false;
        },
        error => {
          console.log('error', error);
          this.isbtnLoaderShow = false;
          this.btnUpdateTxt = "Update";
        },
        () => {
        }
      );
    }
    else {
      this.btnCreateTxt = "Please Wait..";
      this.submitted = true;
      if (this.myForm.invalid) {
        this.btnCreateTxt = "Create";
        this.isDisabled = false;
        return;
      }
      this.isbtnLoaderShow = true;
      if (this.isOnline) {
        var postValue = this.myForm.value;
        postValue.nacs = this.dataSource.data;
        this._helper.apiPost(postValue, `itemapis/possellingrule/`).subscribe(
          res => {
            if (res.message) {
              this._helper.notify({ message: res.message, messageType: res.status });
            }
            if (res.status == 1) {
              this.submitted = false;
              this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
              this.isbtnLoaderShow = false;
              if (this.IsAnotherChecked == true) {
                this.submitted = false;
                this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
                this.isbtnLoaderShow = false;
              } else {
                this.getCommonData.emit({ openSidebar: false, dataAdded: this.myForm.value });
              }
            }
            this.btnCreateTxt = "Create";
            this.isbtnLoaderShow = false;
          },
          error => {
            console.log('error', error);
            this.btnCreateTxt = "Create";
          }
        );
      }
      else {
        // var myThis = this;
        // this._helper.thisDb().brands().find({ BrandName: myThis.myForm.value.BrandName }, function (err, data) {
        //   myThis.btnCreateTxt = "Create";
        //   myThis.isbtnLoaderShow = false;
        //   if (!data.length) {
        //     myThis._helper.thisDb().brands().insert(myThis.myForm.value, function (err, data) {
        //       // console.log('insert', data);
        //       this.getCommonData.emit({ openSidebar: false, dataAdded: this.myForm.value });
        //       // myThis._snackBar.open('Brand created successfully.');
        //       this._helper.notify({ message: 'Brand created successfully.', messageType: 1 });
        //     });
        //   }
        //   else {
        //     // myThis._snackBar.open('Brand already exist.');
        //     this._helper.notify({ message: 'Brand already exist.', messageType: 0 });
        //   }
        // });
      }
    }
  }
  resetForm(_formGroupDirective: FormGroupDirective, _formGroup: FormGroup, _functionName: string): void {
    _formGroupDirective.resetForm();
    _formGroup.reset();
    this[_functionName]();
  }
  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
}
