import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AdminModeRoutes } from './admin-mode.routes';

// ui
import { HeaderSidebarComponent } from '../ui/header-sidebar/header-sidebar.component';
import { FilterComponent } from '../ui/filter/filter.component';

// admin-mode
import { BrandsComponent } from './brands/brands.component';
import { SizesComponent } from './sizes/sizes.component';
import { ItemsComponent } from './items/items.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { ServiceprovidersComponent } from './serviceproviders/serviceproviders.component';
import { ItemsManageComponent } from './items/items-manage/items-manage.component';
import { SellingRuleComponent } from './selling-rule/selling-rule.component';
import { BusinessUnitComponent } from './business-unit/business-unit.component';
import { UnitofmeasurementComponent } from './unitofmeasurement/unitofmeasurement.component';
import { SiteComponent } from './site/site.component';
import { LocationComponent } from './location/location.component';
import { ItemGroupsComponent } from './item-groups/item-groups.component';
import { MerchandisingComponent } from './merchandising/merchandising.component';
import { PosdepartmentComponent } from './posdepartment/posdepartment.component';

// admin-mode sidebars
import { BrandsManageComponent } from './sidebars/brands-manage/brands-manage.component';
import { SizesManageComponent } from './sidebars/sizes-manage/sizes-manage.component';
import { VendorsManageComponent } from './sidebars/vendors-manage/vendors-manage.component';
import { PosdepartmentManageComponent } from './sidebars/posdepartment-manage/posdepartment-manage.component';
import { SellingruleManageComponent } from './sidebars/sellingrule-manage/sellingrule-manage.component';
import { LocationManageComponent } from './sidebars/location-manage/location-manage.component';
import { BusinessunitManageComponent } from './sidebars/businessunit-manage/businessunit-manage.component';
import { ItemGroupsManageComponent } from './sidebars/item-groups-manage/item-groups-manage.component';
import { MerchandiseGroupsManageComponent } from './sidebars/merchandise-groups-manage/merchandise-groups-manage.component';

// admin-mode dialogs
import { NacsListComponent } from './dialogs/nacs-list/nacs-list.component';
import { SellingruleModalComponent } from './dialogs/sellingrule-modal/sellingrule-modal.component';
import { OperationPartyAddEditComponent } from './dialogs/operation-party-add-edit/operation-party-add-edit.component';
import { BusinessGroupAddEditComponent } from './dialogs/business-group-add-edit/business-group-add-edit.component';
import { UnitOfMeasurementAddEditComponent } from './dialogs/unit-of-measurement-add-edit/unit-of-measurement-add-edit.component';
import { LocationLevelAddEditComponent } from './dialogs/location-level-add-edit/location-level-add-edit.component';
import { SiteManageComponent } from './dialogs/site-manage/site-manage.component';
import { SiteTypeAddEditComponent } from './dialogs/site-type-add-edit/site-type-add-edit.component';
import { MeasurementunitDialogComponent } from './dialogs/measurementunit-dialog/measurementunit-dialog.component';
import { AddUnitOfMeasurementTypeComponent } from './dialogs/add-unit-of-measurement-type/add-unit-of-measurement-type.component';
import { ItemInventoryManageComponent } from './dialogs/item-inventory-manage/item-inventory-manage.component';
import { ItemPricingManageComponent } from './dialogs/item-pricing-manage/item-pricing-manage.component';
import { ItemSupplierManageComponent } from './dialogs/item-supplier-manage/item-supplier-manage.component';
import { ItemAddSupplierManageComponent } from './dialogs/item-add-supplier-manage/item-add-supplier-manage.component';
import { ItemCollectionManageComponent } from './dialogs/item-collection-manage/item-collection-manage.component';
import { ItemAddCollectionManageComponent } from './dialogs/item-add-collection-manage/item-add-collection-manage.component';
import { ItemMerchandisingManageComponent } from './dialogs/item-merchandising-manage/item-merchandising-manage.component';
import { ItemGroupsManageDialogComponent } from './dialogs/item-groups-manage/item-groups-manage-dialog.component';
import { LocationtypeAddEditComponent } from './dialogs/locationtype-add-edit/locationtype-add-edit.component';
import { LocationgroupAddEditComponent } from './dialogs/locationgroup-add-edit/locationgroup-add-edit.component';


@NgModule({
	declarations: [
		HeaderSidebarComponent,
		FilterComponent,
		BrandsComponent,
		SizesComponent,
		ManufacturersComponent,
		SuppliersComponent,
		ServiceprovidersComponent,
		BrandsManageComponent,
		SizesManageComponent,
		ItemsComponent,
		ItemsManageComponent,
		PosdepartmentComponent,
		PosdepartmentManageComponent,
		NacsListComponent,
		VendorsManageComponent,
		SellingRuleComponent,
		BusinessUnitComponent,
		BusinessunitManageComponent,
		SellingruleManageComponent,
		SellingruleModalComponent,
		OperationPartyAddEditComponent,
		BusinessGroupAddEditComponent,
		UnitofmeasurementComponent,
		UnitOfMeasurementAddEditComponent,
		SiteComponent,
		LocationComponent,
		LocationManageComponent,
		LocationLevelAddEditComponent,
		LocationgroupAddEditComponent,
		LocationtypeAddEditComponent,
		SiteManageComponent,
		SiteTypeAddEditComponent,
		MeasurementunitDialogComponent,
		AddUnitOfMeasurementTypeComponent,
		ItemInventoryManageComponent,
		ItemPricingManageComponent,
		ItemSupplierManageComponent,
		ItemAddSupplierManageComponent,
		ItemCollectionManageComponent,
		ItemAddCollectionManageComponent,
		ItemMerchandisingManageComponent,
		ItemGroupsComponent,
		ItemGroupsManageComponent,
		ItemGroupsManageDialogComponent,
		MerchandisingComponent,
		MerchandiseGroupsManageComponent
	],
	imports: [
		SharedModule,
		RouterModule.forChild(AdminModeRoutes),
		MatSlideToggleModule,
		DragDropModule,
	],
	entryComponents: [
		ItemInventoryManageComponent,
		ItemPricingManageComponent,
		ItemSupplierManageComponent,
		ItemAddSupplierManageComponent,
		ItemCollectionManageComponent,
		ItemAddCollectionManageComponent,
		ItemMerchandisingManageComponent,
		ItemGroupsManageDialogComponent,
		NacsListComponent,
		SellingruleModalComponent,
		SizesManageComponent,
		OperationPartyAddEditComponent,
		BusinessGroupAddEditComponent,
		LocationLevelAddEditComponent,
		LocationgroupAddEditComponent,
		LocationtypeAddEditComponent,
		SiteTypeAddEditComponent,
		MeasurementunitDialogComponent,
		AddUnitOfMeasurementTypeComponent
	],
	exports: []
})
export class AdminModeModule { }
