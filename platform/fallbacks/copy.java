import java.awt.Toolkit;
import java.awt.datatransfer.*;
import java.io.*;

public class copy {
	public static void main (String args[]) {
		Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();

		BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
		int c; StringBuffer text = new StringBuffer();
		try {
			while ((c = in.read()) != -1) { text.append((char)c); }
		} catch (IOException e) {
			System.err.print(e);
			System.exit(1);
		}

		StringSelection data = new StringSelection(text.toString());
		clipboard.setContents(data, data);

		System.exit(0);
	}
}