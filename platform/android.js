exports.copy = { command: "termux-clipboard-set", args: [] };
exports.paste = { command: "termux-clipboard-get", args: [] };
exports.paste.full_command = exports.paste.command;
exports.encode = (str) => Buffer.from(str, "utf8");
exports.decode = (chunks) => {
	const data = Array.isArray(chunks) ? chunks : [chunks];

	return Buffer.concat(data).toString("utf8");
};
