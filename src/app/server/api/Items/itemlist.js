var dbLoader = require('./itemdbLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var fs = require('fs');
var mime = require('mime');
var LIMIT = 25;
var OFFSET = 1;
var SEARCHPARAM = '';
var requestParam = {};
var RecordsCount = 0;
var NewlyInsertedRecords = [];
var DataList = [];


module.exports = app;

app.get("/", function (req, res) {
  dbLoader.ItemDB.loadDatabase();
  requestParam = req;
  var response = {};
  dbLoader.ItemDB.find({ SavedWithLocal: "YES" }, function (err, Docs) {
    NewlyInsertedRecords = Docs;
  });
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
    //console.log(OFFSET, ' requestParam-query ', LIMIT);
  }

  if (typeof (requestParam.query) != 'undefined' && requestParam.query != null) {
    if (typeof (requestParam.query.q) != 'undefined' && requestParam.query.q != null) {
      SEARCHPARAM = requestParam.query.q;
    }
  }
  //console.log(SEARCHPARAM);
  if (SEARCHPARAM != '') {
    var REGEX = new RegExp(SEARCHPARAM, "i");
    //console.log(REGEX);
    var response = {};
    dbLoader.ItemDB.find({ Description: { $regex: REGEX } }).limit(10).exec(function (err, data) {
      //console.log(data);
      if (data != 'undefined') {
        if (data.length > 0) {
          DataList = [];
          DataList = data;
          SEARCHPARAM = '';
        }
        if (DataList.length > 0) {
          response = { 'status': 1, 'message': 'Items Record.', 'result': DataList, 'RecordsCount': RecordsCount };
          res.send(response);
        } else {
          response = { 'status': 0, 'message': 'Items Record.', 'result': [], 'RecordsCount': 0 };
          res.send(response);
        }
      }
    });
  } else {
    dbLoader.ItemDB.find({}).sort({ id: -1 }).skip(parseInt((OFFSET - 1) * LIMIT)).limit(parseInt(LIMIT)).exec(function (err, data) {

      var response = {};
      if (data.length > 0) {
        dbLoader.ItemDB.count({}).exec(function (err, TotalRecords) {
          RecordsCount = TotalRecords;
        });
        DataList = [];
        DataList = data;

        // if (NewlyInsertedRecords.length > 0) {
        //   //console.log(NewlyInsertedRecords);
        //   DataList = NewlyInsertedRecords.concat(data);
        // } else {
        //   DataList = data;
        // }
        if (DataList.length > 0) {
          response = { 'status': 1, 'message': 'Items Record.', 'result': DataList, 'RecordsCount': RecordsCount };
          res.send(response);
        } else {
          response = { 'status': 0, 'message': 'Items Record.', 'result': [], 'RecordsCount': 0 };
          res.send(response);
        }
      }
    });

  }

});

