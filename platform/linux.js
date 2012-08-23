exports.copy = { command: "xclip", args: [ "-selection", "clipboard" ] };
exports.paste = { command: "xclip", args: [ "-selection", "clipboard", "-o" ] };