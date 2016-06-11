::Setting this code page is more likely to make isTextUnicode return true, making clip.exe do what we want.
chcp 65001 & ::UTF-8

clip & ::Reads stdin

::This is the default code page for the US locale. It might not be the user's original code page. This *probably* doesn't matter.
::Restoring this code page makes cmd.exe behave nicely! Without this it freezes when running the tests.
chcp 437 & ::US ASCII (restore)