// Create Items
app.post("/", function (req, res) {
  var response = {};
  var ItemCreateManage = {};
  var newItem = req.body;
  var SavenItemID = 0;
  var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');


  if (newItem.upc.length > 0) {
    ItemCreateManage = {
      "SavedWithLocal": "YES",
      "business_group":BusinessGroupID,
      "ItemSellingRule": newItem.selling_rule_id,
      "AuthorizedForSaleFlag": 0,
      "DiscountFlag": 0,
      "PriceAuditFlag": 0,
      "TaxExemptCode": 0,
      "UsageCode": 0,
      "ItemName": newItem.description,
      "Description": newItem.description,
      "LongDescription": "",
      "TypeCode": "",
      "KitSetCode": "",
      "SubstituteIdentifiedFlag": "",
      "OrderCollectionCode": "",
      "SerializedIUnitValidationFlag": "",
      "ABV": "",
      "isblocked": "n",
      "retail_package_size": newItem.retail_package_size,
      "MerchandiseHierarchyGroup": newItem.MerchandiseHierarchyGroup,
      "ItemSellingPrices": {
        "id": null,
        "PermanentSaleUnitRetailPriceAmount": null,
        "PermanentSaleUnitRetailPriceOriginalMarkdownFlag": 0,
        "PermanentRetailPricePermanentMarkdownCount": null,
        "PermanentRetailPriceEffectiveDate": null,
        "CurrentSaleUnitRetailPriceAmount": newItem.CurrentSaleUnitReturnPrice,
        "CurrentSaleUnitRetailPriceTypeCode": null,
        "CurrentSaleUnitRetailPricePointAllowedFlag": 0,
        "CurrentSaleUnitRetailPriceEffectiveDate": newItem.begin_date,
        "CurrentSaleUnitRetailPriceExpirationDate": newItem.end_date,
        "ManufacturerSaleUnitRecommendedRetailPriceAmount": newItem.msrp,
        "ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate": newItem.msrp_date,
        "CompareAtSaleUnitRetailPriceAmount": newItem.compare_at_sale_unit_price,
        "QuantityPricingFlag": 0,
        "CurrentPackagePriceQuantity": "1",
        "CurrentPackagePrice": newItem.price,
        "PermanentPackagePriceQuantity": null,
        "PermanentPackagePrice": null,
        "PermanentSaleUnitReturnPrice": null,
        "CurrentSaleUnitReturnPrice": newItem.CurrentSaleUnitReturnPrice,
        "IncludesSalesTaxFlag": 0,
        "PermanentSalesTaxAmount": null,
        "CurrentSalesTaxAmount": null,
        "MinimumAdvertisedRetailUnitPrice": newItem.MinimumAdvertisedRetailUnitPrice,
        "MinimumAdvertisedRetailUnitPriceEffectiveDate": newItem.MinimumAdvertisedRetailUnitPriceEffectiveDate,
        "margin": newItem.margin,
        "profit": newItem.profit,
        "cost": newItem.cost,
        "selling_price_type": newItem.selling_price_type,
        "markup": newItem.markup
      },
      "POSDepartment": { 'POSDepartmentName': newItem.pos_department_name },
      "PriceLine": "",
      "BrandName": { 'BrandName': newItem.brand_name },
      "Parent": "",
      "SubBrand": "",
      "is_expand": "n",
      "upc_a": newItem.upc,
      "size": newItem.size,
      "supplier": null,
      "merchandise9_shelflocation": "",
      "merchandise12_cateogy": "",
      "merchandise14_age": "",
      "merchandise15_cigarettepricetiers": "",
      "merchandise17_departments": "",
      "merchandise16_groups": "",
      "merchandise18_categories": "",
      "merchandise10_location": "",
      "merchandise13_gender": "",
      "current_price": newItem.current_price,
      "current_cost": newItem.current_cost,
      "qty_on_hand": "",
      "qty_in_case": "",
      "margin": newItem.margin,
      "isExpandable": true
    };

    dbLoader.ItemDB.findOne({ upc_a: newItem.upc[0] }, function (err, dataExist) {
      if (typeof dataExist != 'undefined' && dataExist != null) {
        response = { 'status': 0, 'message': 'Sorry, Duplicate UPC. Pls, try again.' };
        res.send(response);
      } else {
        dbLoader.ItemDB.insert(ItemCreateManage, function (err, dataCreate) {
          //console.log(dataCreate);
          if (req.body.uploadedImage.length > 0) {
            var IMAGEARRAY = req.body.uploadedImage;
            var imgresponse = {};
            var dir = process.cwd() + '/src/app/server/api/Items/item-images/' + dataCreate._id + '/';

            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            var i = 0;
            IMAGEARRAY.forEach(function (key, val) {
              i++;
              var matches = key.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              if (matches.length !== 3) {
                return new Error('Invalid input string');
              }
              imgresponse.type = matches[1];
              imgresponse.data = new Buffer.from(matches[2], 'base64');
              var decodedImg = imgresponse;
              var imageBuffer = decodedImg.data;
              var type = decodedImg.type;
              var extension = mime.getExtension(type);
              var fileName = "image_" + i + "." + extension;
              try {
                fs.writeFileSync(dir + fileName, imageBuffer, 'utf8');
                dbLoader.ImagesDB.insert({ 'filename': fileName, 'Item': dataCreate._id }, function (err, ItemSaved) { });
              } catch (e) {
                console.log(e);
              }
            });
          }
          response = { 'status': 1, 'message': 'Item Created Successfully.', 'item_id': dataCreate._id };
          res.send(response);
        });
      }
    });
  } else {
    response = { 'status': 0, 'message': 'Please enter UPC.' };
    res.send(response);
  }




});


