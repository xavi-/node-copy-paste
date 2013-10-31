# node-copy-paste

A command line utility that allows read/write (i.e copy/paste) access to the system clipboard.  It does this by wrapping [`pbcopy/pbpaste`](https://developer.apple.com/library/mac/#documentation/Darwin/Reference/Manpages/man1/pbcopy.1.html) (for OSX), [`xclip`](http://www.cyberciti.biz/faq/xclip-linux-insert-files-command-output-intoclipboard/) (for linux), and [`clip`](http://www.labnol.org/software/tutorials/copy-dos-command-line-output-clipboard-clip-exe/2506/) (for windows). Currently works with node.js v0.8+.

## The API

When `require("copy-paste")` is executed, two global functions are added:

- `copy(text[, callback])`: asynchronously replaces the current contents of the clip board with `text`.  Takes either a string, array, object, or readable stream.  Returns the same value passed in. Optional callback will fire when the copy operation is complete.
- `paste([callback])`: if no callback is provided, `paste` synchronously returns the current contents of the system clip board.  Otherwise, the contents of the system clip board are passed to the callback as the second parameter.

	**Note**: The synchronous version of `paste` is not always availabled.  Unfortunately, I'm having a hard time finding a synchronous version of `child_process.exec` that consistently works on all platforms, especially windows.  An error message is shown if the synchronous version of `paste` is used on an unsupported platform.  That said, the asyncchronous version of `paste` is always available.

If you do not want to pollute the global namespaced call `require("copy-paste").noConflict()`.  It'll remove the `copy` and `paste` global functions as well as return an object that has `copy` and `paste` properties.

## Getting node-copy-paste

The easiest way to get node-copy-paste is with [npm](http://npmjs.org/):

	npm install -g copy-paste

Rarely is it a good idea to install modules globally, but `node-copy-paste` is immensely useful while doing work in the REPL or while debugging.  It's nice having it around.

Alternatively you can clone this git repository:

	git clone git://github.com/xavi-/node-copy-paste.git

## Future plans

I'm hoping to add various fallbacks for instances when `xclip` or `clip` is not avaiable (see [experimental-fallbacks](https://github.com/xavi-/node-copy-paste/tree/experimental-fallbacks/platform) branch).  Also this library needs to be more thoroughly tested on windows.

## Developed by
* Xavi Ramirez

## License
This project is released under [The MIT License](http://www.opensource.org/licenses/mit-license.php).
