import java.awt.Toolkit;
import java.awt.datatransfer.*;
import java.io.IOException;

public class paste {
	public static void main (String args[]) {
		Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();

		Transferable clipData = clipboard.getContents(clipboard);
		String text = "";
		try {
			text = (String)(clipData.getTransferData(DataFlavor.stringFlavor));
		} catch (IOException e) {
			System.err.print(e);
			System.exit(1);
		} catch (UnsupportedFlavorException ee) {
			System.err.print(ee);
			System.exit(2);
		}
		
		System.out.print(text);
		System.exit(0);
	}
}