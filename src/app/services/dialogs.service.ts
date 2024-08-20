import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { SingleInputDialogComponent } from '../modules/ui/single-input-dialog/single-input-dialog.component';
import { NacsListComponent } from '../modules/admin-mode/dialogs/nacs-list/nacs-list.component';
import { SellingruleModalComponent } from '../modules/admin-mode/dialogs/sellingrule-modal/sellingrule-modal.component';
import { BusinessGroupAddEditComponent } from '../modules/admin-mode/dialogs/business-group-add-edit/business-group-add-edit.component';
import { OperationPartyAddEditComponent } from '../modules/admin-mode/dialogs/operation-party-add-edit/operation-party-add-edit.component';
import { LocationLevelAddEditComponent } from '../modules/admin-mode/dialogs/location-level-add-edit/location-level-add-edit.component';
import { LocationtypeAddEditComponent } from '../modules/admin-mode/dialogs/locationtype-add-edit/locationtype-add-edit.component';
import { LocationgroupAddEditComponent } from '../modules/admin-mode/dialogs/locationgroup-add-edit/locationgroup-add-edit.component';
import { SiteTypeAddEditComponent } from '../modules/admin-mode/dialogs/site-type-add-edit/site-type-add-edit.component';
import { MeasurementunitDialogComponent } from '../modules/admin-mode/dialogs/measurementunit-dialog/measurementunit-dialog.component';
import { AddUnitOfMeasurementTypeComponent } from '../modules/admin-mode/dialogs/add-unit-of-measurement-type/add-unit-of-measurement-type.component';

import { ItemInventoryManageComponent } from '../modules/admin-mode/dialogs/item-inventory-manage/item-inventory-manage.component';
import { ItemPricingManageComponent } from '../modules/admin-mode/dialogs/item-pricing-manage/item-pricing-manage.component';
import { ItemSupplierManageComponent } from '../modules/admin-mode/dialogs/item-supplier-manage/item-supplier-manage.component';
import { ItemCollectionManageComponent } from '../modules/admin-mode/dialogs/item-collection-manage/item-collection-manage.component';
import { ItemMerchandisingManageComponent } from '../modules/admin-mode/dialogs/item-merchandising-manage/item-merchandising-manage.component';
import { ItemGroupsManageDialogComponent } from '../modules/admin-mode/dialogs/item-groups-manage/item-groups-manage-dialog.component';

@Injectable({
	providedIn: 'root'
})
export class DialogsService {

	constructor(
		private _dialog: MatDialog
	) { }

	// public brandManageDialog(data: any = [], newbrand: string = null): Observable<any> {
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'add-more-pop';
	// 	dialogConfig.data = { data: data, newbrand: newbrand };
	// 	let dialogRef: MatDialogRef<BrandsManageComponent>;
	// 	dialogRef = this._dialog.open(BrandsManageComponent, dialogConfig);
	// 	//dialogRef.componentInstance.id = id;
	// 	return dialogRef.afterClosed();
	// }

	// public sizeManageDialog(data: any = [], newSize: string = null): Observable<any> {
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'add-more-pop';
	// 	dialogConfig.data = { data: data, newSize: newSize };
	// 	let dialogRef: MatDialogRef<SizesManageComponent>;
	// 	dialogRef = this._dialog.open(SizesManageComponent, dialogConfig);
	// 	//dialogRef.componentInstance.id = id;
	// 	return dialogRef.afterClosed();
	// }

