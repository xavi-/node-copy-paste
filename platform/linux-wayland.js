exports.copy = process.env.WSL_DISTRO_NAME
	? { command: "clip.exe", args: [] }
	: { command: "wl-copy", args: [] };

exports.paste = { command: "wl-paste", args: [] };
exports.paste.full_command = [exports.paste.command].concat(exports.paste.args).join(" ");
exports.encode = (str) => Buffer.from(str, "utf8");
exports.decode = (chunks) => {
	const data = Array.isArray(chunks) ? chunks : [chunks];

	return Buffer.concat(data).toString("utf8");
};
