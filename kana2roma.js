const { type } = require("os");

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