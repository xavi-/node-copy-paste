var iconv = require("iconv-lite");
var path = require("path");

var vbsPath = '"' + path.join(__dirname, ".\\fallbacks\\paste.vbs") + '"';

exports.copy = { command: "clip", args: [] };
exports.paste = { command: "cscript", args: [ "/Nologo", vbsPath ] };
exports.encode = function(str) { return iconv.encode(str, "utf16le"); };
exports.decode = function(chunks) {
	if(!Array.isArray(chunks)) { chunks = [ chunks ]; }

	var str = iconv.decode(Buffer.concat(chunks), "cp437");
	return str.substr(0, str.length - 2); // Chops off extra "\r\n"
};
