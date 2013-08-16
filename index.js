/*
   Azure Mobile Services - Recipe - Blob Storage File Upload

    Copyright 2013 Mimi Xu

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 */
exports.execute = function(myMobileservice, recipe, callback){
    var recipename = 'fileupload';

    // default table names
    var myStorageaccount = '',
        myAccesskey = '',
        myAlbum = 'Album',
        myPicture = 'Picture';

    // file customizations
    var original = [],
        replacement = [],
        files;

    // logging
    var log = recipe.cli.output,
        progress;

    async.series([
        function(callback){
            // prompt for storage account
            recipe.ask('Mobile storage account: ', recipe.REGEXP, 'Storage account format not recognized', function(name) {
                myStorageaccount = name;
                callback();
            });
        },
        function(callback){
            // validate & get stoage key from storage name
            progress = recipe.cli.progress('Fetching primary access key associated with storage account \'' + myStorageaccount + '\'');
            scripty.invoke('account storage keys list ' + myStorageaccount, function(err, results){
                if (err) return callback(err);
                progress.end();
                myAccesskey = results['Primary'];
                callback();
            });
        },
        function(callback){
            // create album table
            recipe.createTable(myMobileservice, "Album", function (err, results) {
                if (err) return callback(err);
                myAlbum = results;
                callback();
            });
        },
        function(callback){
            // create picture table
            recipe.createTable(myMobileservice, "Picture", function (err, results) {
                if (err) return callback(err);
                myPicture = results;
                callback();
            });
        },
        function (callback) {
            // retreive picture table script
            log.info('');
            progress = recipe.cli.progress('Copying scripts\n');
            original = ['\\$storageaccount', '\\$accesskey'];
            replacement = [myStorageaccount, myAccesskey];
            var tableFile = [{
                dir: 'server_files/table',
                file: 'Picture.insert.js',
                newFile: myPicture + '.insert.js',
                original: original,
                replacement: replacement
            }];
            recipe.copyFiles(recipename, tableFile, function (err) {
                if (err) return callback(err);
                progress.end();
                callback();
            });
        },
        function (callback) {
            // upload picture table script
            var tableInsertscript = 'table/' + myPicture + '.insert.js';
            var myInsertscript = 'server_files/' + tableInsertscript;

            progress = recipe.cli.progress('Uploading picture script \'' + myInsertscript + '\'');
            recipe.scripty.invoke('mobile script upload ' + myMobileservice + ' ' + tableInsertscript + ' -f ' + myInsertscript, function (err, results) {
                if (err) return callback(err);
                else {
                    progress.end();
                    callback();
                }
            });
        },
        function (callback) {
            // find all client files
            recipe.readPath(recipe.path.join(__dirname, './client_files'), __dirname, function (err, results) {
                if (err) return callback(err);
                files = results;
                callback();
            });
        },
        function (callback) {
            original = ['\\$picture', '\\$album', '\\$namespace'];
            replacement = [myPicture, myAlbum, ''];
            // format client files
            recipe.async.forEachSeries(
                files,
                function (file, done) {
                    file.original = original;
                    file.replacement = replacement;
                    done();
                },
                function (err) {
                    if (err) return callback(err);
                    callback();
                });
        },
        function (callback) {
            // copy client files to user environment
            recipe.copyFiles(recipename, files, function (err) {
                if (err) return callback(err);
                callback();
            });
        }
    ],
    function (err, results) {
        if (err) throw err;
        callback();
    });
}