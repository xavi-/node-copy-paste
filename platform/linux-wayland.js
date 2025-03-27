exports.copy =
 	process.env.WSL_DISTRO_NAME ?
	{ command: "clip.exe", args: [] } :
  	{ command: "wl-copy", args: [] };


exports.paste = { command: "wl-paste", args: [] };
exports.paste.full_command = [ exports.paste.command ].concat(exports.paste.args).join(" ");
exports.encode = function(str) { return Buffer.from(str, "utf8"); };
exports.decode = function(chunks) {
	if(!Array.isArray(chunks)) { chunks = [ chunks ]; }

	return Buffer.concat(chunks).toString("utf8");
};
