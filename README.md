# Live Reload
### A script for automatically reloading tracked files

## How to use it
- Put `liveReload.js` into any directory you want.
- Create a file called `liveReload.json`, this file must be in the same directory as `liveReload.js`
- Add the script tag before any of your other scripts

The necessary structure
```html
<!DOCTYPE HTML>
<HTML>
  <head>
  </head>
  <body>
    <script src="liveReload.js"></script>
    <!-- Your other scripts -->
  </body>
</HTML>
```

Example structure of `liveReload.json`
```json
[
  "bin/js/owner.js",
  "bin/js/vendor.js",
  "bin/css/all.css",
  "bin/templates/all.html",
  "analyze_profit-and-loss.html"
]
```

Because `liveReload.js` runs client side it necessary to manually track files. When pushing your project to a live server it is recommended to remove `liveReload.js` from the project.
