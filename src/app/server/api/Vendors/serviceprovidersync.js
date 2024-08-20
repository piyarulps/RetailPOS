var app = require("express")();
var dbLoader = require('./vendordbloader.js');
var ipinfo = localStorage.getItem('identifier');
var DataDownloadFromServer = [];
var appLoader = require('../../app.js');

module.exports = app;
app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    var response = {};
    var errCount = 0;

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


    var FirstTimeDownloadURL = appLoader.BASEURL + "organizations/?partyrole=Vendor&vendortype=ServiceProvider&limit=0&IPADDRESS=" + ipinfo;
    appLoader.CallDataFromServer("GET", FirstTimeDownloadURL, {}).then(function (response) {
        DataDownloadFromServer = response.result;
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

                    dbLoader.ServiceproviderListDB.find({ 'PartyData.VendorID': key.PartyData.VendorID }, function (err, docs) {
                        if (docs.length === 0) {
                            //console.log('INSERT DOC');
                            dbLoader.ServiceproviderListDB.insert({ "PartyData": ManufacturerManageArr, "ContactMethod": ContactMethod, "ServiceProviderName": _manufacturerName }, function (err) { });
                        } else {
                            dbLoader.ServiceproviderListDB.update({ _id: docs[0]._id }, { $set: { "PartyData": ManufacturerManageArr, "ContactMethod": ContactMethod, "ServiceProviderName": _manufacturerName } }, function (err) {
                                if (err) {
                                    errCount += 1;
                                } else {
                                    console.log('Updated.');
                                }
                            });
                        }
                    });
                }
            });

        }

    }).catch(function (err) {
        console.log(err);
    });


    if (errCount == 0) {
        response = { 'status': 1, 'message': 'Service provider sync successfully.' };
    } else {
        response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
    }
    res.setHeader('content-type', 'text/javascript');
    res.json(response);




});
