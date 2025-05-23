exports.copy = { command: "pbcopy", args: [], env: { LANG: "en_US.UTF-8" } };
exports.paste = { command: "pbpaste", args: [] };
exports.paste.full_command = exports.paste.command;
exports.encode = (str) => Buffer.from(str, "utf8");
exports.decode = (chunks) => {
	const data = Array.isArray(chunks) ? chunks : [chunks];

	return Buffer.concat(data).toString("utf8");
};
