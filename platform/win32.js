const iconv = require("iconv-lite");
const path = require("node:path");

const vbsPath = path.join(__dirname, ".\\fallbacks\\paste.vbs");

const paste = { command: "cscript", args: ["/Nologo", vbsPath] };
paste.full_command = [paste.command, paste.args[0], `"${vbsPath}"`].join(" ");

exports.copy = { command: "clip", args: [] };
exports.paste = paste;

exports.encode = (str) => iconv.encode(str, "utf16le");
exports.decode = (chunks) => {
	const data = Array.isArray(chunks) ? chunks : [chunks];

	let b64 = iconv.decode(Buffer.concat(data), "cp437");
	b64 = b64.substring(0, b64.length - 2); // Chops off extra "\r\n"

	// remove bom and decode
	return Buffer.from(b64, "base64").subarray(3).toString("utf-8");
};
