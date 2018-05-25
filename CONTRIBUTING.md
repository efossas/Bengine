## Developing Blocks

The `develop.html` page explains how to build new blocks. You can even test out new blocks on that page.

Eventually, you'll want to add new blocks or edit existing ones in the `blocks` directory.

## Developing Bengine

Everything is in `public/dev/bengine.js`.

## Generating Files

After making edits, the following command will make any necessary links and minified/optimized files:
```
npm run postinstall
```

## Front-End Testing

`public/dev/front-end`

## Back-End Testing

`test`

## A Basic Example Of Bengine

You can get a good idea of how to add Bengine and its different modes into a page by checking out the HTML files in `public/pages`. But the gist of it is:

Create a div with an id to host Bengine on an HTML page:
```
<div id="some-id-goes-here"></div>
```

Add these two tags to the page (these are the unminified files):
```
<link rel="stylesheet" href="dev/css/bengine.css">
<script src="dev/js/bengine.js"></script>
```

Use Bengine to load any blocks or external dependencies you need and then create a new Bengine instance:

```javascript
Bengine.loadBlocks([
	// ... list blocks or dependencies here
]).then(function(result) {
	var myEngine = new Bengine(options,extensions)
	myEngine.loadBlocksEdit("some-id-goes-here","some/file/path/goes/here")
});
```

## Bengine HTML Prefixes

Bengine prefixes all its id & class names with 'bengine-'

- 'bengine-' + number
- 'bengine-b' + number
- 'bengine-a' + number
- 'bengine-d' + number
- 'bengine-instance'
- 'bengine-x-blocks'
- 'bengine-file-select'
- 'bengine-x-id'
- 'bengine-progressbar'
- 'bengine-autosave'
- 'bengine-savestatus'
- 'bengine-statusid'

## Saving & Uploads

This has changed quite a bit lately and is currently being discussed. Check out the methods in the `datahandler` object inside `public/dev/js/bengine.js`. That's a good place to start to figure out how this stuff is wired up.





