import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule, MatExpansionModule, MatSnackBarModule, MatDialogModule, MatInputModule, MatFormFieldModule, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatTabsModule, MatIconModule, MatChipsModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatProgressSpinnerModule, MatTreeModule, MatRippleModule } from '@angular/material';
import { MatFormFieldModule, MatSelectModule, MatDialogModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatRadioModule } from '@angular/material';
// import { FormGroupDirective } from '@angular/forms';
import { ConnectionServiceModule } from 'ng-connection-service';
import { HotkeyModule } from 'angular2-hotkeys';
import { NgxCurrencyModule } from 'ngx-currency';

import { SharedModule } from './modules/shared.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpConfigInterceptor } from './interceptors/httpconfig.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import { ElectronService } from 'ngx-electron';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { GrdFilterPipe } from './pipes/grd-filter.pipe';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { HighlightPipe } from './pipes/highlight.pipe';
// import { ReversePipe } from './pipes/reverse.pipe';

// import { Globals } from './globals';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DeviceManageComponent } from './modules/sale-mode/dialogs/device-manage/device-manage.component';
import { ObEntryComponent } from './modules/ob-entry/ob-entry.component';

// ui
// import { HeaderSidebarComponent } from './modules/ui/header-sidebar/header-sidebar.component';
// import { ConfirmDialogComponent } from './modules/ui/confirm-dialog/confirm-dialog.component';
// import { SingleInputDialogComponent } from './modules/ui/single-input-dialog/single-input-dialog.component';
// import { FilterComponent } from './modules/ui/filter/filter.component';
// import { ContactDetailsDialogComponent } from './modules/ui/contact-details-dialog/contact-details-dialog.component';

// admin-mode
// import { BrandsComponent } from './modules/admin-mode/brands/brands.component';
// import { SizesComponent } from './modules/admin-mode/sizes/sizes.component';
// import { ItemsComponent } from './modules/admin-mode/items/items.component';
// import { ManufacturersComponent } from './modules/admin-mode/manufacturers/manufacturers.component';
// import { SuppliersComponent } from './modules/admin-mode/suppliers/suppliers.component';
// import { ServiceprovidersComponent } from './modules/admin-mode/serviceproviders/serviceproviders.component';
// import { ItemsManageComponent } from './modules/admin-mode/items/items-manage/items-manage.component';
// import { SellingRuleComponent } from './modules/admin-mode/selling-rule/selling-rule.component';
// import { BusinessUnitComponent } from './modules/admin-mode/business-unit/business-unit.component';
// import { UnitofmeasurementComponent } from './modules/admin-mode/unitofmeasurement/unitofmeasurement.component';
// import { SiteComponent } from './modules/admin-mode/site/site.component';
// import { LocationComponent } from './modules/admin-mode/location/location.component';
// import { ItemGroupsComponent } from './modules/admin-mode/item-groups/item-groups.component';
// import { MerchandisingComponent } from './modules/admin-mode/merchandising/merchandising.component';
// import { PosdepartmentComponent } from './modules/admin-mode/posdepartment/posdepartment.component';

// admin-mode sidebars
// import { BrandsManageComponent } from './modules/admin-mode/sidebars/brands-manage/brands-manage.component';
// import { SizesManageComponent } from './modules/admin-mode/sidebars/sizes-manage/sizes-manage.component';
// import { VendorsManageComponent } from './modules/admin-mode/sidebars/vendors-manage/vendors-manage.component';
// import { PosdepartmentManageComponent } from './modules/admin-mode/sidebars/posdepartment-manage/posdepartment-manage.component';
// import { SellingruleManageComponent } from './modules/admin-mode/sidebars/sellingrule-manage/sellingrule-manage.component';
// import { LocationManageComponent } from './modules/admin-mode/sidebars/location-manage/location-manage.component';
// import { BusinessunitManageComponent } from './modules/admin-mode/sidebars/businessunit-manage/businessunit-manage.component';
// import { ItemGroupsManageComponent } from './modules/admin-mode/sidebars/item-groups-manage/item-groups-manage.component';
// import { MerchandiseGroupsManageComponent } from './modules/admin-mode/sidebars/merchandise-groups-manage/merchandise-groups-manage.component';

