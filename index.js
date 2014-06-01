var spawn = require("child_process").spawn;
var util = require("util");

try {
	var execSync = (function() {
		var execSync = require("execSync");
		return function(cmd) { return execSync.exec(cmd).stdout; };
	})();
}
catch(e) { execSync = null; }

var config, isSilent;

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
		throw "Unknown platform: '" + process.platform + "'.  Send this error to xavi.rmz@gmail.com.";
}

var noop = function() {};
var _copy = GLOBAL.copy, _paste = GLOBAL.paste;

var copy = GLOBAL.copy = exports.copy = function(text, callback) {
	var child = spawn(config.copy.command, config.copy.args);

	var done = callback && function() { callback.apply(this, arguments); done = noop; };

	var err = [];
	child.stdin.on("error", function (err) {
		if(done) { done(err); }
		else if (!isSilent) { console.log("Couldn't execute " + config.copy.command + ": " + err); }
	});
	child
		.on("exit", function() {
			if(done) { done(null, text); }
			else if(!isSilent) { console.log("Copy complete"); }
		})
		.on("error", function(err) {
			if(done) { done(err); }
			else if(!isSilent) { console.error("Copy error", err); }
		})
		.stderr
			.on("data", function(chunk) { err.push(chunk); })
			.on("end", function() {
				if(err.length === 0) { return; }
				var error = err.join("");

				if(done) { done(new Error(error)); }
				else if(!isSilent) { console.log(error); }
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
	} else if(!isSilent) {
		console.error(
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
	isSilent = true;
	return exports;
};
