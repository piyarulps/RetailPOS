import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HelperService } from '../../../../services/helper.service';

@Component({
  selector: 'app-sellingrule-modal',
  templateUrl: './sellingrule-modal.component.html',
  styleUrls: ['./sellingrule-modal.component.scss']
})
export class SellingruleModalComponent implements OnInit {


  dialogTitle = "Add Selling Rule";
  isDisabled: boolean = false;
  addModuleForm: FormGroup;
  moduleName: any;
  itemTenderRestrictionGroupCode: any[];
  retailStore: any[];
  parentPOSDepartment: any[];
  processMode: { id: string; text: string; }[];
  color = 'primary';
  couponRestricted: number = 0;
  checked = false;
  disabled = false;
  isLoading: boolean;
  submitted: boolean = false;
  btnValue: string;  // this variable use to change form submit button value
  allowMulCopValueBk: any;
  onChange(value) {
    console.log("toggle change");
  }
  onChangeCouponRestricted(value) {
    if (value.checked === true) {
      this.couponRestricted = 1;
      this.allowMulCopValueBk = this.addModuleForm.value.allowMultipleCoupon
      this.addModuleForm.patchValue({
        allowMultipleCoupon: false,
      });
    } else {
      this.addModuleForm.patchValue({
        allowMultipleCoupon: this.allowMulCopValueBk,
      });
    }
  }
  onChangeAllowMultipleCoupon(value) {
    if (this.addModuleForm.value.couponRestricted === true) {
      this.addModuleForm.patchValue({
        allowMultipleCoupon: false,
      });
    };
  }
  editData: any;
  updateData: any;
  public updateValue = {
    id: [],
    data: null,
    previous: []
  };
  constructor(
    public _dialogRef: MatDialogRef<SellingruleModalComponent>,
    private _formBuilder: FormBuilder,
    private _genericService: HelperService,
    @Inject(MAT_DIALOG_DATA) public _dialogData: any
  ) {
    this.addModuleForm = this._formBuilder.group({
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
    return this.addModuleForm.controls;
  }
  ngOnInit() {
    this.btnValue = "Create";
    this.addModuleForm.get('sellingName').patchValue(this._dialogData.newData);
    this.addModuleForm.get('sellingDescription').patchValue(this._dialogData.newData);
    this.dropDownData();
    this.getForupdateData();

  }
  //Start: Set value in form field to update data
  public getForupdateData() {
    this.editData = this._dialogData.data;
    if (this.editData.length) {
      this.dialogTitle = "Update Selling Rule";
      this.btnValue = "Update";
      const sellingName = this.addModuleForm.get('sellingName');
      const sellingDescription = this.addModuleForm.get('sellingDescription');
      if (this.editData.length == 1) {
        this.updateData = this.editData[0];
        this.setCommonDataInForm();
        sellingName.patchValue(this.updateData.name == null ? "" : this.updateData.name.toString());
        sellingDescription.patchValue(this.updateData.description == null ? "" : this.updateData.description.toString());
      }
      else {
        sellingName.clearValidators();
        this.pushAllIdInArray(this.editData) // This method is used to push all the id in one array from data
        this._genericService.apiPost(this.updateValue.id, `itemapis/commonelement`).subscribe(data => {
          this.updateData = data.data;
          this.setCommonDataInForm();
        });
      }
    }
  }
  //End: Set value in form field to update data

  //Start:This function used to update/set data for single and muliple data
  public setCommonDataInForm() {
    this.addModuleForm.patchValue({
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
  //Stop:This function used to update/set data for single and muliple data

  public dropDownData() {
    this._genericService.apiGet('itemapis/poslist/?colname=ItemTenderRestrictionGroupCode&').subscribe(
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
  public backProgress() {
    this._dialogRef.close()
  }
  // Start:This method is used to push all the id in one array from data
  public pushAllIdInArray(allId) {
    this.updateValue.id = [];
    for (let edit of allId) {
      this.updateValue.id.push(edit.id);
    }
  }
  // End:This method is used to push all the id in one array from data
  public onSubmit() {
    if (this.editData.length) {
      this.isDisabled = true;
      this.isLoading = true;
      if (this.addModuleForm.invalid) {
        this.isLoading = false;
        this.isDisabled = false;
        return;
      }
      this.pushAllIdInArray(this.editData) // This method is used to push all the id in one array from data
      this.updateValue.data = this.addModuleForm.value;
      this.updateValue.previous = this.updateData;
      this._genericService.apiPut(this.updateValue, `itemapis/sellingrule/`).subscribe(
        res => {
          if (res["message"]) {
            this._genericService.notify({ message: res.message, messageType: res.status });
          }
          this.isDisabled = false;
          this.isDisabled = false;
          this._dialogRef.close(res)
        },
        error => {
          console.log('error', error);
          this.isDisabled = false;
          this.isDisabled = false;
        },
        () => {
        }
      );
    }
    else {
      this.isDisabled = true;
      this.isLoading = true;
      if (this.addModuleForm.invalid) {
        this.addModuleForm.controls.sellingName.markAsTouched();
        this.isLoading = false;
        this.isDisabled = false;
        return;
      }
      var postValue = this.addModuleForm.value;
      this._genericService.apiPost(postValue, `itemapis/possellingrule/`).subscribe(
        res => {
          if (res["message"]) {
            this._genericService.notify({ message: res.message, messageType: res.status });
          }
          this.isDisabled = false;
          this.isLoading = false;
          if (res["status"] == 1) {
            this._dialogRef.close(res);
          }
        },
        error => {
          this.isDisabled = false;
          this.isLoading = false;
        },
        () => {
        }
      );
    }
  }

}
