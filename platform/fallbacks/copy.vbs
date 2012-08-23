Dim objIE

Set objIE = CreateObject("InternetExplorer.Application")
objIE.Navigate("about:blank")

text = Wscript.StdIn.ReadAll

Do Until objIE.ReadyState=4: WScript.Sleep 1: Loop

objIE.document.parentwindow.clipboardData.SetData "text", text
objIE.Quit

