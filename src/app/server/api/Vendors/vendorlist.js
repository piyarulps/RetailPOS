var dbLoader = require('./vendordbloader.js');
var app = require("express")();
var appLoader = require('../../app.js');

var LIMIT = 25;
var OFFSET = 1;
var SEARCHPARAM = '';
var requestParam = {};
var RecordsCount = 0;
var DataList = [];
var NewlyInsertedRecords = [];

module.exports = app;

app.get("/", function (req, res) {


  dbLoader.ManufacturerListDB.loadDatabase();
  dbLoader.SupplierListDB.loadDatabase();
  dbLoader.ServiceproviderListDB.loadDatabase();
  requestParam = req;
  var VENDORTYPE = '';
  var response = {};

  //console.log('requestParam.query', requestParam.query);
  if (typeof (requestParam.query) != 'undefined' && requestParam.query != null) {
    if (requestParam.query.vendortype == "Supplier") {
      VENDORTYPE = "Supplier";
    }
    if (requestParam.query.vendortype == "Manufacturer") {
      VENDORTYPE = "Manufacturer";
    }
    if (requestParam.query.vendortype == "ServiceProvider") {
      VENDORTYPE = "ServiceProvider";
    }
  }
  if (typeof (requestParam.query) != 'undefined' && requestParam.query != null) {
    if (typeof (requestParam.query.offset) != 'undefined' && requestParam.query.offset != null && requestParam.query.offset == 1) {
      OFFSET = 1;
      if (typeof (requestParam.query.limit) != 'undefined' && requestParam.query.limit != null && requestParam.query.limit != '') {
        LIMIT = parseInt(requestParam.query.limit);
      }
    } else if (typeof (requestParam.query.offset) != 'undefined' && requestParam.query.offset != null && requestParam.query.offset > 1) {
      OFFSET = parseInt(requestParam.query.offset);
      if (typeof (requestParam.query.limit) != 'undefined' && requestParam.query.limit != null && requestParam.query.limit != '') {
        LIMIT = parseInt(requestParam.query.limit);
      }
    }
    console.log(OFFSET, ' requestParam-query ', LIMIT);
  }



  if (typeof (requestParam.query) != 'undefined' && requestParam.query != null) {
    if (typeof (requestParam.query.q) != 'undefined' && requestParam.query.q != null) {
      SEARCHPARAM = requestParam.query.q;
    }
  }
  if (VENDORTYPE == "Manufacturer") {
    if (SEARCHPARAM != '') {
      var REGEX = new RegExp(SEARCHPARAM, "i");
      console.log(REGEX);
      dbLoader.ManufacturerListDB.find({ ManufacturerName: { $regex: REGEX } }).limit(10).exec(function (err, data) {
        console.log(data);
        if (data != 'undefined') {
          if (data.length > 0) {
            DataList = [];
            DataList = data;
            SEARCHPARAM = '';
          }
          if (DataList.length > 0) {
            response = { 'status': 1, 'message': 'Manufacturer Record.', 'result': DataList, 'RecordsCount': RecordsCount };
            res.send(response);
          } else {
            response = { 'status': 0, 'message': 'Manufacturer Record.', 'result': [], 'RecordsCount': 0 };
            res.send(response);
          }
        }
      });
    } else {
      dbLoader.ManufacturerListDB.find({ SavedWithLocal: "YES" }, function (err, Docs) {
        NewlyInsertedRecords = Docs;
      });
      dbLoader.ManufacturerListDB.count({}).exec(function (err, TotalRecords) {
        RecordsCount = TotalRecords;
      });
      dbLoader.ManufacturerListDB.find({}).sort({ 'PartyData.VendorID': -1 }).skip(parseInt((OFFSET - 1) * LIMIT)).limit(parseInt(LIMIT)).exec(function (err, data) {
        if (data.length > 0) {
          DataList = [];
          if (NewlyInsertedRecords.length > 0) {
            //console.log(NewlyInsertedRecords);
            DataList = NewlyInsertedRecords.concat(data);
          } else {
            DataList = data;
          }
          response = { 'status': 1, 'message': 'Manufacturer Records.', 'result': DataList, 'RecordsCount': RecordsCount };
          res.send(response);
        }
      });
    }
  }
  if (VENDORTYPE == "Supplier") {
    if (SEARCHPARAM != '') {
      var REGEX = new RegExp(SEARCHPARAM, "i");
      console.log(REGEX);
      dbLoader.SupplierListDB.find({ SupplierName: { $regex: REGEX } }).limit(10).exec(function (err, data) {
        console.log(data);
        if (data != 'undefined') {
          if (data.length > 0) {
            DataList = [];
            DataList = data;
            SEARCHPARAM = '';
          }
          if (DataList.length > 0) {
            response = { 'status': 1, 'message': 'Supplier Record.', 'result': DataList, 'RecordsCount': RecordsCount };
            res.send(response);
          } else {
            response = { 'status': 0, 'message': 'Supplier Record.', 'result': [], 'RecordsCount': 0 };
            res.send(response);
          }
        }
      });
    } else {
      dbLoader.SupplierListDB.find({ SavedWithLocal: "YES" }, function (err, Docs) {
        NewlyInsertedRecords = Docs;
      });
      dbLoader.SupplierListDB.count({}).exec(function (err, TotalRecords) {
        RecordsCount = TotalRecords;
      });
      dbLoader.SupplierListDB.find({}).sort({ 'PartyData.VendorID': -1 }).skip(parseInt((OFFSET - 1) * LIMIT)).limit(parseInt(LIMIT)).exec(function (err, data) {
        if (data.length > 0) {
          DataList = [];
          if (NewlyInsertedRecords.length > 0) {
            //console.log(NewlyInsertedRecords);
            DataList = NewlyInsertedRecords.concat(data);
          } else {
            DataList = data;
          }
          response = { 'status': 1, 'message': 'Manufacturer Records.', 'result': DataList, 'RecordsCount': RecordsCount };
          res.send(response);
        }
      });
    }
  }
  if (VENDORTYPE == "ServiceProvider") {
    if (SEARCHPARAM != '') {
      var REGEX = new RegExp(SEARCHPARAM, "i");
      console.log(REGEX);
      dbLoader.ServiceproviderListDB.find({ ServiceProviderName: { $regex: REGEX } }).limit(10).exec(function (err, data) {
        console.log(data);
        if (data != 'undefined') {
          if (data.length > 0) {
            DataList = [];
            DataList = data;
            SEARCHPARAM = '';
          }
          if (DataList.length > 0) {
            response = { 'status': 1, 'message': 'Service Provider Record.', 'result': DataList, 'RecordsCount': RecordsCount };
            res.send(response);
          } else {
            response = { 'status': 0, 'message': 'Service Provider Record.', 'result': [], 'RecordsCount': 0 };
            res.send(response);
          }
        }
      });
    } else {
      dbLoader.ServiceproviderListDB.find({ SavedWithLocal: "YES" }, function (err, Docs) {
        NewlyInsertedRecords = Docs;
      });
      dbLoader.ServiceproviderListDB.count({}).exec(function (err, TotalRecords) {
        RecordsCount = TotalRecords;
      });
      dbLoader.ServiceproviderListDB.find({}).sort({ 'PartyData.VendorID': -1 }).skip(parseInt((OFFSET - 1) * LIMIT)).limit(parseInt(LIMIT)).exec(function (err, data) {
        if (data.length > 0) {
          DataList = [];
          if (NewlyInsertedRecords.length > 0) {
            //console.log(NewlyInsertedRecords);
            DataList = NewlyInsertedRecords.concat(data);
          } else {
            DataList = data;
          }
          response = { 'status': 1, 'message': 'Manufacturer Records.', 'result': DataList, 'RecordsCount': RecordsCount };
          res.send(response);
        }
      });
    }
  }

});

