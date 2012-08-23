Dim objHTML

Set objHTML = CreateObject("htmlfile")
text = objHTML.ParentWindow.ClipboardData.GetData("Text")

Wscript.Echo text