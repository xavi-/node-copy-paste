var execSync = require("exec-sync");
var spawn = require("child_process").spawn;
var util = require("util");

var config;

switch(process.platform) {
	case "darwin":
		config = require("./platform/darwin");
		break;
	case "win32":
		config = require("./platform/win32");
		break;
	case "linux":
		config = require("./platform/linux");
		break;
	default:
		throw "Unknown platform.  Don't know how to copy and paste."
		break;
}

var _copy = GLOBAL.copy, _paste = GLOBAL.paste;

var copy = GLOBAL.copy = exports.copy = function(text) {
	var child = spawn(config.copy.command, config.copy.args);

	child
		.on("exit", function() { console.log("Copy complete"); })
		.stderr.on("data", function(err) { console.error(err.toString()); });

	if(text.pipe) { text.pipe(child.stdin); }
	else {
		var type = Object.prototype.toString.call(text);

		if(type === "[object String]") { child.stdin.end(text); }
		else if(type === "[object Object]") { child.stdin.end(util.inspect(text)); }
		else if(type === "[object Array]") { child.stdin.end(util.inspect(text)); }
		else { child.stdin.end(text.toString()); }
	}
};

var pasteCommand = [ config.paste.command ].concat(config.paste.args).join(" ");
var paste = GLOBAL.paste = exports.paste = function() {
	return execSync.stdout(pasteCommand);
};

exports.noConflict = function() {
	GLOBAL.copy = _copy;
	GLOBAL.paste = _paste;

	if(_copy === undefined) { delete GLOBAL.copy; }
	if(_paste === undefined) { delete GLOBAL.paste; }

	return { copy: copy, paste: paste };
};