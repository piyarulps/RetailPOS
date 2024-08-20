import { Route } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

import { BrandsComponent } from './brands/brands.component';
import { SizesComponent } from './sizes/sizes.component';
import { ItemsComponent } from './items/items.component';
import { ItemGroupsComponent } from './item-groups/item-groups.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { ServiceprovidersComponent } from './serviceproviders/serviceproviders.component';
import { ItemsManageComponent } from './items/items-manage/items-manage.component';
import { SellingRuleComponent } from './selling-rule/selling-rule.component';
import { BusinessUnitComponent } from './business-unit/business-unit.component';
import { UnitofmeasurementComponent } from './unitofmeasurement/unitofmeasurement.component';
import { SiteComponent } from './site/site.component';
import { LocationComponent } from './location/location.component';
import { MerchandisingComponent } from './merchandising/merchandising.component';
import { PosdepartmentComponent } from './posdepartment/posdepartment.component';

export const AdminModeRoutes: Route[] = [
    {
        path: "brands",
        component: BrandsComponent,
        data: {
            moduleName: 'Brands'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "sizes",
        component: SizesComponent,
        data: {
            moduleName: 'Sizes'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "items",
        component: ItemsComponent,
        data: {
            moduleName: 'Items'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "item-groups",
        component: ItemGroupsComponent,
        data: {
            moduleName: 'GroupSelectItem'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "items/manage",
        component: ItemsManageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "manufacturers",
        component: ManufacturersComponent,
        data: {
            moduleName: 'Manufacturer'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "suppliers",
        component: SuppliersComponent,
        data: {
            moduleName: 'Supplier'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "serviceproviders",
        component: ServiceprovidersComponent,
        data: {
            moduleName: 'ServiceProvider'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "merchandising",
        component: MerchandisingComponent,
        data: {
            moduleName: 'merchandise_group_add_edit'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "posdepartment",
        component: PosdepartmentComponent,
        data: {
            moduleName: 'POSDepartment'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "sellingrule",
        component: SellingRuleComponent,
        data: {
            moduleName: 'ItemSellingRule'
        },
        canActivate: [AuthGuard]
    },
    {
        path: "businessunit",
        component: BusinessUnitComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "unitofmeasurement",
        component: UnitofmeasurementComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "site",
        component: SiteComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "location",
        component: LocationComponent,
        canActivate: [AuthGuard]
    },
]