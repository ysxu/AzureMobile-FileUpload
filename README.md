AzureMobile-FileUpload
=========================

This recipe automates backend set up and fetches client files with Azure Mobile Services to provide Windows Store apps with a blob storage solution for file upload. 
Platform: Windows Store Apps
Project language: C#

# Getting started

## Before Installation
Make sure node.js is installed (install at http://nodejs.org/) as well as npm modules azure-cli and azuremobile-recipe. To do so, run in command line:
```bash
npm install -g azure-cli
npm install -g azuremobile-recipe
```
Note: users with Azure CLI installed through the Windows .msi installer will not be able to access recipes at this point of time.


## Install it
```bash
npm install -g azuremobile-fileupload
```

To set up file upload for a C# project with account downloaded and imported as well as an existing storage account and an existing mobile service created, cd to project directory and run in command line:
```bash
azure mobile recipe execute <servicename> fileupload
```

The module will create an album table and a picture table, configure their scripts, and download neccessary client-side files in user's working directory.


## Use it
Windows Azure Mobile Services SDK for Windows 8 is required for this recipe at http://go.microsoft.com/fwlink/?LinkId=257545&clcid=0x409.

// TODOTODOTODO


Complete testing scripts coming soon.