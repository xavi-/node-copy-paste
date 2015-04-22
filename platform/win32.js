var iconv = require("iconv-lite");

exports.copy = { command: "clip", args: [] };
exports.paste = { command: "cscript", args: [ "/Nologo", __dirname + ".\\fallbacks\\paste.vbs" ] };
exports.encode = function(str) { return iconv.encode(str, "utf16le"); };
exports.decode = function(chunks) {
	if(!Array.isArray(chunks)) { chunks = [ chunks ]; }

	var str = iconv.decode(Buffer.concat(chunks), "cp437");
	return str.substr(0, str.length - 2); // Chops off extra "\r\n"
};
