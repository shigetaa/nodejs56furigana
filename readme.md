# 日本語読み方解析
日本語の文章には、同じ漢字で記述されている単語でも、音読み、訓読みと、読み方が違う場合があるので
形態素解析にて、よみかたを解析するプログラムを作成していきます。

ここでは、形態素解析をするにあたって、MeCab を利用して、日本語の読み方を解析してみます。

[形態要素解析について<br>https://github.com/shigetaa/nodejs52mecab](https://github.com/shigetaa/nodejs52mecab)

## 文章などの漢字などをすべてカタカナに変換プログラム
簡単なプログラムを書いて、その実行方法を確認していきましょう。 mecab.js と言う名前のファイルを作成して以下の様に記述してみます。
```javascript
var execFile = require('child_process').execFile;
var iconv = require('iconv-lite');
var fs = require('fs');
var platform = require('os').platform(); // OS判定

// 形態素解析するテキスト
var srcText = "探しつづけなさい。そうすれば見いだせます。\n";

// 一時ファイル
var TMP_FILE = '__mecab_tmpfile';
// MeCabのコマンドライン
var MECAB = 'mecab';
var ENCODING = (platform.substr(0, 3) == 'win')
	? 'SHIFT_JIS' : 'UTF-8';

// 形態素解析を実行する関数
function parse(text, callback) {
	// 変換元テキストを一時ファイルに保存
	if (ENCODING != 'UTF-8') {
		var buf = iconv.encode(text, ENCODING);
		fs.writeFileSync(TMP_FILE, buf, "binary");
	} else {
		fs.writeFileSync(TMP_FILE, text, "UTF-8");
	}
	// コマンドを実行
	var opt = { encoding: 'UTF-8' };
	if (ENCODING != 'UTF-8') opt.encoding = 'binary';

	execFile(MECAB, [TMP_FILE], opt,
		function (err, stdout, stderr) {
			if (err) return callback(err);
			var inp;
			// 結果出力ファイルを元に戻す
			if (ENCODING != 'UTF-8') {
				iconv.skipDecodeWarning = true;
				inp = iconv.decode(stdout, ENCODING);
			} else {
				inp = stdout;
			}
			// 結果をパースする
			inp = inp.replace(/\r/g, "");
			inp = inp.replace(/\s+$/, "");
			var lines = inp.split("\n");
			var res = lines.map(function (line) {
				return line.replace('\t', ',').split(',');
			});
			callback(err, res);
		});
}

// 形態素解析を実行する
parse(srcText, function (err, result) {
	var strText = '';
	for (var i in result) {
		var word = result[i][0];
		if (word == "EOS") continue;
		strText += result[i][8];
	}
	console.log(strText);
});

```
実行するには、以下のコマンドを実行します。
```bash
node mecab.js
```
```bash
サガシツヅケナサイ。ソウスレバミイダセマス。
```

## カタガナをローマ字に変換モジュールを作成
