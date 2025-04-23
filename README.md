# node-copy-paste

A command line utility that allows read/write (i.e copy/paste) access to the system clipboard.  It does this by wrapping [`pbcopy/pbpaste`](https://developer.apple.com/library/mac/#documentation/Darwin/Reference/Manpages/man1/pbcopy.1.html) (for OSX), [`xclip`](http://www.cyberciti.biz/faq/xclip-linux-insert-files-command-output-intoclipboard/) (for Linux, FreeBSD, and OpenBSD), and [`clip`](http://www.labnol.org/software/tutorials/copy-dos-command-line-output-clipboard-clip-exe/2506/) (for Windows). Currently works with node.js v0.8+.

## The API

When `require("copy-paste")` is executed, an object with the following properties is returned:

- `copy(text[, callback])`: asynchronously replaces the current contents of the clip board with `text`.  Takes either a string, array, object, or readable stream.  Returns the same value passed in. Optional callback will fire when the copy operation is complete.
- `copy.json(obj[, callback])`: asynchronously replaces the current contents of the clip board with the JSON string of `obj`.  Returns the same value passed in. Optional callback will fire when the copy operation is complete.
- `paste([callback])`: if no callback is provided, `paste` synchronously returns the current contents of the system clip board.  Otherwise, the contents of the system clip board are passed to the callback as the second parameter. The first one being a potential error.
- `require("copy-paste").global()`:  adds `copy` and `paste` to the global namespace.  Returns an object with `copy` and `paste` as properties.

Example usage:

```js
const { copy, paste } = require("copy-paste");

copy("some text", (err, text) => {
  // "some text" is in your clipboard
});

paste((err, text) => {
  // complete...
});

const text = paste(); // Synchronous paste
copy({ hello: "world" }) // Asynchronous copy
```

### Promise-based API

For modern JavaScript applications, you can use the promise-based interface by requiring the `promises` submodule:

```javascript
const clipboard = require('copy-paste/promises');
```

The promise-based API provides the following methods:

- `copy(text)`: Returns a promise that resolves with the copied text when the operation is complete
- `copy.json(obj)`: Returns a promise that resolves with the copied JSON string when the operation is complete
- `paste()`: Returns a promise that resolves with the clipboard contents when the operation is complete

Example usage with async/await:

```javascript
const { copy, paste } = require('copy-paste/promises');

// Copy text
await copy('Hello World');

// Copy JSON
await copy.json({ hello: 'world' });

// Paste text
const text = await paste();
```

## Getting node-copy-paste

The easiest way to get node-copy-paste is with [npm](http://npmjs.org/):

	npm install copy-paste

Alternatively you can clone this git repository:

	git clone git://github.com/xavi-/node-copy-paste.git

## Future plans

I'm hoping to add various fallbacks for instances when `xclip` or `clip` is not avaiable (see [experimental-fallbacks](https://github.com/xavi-/node-copy-paste/tree/experimental-fallbacks/platform) branch).  Also this library needs to be more thoroughly tested on windows.

## Developed by
* Xavi Ramirez

## License
This project is released under [The MIT License](http://www.opensource.org/licenses/mit-license.php).