// admin-mode dialogs
// import { NacsListComponent } from './modules/admin-mode/dialogs/nacs-list/nacs-list.component';
// import { SellingruleModalComponent } from './modules/admin-mode/dialogs/sellingrule-modal/sellingrule-modal.component';
// import { OperationPartyAddEditComponent } from './modules/admin-mode/dialogs/operation-party-add-edit/operation-party-add-edit.component';
// import { BusinessGroupAddEditComponent } from './modules/admin-mode/dialogs/business-group-add-edit/business-group-add-edit.component';
// import { UnitOfMeasurementAddEditComponent } from './modules/admin-mode/dialogs/unit-of-measurement-add-edit/unit-of-measurement-add-edit.component';
// import { LocationLevelAddEditComponent } from './modules/admin-mode/dialogs/location-level-add-edit/location-level-add-edit.component';
// import { SiteManageComponent } from './modules/admin-mode/dialogs/site-manage/site-manage.component';
// import { SiteTypeAddEditComponent } from './modules/admin-mode/dialogs/site-type-add-edit/site-type-add-edit.component';
// import { MeasurementunitDialogComponent } from './modules/admin-mode/dialogs/measurementunit-dialog/measurementunit-dialog.component';
// import { AddUnitOfMeasurementTypeComponent } from './modules/admin-mode/dialogs/add-unit-of-measurement-type/add-unit-of-measurement-type.component';
// import { ItemInventoryManageComponent } from './modules/admin-mode/dialogs/item-inventory-manage/item-inventory-manage.component';
// import { ItemPricingManageComponent } from './modules/admin-mode/dialogs/item-pricing-manage/item-pricing-manage.component';
// import { ItemSupplierManageComponent } from './modules/admin-mode/dialogs/item-supplier-manage/item-supplier-manage.component';
// import { ItemAddSupplierManageComponent } from './modules/admin-mode/dialogs/item-add-supplier-manage/item-add-supplier-manage.component';
// import { ItemCollectionManageComponent } from './modules/admin-mode/dialogs/item-collection-manage/item-collection-manage.component';
// import { ItemAddCollectionManageComponent } from './modules/admin-mode/dialogs/item-add-collection-manage/item-add-collection-manage.component';
// import { ItemMerchandisingManageComponent } from './modules/admin-mode/dialogs/item-merchandising-manage/item-merchandising-manage.component';
// import { ItemGroupsManageDialogComponent } from './modules/admin-mode/dialogs/item-groups-manage/item-groups-manage-dialog.component';
// import { LocationtypeAddEditComponent } from './modules/admin-mode/dialogs/locationtype-add-edit/locationtype-add-edit.component';
// import { LocationgroupAddEditComponent } from './modules/admin-mode/dialogs/locationgroup-add-edit/locationgroup-add-edit.component';

// sale-mode
// import { TerminalComponent } from './modules/sale-mode/terminal/terminal.component';
// import { CustomerManageComponent } from './modules/sale-mode/dialogs/customer-manage/customer-manage.component';

// dialogs
import { UnlockComponent } from './modules/dialogs/unlock/unlock.component';

