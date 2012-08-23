# node-copy-paste

A command line utility that allows read/write (i.e copy/paste) access to the system clipboard.  It does this by wrapping `pbcopy/pbpaste` (for OSX), `xclip` (for linux), and `clip` (for windows). Currently works with node.js v0.8+.

## The API

When `require("node-copy-paste")`, two Global functions are added:

- `copy(text)`: asynchronously replaces the current contents of the clip board with `text`.  Takes either a string, array, object, or readable stream.
- `paste()`: synchronously returns the current contents of the system clip board.

## Getting node-copy-paste

The easiest way to get node-copy-paste is with [npm](http://npmjs.org/):

	npm install node-copy-paste

Alternatively you can clone this git repository:

	git://github.com/xavi-/node-copy-paste.git

## Future plans

I'm hoping to add various fallbacks for instances when `xclip` or `clip` is not avaiable (see [experimental-fallbacks](https://github.com/xavi-/node-copy-paste/tree/experimental-fallbacks) branch).  Also this library needs to be more thoroughly tested on windows.

## Developed by
* Xavi Ramirez

## License
This project is released under [The MIT License](http://www.opensource.org/licenses/mit-license.php).