	public itemGroupsManageDialog(data: any = [], preSetData?: any): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, preSetData: preSetData };
		let dialogRef: MatDialogRef<ItemGroupsManageDialogComponent>;
		dialogRef = this._dialog.open(ItemGroupsManageDialogComponent, dialogConfig);
		//dialogRef.componentInstance.id = id;
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public itemMerchandisingManageDialog(data: any = []): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data };
		let dialogRef: MatDialogRef<ItemMerchandisingManageComponent>;
		dialogRef = this._dialog.open(ItemMerchandisingManageComponent, dialogConfig);
		//dialogRef.componentInstance.id = id;
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public itemItemCollectionManageDialog(data: any = []): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data };
		let dialogRef: MatDialogRef<ItemCollectionManageComponent>;
		dialogRef = this._dialog.open(ItemCollectionManageComponent, dialogConfig);
		//dialogRef.componentInstance.id = id;
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public itemSupplierManageDialog(data: any = []): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data };
		let dialogRef: MatDialogRef<ItemSupplierManageComponent>;
		dialogRef = this._dialog.open(ItemSupplierManageComponent, dialogConfig);
		//dialogRef.componentInstance.id = id;
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public itemPricingManageDialog(data: any = []): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data };
		let dialogRef: MatDialogRef<ItemPricingManageComponent>;
		dialogRef = this._dialog.open(ItemPricingManageComponent, dialogConfig);
		//dialogRef.componentInstance.id = id;
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public itemInventoryManageDialog(data: any = []): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data };
		let dialogRef: MatDialogRef<ItemInventoryManageComponent>;
		dialogRef = this._dialog.open(ItemInventoryManageComponent, dialogConfig);
		//dialogRef.componentInstance.id = id;
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public columnManageDialog(data: any = []): Observable<any> {
		//console.log(data);
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-more-pop';
		dialogConfig.data = { data: data };
		let dialogRef: MatDialogRef<SingleInputDialogComponent>;
		dialogRef = this._dialog.open(SingleInputDialogComponent, dialogConfig);
		//dialogRef.componentInstance.id = id;
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public sellingRuleAddEditDialog(data: any = [], newSellingRule: string = null): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, newData: newSellingRule };
		let dialogRef: MatDialogRef<SellingruleModalComponent>;
		dialogRef = this._dialog.open(SellingruleModalComponent, dialogConfig);
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public NacsListDialog(data: any = []): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data };
		let dialogRef: MatDialogRef<NacsListComponent>;
		dialogRef = this._dialog.open(NacsListComponent, dialogConfig);
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public businessGroupDialog(data: any = [], valueByOnType: string = null): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, newData: valueByOnType };
		let dialogRef: MatDialogRef<BusinessGroupAddEditComponent>;
		dialogRef = this._dialog.open(BusinessGroupAddEditComponent, dialogConfig);
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}

	public operationPartyDialog(data: any = [], valueByOnType: string = null): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, newData: valueByOnType };
		let dialogRef: MatDialogRef<OperationPartyAddEditComponent>;
		dialogRef = this._dialog.open(OperationPartyAddEditComponent, dialogConfig);
		dialogRef.disableClose = true;
		return dialogRef.afterClosed();
	}
	public locationLevelDialog(data: any = [], valueByOnType: string = null): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, newData: valueByOnType };
		let dialogRef: MatDialogRef<LocationLevelAddEditComponent>;
		dialogRef = this._dialog.open(LocationLevelAddEditComponent, dialogConfig);
		return dialogRef.afterClosed();
	}
	public locationTypeDialog(data: any = [], valueByOnType: string = null): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, newData: valueByOnType };
		let dialogRef: MatDialogRef<LocationtypeAddEditComponent>;
		dialogRef = this._dialog.open(LocationtypeAddEditComponent, dialogConfig);
		return dialogRef.afterClosed();
	}
	public locationGroupDialog(data: any = [], valueByOnType: string = null): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, newData: valueByOnType };
		let dialogRef: MatDialogRef<LocationgroupAddEditComponent>;
		dialogRef = this._dialog.open(LocationgroupAddEditComponent, dialogConfig);
		return dialogRef.afterClosed();
	}
	public siteTypeDialog(data: any = [], valueByOnType: string = null): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: data, newData: valueByOnType };
		let dialogRef: MatDialogRef<SiteTypeAddEditComponent>;
		dialogRef = this._dialog.open(SiteTypeAddEditComponent, dialogConfig);
		return dialogRef.afterClosed();
	}
	public conversionUnitDialog(unitOfMeasurementCode, arrayData): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { data: unitOfMeasurementCode, arrayData: arrayData };
		let dialogRef: MatDialogRef<MeasurementunitDialogComponent>;
		dialogRef = this._dialog.open(MeasurementunitDialogComponent, dialogConfig);
		return dialogRef.afterClosed();
	}
	public unitOfMeasurementTypeDialog(data): Observable<any> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.panelClass = 'add-pop';
		dialogConfig.data = { newData: data };
		let dialogRef: MatDialogRef<AddUnitOfMeasurementTypeComponent>;
		dialogRef = this._dialog.open(AddUnitOfMeasurementTypeComponent, dialogConfig);
		return dialogRef.afterClosed();
	}


	// public addEditunitOfMeasurement(data: any = [], newData: string = null): Observable<any> {
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'supplier-pop';
	// 	dialogConfig.data = { data: data, newData: newData };
	// 	let dialogRef: MatDialogRef<UnitOfMeasurementAddEditComponent>;
	// 	dialogRef = this._dialog.open(UnitOfMeasurementAddEditComponent, dialogConfig);
	// 	dialogRef.disableClose = true;
	// 	return dialogRef.afterClosed();
	// }
	// public addEditCustomFieldPopup(data: any = [], itemids: string = null, module_name: string = null, tab_name: string = null): Observable<any> {
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'supplier-pop';
	// 	dialogConfig.data = { data: data, ItemIDs: itemids, module_name: module_name, tab_name: tab_name };
	// 	let dialogRef: MatDialogRef<CustomFieldPopupComponent>;
	// 	dialogRef = this._dialog.open(CustomFieldPopupComponent, dialogConfig);
	// 	dialogRef.disableClose = true;
	// 	return dialogRef.afterClosed();
	// }
	// public businessunitAddEdit(data: any = []): Observable<any> {
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'supplier-pop';
	// 	dialogConfig.data = { data: data };
	// 	let dialogRef: MatDialogRef<BusinessUnitAddEditComponent>;
	// 	dialogRef = this._dialog.open(BusinessUnitAddEditComponent, dialogConfig);
	// 	dialogRef.disableClose = true;
	// 	return dialogRef.afterClosed();
	// }
	// public siteAddEdit(data: any = []): Observable<any> {
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'supplier-pop';
	// 	dialogConfig.data = { data: data };
	// 	let dialogRef: MatDialogRef<SiteAddEditComponent>;
	// 	dialogRef = this._dialog.open(SiteAddEditComponent, dialogConfig);
	// 	dialogRef.disableClose = true;
	// 	return dialogRef.afterClosed();
	// }
	// public locationAddEdit(data: any = [], newData: string = null): Observable<any> {
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'supplier-pop';
	// 	dialogConfig.data = { data: data, newData: newData };
	// 	let dialogRef: MatDialogRef<LocationAddEditComponent>;
	// 	dialogRef = this._dialog.open(LocationAddEditComponent, dialogConfig);
	// 	return dialogRef.afterClosed();
	// }
	// public posDepartmentAddEditDialog(data: any = [], newData: string = null): Observable<any> {
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'supplier-pop';
	// 	dialogConfig.data = { data: data, newData: newData };
	// 	let dialogRef: MatDialogRef<PosDepartmentAddEditComponent>;
	// 	dialogRef = this._dialog.open(PosDepartmentAddEditComponent, dialogConfig);
	// 	return dialogRef.afterClosed();
	// }
	// public workstationAddEdit(data: any = [], newData: string = null): Observable<any> {
	// 	var dialogConfig = new MatDialogConfig();
	// 	dialogConfig.panelClass = 'supplier-pop';
	// 	dialogConfig.data = { data: data, newData: newData };
	// 	let dialogRef: MatDialogRef<WorkstationAddEditComponent>;
	// 	dialogRef = this._dialog.open(WorkstationAddEditComponent, dialogConfig);
	// 	return dialogRef.afterClosed();
	// }


}
