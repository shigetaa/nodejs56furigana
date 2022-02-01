# 日本語読み方解析
日本語の文章には、同じ漢字で記述されている単語でも、音読み、訓読みと、読み方が違う場合があるので
形態素解析にて、よみかたを解析するプログラムを作成していきます。

ここでは、形態素解析をするにあたって、MeCab を利用して、日本語の読み方を解析してみます。

[形態要素解析について<br>https://github.com/shigetaa/nodejs52mecab](https://github.com/shigetaa/nodejs52mecab)

## 文章などの漢字などをすべてカタカナに変換プログラム
簡単なプログラムを書いて、その実行方法を確認していきましょう。 `mecab.js` と言う名前のファイルを作成して以下の様に記述してみます。
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

## ひらがな、カタカナをローマ字に変換モジュールを作成
ひらがな、カタカナをローマ字に変換するモジュールを`kana2roma.js`と言う名前のファイルを作成して以下の様に記述してみます。
```javascript
// ひらがなからローマ字を返すモジュール
module.exports = function (targetStr) {
	var romanMap = {
		'あ': 'a',
		'い': 'i',
		'う': 'u',
		'え': 'e',
		'お': 'o',
		'か': 'ka',
		'き': 'ki',
		'く': 'ku',
		'け': 'ke',
		'こ': 'ko',
		'さ': 'sa',
		'し': 'shi',
		'す': 'su',
		'せ': 'se',
		'そ': 'so',
		'た': 'ta',
		'ち': 'chi',
		'つ': 'tsu',
		'て': 'te',
		'と': 'to',
		'な': 'na',
		'に': 'ni',
		'ぬ': 'nu',
		'ね': 'ne',
		'の': 'no',
		'は': 'ha',
		'ひ': 'hi',
		'ふ': 'fu',
		'へ': 'he',
		'ほ': 'ho',
		'ま': 'ma',
		'み': 'mi',
		'む': 'mu',
		'め': 'me',
		'も': 'mo',
		'や': 'ya',
		'ゆ': 'yu',
		'よ': 'yo',
		'ら': 'ra',
		'り': 'ri',
		'る': 'ru',
		'れ': 're',
		'ろ': 'ro',
		'わ': 'wa',
		'ゐ': 'wi',
		'ゑ': 'we',
		'を': 'wo',
		'ん': 'n',
		'が': 'ga',
		'ぎ': 'gi',
		'ぐ': 'gu',
		'げ': 'ge',
		'ご': 'go',
		'ざ': 'za',
		'じ': 'ji',
		'ず': 'zu',
		'ぜ': 'ze',
		'ぞ': 'zo',
		'だ': 'da',
		'ぢ': 'di',
		'づ': 'du',
		'で': 'de',
		'ど': 'do',
		'ば': 'ba',
		'び': 'bi',
		'ぶ': 'bu',
		'べ': 'be',
		'ぼ': 'bo',
		'ぱ': 'pa',
		'ぴ': 'pi',
		'ぷ': 'pu',
		'ぺ': 'pe',
		'ぽ': 'po',
		'きゃ': 'kya',
		'きぃ': 'kyi',
		'きゅ': 'kyu',
		'きぇ': 'kye',
		'きょ': 'kyo',
		'くぁ': 'qa',
		'くぃ': 'qi',
		'くぇ': 'qe',
		'くぉ': 'qo',
		'くゃ': 'qya',
		'くゅ': 'qyu',
		'くょ': 'qyo',
		'しゃ': 'sya',
		'しぃ': 'syi',
		'しゅ': 'syu',
		'しぇ': 'sye',
		'しょ': 'syo',
		'ちゃ': 'cha',
		'ちぃ': 'chi',
		'ちゅ': 'chu',
		'ちぇ': 'che',
		'ちょ': 'cho',
		'てゃ': 'tha',
		'てぃ': 'thi',
		'てゅ': 'thu',
		'てぇ': 'the',
		'てょ': 'tho',
		'ひゃ': 'hya',
		'ひぃ': 'hyi',
		'ひゅ': 'hyu',
		'ひぇ': 'hye',
		'ひょ': 'hyo',
		'ふぁ': 'fa',
		'ふぃ': 'fi',
		'ふぇ': 'fe',
		'ふぉ': 'fo',
		'みゃ': 'mya',
		'みぃ': 'myi',
		'みゅ': 'myu',
		'みぇ': 'mye',
		'みょ': 'myo',
		'ヴぁ': 'va',
		'ヴぃ': 'vi',
		'ヴぇ': 've',
		'ヴぉ': 'vo',
		'ぎゃ': 'gya',
		'ぎぃ': 'gyi',
		'ぎゅ': 'gyu',
		'ぎぇ': 'gye',
		'ぎょ': 'gyo',
		'じゃ': 'jya',
		'じぃ': 'jyi',
		'じゅ': 'jyu',
		'じぇ': 'jye',
		'じょ': 'jyo',
		'ぢゃ': 'dya',
		'ぢぃ': 'dyi',
		'ぢゅ': 'dyu',
		'ぢぇ': 'dye',
		'ぢょ': 'dyo',
		'びゃ': 'bya',
		'びぃ': 'byi',
		'びゅ': 'byu',
		'びぇ': 'bye',
		'びょ': 'byo',
		'ぴゃ': 'pya',
		'ぴぃ': 'pyi',
		'ぴゅ': 'pyu',
		'ぴぇ': 'pye',
		'ぴょ': 'pyo',
		'ぁ': 'xa',
		'ぃ': 'xi',
		'ぅ': 'xu',
		'ぇ': 'xe',
		'ぉ': 'xo',
		'ゃ': 'xya',
		'ゅ': 'xyu',
		'ょ': 'xyo',
		'っ': 'xtu',
		'ヴ': 'vu',
		'ー': '-',
		'、': ', ',
		'，': ', ',
		'。': '.'
	};
	var repStr = String(targetStr), result = '';
	// カタカナからひらがなへ変換
	var toHiragana = function (kana) {
		return kana.replace(/[\u30a1-\u30f6]/g, function (match) {
			return String.fromCharCode(match.charCodeAt(0) - 0x60);
		});
	};
	// ひらがなに対応するローマ字を取得
	var getRoma = function (kana) {
		var roma = romanMap[toHiragana(kana)];
		if (roma) {
			if (typeof roma === 'string') {
				return roma;
			}
		}
		return kana;
	};
	// 文字列を1文字切り抜く
	var splice = function () {
		var oneChar = repStr.slice(0, 1);
		repStr = repStr.slice(1);
		return oneChar;
	}
	//残りの文字列が最初が小文字か判定
	var isSmallChar = function () {
		return !!repStr.slice(0, 1).match(/^[ぁぃぅぇぉゃゅょァィゥェォャュョ]$/);
	};
	//
	while (repStr) {
		slStr = splice();
		if (slStr.match(/^(っ|ッ)$/)) {
			slStr = splice();
			if (isSmallChar()) slStr += splice();

			roman = getRoma(slStr);
			roman = (roman !== slStr ? roman.slice(0, 1) : '') + roman;
		} else {
			if (isSmallChar()) slStr += splice();

			roman = getRoma(slStr);
		}
		result += roman;
	}
	return result;
};
```

上記で作成したモジュールを実行する為、 `mecab2.js` と言う名前のファイルを作成して以下の様に記述してみます。
```javascript
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
```
実行するには、以下のコマンドを実行します。
```bash
node mecab2.js
```
```bash
sagashitsudukenasai.sousurebamiidasemasu.
```