// Create Brands
app.post("/", function (req, res) {
  var response = {};
  var _vendorName = '';
  var VendorExistFlag = false;
  var newDoc = req.body.PartyData;
  var VENDORTYPE = req.body.VendorType;
  var ContactData = req.body.ContactMethod;


  if (newDoc.PartyType == "Organization") {
    _vendorName = newDoc.LegalName;
  } else {
    _vendorName = newDoc.FirstName;
  }
  if (VENDORTYPE == "Manufacturer") {
    // console.log('HHHAA');
    dbLoader.ManufacturerListDB.find({ ManufacturerName: _vendorName }, function (err, docs) {
      if (docs.length === 0) {
        VendorExistFlag = false;
        console.log('Not Exist.');
      } else {
        VendorExistFlag = true;
        console.log('Exist.');
      }
    });
  }
  else if (VENDORTYPE == "ServiceProvider") {
    dbLoader.ServiceproviderListDB.find({ ServiceProviderName: _vendorName }, function (err, docs) {
      if (docs.length === 0) {
        VendorExistFlag = false;
      } else {
        VendorExistFlag = true;
      }
    });
  }
  else if (VENDORTYPE == "Supplier") {
    dbLoader.SupplierListDB.find({ SupplierName: _vendorName }, function (err, docs) {
      if (docs.length === 0) {
        VendorExistFlag = false;
      } else {
        VendorExistFlag = true;
      }
    });
  }
  //console.log(VendorExistFlag);
  if (VendorExistFlag == false) {
    var ContactMethod = [];
    var PartyDataManage = {};
    if (newDoc.PartyType == "Person") {
      PartyDataManage = {
        "PartyType": newDoc.PartyType,
        "Salutation": newDoc.Salutation,
        "FirstName": newDoc.FirstName,
        "MiddleNames": newDoc.MiddleNames,
        "LastName": newDoc.LastName,
        "GenderTypeCode": newDoc.GenderTypeCode,
        "DateOfBirth": newDoc.DateOfBirth,
        "Suffix": newDoc.Suffix,
        "SortingName": newDoc.SortingName,
        "MailingName": newDoc.MailingName,
        "OfficialName": newDoc.OfficialName,
        "LifeStageCode": newDoc.LifeStageCode,
        "DisplayLifeStageCode": newDoc.DisplayLifeStageCode,
        "RaceCode": newDoc.RaceCode,
        "DisplayRaceCode": newDoc.DisplayRaceCode,
        "EthnicityTypeCode": newDoc.EthnicityTypeCode,
        "DisplayEthnicityTypeCode": newDoc.DisplayEthnicityTypeCode,
        "ReligionName": newDoc.ReligionName,
        "DisplayReligionName": newDoc.DisplayReligionName,
        "EducationLevelCode": newDoc.EducationLevelCode,
        "DisplayEducationLevelCode": newDoc.DisplayEducationLevelCode,
        "EmploymentStatusCode": newDoc.EmploymentStatusCode,
        "DisplayEmploymentStatusCode": newDoc.DisplayEmploymentStatusCode,
        "OccupationTypeCode": newDoc.OccupationTypeCode,
        "DisplayOccupationTypeCode": newDoc.DisplayOccupationTypeCode,
        "AnnualIncomeRangeCode": newDoc.AnnualIncomeRangeCode,
        "DisplayAnnualIncomeRangeCode": newDoc.DisplayAnnualIncomeRangeCode,
        "PersonalityTypeCode": newDoc.PersonalityTypeCode,
        "DisplayPersonalityTypeCode": newDoc.DisplayPersonalityTypeCode,
        "LifestyleTypeCode": newDoc.LifestyleTypeCode,
        "DisplayLifestyleTypeCode": newDoc.DisplayLifestyleTypeCode,
        "PersonalValueTypeCode": newDoc.PersonalValueTypeCode,
        "DisplayPersonalValueTypeCode": newDoc.DisplayPersonalValueTypeCode,
        "ConsumerCreditScore": newDoc.ConsumerCreditScore,
        "ConsumerCreditRatingServiceName": newDoc.ConsumerCreditRatingServiceName,
        "DisabilityImpairmentTypeCode": newDoc.DisabilityImpairmentTypeCode,
        "DisplayDisabilityImpairmentTypeCode": newDoc.DisplayDisabilityImpairmentTypeCode,
        "MaritalStatusCode": newDoc.MaritalStatusCode,
        "DisplayMaritalStatusCode": newDoc.DisplayMaritalStatusCode,
        "DietaryHabitTypeCode": newDoc.DietaryHabitTypeCode,
        "DisplayDietaryHabitTypeCode": newDoc.DisplayDietaryHabitTypeCode,
        "ACTIVESTATUS": 'n'
      }
    } else {
      PartyDataManage = {
        "PartyType": newDoc.PartyType,
        "LegalName": newDoc.LegalName,
        "TradeName": newDoc.TradeName,
        "LegalStatusCode": newDoc.LegalStatusCode,
        "DisplayLegalStatusCode": newDoc.DisplayLegalStatusCode,
        "TaxExemptOrganizationTypeCode": "",
        "DUNSNumber": newDoc.DUNSNumber,
        "FiscalYearEndDate": newDoc.FiscalYearEndDate,
        "LegalOrganizationTypeCode": newDoc.LegalOrganizationTypeCode,
        "DisplayLegalOrganizationTypeCode": newDoc.DisplayLegalOrganizationTypeCode,
        "GlobalBusinessSizeTypeCode": newDoc.GlobalBusinessSizeTypeCode,
        "DisplayGlobalBusinessSizeTypeCode": newDoc.DisplayGlobalBusinessSizeTypeCode,
        "ReligionName": newDoc.ReligionName,
        "DisplayReligionName": newDoc.DisplayReligionName,
        "BusinessActivityCode": newDoc.BusinessActivityCode,
        "DisplayBusinessActivityCode": newDoc.DisplayBusinessActivityCode,
        "ActualOrgDescription": newDoc.ActualOrgDescription,
        "EmployeeCountLocal": newDoc.EmployeeCountLocal,
        "EmployeeCountGlobal": newDoc.EmployeeCountGlobal,
        "LocalAnnualRevenueAmount": newDoc.LocalAnnualRevenueAmount,
        "GlobalAnnualRevenueAmount": newDoc.GlobalAnnualRevenueAmount,
        "OpenForBusinessDate": newDoc.OpenForBusinessDate,
        "ClosedForBusinessDate": newDoc.ClosedForBusinessDate,
        "BankruptcyFlag": newDoc.BankruptcyFlag,
        "BankruptcyDate": newDoc.BankruptcyDate,
        "BankruptcyEmergenceDate": newDoc.BankruptcyEmergenceDate,
        "BankruptcyTypeCode": newDoc.BankruptcyTypeCode,
        "ACTIVESTATUS": 'n'
      }
    }
    if (ContactData.length > 0) {
      ContactData.forEach(function (ckey, cval) {
        var contactDetails = {
          "ContactPurposeTypeCode": ckey.ContactPurposeTypeCode,
          "ContactMethodTypeCode": ckey.ContactMethodTypeCode,
          "AddressLine1": ckey.AddressLine1,
          "AddressLine2": ckey.AddressLine2,
          "AddressLine3": ckey.AddressLine3,
          "AddressLine4": ckey.AddressLine4,
          "email": ckey.email,
          "phone": ckey.phone,
          "language": ckey.language,
          "country": ckey.country,
          "country_code": ckey.country_code,
          "state": ckey.state,
          "city": ckey.city,
          "zipcode": ckey.zipcode
        }
        ContactMethod.push(contactDetails);
      });
    }
    if (VENDORTYPE == "Manufacturer") {
      dbLoader.ManufacturerListDB.insert({ "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "ManufacturerName": _vendorName, "SavedWithLocal": "YES" }, function (err) { });
      //ServerSyncVendor('Manufacturer','Insert');

    }
    if (VENDORTYPE == "Supplier") {
      dbLoader.SupplierListDB.insert({ "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "SupplierName": _vendorName, "SavedWithLocal": "YES" }, function (err) { });
      //ServerSyncVendor('Supplier','Insert');
    }
    if (VENDORTYPE == "ServiceProvider") {
      dbLoader.ServiceproviderListDB.insert({ "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "ServiceProviderName": _vendorName, "SavedWithLocal": "YES" }, function (err) { });
      //ServerSyncVendor('ServiceProvider','Insert');
    }
    console.log(VENDORTYPE + ' Created Successfully.');
    response = { 'status': 1, 'message': VENDORTYPE + ' Created Successfully.' };
    res.send(response);
  } else {
    console.log('Sorry, this ' + VENDORTYPE + ' already exist.');
    response = { 'status': 1, 'message': 'Sorry, this ' + VENDORTYPE + ' already exist.' };
    res.send(response);
  }
});

app.put("/", function (req, res) {
  var response = {};
  var UpdateData = req.body;
  var ContactMethod = [];
  var _vendorName = '';
  var errCount = 0;
  if ('ContactMethod' in UpdateData[0]) {
    //console.log(UpdateBrandsArr);
    UpdateData.forEach(function (key, val) {
      var VENDORTYPE = key.VendorType;
      var CONTACTDATA = key.ContactMethod;
      var VENDORDATAOBJECT = key.PartyData;
      if (VENDORDATAOBJECT.PartyType == "Organization") {
        _vendorName = VENDORDATAOBJECT.LegalName;
      } else {
        _vendorName = VENDORDATAOBJECT.FirstName;
      }
      if (VENDORDATAOBJECT.PartyType == "Person") {
        PartyDataManage = {
          "VendorID": VENDORDATAOBJECT.VendorID,
          "PartyType": VENDORDATAOBJECT.PartyType,
          "Salutation": VENDORDATAOBJECT.Salutation,
          "FirstName": _vendorName,
          "MiddleNames": VENDORDATAOBJECT.MiddleNames,
          "LastName": VENDORDATAOBJECT.LastName,
          "GenderTypeCode": VENDORDATAOBJECT.GenderTypeCode,
          "DateOfBirth": VENDORDATAOBJECT.DateOfBirth,
          "Suffix": VENDORDATAOBJECT.Suffix,
          "SortingName": VENDORDATAOBJECT.SortingName,
          "MailingName": VENDORDATAOBJECT.MailingName,
          "OfficialName": VENDORDATAOBJECT.OfficialName,
          "LifeStageCode": VENDORDATAOBJECT.LifeStageCode,
          "DisplayLifeStageCode": VENDORDATAOBJECT.DisplayLifeStageCode,
          "RaceCode": VENDORDATAOBJECT.RaceCode,
          "DisplayRaceCode": VENDORDATAOBJECT.DisplayRaceCode,
          "EthnicityTypeCode": VENDORDATAOBJECT.EthnicityTypeCode,
          "DisplayEthnicityTypeCode": VENDORDATAOBJECT.DisplayEthnicityTypeCode,
          "ReligionName": VENDORDATAOBJECT.ReligionName,
          "DisplayReligionName": VENDORDATAOBJECT.DisplayReligionName,
          "EducationLevelCode": VENDORDATAOBJECT.EducationLevelCode,
          "DisplayEducationLevelCode": VENDORDATAOBJECT.DisplayEducationLevelCode,
          "EmploymentStatusCode": VENDORDATAOBJECT.EmploymentStatusCode,
          "DisplayEmploymentStatusCode": VENDORDATAOBJECT.DisplayEmploymentStatusCode,
          "OccupationTypeCode": VENDORDATAOBJECT.OccupationTypeCode,
          "DisplayOccupationTypeCode": VENDORDATAOBJECT.DisplayOccupationTypeCode,
          "AnnualIncomeRangeCode": VENDORDATAOBJECT.AnnualIncomeRangeCode,
          "DisplayAnnualIncomeRangeCode": VENDORDATAOBJECT.DisplayAnnualIncomeRangeCode,
          "PersonalityTypeCode": VENDORDATAOBJECT.PersonalityTypeCode,
          "DisplayPersonalityTypeCode": VENDORDATAOBJECT.DisplayPersonalityTypeCode,
          "LifestyleTypeCode": VENDORDATAOBJECT.LifestyleTypeCode,
          "DisplayLifestyleTypeCode": VENDORDATAOBJECT.DisplayLifestyleTypeCode,
          "PersonalValueTypeCode": VENDORDATAOBJECT.PersonalValueTypeCode,
          "DisplayPersonalValueTypeCode": VENDORDATAOBJECT.DisplayPersonalValueTypeCode,
          "ConsumerCreditScore": VENDORDATAOBJECT.ConsumerCreditScore,
          "ConsumerCreditRatingServiceName": VENDORDATAOBJECT.ConsumerCreditRatingServiceName,
          "DisabilityImpairmentTypeCode": VENDORDATAOBJECT.DisabilityImpairmentTypeCode,
          "DisplayDisabilityImpairmentTypeCode": VENDORDATAOBJECT.DisplayDisabilityImpairmentTypeCode,
          "MaritalStatusCode": VENDORDATAOBJECT.MaritalStatusCode,
          "DisplayMaritalStatusCode": VENDORDATAOBJECT.DisplayMaritalStatusCode,
          "DietaryHabitTypeCode": VENDORDATAOBJECT.DietaryHabitTypeCode,
          "DisplayDietaryHabitTypeCode": VENDORDATAOBJECT.DisplayDietaryHabitTypeCode,
          "ACTIVESTATUS": VENDORDATAOBJECT.ACTIVESTATUS

        }
      } else {
        PartyDataManage = {
          "VendorID": VENDORDATAOBJECT.VendorID,
          "PartyType": VENDORDATAOBJECT.PartyType,
          "LegalName": _vendorName,
          "TradeName": VENDORDATAOBJECT.TradeName,
          "LegalStatusCode": VENDORDATAOBJECT.LegalStatusCode,
          "DisplayLegalStatusCode": VENDORDATAOBJECT.DisplayLegalStatusCode,
          "TaxExemptOrganizationTypeCode": "",
          "DUNSNumber": VENDORDATAOBJECT.DUNSNumber,
          "FiscalYearEndDate": VENDORDATAOBJECT.FiscalYearEndDate,
          "LegalOrganizationTypeCode": VENDORDATAOBJECT.LegalOrganizationTypeCode,
          "DisplayLegalOrganizationTypeCode": VENDORDATAOBJECT.DisplayLegalOrganizationTypeCode,
          "GlobalBusinessSizeTypeCode": VENDORDATAOBJECT.GlobalBusinessSizeTypeCode,
          "DisplayGlobalBusinessSizeTypeCode": VENDORDATAOBJECT.DisplayGlobalBusinessSizeTypeCode,
          "ReligionName": VENDORDATAOBJECT.ReligionName,
          "DisplayReligionName": VENDORDATAOBJECT.DisplayReligionName,
          "BusinessActivityCode": VENDORDATAOBJECT.BusinessActivityCode,
          "DisplayBusinessActivityCode": VENDORDATAOBJECT.DisplayBusinessActivityCode,
          "ActualOrgDescription": VENDORDATAOBJECT.ActualOrgDescription,
          "EmployeeCountLocal": VENDORDATAOBJECT.EmployeeCountLocal,
          "EmployeeCountGlobal": VENDORDATAOBJECT.EmployeeCountGlobal,
          "LocalAnnualRevenueAmount": VENDORDATAOBJECT.LocalAnnualRevenueAmount,
          "GlobalAnnualRevenueAmount": VENDORDATAOBJECT.GlobalAnnualRevenueAmount,
          "OpenForBusinessDate": VENDORDATAOBJECT.OpenForBusinessDate,
          "ClosedForBusinessDate": VENDORDATAOBJECT.ClosedForBusinessDate,
          "BankruptcyFlag": VENDORDATAOBJECT.BankruptcyFlag,
          "BankruptcyDate": VENDORDATAOBJECT.BankruptcyDate,
          "BankruptcyEmergenceDate": VENDORDATAOBJECT.BankruptcyEmergenceDate,
          "BankruptcyTypeCode": VENDORDATAOBJECT.BankruptcyTypeCode,
          "ACTIVESTATUS": VENDORDATAOBJECT.ACTIVESTATUS

        }
      }
      if (CONTACTDATA.length > 0) {
        CONTACTDATA.forEach(function (ckey, cval) {
          var contactDetails = {
            "ContactPurposeTypeCode": ckey.ContactPurposeTypeCode,
            "ContactMethodTypeCode": ckey.ContactMethodTypeCode,
            "AddressLine1": ckey.AddressLine1,
            "AddressLine2": ckey.AddressLine2,
            "AddressLine3": ckey.AddressLine3,
            "AddressLine4": ckey.AddressLine4,
            "email": ckey.email,
            "phone": ckey.phone,
            "language": ckey.language,
            "country": ckey.country,
            "country_code": ckey.country_code,
            "state": ckey.state,
            "city": ckey.city,
            "zipcode": ckey.zipcode
          }
          ContactMethod.push(contactDetails);
        });
      }
      if ('VendorID' in VENDORDATAOBJECT) {
        if (VENDORTYPE == "Manufacturer") {
          dbLoader.ManufacturerListDB.update({ _id: VENDORDATAOBJECT._id }, { $set: { "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "ManufacturerName": _vendorName } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              dbLoader.ManufacturerUpdateDB.insert({ "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "ManufacturerName": _vendorName }, function (err) { });
              ServerSyncVendor('Manufacturer', 'Update');
            }
          });

        }
        else if (VENDORTYPE == "Supplier") {
          dbLoader.SupplierListDB.update({ _id: VENDORDATAOBJECT._id }, { $set: { "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "SupplierName": _vendorName } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              dbLoader.SupplierUpdateDB.insert({ "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "SupplierName": _vendorName }, function (err) { });
              ServerSyncVendor('Supplier', 'Update');
            }
          });
        }
        else if (VENDORTYPE == "ServiceProvider") {
          dbLoader.ServiceproviderListDB.update({ _id: VENDORDATAOBJECT._id }, { $set: { "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "ServiceProviderName": _vendorName } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              dbLoader.ServiceproviderUpdateDB.insert({ "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "ServiceProviderName": _vendorName }, function (err) { });
              ServerSyncVendor('ServiceProvider', 'Update');
            }
          });
        }
      } else {
        if (VENDORTYPE == "Manufacturer") {
          dbLoader.ManufacturerListDB.update({ _id: VENDORDATAOBJECT._id }, { $set: { "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "ManufacturerName": _vendorName, "SavedWithLocal": "YES" } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              console.log('Manufacturer updated successfully.');
            }
          });
        }
        else if (VENDORTYPE == "Supplier") {
          dbLoader.SupplierListDB.update({ _id: VENDORDATAOBJECT._id }, { $set: { "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "SupplierName": _vendorName, "SavedWithLocal": "YES" } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              console.log('Supplier updated successfully.');
            }
          });
        }
        else if (VENDORTYPE == "ServiceProvider") {
          dbLoader.ServiceproviderListDB.update({ _id: VENDORDATAOBJECT._id }, { $set: { "PartyData": PartyDataManage, "ContactMethod": ContactMethod, "ServiceProviderName": _vendorName, "SavedWithLocal": "YES" } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              console.log('Serviceprovider updated successfully.');
            }
          });
        }
      }
    });
    if (errCount == 0) {
      response = { 'status': 1, 'message': UpdateData[0].VendorType + ' updated successfully.' };
    } else {
      response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
    }
    res.setHeader('content-type', 'text/javascript');
    res.json(response);
  } else {
    UpdateData.forEach(function (key, val) {
      var PARTYDATA = key.PartyData;
      var UPDATEID = PARTYDATA._id;
      var VENDORTYPE = key.VendorType;

      if ('VendorID' in PARTYDATA) {
        var paramStatus = {
          "PartyData": {
            "VendorID": PARTYDATA.VendorID,
            "isblocked": PARTYDATA.isblocked
          },
          "PartyRole": "Vendor",
          "VendorType": VENDORTYPE
        };

        if (VENDORTYPE == "Manufacturer") {
          dbLoader.ManufacturerListDB.update({ _id: UPDATEID }, { $set: { "PartyData.ACTIVESTATUS": PARTYDATA.isblocked } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              dbLoader.VendorStatusDB.insert(paramStatus, function (err) { });
              ServerSyncVendor('Manufacturer', 'Status');
            }
          });
        }
        else if (VENDORTYPE == "Supplier") {
          dbLoader.SupplierListDB.update({ _id: UPDATEID }, { $set: { "PartyData.ACTIVESTATUS": PARTYDATA.isblocked } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              dbLoader.VendorStatusDB.insert(paramStatus, function (err) { });
              ServerSyncVendor('Supplier', 'Status');
            }
          });
        }
        else if (VENDORTYPE == "ServiceProvider") {
          dbLoader.ServiceproviderListDB.update({ _id: UPDATEID }, { $set: { "PartyData.ACTIVESTATUS": PARTYDATA.isblocked } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              dbLoader.VendorStatusDB.insert(paramStatus, function (err) { });
              ServerSyncVendor('ServiceProvider', 'Status');
            }
          });
        }
      } else {
        if (VENDORTYPE == "Manufacturer") {
          dbLoader.ManufacturerListDB.update({ _id: UPDATEID }, { $set: { "PartyData.ACTIVESTATUS": PARTYDATA.isblocked } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              console.log('Manufacturer updated successfully.');
            }
          });
        }
        else if (VENDORTYPE == "Supplier") {
          dbLoader.SupplierListDB.update({ _id: UPDATEID }, { $set: { "PartyData.ACTIVESTATUS": PARTYDATA.isblocked } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              console.log('Supplier updated successfully.');
            }
          });
        }
        else if (VENDORTYPE == "ServiceProvider") {
          dbLoader.ServiceproviderListDB.update({ _id: UPDATEID }, { $set: { "PartyData.ACTIVESTATUS": PARTYDATA.isblocked } }, function (err) {
            if (err) {
              errCount += 1;
            } else {
              console.log('ServiceProvider updated successfully.');
            }
          });
        }
      }
    });

    if (errCount == 0) {
      response = { 'status': 1, 'message': UpdateData[0].VendorType + ' updated successfully.' };
    } else {
      response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
    }
    res.setHeader('content-type', 'text/javascript');
    res.json(response);

  }


});

