import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    // COMMON CONSTANTS
    ENABLE_ENCRYPTION: boolean = false; //true | false
    APP_NAME: string = 'Insight Retail POS';
    PASSCODE: string = 'InsightRetailPOS';
    CURRENCY: string = '$';
    CURRENCY_CODE: string = 'USD';

    // REGEXP
    REGEXP_DECIMAL: any = new RegExp('^(0\.((0[1-9]{1})|([1-9]{1}([0-9]{1})?)))|(([1-9]+[0-9]*)(\.([0-9]{1,2}))?)$');

    // COLUMN SETUP
    charecterColumnConditions: any = [{ name: 'equals', class: 'icon-equals', displayname: 'Equals' },
    { name: 'doesnotequals', class: 'icon-not-equals', displayname: 'Does Not Equals' },
    { name: 'startswith', class: 'icon-start-contains', displayname: 'Starts with' },
    { name: 'endswith', class: 'icon-end-contains', displayname: 'Ends with' },
    { name: 'contains', class: 'icon-contains', displayname: 'Contains' },
    { name: 'doesnotcontains', class: 'icon-not-contains', displayname: 'Does not contain' }
    ];
    numberColumnConditions: any = [{ name: 'equals', class: 'icon-equals', displayname: 'Equals' },
    { name: 'greaterequals', class: 'icon-greater-equal', displayname: 'Greater Equals' },
    { name: 'lessequals', class: 'icon-less-equal', displayname: 'Less Equals' }];
    smallintColumnConditions: any = [{ name: 'equals', class: 'icon-equals', displayname: 'Equals' },
    { name: 'doesnotequals', class: 'icon-not-equals', displayname: 'Does Not Equals' }];

    // SUPPORT FOR ITEM
    Tax_Exempt_Code: any = [
        { shortcode: '', displayname: 'None' },
        { shortcode: 'TE', displayname: 'Tax Exempt' },
    ];
    Useage_Code: any = [
        { shortcode: '', displayname: 'None' },
        { shortcode: 'SU', displayname: 'Store use' },
        { shortcode: 'FSE', displayname: 'Food service use' },
    ];
    Kit_Set_Code = [
        { shortcode: '', displayname: 'None' },
        { shortcode: 'IK', displayname: 'Is Kit' },
    ];
    Order_Collection_Code = [
        { shortcode: '', displayname: 'None' },
        { shortcode: 'IOC', displayname: 'Is Order Collection' },
    ];

    // SHORTCUTS
    SKEY_REFRESH: any = ['f5'];                         // listing page
    SKEY_ADD: any = ['alt+n'];                          // listing page
    SKEY_EDIT: any = ['alt+e'];                         // listing page
    SKEY_DEL: any = ['alt+d'];                          // listing page, sale mode
    SKEY_ACT: any = ['alt+shift+e'];                    // listing page
    SKEY_DEACT: any = ['alt+shift+b'];                  // listing page
    SKEY_ADMIN_MODE: any = ['alt+a'];                   // dashboard page
    SKEY_SALE_MODE: any = ['alt+s'];                    // dashboard page
    SKEY_MASTER_CHECK: any = ['alt+a', 'ctrl+a'];       // listing page
    SKEY_FIND: any = ['alt+f'];                         // listing page
    SKEY_LOGOUT: any = ['alt+shift+l'];                 // everywhere
    SKEY_DASHBOARD: any = ['alt+shift+h'];              // everywhere
    SKEY_SELECT_DOWN: any = ['shift+down'];             // listing page
    SKEY_SELECT_UP: any = ['shift+up'];                 // listing page
    SKEY_SELECT_FIRST: any = ['shift+space'];           // listing page
    SKEY_NEXT_PAGE: any = ['alt+right'];                // listing page
    SKEY_PREV_PAGE: any = ['alt+left'];                 // listing page
    SKEY_UP: any = ['up'];                              // sale mode
    SKEY_DOWN: any = ['down'];                          // sale mode
    SKEY_SHIFT_ENTER: any = ['shift+enter'];            // sale mode
    SKEY_ENTER: any = ['enter'];                        // login

    // TERMINAL BUTTON COLOR SET
    COLOR_SET = ['pink-bg', 'pink1-bg', 'pink2-bg', 'violet-bg', 'violet1-bg', 'violet2-bg', 'violet3-bg', 'violet4-bg', 'sky-bg', 'sky1-bg', 'green-bg', 'green1-bg', 'green2-bg', 'green3-bg', 'green4-bg', 'red-bg', 'red1-bg', 'brown-bg', 'brown1-bg', 'brown2-bg', 'brown3-bg', 'gray-bg', 'blue-bg'];
}