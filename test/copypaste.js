const should = require("should");
const clipboard = require("../index.js");

function copy_and_paste(content, done) {
	clipboard.copy(content, (error_when_copy) => {
		should.not.exist(error_when_copy);

		clipboard.paste((error_when_paste, p) => {
			should.not.exist(error_when_paste);
			should.exist(p);
			p.should.equal(content);
			done();
		});
	});
}

describe("copy and paste", () => {
	it("should work correctly with ascii chars (<128)", (done) => {
		copy_and_paste("123456789abcdefghijklmnopqrstuvwxyz+-=&_[]<^=>=/{:})-{(`)}", done);
	});

	it("should work correctly with cp437 chars (<256)", (done) => {
		copy_and_paste("ÉæÆôöòûùÿÖÜ¢£¥₧ƒ", done);
	});

	it("should work correctly with unicode chars (<2^16)", (done) => {
		copy_and_paste("ĀāĂăĄąĆćĈĉĊċČčĎ ፰፱፲፳፴፵፶፷፸፹፺፻፼", done);
	});

	it('should work correctly for "±"', (done) => {
		copy_and_paste("±", done);
	});

	it("should work correctly with Chinese chars", (done) => {
		copy_and_paste("你好，我是中文", done);
	});
});
