exports.copy = { command: "pbcopy", args: [], env: { LANG: "en_US.UTF-8" } };
exports.paste = { command: "pbpaste", args: [] };
exports.paste.full_command = exports.paste.command;
exports.encode = function(str) { return Buffer.from(str, "utf8"); };
exports.decode = function(chunks) {
	if(!Array.isArray(chunks)) { chunks = [ chunks ]; }

	return Buffer.concat(chunks).toString("utf8");
};