app.delete("/", function (req, res) {
  var response = {};
  var errCount = 0;

  var DeleteData = req.body;
  //console.log(DeleteBrandsArr);
  DeleteData.forEach(function (key, val) {
    if ('VendorID' in key) {
      var VENDORTYPE = key.VendorType;
      var paramDelete = {
        "PartyRole": "Vendor",
        "VendorID": key.VendorID,
        "VendorType": key.VendorType
      };
      if (VENDORTYPE == "Manufacturer") {
        dbLoader.ManufacturerListDB.remove({ _id: key._id }, { multi: true }, function (err, cb) {
          if (cb === 1) {
            dbLoader.ManufacturerDeleteDB.insert(paramDelete, function (err) { });
            ServerSyncVendor('Manufacturer', 'Delete');
          } else {
            errCount += 1;
          }
        });
      }
      else if (VENDORTYPE == "Supplier") {
        dbLoader.SupplierListDB.remove({ _id: key._id }, { multi: true }, function (err, cb) {
          if (cb === 1) {
            dbLoader.SupplierDeleteDB.insert(paramDelete, function (err) { });
            ServerSyncVendor('Supplier', 'Delete');
          } else {
            errCount += 1;
          }
        });

      }
      else if (VENDORTYPE == "ServiceProvider") {
        dbLoader.ServiceproviderListDB.remove({ _id: key._id }, { multi: true }, function (err, cb) {
          if (cb === 1) {
            dbLoader.ServiceproviderDeleteDB.insert(paramDelete, function (err) { });
            ServerSyncVendor('ServiceProvider', 'Delete');
          } else {
            errCount += 1;
          }
        });
      }
    } else {
      if (VENDORTYPE == "Manufacturer") {
        dbLoader.ManufacturerListDB.remove({ _id: key._id }, { multi: true }, function (err, cb) {
          if (cb === 1) {
            console.log('Manufacturer deleted successfully.');
          } else {
            errCount += 1;
          }
        });
      }
      else if (VENDORTYPE == "Supplier") {
        dbLoader.SupplierListDB.remove({ _id: key._id }, { multi: true }, function (err, cb) {
          if (cb === 1) {
            console.log('Supplier deleted successfully.');
          } else {
            errCount += 1;
          }
        });
      }
      else if (VENDORTYPE == "ServiceProvider") {
        dbLoader.ServiceproviderListDB.remove({ _id: key._id }, { multi: true }, function (err, cb) {
          if (cb === 1) {
            console.log('ServiceProvider deleted successfully.');
          } else {
            errCount += 1;
          }
        });
      }
    }
  });
  if (errCount == 0) {
    response = { 'status': 1, 'message': DeleteData[0].VendorType + ' deleted successfully.' };
  } else {
    response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
  }
  res.setHeader('content-type', 'text/javascript');
  res.json(response);

});



