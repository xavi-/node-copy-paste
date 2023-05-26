exports.copy = { command: "termux-clipboard-set", args: [] };
exports.paste = { command: "termux-clipboard-get", args: [] };
exports.paste.full_command = exports.paste.command;
exports.encode = function(str) { return Buffer.from(str, "utf8"); };
exports.decode = function(chunks) {
	if(!Array.isArray(chunks)) { chunks = [ chunks ]; }

	return Buffer.concat(chunks).toString("utf8");
};
