AzureMobile-PictureUpload
=======================

Automated backend set up for azure mobile blob storage (specifically picture upload) using azure-scripty. 
The general code flow and Result table action script follow the instructions at http://code.msdn.microsoft.com/windowsapps/Upload-File-to-Windows-c9169190.


# Getting started
## Before Installation
Make sure node.js is installed as well as npm modules azure-cli and azuremobile-recipe
```bash
npm install -g azure-cli
npm install -g azuremobile-recipe
```

## Install it
```bash
npm install -g azuremobile-pictureupload
```

To set up leaderboard with azure-cli installed and user account downloaded and imported:
```bash
azure mobile recipe pictureupload
```

The module will create an Album table and a Picture table, configure their action scripts, and download neccessary client-side files in the same directory as where the module is called.

Complete testing scripts coming soon.
