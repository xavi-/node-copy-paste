const assert = require("node:assert");
const { describe, it } = require("node:test");
const clipboard = require("../index.js");
const clipboardPromises = require("../promises.js");

const tests = [
	{
		text: "123456789abcdefghijklmnopqrstuvwxyz+-=&_[]<^=>=/{:})-{(`)}",
		description: "ascii chars (<128)",
	},
	{ text: "ÉæÆôöòûùÿÖÜ¢£¥₧ƒ", description: "cp437 chars (<256)" },
	{ text: "ĀāĂăĄąĆćĈĉĊċČčĎ ፰፱፲፳፴፵፶፷፸፹፺፻፼", description: "unicode chars (<2^16)" },
	{ text: "±", description: "special chars" },
	{ text: "你好，我是中文", description: "chinese chars" },
];

function copyAndPasteAsync(content) {
	return new Promise((resolve, reject) => {
		clipboard.copy(content, (errorWhenCopy) => {
			if (errorWhenCopy) return reject(errorWhenCopy);

			clipboard.paste((errorWhenPaste, p) => {
				if (errorWhenPaste) return reject(errorWhenPaste);

				resolve(p);
			});
		});
	});
}

describe("copy and paste", () => {
	for (const { text, description } of tests) {
		it(`should work correctly with ${description}`, async () => {
			const result = await copyAndPasteAsync(text);
			assert.ok(result);
			assert.strictEqual(result, text);
		});
	}

	it("should work correctly with JSON", async () => {
		const obj = { name: "John", age: 30 };
		const expectedText = `{\n\t"name": "John",\n\t"age": 30\n}`;

		return new Promise((resolve, reject) => {
			clipboard.copy.json(obj, (err, text) => {
				if (err) return reject(err);

				assert.ok(text);
				assert.strictEqual(text, expectedText);

				clipboard.paste((err, text) => {
					if (err) return reject(err);

					assert.ok(text);
					assert.strictEqual(text, expectedText);

					resolve();
				});
			});
		});
	});
});

describe("promise-based copy and paste", () => {
	for (const { text, description } of tests) {
		it(`should work correctly with ${description}`, async () => {
			await clipboardPromises.copy(text);
			const result = await clipboardPromises.paste();
			assert.ok(result);
			assert.strictEqual(result, text);
		});
	}

	it("should work correctly with JSON", async () => {
		const obj = { name: "John", age: 30 };
		const expectedText = `{\n\t"name": "John",\n\t"age": 30\n}`;

		await clipboardPromises.copy.json(obj);
		const result = await clipboardPromises.paste();
		assert.ok(result);
		assert.strictEqual(result, expectedText);
	});
});
