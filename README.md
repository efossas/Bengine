
[![Build Status](https://travis-ci.org/academicsystems/Bengine.svg?branch=master)](https://travis-ci.org/academicsystems/Bengine)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/BlockEngine/Lobby)

# Bengine
A browser block engine.

The purpose of Bengine is to provide a simple platform for creating dynamic web resources.

Bengine handles the creating and deleting of "blocks", which are just html elements. You can view the available block types in the "blocks" folder. You can always create your own block if you don't see the functionality you want.

Bengine also works as a front-end for developing and testing dynamic questions that work with Qengine.

# Demo

View the demo at: [https://bengine.academic.systems](https://bengine.academic.systems)

## Getting Started Locally

Download & enter the repo.

```
git clone https://github.com/efossas/Bengine ~
cd ~/Bengine
```

Install the node dependencies.

```
npm install
```

Change any configuration you need in `config.json`. Then run the back-end server.

```
npm start
```

Now go to the index page: [https://localhost:2021](https://localhost:2021)

## Files

If you want to use Bengine in another website, copy all the files in `public/bengine`.

If you make any changes to Bengine or any blocks, run this command to regenerate those files:

```
npm run postinstall
```

## Configuration

A configuration object can be passed to Bengine when creating a new instance. This is what options are available:

OPTION | TYPE | DEFAULT | EXPLANATION
| --- | --- | --- | --- |
blockLimit | number | 16 | number of blocks that can be added to a page
defaultText | boolean | true | when a new block is added in edit mode, it's default input will be shown, usually to explain usage
enableAutoSave | boolean | false | automatically save when a block is added or deleted
enableSingleView | boolean | false | puts Bengine into a mode sort of like a power point, where only one block is viewable at a time
localMode | boolean	| false | Bengine will load dependencies from local directory instead of using remote CDN requests
mediaLimit | number | 100 | the file size limit in megabytes to accept for media files, like images, audio, and video
mode | string | 'bengine' | Can also be 'qengine'. Changes the type of file generated when downloading a save file
playableMediaLimit | number | 180 | the file size limit in seconds to accept for media files, like audio and video

## Blocks

A list of currently available blocks can be found in the `blocks` directory. If they are preprended with the letter `q`, that means they are for Qengine mode.

## Extensions

Extensions are objects you can pass to Bengine to handle functionality that isn't directly related to loading and displaying blocks. Here is a list of extensions you can add:

NAME | FUNCTIONS | EXPLANATION
| --- | --- | --- |
alerts | _ | used for UI messages
 _ | alert() | used to alert the user of errors 
 _ | confirm() | used when requiring user confirmation
 _ | log() | used to display or log developer related error messages
display | _ | used to display page related functionality like save buttons, loading progress, page status, etc.
 _ | _ | the display is created using the new operator and recieves these arguments: (engineID,datahandler)
 _ | progressFinalize(status,total) | run when saving or uploading has completed 
 _ | progressInitialize(status,total) | run when saving or uploading has initialized
 _ | progressUpdate(loaded) | run when there is an update to progress
 _ | updateSaveStatus(status) | run when there is a change of save status

A list of known compatible extensions are listed below:

NAME | EXTENSION
| --- | --- |
alerts | _
 _ | Alertify: https://github.com/MohammadYounes/AlertifyJS
display | _
 _ | Bengine Default Display: it's in the public/dev/js directory



