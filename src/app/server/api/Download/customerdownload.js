var app = require("express")();
var DataDownloadFromServer = [];
var appLoader = require('../../app.js');
var DownloadeddbLoader = require('../Download/downloadedDBLoader.js');

module.exports = app;

app.get("/", function (req, res) {

    var ipinfo = localStorage.getItem('identifier');
    var noderesponse = {};
    var errCount = 0;

    // Customer data loading...
    var CustomerdbLoader = require('../Customers/customerDBLoader.js');
    CustomerdbLoader.CustomerDB.loadDatabase();
    var getURL = appLoader.BASEURL+"organizations/?partyrole=Consumer&vendortype=Customer&limit=0&IPADDRESS="+ ipinfo;
    console.log(getURL);
    appLoader.CallDataFromServer("GET", getURL, {}).then(function (response) {
        DataDownloadFromServer = response.result;
        if (DataDownloadFromServer.length > 0) {
            noderesponse = { 'status': 1, 'message': 'Data Downloading....','DataCount': DataDownloadFromServer.length};
            res.send(noderesponse);
            var promise1 = new Promise(function (resolve, reject) {
            var tempCount = 0;
            var TotolCount=response.RecordsCount;

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
                                "ConsumerID": key.PartyData.ConsumerID,
                                "CustomerID": key.PartyData.CustomerID,
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
                                "ConsumerID": key.PartyData.ConsumerID,
                                "CustomerID": key.PartyData.CustomerID,
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
                        if(key.PartyData.ConsumerID!='' && key.PartyData.ConsumerID!='undefined'){
                            CustomerdbLoader.CustomerDB.find({ConsumerID:key.PartyData.ConsumerID}, function (err, docs) {
                                if (docs.length === 0) {
                                    CustomerdbLoader.CustomerDB.insert({ "PartyData": ManufacturerManageArr, "ContactMethod": ContactMethod, "CustomerName": _manufacturerName }, function (err) { });
                                    tempCount++;
                                } else {
                                    CustomerdbLoader.CustomerDB.update({_id: docs[0]._id},{ $set:{"PartyData":ManufacturerManageArr,"ContactMethod":ContactMethod,"CustomerName": _manufacturerName}}, function (err) {
                                        if(err){
                                            errCount += 1;
                                        }else{
                                            console.log('Updated.');
                                            tempCount++;
                                        }
                                    });
                                }
                                if (TotolCount == tempCount) {
                                    resolve(TotolCount);
                                    DownloadeddbLoader.DownloadedDB.insert({'ModuleName':'Customers','Total':TotolCount,'Downloaded':tempCount});
    
                                }
                            });
                        }
                    }
                });
            });    
            promise1.then(function (TotolCount) {
                console.log(TotolCount, ' Inserted.');
            });
        }else{
            DownloadeddbLoader.DownloadedDB.insert({'ModuleName':'Customers','Total':0,'Downloaded':0});
            noderesponse = { 'status': 1, 'message': 'Data Downloading....','DataCount': 0};
            res.send(noderesponse);
        }
    }).catch(function (err) {
        console.log(err);
    });
    
});