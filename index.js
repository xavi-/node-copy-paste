var spawn = require("child_process").spawn;
var util = require("util");

try {
	var execSync = (function() {
		var execSync = require("execSync");
		return function(cmd) { return execSync.exec(cmd).stdout; };
	})();
}
catch(e) { execSync = null; }

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
	case "openbsd":
		config = require("./platform/openbsd");
		break;
	default:
		throw new Error("Unknown platform: '" + process.platform + "'.  Send this error to xavi.rmz@gmail.com.");
}

var noop = function() {};
var _copy = GLOBAL.copy, _paste = GLOBAL.paste;

var copy = GLOBAL.copy = exports.copy = function(text, cb) {
	var child = spawn(config.copy.command, config.copy.args);

	cb = cb ? function() { cb.apply(this, arguments); cb = noop; } : noop;

	var err = [];

	child.stdin.setEncoding("utf8");
	child.stderr.setEncoding("utf8");

	child.stdin.on("error", function (err) { cb(err); });
	child
		.on("exit", function() { cb(null, text); })
		.on("error", function(err) { cb(err); })
		.stderr
			.on("data", function(chunk) { err.push(chunk); })
			.on("end", function() {
				if(err.length === 0) { return; }
				cb(new Error(err.join("")));
			})
	;

	if(text.pipe) { text.pipe(child.stdin); }
	else {
		var type = Object.prototype.toString.call(text);

		if(type === "[object String]") { child.stdin.end(text); }
		else if(type === "[object Object]") { child.stdin.end(util.inspect(text, { depth: null })); }
		else if(type === "[object Array]") { child.stdin.end(util.inspect(text, { depth: null })); }
		else { child.stdin.end(text.toString()); }
	}

	return text;
};

var pasteCommand = [ config.paste.command ].concat(config.paste.args).join(" ");
var paste = GLOBAL.paste = exports.paste = function(callback) {
	if(execSync && !callback) { return execSync(pasteCommand); }
	else if(callback) {
		var child = spawn(config.paste.command, config.paste.args);

		var done = callback && function() { callback.apply(this, arguments); done = noop; };

		var data = [], err = [];

		child.stdin.setEncoding("utf8");
		child.stderr.setEncoding("utf8");

		child.on("error", function(err) { done(err); });
		child.stdout
			.on("data", function(chunk) { data.push(chunk); })
			.on("end", function() { done(null, data.join("")); })
		;
		child.stderr
			.on("data", function(chunk) { err.push(chunk); })
			.on("end", function() {
				if(err.length === 0) { return; }

				done(new Error(err.join("")));
			})
		;
	} else {
		throw new Error(
			"Unfortunately a synchronous version of paste is not supported on this platform."
		);
	}
};

exports.noConflict = function() {
	GLOBAL.copy = _copy;
	GLOBAL.paste = _paste;

	if(_copy === undefined) { delete GLOBAL.copy; }
	if(_paste === undefined) { delete GLOBAL.paste; }

	return exports;
};

exports.silent = function() {
	throw new Error("This function is deprecated");
};