function ServerSyncVendor(VendorType, APIMethod) {

  var DataDownloadFromServer = [];


  if (APIMethod == 'Insert') {
    if (VendorType == 'Manufacturer') {
      dbLoader.ManufacturerListDB.find({ SavedWithLocal: "YES" }, function (err, data) {
        var responseCreate = {};
        if (data.length > 0) {
          data.forEach(function (key, val) {
            var VendorData = key.PartyData;
            var VendorType = "Manufacturer";
            var ContactMethod = key.ContactMethod;
            var ParamConfig = { "PartyData": VendorData, "ContactMethod": ContactMethod, "VendorType": VendorType, "PartyRole": "Vendor" };

            var PostURL = appLoader.BASEURL + "organizations/";
            appLoader.CallDataFromServer("POST", PostURL, ParamConfig).then(function (response) {
              responseCreate = response;
              //console.log(responseCreate);
              dbLoader.ManufacturerListDB.remove({ SavedWithLocal: "YES" }, { multi: true }, function (err, cb) {

                if (cb > 0) {
                  var getURL = appLoader.BASEURL + "organizations/?partyrole=Vendor&vendortype=Manufacturer&q=" + key.ManufacturerName;
                  appLoader.CallDataFromServer("GET", getURL, {}).then(function (createresponse) {

                    DataDownloadFromServer = createresponse.result;
                    if (DataDownloadFromServer.length > 0) {
                      DataDownloadFromServer.forEach(function (key, val) {
                        if (key.PartyData.PartyType == "Organization") {
                          var _manufacturerName = key.PartyData.LegalName;
                        } else {
                          var _manufacturerName = key.PartyData.FirstName;
                        }
                        if (typeof (_manufacturerName) != 'undefined') {
                          var ContactMethod = [];
                          var ManufacturerManageArr = {};
                          if (key.PartyData.PartyType == "Person") {
                            ManufacturerManageArr = {
                              "VendorID": key.PartyData.VendorID,
                              "PartyType": key.PartyData.PartyType,
                              "Salutation": key.PartyData.Salutation,
                              "FirstName": key.PartyData.FirstName,
                              "MiddleNames": key.PartyData.MiddleNames,
                              "LastName": key.PartyData.LastName,
                              "GenderTypeCode": key.PartyData.GenderTypeCode,
                              "DateOfBirth": key.PartyData.DateOfBirth,
                              "Suffix": key.PartyData.Suffix,
                              "SortingName": key.PartyData.SortingName,
                              "MailingName": key.PartyData.MailingName,
                              "OfficialName": key.PartyData.OfficialName,
                              "LifeStageCode": key.PartyData.LifeStageCode,
                              "DisplayLifeStageCode": key.PartyData.DisplayLifeStageCode,
                              "RaceCode": key.PartyData.RaceCode,
                              "DisplayRaceCode": key.PartyData.DisplayRaceCode,
                              "EthnicityTypeCode": key.PartyData.EthnicityTypeCode,
                              "DisplayEthnicityTypeCode": key.PartyData.DisplayEthnicityTypeCode,
                              "ReligionName": key.PartyData.ReligionName,
                              "DisplayReligionName": key.PartyData.DisplayReligionName,
                              "EducationLevelCode": key.PartyData.EducationLevelCode,
                              "DisplayEducationLevelCode": key.PartyData.DisplayEducationLevelCode,
                              "EmploymentStatusCode": key.PartyData.EmploymentStatusCode,
                              "DisplayEmploymentStatusCode": key.PartyData.DisplayEmploymentStatusCode,
                              "OccupationTypeCode": key.PartyData.OccupationTypeCode,
                              "DisplayOccupationTypeCode": key.PartyData.DisplayOccupationTypeCode,
                              "AnnualIncomeRangeCode": key.PartyData.AnnualIncomeRangeCode,
                              "DisplayAnnualIncomeRangeCode": key.PartyData.DisplayAnnualIncomeRangeCode,
                              "PersonalityTypeCode": key.PartyData.PersonalityTypeCode,
                              "DisplayPersonalityTypeCode": key.PartyData.DisplayPersonalityTypeCode,
                              "LifestyleTypeCode": key.PartyData.LifestyleTypeCode,
                              "DisplayLifestyleTypeCode": key.PartyData.DisplayLifestyleTypeCode,
                              "PersonalValueTypeCode": key.PartyData.PersonalValueTypeCode,
                              "DisplayPersonalValueTypeCode": key.PartyData.DisplayPersonalValueTypeCode,
                              "ConsumerCreditScore": key.PartyData.ConsumerCreditScore,
                              "ConsumerCreditRatingServiceName": key.PartyData.ConsumerCreditRatingServiceName,
                              "DisabilityImpairmentTypeCode": key.PartyData.DisabilityImpairmentTypeCode,
                              "DisplayDisabilityImpairmentTypeCode": key.PartyData.DisplayDisabilityImpairmentTypeCode,
                              "MaritalStatusCode": key.PartyData.MaritalStatusCode,
                              "DisplayMaritalStatusCode": key.PartyData.DisplayMaritalStatusCode,
                              "DietaryHabitTypeCode": key.PartyData.DietaryHabitTypeCode,
                              "DisplayDietaryHabitTypeCode": key.PartyData.DisplayDietaryHabitTypeCode,
                              "ACTIVESTATUS": key.PartyData.ACTIVESTATUS

                            }
                          } else {
                            ManufacturerManageArr = {
                              "VendorID": key.PartyData.VendorID,
                              "PartyType": key.PartyData.PartyType,
                              "LegalName": key.PartyData.LegalName,
                              "TradeName": key.PartyData.TradeName,
                              "LegalStatusCode": key.PartyData.LegalStatusCode,
                              "DisplayLegalStatusCode": key.PartyData.DisplayLegalStatusCode,
                              "TaxExemptOrganizationTypeCode": "",
                              "DUNSNumber": key.PartyData.DUNSNumber,
                              "FiscalYearEndDate": key.PartyData.FiscalYearEndDate,
                              "LegalOrganizationTypeCode": key.PartyData.LegalOrganizationTypeCode,
                              "DisplayLegalOrganizationTypeCode": key.PartyData.DisplayLegalOrganizationTypeCode,
                              "GlobalBusinessSizeTypeCode": key.PartyData.GlobalBusinessSizeTypeCode,
                              "DisplayGlobalBusinessSizeTypeCode": key.PartyData.DisplayGlobalBusinessSizeTypeCode,
                              "ReligionName": key.PartyData.ReligionName,
                              "DisplayReligionName": key.PartyData.DisplayReligionName,
                              "BusinessActivityCode": key.PartyData.BusinessActivityCode,
                              "DisplayBusinessActivityCode": key.PartyData.DisplayBusinessActivityCode,
                              "ActualOrgDescription": key.PartyData.ActualOrgDescription,
                              "EmployeeCountLocal": key.PartyData.EmployeeCountLocal,
                              "EmployeeCountGlobal": key.PartyData.EmployeeCountGlobal,
                              "LocalAnnualRevenueAmount": key.PartyData.LocalAnnualRevenueAmount,
                              "GlobalAnnualRevenueAmount": key.PartyData.GlobalAnnualRevenueAmount,
                              "OpenForBusinessDate": key.PartyData.OpenForBusinessDate,
                              "ClosedForBusinessDate": key.PartyData.ClosedForBusinessDate,
                              "BankruptcyFlag": key.PartyData.BankruptcyFlag,
                              "BankruptcyDate": key.PartyData.BankruptcyDate,
                              "BankruptcyEmergenceDate": key.PartyData.BankruptcyEmergenceDate,
                              "BankruptcyTypeCode": key.PartyData.BankruptcyTypeCode,
                              "ACTIVESTATUS": key.PartyData.ACTIVESTATUS

                            }
                          }
                          if (key.ContactMethod.length > 0) {
                            var contactArr = key.ContactMethod;
                            contactArr.forEach(function (ckey, cval) {
                              var contactData = {
                                "ContactPurposeTypeCode": ckey.ContactPurposeTypeCode,
                                "ContactMethodTypeCode": ckey.ContactMethodTypeCode,
                                "AddressLine1": ckey.AddressLine1,
                                "AddressLine2": ckey.AddressLine2,
                                "AddressLine3": ckey.AddressLine3,
                                "AddressLine4": ckey.AddressLine4,
                                "email": ckey.email,
                                "phone": ckey.phone,
                                "language": ckey.language,
                                "country": ckey.country,
                                "country_code": ckey.country_code,
                                "state": ckey.state,
                                "city": ckey.city,
                                "zipcode": ckey.zipcode
                              }
                              ContactMethod.push(contactData);
                            });
                          }
                          dbLoader.ManufacturerListDB.insert({ "PartyData": ManufacturerManageArr, "ContactMethod": ContactMethod, "ManufacturerName": _manufacturerName }, function (err, cb) {
                            console.log('Manufacturer created successfully.');
                          });
                        }
                      });
                    }
                  }).catch(function (err) {
                    console.log(err);
                  });
                }
              });
            }).catch(function (err) {
              console.log(err);
            });
          });
        }
      });
    } else if (VendorType == 'Supplier') {
      dbLoader.SupplierListDB.find({ SavedWithLocal: "YES" }, function (err, data) {
        var responseCreate = {};
        if (data.length > 0) {
          data.forEach(function (key, val) {
            var VendorData = key.PartyData;
            var VendorType = "Supplier";
            var ContactMethod = key.ContactMethod;
            var ParamConfig = { "PartyData": VendorData, "ContactMethod": ContactMethod, "VendorType": VendorType, "PartyRole": "Vendor" };

            var POSTURL = appLoader.BASEURL + "organizations/";
            appLoader.CallDataFromServer("POST", POSTURL, ParamConfig).then(function (callback) {
              responseCreate = callback;
              console.log(responseCreate);
              dbLoader.SupplierListDB.remove({ SavedWithLocal: "YES" }, { multi: true }, function (err, cb) {
                if (cb > 0) {
                  var getURL = appLoader.BASEURL + "organizations/?partyrole=Vendor&vendortype=Supplier&q=" + key.SupplierName;
                  appLoader.CallDataFromServer("GET", getURL, {}).then(function (createresponse) {
                    DataDownloadFromServer = createresponse.result;
                    if (DataDownloadFromServer.length > 0) {
                      DataDownloadFromServer.forEach(function (key, val) {
                        if (key.PartyData.PartyType == "Organization") {
                          var _manufacturerName = key.PartyData.LegalName;
                        } else {
                          var _manufacturerName = key.PartyData.FirstName;
                        }
                        if (typeof (_manufacturerName) != 'undefined') {
                          var ContactMethod = [];
                          var ManufacturerManageArr = {};
                          if (key.PartyData.PartyType == "Person") {
                            ManufacturerManageArr = {
                              "VendorID": key.PartyData.VendorID,
                              "SupplierID": key.PartyData.SupplierID,
                              "PartyType": key.PartyData.PartyType,
                              "Salutation": key.PartyData.Salutation,
                              "FirstName": key.PartyData.FirstName,
                              "MiddleNames": key.PartyData.MiddleNames,
                              "LastName": key.PartyData.LastName,
                              "GenderTypeCode": key.PartyData.GenderTypeCode,
                              "DateOfBirth": key.PartyData.DateOfBirth,
                              "Suffix": key.PartyData.Suffix,
                              "SortingName": key.PartyData.SortingName,
                              "MailingName": key.PartyData.MailingName,
                              "OfficialName": key.PartyData.OfficialName,
                              "LifeStageCode": key.PartyData.LifeStageCode,
                              "DisplayLifeStageCode": key.PartyData.DisplayLifeStageCode,
                              "RaceCode": key.PartyData.RaceCode,
                              "DisplayRaceCode": key.PartyData.DisplayRaceCode,
                              "EthnicityTypeCode": key.PartyData.EthnicityTypeCode,
                              "DisplayEthnicityTypeCode": key.PartyData.DisplayEthnicityTypeCode,
                              "ReligionName": key.PartyData.ReligionName,
                              "DisplayReligionName": key.PartyData.DisplayReligionName,
                              "EducationLevelCode": key.PartyData.EducationLevelCode,
                              "DisplayEducationLevelCode": key.PartyData.DisplayEducationLevelCode,
                              "EmploymentStatusCode": key.PartyData.EmploymentStatusCode,
                              "DisplayEmploymentStatusCode": key.PartyData.DisplayEmploymentStatusCode,
                              "OccupationTypeCode": key.PartyData.OccupationTypeCode,
                              "DisplayOccupationTypeCode": key.PartyData.DisplayOccupationTypeCode,
                              "AnnualIncomeRangeCode": key.PartyData.AnnualIncomeRangeCode,
                              "DisplayAnnualIncomeRangeCode": key.PartyData.DisplayAnnualIncomeRangeCode,
                              "PersonalityTypeCode": key.PartyData.PersonalityTypeCode,
                              "DisplayPersonalityTypeCode": key.PartyData.DisplayPersonalityTypeCode,
                              "LifestyleTypeCode": key.PartyData.LifestyleTypeCode,
                              "DisplayLifestyleTypeCode": key.PartyData.DisplayLifestyleTypeCode,
                              "PersonalValueTypeCode": key.PartyData.PersonalValueTypeCode,
                              "DisplayPersonalValueTypeCode": key.PartyData.DisplayPersonalValueTypeCode,
                              "ConsumerCreditScore": key.PartyData.ConsumerCreditScore,
                              "ConsumerCreditRatingServiceName": key.PartyData.ConsumerCreditRatingServiceName,
                              "DisabilityImpairmentTypeCode": key.PartyData.DisabilityImpairmentTypeCode,
                              "DisplayDisabilityImpairmentTypeCode": key.PartyData.DisplayDisabilityImpairmentTypeCode,
                              "MaritalStatusCode": key.PartyData.MaritalStatusCode,
                              "DisplayMaritalStatusCode": key.PartyData.DisplayMaritalStatusCode,
                              "DietaryHabitTypeCode": key.PartyData.DietaryHabitTypeCode,
                              "DisplayDietaryHabitTypeCode": key.PartyData.DisplayDietaryHabitTypeCode,
                              "ACTIVESTATUS": key.PartyData.ACTIVESTATUS

                            }
                          } else {
                            ManufacturerManageArr = {
                              "VendorID": key.PartyData.VendorID,
                              "SupplierID": key.PartyData.SupplierID,
                              "PartyType": key.PartyData.PartyType,
                              "LegalName": key.PartyData.LegalName,
                              "TradeName": key.PartyData.TradeName,
                              "LegalStatusCode": key.PartyData.LegalStatusCode,
                              "DisplayLegalStatusCode": key.PartyData.DisplayLegalStatusCode,
                              "TaxExemptOrganizationTypeCode": "",
                              "DUNSNumber": key.PartyData.DUNSNumber,
                              "FiscalYearEndDate": key.PartyData.FiscalYearEndDate,
                              "LegalOrganizationTypeCode": key.PartyData.LegalOrganizationTypeCode,
                              "DisplayLegalOrganizationTypeCode": key.PartyData.DisplayLegalOrganizationTypeCode,
                              "GlobalBusinessSizeTypeCode": key.PartyData.GlobalBusinessSizeTypeCode,
                              "DisplayGlobalBusinessSizeTypeCode": key.PartyData.DisplayGlobalBusinessSizeTypeCode,
                              "ReligionName": key.PartyData.ReligionName,
                              "DisplayReligionName": key.PartyData.DisplayReligionName,
                              "BusinessActivityCode": key.PartyData.BusinessActivityCode,
                              "DisplayBusinessActivityCode": key.PartyData.DisplayBusinessActivityCode,
                              "ActualOrgDescription": key.PartyData.ActualOrgDescription,
                              "EmployeeCountLocal": key.PartyData.EmployeeCountLocal,
                              "EmployeeCountGlobal": key.PartyData.EmployeeCountGlobal,
                              "LocalAnnualRevenueAmount": key.PartyData.LocalAnnualRevenueAmount,
                              "GlobalAnnualRevenueAmount": key.PartyData.GlobalAnnualRevenueAmount,
                              "OpenForBusinessDate": key.PartyData.OpenForBusinessDate,
                              "ClosedForBusinessDate": key.PartyData.ClosedForBusinessDate,
                              "BankruptcyFlag": key.PartyData.BankruptcyFlag,
                              "BankruptcyDate": key.PartyData.BankruptcyDate,
                              "BankruptcyEmergenceDate": key.PartyData.BankruptcyEmergenceDate,
                              "BankruptcyTypeCode": key.PartyData.BankruptcyTypeCode,
                              "ACTIVESTATUS": key.PartyData.ACTIVESTATUS

                            }
                          }
                          if (key.ContactMethod.length > 0) {
                            var contactArr = key.ContactMethod;
                            contactArr.forEach(function (ckey, cval) {
                              var contactData = {
                                "ContactPurposeTypeCode": ckey.ContactPurposeTypeCode,
                                "ContactMethodTypeCode": ckey.ContactMethodTypeCode,
                                "AddressLine1": ckey.AddressLine1,
                                "AddressLine2": ckey.AddressLine2,
                                "AddressLine3": ckey.AddressLine3,
                                "AddressLine4": ckey.AddressLine4,
                                "email": ckey.email,
                                "phone": ckey.phone,
                                "language": ckey.language,
                                "country": ckey.country,
                                "country_code": ckey.country_code,
                                "state": ckey.state,
                                "city": ckey.city,
                                "zipcode": ckey.zipcode
                              }
                              ContactMethod.push(contactData);
                            });
                          }
                          dbLoader.SupplierListDB.insert({ "PartyData": ManufacturerManageArr, "ContactMethod": ContactMethod, "SupplierName": _manufacturerName }, function (err, cb) {
                            console.log('Supplier created successfully.');
                          });

                        }

                      });

                    }

                  }).catch(function (err) {
                    console.log(err);
                  });
                }
              });

            }).catch(function (err) {
              console.log(err);
            });
          });
        }
      });
    } else if (VendorType == 'ServiceProvider') {
      dbLoader.ServiceproviderListDB.find({ SavedWithLocal: "YES" }, function (err, data) {
        var responseCreate = {};
        if (data.length > 0) {
          data.forEach(function (key, val) {
            var VendorData = key.PartyData;
            var VendorType = "ServiceProvider";
            var ContactMethod = key.ContactMethod;
            var ParamConfig = { "PartyData": VendorData, "ContactMethod": ContactMethod, "VendorType": VendorType, "PartyRole": "Vendor" };
            var PostURL = appLoader.BASEURL + "organizations/";
            appLoader.CallDataFromServer("POST", PostURL, ParamConfig).then(function (response) {
              responseCreate = response;
              console.log(responseCreate);
              dbLoader.ServiceproviderListDB.remove({ SavedWithLocal: "YES" }, { multi: true }, function (err, cb) {
                if (cb > 0) {
                  var getURL = appLoader.BASEURL + "organizations/?partyrole=Vendor&vendortype=ServiceProvider&q=" + key.ServiceProviderName;
                  appLoader.CallDataFromServer("GET", getURL, {}).then(function (createresponse) {
                    DataDownloadFromServer = createresponse.result;
                    if (DataDownloadFromServer.length > 0) {
                      DataDownloadFromServer.forEach(function (key, val) {
                        if (key.PartyData.PartyType == "Organization") {
                          var _manufacturerName = key.PartyData.LegalName;
                        } else {
                          var _manufacturerName = key.PartyData.FirstName;
                        }
                        if (typeof (_manufacturerName) != 'undefined') {
                          var ContactMethod = [];
                          var ManufacturerManageArr = {};
                          if (key.PartyData.PartyType == "Person") {
                            ManufacturerManageArr = {
                              "VendorID": key.PartyData.VendorID,
                              "PartyType": key.PartyData.PartyType,
                              "Salutation": key.PartyData.Salutation,
                              "FirstName": key.PartyData.FirstName,
                              "MiddleNames": key.PartyData.MiddleNames,
                              "LastName": key.PartyData.LastName,
                              "GenderTypeCode": key.PartyData.GenderTypeCode,
                              "DateOfBirth": key.PartyData.DateOfBirth,
                              "Suffix": key.PartyData.Suffix,
                              "SortingName": key.PartyData.SortingName,
                              "MailingName": key.PartyData.MailingName,
                              "OfficialName": key.PartyData.OfficialName,
                              "LifeStageCode": key.PartyData.LifeStageCode,
                              "DisplayLifeStageCode": key.PartyData.DisplayLifeStageCode,
                              "RaceCode": key.PartyData.RaceCode,
                              "DisplayRaceCode": key.PartyData.DisplayRaceCode,
                              "EthnicityTypeCode": key.PartyData.EthnicityTypeCode,
                              "DisplayEthnicityTypeCode": key.PartyData.DisplayEthnicityTypeCode,
                              "ReligionName": key.PartyData.ReligionName,
                              "DisplayReligionName": key.PartyData.DisplayReligionName,
                              "EducationLevelCode": key.PartyData.EducationLevelCode,
                              "DisplayEducationLevelCode": key.PartyData.DisplayEducationLevelCode,
                              "EmploymentStatusCode": key.PartyData.EmploymentStatusCode,
                              "DisplayEmploymentStatusCode": key.PartyData.DisplayEmploymentStatusCode,
                              "OccupationTypeCode": key.PartyData.OccupationTypeCode,
                              "DisplayOccupationTypeCode": key.PartyData.DisplayOccupationTypeCode,
                              "AnnualIncomeRangeCode": key.PartyData.AnnualIncomeRangeCode,
                              "DisplayAnnualIncomeRangeCode": key.PartyData.DisplayAnnualIncomeRangeCode,
                              "PersonalityTypeCode": key.PartyData.PersonalityTypeCode,
                              "DisplayPersonalityTypeCode": key.PartyData.DisplayPersonalityTypeCode,
                              "LifestyleTypeCode": key.PartyData.LifestyleTypeCode,
                              "DisplayLifestyleTypeCode": key.PartyData.DisplayLifestyleTypeCode,
                              "PersonalValueTypeCode": key.PartyData.PersonalValueTypeCode,
                              "DisplayPersonalValueTypeCode": key.PartyData.DisplayPersonalValueTypeCode,
                              "ConsumerCreditScore": key.PartyData.ConsumerCreditScore,
                              "ConsumerCreditRatingServiceName": key.PartyData.ConsumerCreditRatingServiceName,
                              "DisabilityImpairmentTypeCode": key.PartyData.DisabilityImpairmentTypeCode,
                              "DisplayDisabilityImpairmentTypeCode": key.PartyData.DisplayDisabilityImpairmentTypeCode,
                              "MaritalStatusCode": key.PartyData.MaritalStatusCode,
                              "DisplayMaritalStatusCode": key.PartyData.DisplayMaritalStatusCode,
                              "DietaryHabitTypeCode": key.PartyData.DietaryHabitTypeCode,
                              "DisplayDietaryHabitTypeCode": key.PartyData.DisplayDietaryHabitTypeCode,
                              "ACTIVESTATUS": key.PartyData.ACTIVESTATUS

                            }
                          } else {
                            ManufacturerManageArr = {
                              "VendorID": key.PartyData.VendorID,
                              "PartyType": key.PartyData.PartyType,
                              "LegalName": key.PartyData.LegalName,
                              "TradeName": key.PartyData.TradeName,
                              "LegalStatusCode": key.PartyData.LegalStatusCode,
                              "DisplayLegalStatusCode": key.PartyData.DisplayLegalStatusCode,
                              "TaxExemptOrganizationTypeCode": "",
                              "DUNSNumber": key.PartyData.DUNSNumber,
                              "FiscalYearEndDate": key.PartyData.FiscalYearEndDate,
                              "LegalOrganizationTypeCode": key.PartyData.LegalOrganizationTypeCode,
                              "DisplayLegalOrganizationTypeCode": key.PartyData.DisplayLegalOrganizationTypeCode,
                              "GlobalBusinessSizeTypeCode": key.PartyData.GlobalBusinessSizeTypeCode,
                              "DisplayGlobalBusinessSizeTypeCode": key.PartyData.DisplayGlobalBusinessSizeTypeCode,
                              "ReligionName": key.PartyData.ReligionName,
                              "DisplayReligionName": key.PartyData.DisplayReligionName,
                              "BusinessActivityCode": key.PartyData.BusinessActivityCode,
                              "DisplayBusinessActivityCode": key.PartyData.DisplayBusinessActivityCode,
                              "ActualOrgDescription": key.PartyData.ActualOrgDescription,
                              "EmployeeCountLocal": key.PartyData.EmployeeCountLocal,
                              "EmployeeCountGlobal": key.PartyData.EmployeeCountGlobal,
                              "LocalAnnualRevenueAmount": key.PartyData.LocalAnnualRevenueAmount,
                              "GlobalAnnualRevenueAmount": key.PartyData.GlobalAnnualRevenueAmount,
                              "OpenForBusinessDate": key.PartyData.OpenForBusinessDate,
                              "ClosedForBusinessDate": key.PartyData.ClosedForBusinessDate,
                              "BankruptcyFlag": key.PartyData.BankruptcyFlag,
                              "BankruptcyDate": key.PartyData.BankruptcyDate,
                              "BankruptcyEmergenceDate": key.PartyData.BankruptcyEmergenceDate,
                              "BankruptcyTypeCode": key.PartyData.BankruptcyTypeCode,
                              "ACTIVESTATUS": key.PartyData.ACTIVESTATUS

                            }
                          }
                          if (key.ContactMethod.length > 0) {
                            var contactArr = key.ContactMethod;
                            contactArr.forEach(function (ckey, cval) {
                              var contactData = {
                                "ContactPurposeTypeCode": ckey.ContactPurposeTypeCode,
                                "ContactMethodTypeCode": ckey.ContactMethodTypeCode,
                                "AddressLine1": ckey.AddressLine1,
                                "AddressLine2": ckey.AddressLine2,
                                "AddressLine3": ckey.AddressLine3,
                                "AddressLine4": ckey.AddressLine4,
                                "email": ckey.email,
                                "phone": ckey.phone,
                                "language": ckey.language,
                                "country": ckey.country,
                                "country_code": ckey.country_code,
                                "state": ckey.state,
                                "city": ckey.city,
                                "zipcode": ckey.zipcode
                              }
                              ContactMethod.push(contactData);
                            });
                          }
                          dbLoader.ServiceproviderListDB.insert({ "PartyData": ManufacturerManageArr, "ContactMethod": ContactMethod, "ServiceProviderName": _manufacturerName }, function (err, cb) {
                            console.log('ServiceProvider created successfully.');
                          });

                        }

                      });

                    }

                  }).catch(function (err) {
                    console.log(err);
                  });
                }
              });

            }).catch(function (err) {
              console.log(err);
            });
          });
        }
      });
    }

  } else if (APIMethod == 'Update') {
    if (VendorType == 'Manufacturer') {

        dbLoader.ManufacturerUpdateDB.find({}, function (err, data) {
          var responseCreate = {};
          var ManufacturerUpdateArray = [];
          if (data.length > 0) {
            data.forEach(function (key, val) {
              var VendorData = key.PartyData;
              var VendorType = "Manufacturer";
              var ContactMethod = key.ContactMethod;
              var ParamConfig = { "PartyData": VendorData, "ContactMethod": ContactMethod, "VendorType": VendorType, "PartyRole": "Vendor" };
              ManufacturerUpdateArray.push(ParamConfig);
            });
            var PutURL = appLoader.BASEURL + "organizations/";
            appLoader.CallDataFromServer("PUT", PutURL, ManufacturerUpdateArray).then(function (response) {
              responseCreate = response;
              console.log(responseCreate);
              dbLoader.ManufacturerUpdateDB.remove({}, { multi: true }, function (err, cb) {
                // Delete All Records From Local Database.
                console.log(cb + " Deleted.");
              });

            }).catch(function (err) {
              console.log(err);
            });
          }
        });
    } else if (VendorType == 'Supplier') {
        dbLoader.SupplierUpdateDB.find({}, function (err, data) {
          var responseCreate = {};
          var ManufacturerUpdateArray = [];
          if (data.length > 0) {
            data.forEach(function (key, val) {
              var VendorData = key.PartyData;
              var VendorType = "Supplier";
              var ContactMethod = key.ContactMethod;
              var ParamConfig = { "PartyData": VendorData, "ContactMethod": ContactMethod, "VendorType": VendorType, "PartyRole": "Vendor" };
              ManufacturerUpdateArray.push(ParamConfig);
            });
            var PUTURL = appLoader.BASEURL + "organizations/";
            appLoader.CallDataFromServer("PUT", PUTURL, ManufacturerUpdateArray).then(function (response) {
              responseCreate = response;
              console.log(responseCreate);
              dbLoader.SupplierUpdateDB.remove({}, { multi: true }, function (err, cb) {
                // Delete All Records From Local Database.
                console.log(cb + " Deleted.");
              });
            }).catch(function (err) {
              console.log(err);
            });
          }
        });
    } else if (VendorType == 'ServiceProvider') {
        dbLoader.ServiceproviderUpdateDB.find({}, function (err, data) {
          var responseCreate = {};
          var ManufacturerUpdateArray = [];
          if (data.length > 0) {
            data.forEach(function (key, val) {
              var VendorData = key.PartyData;
              var VendorType = "ServiceProvider";
              var ContactMethod = key.ContactMethod;
              var ParamConfig = { "PartyData": VendorData, "ContactMethod": ContactMethod, "VendorType": VendorType, "PartyRole": "Vendor" };
              ManufacturerUpdateArray.push(ParamConfig);
            });
            var putURL = appLoader.BASEURL + "organizations/";
            appLoader.CallDataFromServer("PUT", putURL, ManufacturerUpdateArray).then(function (response) {
              responseCreate = response;
              console.log(responseCreate);
              dbLoader.ServiceproviderUpdateDB.remove({}, { multi: true }, function (err, cb) {
                // Delete All Records From Local Database.
                console.log(cb + " Deleted.");
              });
            }).catch(function (err) {
              console.log(err);
            });
          }
        });
    }
  } else if (APIMethod == 'Delete') {
    if (VendorType == 'Manufacturer') {
        dbLoader.ManufacturerDeleteDB.find({}, function (err, data) {
          var responseCreate = {};
          var ManufacturerDeleteArray = [];
          if (data.length > 0) {
            data.forEach(function (key, val) {
              ManufacturerDeleteArray.push(key);
            });
            var DeleteURL = appLoader.BASEURL + "organizations/";
            appLoader.CallDataFromServer("DELETE", DeleteURL, ManufacturerDeleteArray).then(function (response) {
              responseCreate = response;
              console.log(responseCreate);
              dbLoader.ManufacturerDeleteDB.remove({}, { multi: true }, function (err, cb) {
                // Delete All Records From Local Database.
                console.log(cb + " Deleted.");
              });

            }).catch(function (err) {
              console.log(err);
            });
          }
        });
    } else if (VendorType == 'Supplier') {
        dbLoader.SupplierDeleteDB.find({}, function (err, data) {
          var responseCreate = {};
          var ManufacturerDeleteArray = [];
          if (data.length > 0) {
            data.forEach(function (key, val) {
              ManufacturerDeleteArray.push(key);
            });
            var DELETEURL = appLoader.BASEURL + "organizations/";
            appLoader.CallDataFromServer("DELETE", DELETEURL, ManufacturerDeleteArray).then(function (response) {
              responseCreate = response;
              console.log(responseCreate);
              dbLoader.SupplierDeleteDB.remove({}, { multi: true }, function (err, cb) {
                // Delete All Records From Local Database.
                console.log(cb + " Deleted.");
              });
            }).catch(function (err) {
              console.log(err);
            });
          }
        });
    } else if (VendorType == 'ServiceProvider') {
        dbLoader.ServiceproviderDeleteDB.find({}, function (err, data) {
          var responseCreate = {};
          var ManufacturerDeleteArray = [];
          if (data.length > 0) {
            data.forEach(function (key, val) {
              ManufacturerDeleteArray.push(key);
            });
            var DELETEURL = appLoader.BASEURL + "organizations/";
            appLoader.CallDataFromServer("DELETE", DELETEURL, ManufacturerDeleteArray).then(function (response) {
              responseCreate = response;
              console.log(responseCreate);
              dbLoader.ServiceproviderDeleteDB.remove({}, { multi: true }, function (err, cb) {
                // Delete All Records From Local Database.
                console.log(cb + " Deleted.");
              });
            }).catch(function (err) {
              console.log(err);
            });
          }
        });
    }
  } else if (APIMethod == 'Status') {
      dbLoader.VendorStatusDB.find({}, function (err, data) {
        var responseCreate = {};
        var VendorStatusUpdateArray = [];
        if (data.length > 0) {
          data.forEach(function (key, val) {
            VendorStatusUpdateArray.push(key);
          });
          var PutURL = appLoader.BASEURL + "organizations/";
          appLoader.CallDataFromServer("PUT", PutURL, VendorStatusUpdateArray).then(function (callback) {
            responseCreate = callback;
            //console.log(responseCreate);
            dbLoader.VendorStatusDB.remove({}, { multi: true }, function (err, cb) {
              // Delete All Records From Local Database.
              console.log(cb + " Deleted.");
            });

          }).catch(function (err) {
            console.log(err);
          });
        }
      });
  }

}