app.delete("/", function (req, res) {
  var response = {};

  var DeleteBody = req.body;
  var IDS = DeleteBody.ids;
  var errCount = 0;
  var Value = DeleteBody.value;
  var Type = DeleteBody.type;
  var message = '';

  IDS.forEach(function (key, val) {
    dbLoader.ItemDB.findOne({ _id: key }, function (err, data) {
      //console.log(key,data);
      if (data != null) {
        if ('id' in data) {
          if (Type == "delete") {
            var ParamConfig = {
              "id": data.id,
              "value": Value,
              "type": Type
            };
            dbLoader.ItemDB.remove({ _id: key }, { multi: true }, function (err, cb) {
              if (err) {
                errCount += 1;
              } else {
                //DeleteToServer();
                dbLoader.ItemDeleteDB.insert(ParamConfig, function (err) { });
                console.log('Item deleted successfully.');
                message = 'Item deleted successfully.';
              }
            });
          } else {
            var ParamConfig = {
              "id": data.id,
              "value": Value,
              "type": Type
            };
            data.isblocked = "y";
            dbLoader.ItemDB.update({ _id: key }, { $set: data }, function (err, cb) {
              if (err) {
                errCount += 1;
              } else {
                //DeleteToServer();
                dbLoader.ItemDeleteDB.insert(ParamConfig, function (err) { });
                console.log('Item status updated successfully.');
                message = 'Item status updated successfully.';

              }
            });
          }
          DeleteToServer();
        } else {
          if (Type == "delete") {
            dbLoader.ItemDB.remove({ _id: key }, { multi: true }, function (err, cb) {
              if (err) {
                errCount += 1;
              } else {
                console.log('Item deleted successfully.');
                message = 'Item deleted successfully.';
              }
            });
          } else {
            data.isblocked = "y";
            dbLoader.ItemDB.update({ _id: key }, { $set: data }, function (err, cb) {
              if (err) {
                errCount += 1;
              } else {
                console.log('Item status updated successfully.');
                message = 'Item status updated successfully.';
              }
            });
          }
        }
      }
    });
  });

  if (errCount == 0) {
    response = { 'status': 1, 'message': message };
  } else {
    response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
  }
  res.setHeader('content-type', 'text/javascript');
  res.json(response);
});




function DeleteToServer() {

  dbLoader.ItemDeleteDB.find({}, function (err, data) {
    var ParamConfig = {};
    var delete_ids = [];
    if (data.length > 0) {
      data.forEach(function (key, val) {
        delete_ids.push(key.id);
      });
      if (delete_ids.length > 0) {
        ParamConfig = {
          "ids": delete_ids,
          "value": data[0].value,
          "type": data[0].type
        };
        var ItemDeleteUrl = appLoader.BASEURL + "items/";
        appLoader.CallDataFromServer("DELETE", ItemDeleteUrl, ParamConfig).then(function (response) {

          dbLoader.ItemDeleteDB.remove({}, function (err, data) { });
          console.log('Item updated successfully.');

        }).catch(function (err) {
          console.err(err);
        });
      }

    }
  });

}
