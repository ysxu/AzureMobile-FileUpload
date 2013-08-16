var azure = require('azure');

function insert(item, user, request) {
    var accountName = '$storageaccount';
    var accountKey = '$accesskey';

    var host = accountName + '.blob.core.windows.net';
    var container = item.container;
    var pictureRelativePath = '/' + container + '/' + item.filename;

    // Create the container if it does not exist
    // Use public read access for the blobs, and the SAS to upload        
    var blobService = azure.createBlobService(accountName, accountKey, host);
    blobService.createContainerIfNotExists(container, { publicAccessLevel: 'blob' }, function (error) {
        if (!error) {
            // Container exists now define a policy for write access
            // that starts immediately and expires in 5 mins
            var sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.Constants.BlobConstants.SharedAccessPermissions.WRITE,
                    // Start: use for start time in future, beware of server time skew 
                    Expiry: azure.date.minutesFromNow(30)
                }
            };
            // Create the blobs urls with the SAS
            item.sas = blobService.getBlobUrl(container, item.filename, sharedAccessPolicy);
            item.url = item.sas.split('?')[0];


            console.log(item.sas);
        }
        else {
            console.error(error);
        }

        request.execute();
    });
}