@NgModule({
	declarations: [
		AppComponent,
		// HighlightPipe,
		// ReversePipe,
		LoginComponent,
		DashboardComponent,
		// HeaderSidebarComponent,
		// ConfirmDialogComponent,
		// SingleInputDialogComponent,
		// FilterComponent,
		// GrdFilterPipe,
		// ContactDetailsDialogComponent,
		DeviceManageComponent,
		UnlockComponent,
		ObEntryComponent,
		// sale-mode
		// TerminalComponent,
		// CustomerManageComponent,
		// admin-mode
		// BrandsComponent,
		// SizesComponent,
		// ManufacturersComponent,
		// SuppliersComponent,
		// ServiceprovidersComponent,
		// BrandsManageComponent,
		// SizesManageComponent,
		// ItemsComponent,
		// ItemsManageComponent,
		// PosdepartmentComponent,
		// PosdepartmentManageComponent,
		// NacsListComponent,
		// VendorsManageComponent,
		// SellingRuleComponent,
		// BusinessUnitComponent,
		// BusinessunitManageComponent,
		// SellingruleManageComponent,
		// SellingruleModalComponent,
		// OperationPartyAddEditComponent,
		// BusinessGroupAddEditComponent,
		// UnitofmeasurementComponent,
		// UnitOfMeasurementAddEditComponent,
		// SiteComponent,
		// LocationComponent,
		// LocationManageComponent,
		// LocationLevelAddEditComponent,
		// LocationgroupAddEditComponent,
		// LocationtypeAddEditComponent,
		// SiteManageComponent,
		// SiteTypeAddEditComponent,
		// MeasurementunitDialogComponent,
		// AddUnitOfMeasurementTypeComponent,
		// ItemInventoryManageComponent,
		// ItemPricingManageComponent,
		// ItemSupplierManageComponent,
		// ItemAddSupplierManageComponent,
		// ItemCollectionManageComponent,
		// ItemAddCollectionManageComponent,
		// ItemMerchandisingManageComponent,
		// ItemGroupsComponent,
		// ItemGroupsManageComponent,
		// ItemGroupsManageDialogComponent,
		// MerchandisingComponent,
		// MerchandiseGroupsManageComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
		CommonModule,
		RouterModule,
		// NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		ConnectionServiceModule,
		// MatTableModule,
		// MatSortModule,
		MatButtonModule,
		// MatPaginatorModule,
		// MatProgressBarModule,
		MatSelectModule,
		MatCheckboxModule,
		// MatExpansionModule,
		// MatSnackBarModule,
		MatDialogModule,
		MatInputModule,
		MatFormFieldModule,
		// MatTabsModule,
		// MatIconModule,
		// MatChipsModule,
		// MatMenuModule,
		// MatDatepickerModule,
		// MatNativeDateModule,
		// MatProgressSpinnerModule,
		// MatTreeModule,
		// DragDropModule,
		// MatSlideToggleModule,
		MatRadioModule,
		HotkeyModule.forRoot(),
		NgxCurrencyModule,
		// MatRippleModule
		SharedModule,
	],
	providers: [
		// DatePipe,
		// DecimalPipe,
		// Globals,
		// FormGroupDirective,
		// { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
		{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
	],
	entryComponents: [
		// ObEntryComponent,
		UnlockComponent,
		DeviceManageComponent,
		// ConfirmDialogComponent,
		// sale-mode
		// CustomerManageComponent,
		// admin-mode
		// ContactDetailsDialogComponent,
		// SingleInputDialogComponent,
		// ItemInventoryManageComponent,
		// ItemPricingManageComponent,
		// ItemSupplierManageComponent,
		// ItemAddSupplierManageComponent,
		// ItemCollectionManageComponent,
		// ItemAddCollectionManageComponent,
		// ItemMerchandisingManageComponent,
		// ItemGroupsManageDialogComponent,
		// NacsListComponent,
		// SellingruleModalComponent,
		// SizesManageComponent,
		// OperationPartyAddEditComponent,
		// BusinessGroupAddEditComponent,
		// LocationLevelAddEditComponent,
		// LocationgroupAddEditComponent,
		// LocationtypeAddEditComponent,
		// SiteTypeAddEditComponent,
		// MeasurementunitDialogComponent,
		// AddUnitOfMeasurementTypeComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
