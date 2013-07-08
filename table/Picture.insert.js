var azure = require('azure'); 
var qs = require('querystring'); 
 
function insert(item, user, request) { 
    var accountName = 'samplestorage'; 
    var accountKey = 'xSyFM65/07AZ9LpMXnUa2gVnlan9xfhOzeRSQw4/EhOiAR5yUpeyHn3D47twg9IyUEGOl5jg2BnSKs1FoazKjg=='; 
 
    var host = accountName + '.blob.core.windows.net'; 
    var containerName = 'mypictures-' + item.albumid; 
    var pictureRelativePath = '/' + containerName + '/' + item.fileName; 
    var pictureThumbnailRelativePath = '/' + containerName + '/' + item.thumbnailFileName; 
 
    // Create the container if it does not exist 
    // Use public read access for the blobs, and the SAS to upload         
    var blobService = azure.createBlobService(accountName, accountKey, host); 
    blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, function (error) { 
        if (!error) { 
            // Container exists now define a policy for write access 
            // that starts immediately and expires in 5 mins 
            var sharedAccessPolicy = createAccessPolicy(); 
 
            // Create the blobs urls with the SAS 
            item.imageurl = createResourceURLWithSAS(accountName, accountKey, pictureRelativePath, sharedAccessPolicy, host); 
            item.thumbnailurl = createResourceURLWithSAS(accountName, accountKey, pictureThumbnailRelativePath, sharedAccessPolicy, host); 
        } 
        else { 
            console.error(error); 
        } 
 
        request.execute(); 
    }); 
} 
 
function createResourceURLWithSAS(accountName, accountKey, blobRelativePath, sharedAccessPolicy, host) { 
    // Generate the SAS for your BLOB 
    var sasQueryString = getSAS(accountName, 
                        accountKey, 
                        blobRelativePath, 
                        azure.Constants.BlobConstants.ResourceTypes.BLOB, 
                        sharedAccessPolicy); 
 
    // Full path for resource with SAS 
    return 'https://' + host + blobRelativePath + '?' + sasQueryString; 
} 
 
function createAccessPolicy() { 
    return { 
        AccessPolicy: { 
            Permissions: azure.Constants.BlobConstants.SharedAccessPermissions.WRITE, 
            // Start: use for start time in future, beware of server time skew  
            Expiry: formatDate(new Date(new Date().getTime() + 5 * 60 * 1000)) // 5 minutes from now 
        } 
    }; 
} 
 
function getSAS(accountName, accountKey, path, resourceType, sharedAccessPolicy) { 
    return qs.encode(new azure.SharedAccessSignature(accountName, accountKey) 
                                    .generateSignedQueryString(path, {}, resourceType, sharedAccessPolicy)); 
} 
 
function formatDate(date) { 
    var raw = date.toJSON(); 
    // Blob service does not like milliseconds on the end of the time so strip 
    return raw.substr(0, raw.lastIndexOf('.')) + 'Z'; 
} 