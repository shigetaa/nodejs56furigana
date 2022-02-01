var execFile = require('child_process').execFile;
var iconv = require('iconv-lite');
var fs = require('fs');
var platform = require('os').platform(); // OS判定
var kana2roma = require('./kana2roma.js');

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
	console.log(kana2roma(strText));
});
