exports.copy =
 	process.env.WSL_DISTRO_NAME ?
	{ command: "clip.exe", args: [] } :
  	{ command: "xclip", args: [ "-selection", "clipboard" ] };

exports.paste =
	process.env.WSL_DISTRO_NAME ?
	{ command: "powershell.exe", args: ['-noprofile', '-command', 'Get-Clipboard'] } :
	{ command: "xclip", args: [ "-selection", "clipboard", "-o" ] };
  
exports.paste.full_command = [ exports.paste.command ].concat(exports.paste.args).join(" ");
exports.encode = function(str) { return Buffer.from(str, "utf8"); };
exports.decode = function(chunks) {
	if(!Array.isArray(chunks)) { chunks = [ chunks ]; }

	var output = Buffer.concat(chunks).toString("utf8");

	// Check if running under WSL and strip the last two characters added by powershell.exe
	if (process.env.WSL_DISTRO_NAME) {
		output = output.slice(0, -2);
	}

	return output;
};
