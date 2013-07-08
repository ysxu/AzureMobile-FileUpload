/*
 *	Azure Mobile Services - Recipe - Blob Storage Picture Upload
 */

// scripty & file manipulation & system
var scripty = require('azure-scripty');
var fs = require('fs');
var async = require('async');
var recipe = require('azuremobile-recipe');

exports.use = function(){

	// default table names
	var myStorageaccount = "";
	var myAccesskey = "";
	var myMobileservice = "";

	var myAlbum = "Album";
	var myPicture = "Picture";

	// async error checking, table creates, and script upload
	async.series([

		// prompt for storage name
		function(callback){
			recipe.ask("Mobile storage account", /[a-z|A-Z]+/, function(name) {
				myStorageaccount = name;
				callback(null, name);
			});
		},

		// validate & get stoage key from storage name
		function(callback){
			console.log("Fetching primary access key associated with storage account '"+myStorageaccount+"'...\n");
			scripty.invoke('account storage keys list '+myStorageaccount, function(err, results){
				if (err)
					throw err;
				myAccesskey = results['Primary'];
				callback(err, results);
			});
		},

		// prompt for mobile service 
		function(callback){
			recipe.ask("Mobile service name", /[a-z|A-Z]+/, function(name) {
				myMobileservice = name;
				callback(null, name);
			});
		},
	    // error check: service exists
	    function(callback){
	        console.log('Validating mobile service '+ myMobileservice+'...');
			scripty.invoke('mobile show '+ myMobileservice, function(err, results) {
	    		if (err)
	    			throw err;
	    		console.log('Validated.\n');
	        	callback(err, results);
			});
	    },

	    // create new table album
		// create new table picture
	    function(callback){
			recipe.table_create(myMobileservice,"Album", function(err, results){
				if (err)
					throw err;
				myAlbum = results;
			    callback(err, results);
			});
	    },
	    function(callback){
	    	recipe.table_create(myMobileservice,"Picture", function(err, results){
	    		if (err)
	    			throw err;
				myPicture = results;
	    		callback(err, results);
			});
	    },

		// download Picture.insert.js, customize it with key and storage name, upload
	    function(callback){
	    	console.log("Uploading action scripts...");
			// insertion scripts
			var curdir = process.cwd();
			var insertscript = __dirname + '/table/Picture.insert.js';

		  	var tabledir = curdir + '/table';
			var myInsertscript = tabledir+ "/" + myPicture + '.insert.js';

			// create table directory
			fs.exists(tabledir, function (exists) {
			  if(!exists){
			  	fs.mkdir(tabledir, function(err){
			  		if (err)
			  			throw err;
			  	});
			  }
			});

			// update scripts with myLeaderboard and myResult
			// reference: http://stackoverflow.com/questions/10058814/get-data-from-fs-readfile
			fs.readFile(insertscript, 'utf8', function (err,data) {
		  		if (err) 
		  			throw err;

		  		// replace placeholders
		  		var result = data.replace(/\$/g, myStorageaccount).replace(/\%/g, myAccesskey);

		  		fs.writeFile(myInsertscript, result, 'utf8', function (err) {
		     		if (err) 
		     			throw err;
		  		});
			});

			// modify uploading script
			var cut = myInsertscript.indexOf(curdir);
			myInsertscript = myInsertscript.slice(0, cut) + myInsertscript.slice(cut+curdir.length+1, myInsertscript.length);
							
			// upload script
			scripty.invoke('mobile script upload ' + myMobileservice + ' '+ myInsertscript, function(err, results) {
		  		if (err) 
		  			throw err;
		  		else{
		  			console.log("Action script '"+myInsertscript+"' successfully uploaded.\n");
					callback(null, results);
		  		}
			});
	    },

		// download windows azure sotage client library
		//TODO: ask kirill if this is updated slash if we can use this?????

		// create client_files folder
	    function(callback){
			var curdir = process.cwd();
	    	var clientdir = curdir + '/client_files';
	    	// create client_files directory
			fs.exists(clientdir, function (exists) {
			  if(!exists){
			  	fs.mkdir(clientdir, function(err){
			  		if (err)
			  			throw err;
			  		callback(null, 'client dir');
			  	});
			  }
			  else
			  	callback(null, 'client dir');
			});
	    },
	    // copy client files into user local environment:s
	    function(callback){
	    	console.log("Downloading client files...");
	    	var folder = 'client_files/DataModel';
	    	var file_name = 'Album.cs';
	    	recipe.file_download(folder, file_name, ['\\$','\\%'], [myAlbum, myPicture], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/DataModel';
	    	var file_name = 'AlbumDataSource.cs';
	    	recipe.file_download(folder, file_name,  ['\\$','\\%'], [myAlbum, myPicture], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/DataModel';
	    	var file_name = 'AlbumViewModel.cs';
	    	recipe.file_download(folder, file_name,  ['\\$','\\%'], [myAlbum, myPicture], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/DataModel';
	    	var file_name = 'BaseViewModel.cs';
	    	recipe.file_download(folder, file_name,  ['\\$','\\%'], [myAlbum, myPicture], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/DataModel';
	    	var file_name = 'BlobStorageHelper.cs';
	    	recipe.file_download(folder, file_name,  ['\\$','\\%'], [myAlbum, myPicture], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/DataModel';
	    	var file_name = 'Picture.cs';
	    	recipe.file_download(folder, file_name,  ['\\$','\\%'], [myAlbum, myPicture], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/DataModel';
	    	var file_name = 'PictureViewModel.cs';
	    	recipe.file_download(folder, file_name,  ['\\$','\\%'], [myAlbum, myPicture], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/DataModel';
	    	var file_name = 'UploadViewModel.cs';
	    	recipe.file_download(folder, file_name,  ['\\$','\\%'], [myAlbum, myPicture], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(){
	    	process.exit(1);
	    }
	]);
}