var child_process = require("child_process");
var spawn = child_process.spawn;
var util = require("util");

var execSync = (function() {
	if(child_process.execSync) { // Use native execSync if avaiable
		return function(cmd) { return child_process.execSync(cmd).toString(); }
	} else {
		try { // Try using fallback package if available
			var execSync = require("execSync");
			return function(cmd) { return execSync.exec(cmd).stdout; };
		} catch(e) {}
	}

	return null;
})();

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

exports.copy = function(text, callback) {
	var child = spawn(config.copy.command, config.copy.args);

	var done = (callback ? function() { callback.apply(this, arguments); done = noop; } : noop);

	var err = [];

	child.stdin.setEncoding(config.encoding);
	child.stderr.setEncoding(config.encoding);

	child.stdin.on("error", function (err) { done(err); });
	child
		.on("exit", function() { done(null, text); })
		.on("error", function(err) { done(err); })
		.stderr
			.on("data", function(chunk) { err.push(chunk); })
			.on("end", function() {
				if(err.length === 0) { return; }
				done(new Error(err.join("")));
			})
	;

	if(text.pipe) { text.pipe(child.stdin); }
	else {
		var output, type = Object.prototype.toString.call(text);

		if(type === "[object String]") { output = text; }
		else if(type === "[object Object]") { output = util.inspect(text, { depth: null }); }
		else if(type === "[object Array]") { output = util.inspect(text, { depth: null }); }
		else { output = text.toString(); }

		child.stdin.end(new Buffer(output, config.encoding));
	}

	return text;
};

var pasteCommand = [ config.paste.command ].concat(config.paste.args).join(" ");
exports.paste = function(callback) {
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

exports.silent = function() {
	throw new Error("DEPRECATED: copy-paste is now always silent.");
};

exports.noConflict = function() {
	throw new Error("DEPRECATED: copy-paste no longer adds global variables by default.");
};
exports.global = function() {
	GLOBAL.copy = exports.copy;
	GLOBAL.paste = exports.paste;

	return exports;
};
