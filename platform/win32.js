var iconv = require("iconv-lite");
var path = require("path");

var copyHelperPath = path.join(__dirname, ".\\fallbacks\\copy.bat");
var pasteHelperPath = path.join(__dirname, ".\\fallbacks\\paste.vbs");

var paste = { command: "cscript", args: [ "/Nologo", pasteHelperPath ] };
paste.full_command = [ paste.command, paste.args[0], '"'+pasteHelperPath+'"' ].join(" ");

exports.copy = { command: "cmd", args: [ "/U", "/C", copyHelperPath ] };
exports.paste = paste;

// explicitly do not add BOM otherwise clip.exe might include the BOM in the text that is copied to the clipboard!
exports.encode = function(str) { return iconv.encode(str, "utf-8", {addBOM: false}); };
exports.decode = function(chunks, isError) {
    if (isError) {
        // no base64 decoding error messages!
        return chunks;
    } else {
        if(!Array.isArray(chunks)) { chunks = [ chunks ]; }

        var b64 = iconv.decode(Buffer.concat(chunks), "cp437");
        b64 = b64.substr(0, b64.length - 2); // Chops off extra "\r\n"

        // remove bom and decode
        var result = new Buffer(b64, "base64").slice(3).toString("utf8");
        return result;
    }
};
