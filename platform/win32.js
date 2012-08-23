exports.copy = { command: "clip", args: [ "-selection", "clipboard" ] };
exports.paste = { command: "cscript", args: [ "/Nologo", ".\\platform\\fallbacks\\paste.vbs" ] };