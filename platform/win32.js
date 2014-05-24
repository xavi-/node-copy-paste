exports.copy = { command: "clip", args: [] };
exports.paste = { command: "cscript", args: [ "/Nologo", __dirname + ".\\fallbacks\\paste.vbs" ] };
