		//Insert Record InTO Local Database.
/*		this._dataBaseService.thisDb().brands().insert({}, function (err, cb) {
			console.log(cb);
		});*/

		//Fetch Record From Local Database.
		this._dataBaseService.thisDb().brands().find({}, function (err, cb) {
			console.log(cb);
/*			let message = "";
			for (let i = 0; i < cb.length; i++) {
				message += cb[i].BrandName + " - _id: " + cb[i]._id + "\n";
			}
			console.log(message);*/
		});

		//Delete Record From Local Database.
		this._dataBaseService.thisDb().brands().remove({},{ multi: true }, function (err, cb) {
		// Delete All Records From Local Database.
		//this._dataBaseService.thisDb().brands().remove({},{ multi: true }, function (err, cb) {
			console.log(cb+" Deleted.");

		});