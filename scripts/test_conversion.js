const VOWELS = {
  '\u0905': 'a', '\u0906': '\u0101', '\u0907': 'i', '\u0908': '\u012B',
  '\u0909': 'u', '\u090A': '\u016B', '\u090B': '\u1E5B', '\u0960': '\u1E5D',
  '\u090C': '\u1E37', '\u0961': '\u1E39', '\u090F': '\u0113', '\u0910': 'ai',
  '\u0913': '\u014D', '\u0914': 'au',
};
const VOWEL_SIGNS = {
  '\u093E': '\u0101', '\u093F': 'i', '\u0940': '\u012B', '\u0941': 'u',
  '\u0942': '\u016B', '\u0943': '\u1E5B', '\u0944': '\u1E5D', '\u0962': '\u1E37',
  '\u0963': '\u1E39', '\u0947': '\u0113', '\u0948': 'ai', '\u094B': '\u014D',
  '\u094C': 'au',
};
const CONSONANTS = {
  '\u0915': 'k', '\u0916': 'kh', '\u0917': 'g', '\u0918': 'gh', '\u0919': '\u1E45',
  '\u091A': 'c', '\u091B': 'ch', '\u091C': 'j', '\u091D': 'jh', '\u091E': '\u00F1',
  '\u091F': '\u1E6D', '\u0920': '\u1E6Dh', '\u0921': '\u1E0D', '\u0922': '\u1E0Dh', '\u0923': '\u1E47',
  '\u0924': 't', '\u0925': 'th', '\u0926': 'd', '\u0927': 'dh', '\u0928': 'n',
  '\u092A': 'p', '\u092B': 'ph', '\u092C': 'b', '\u092D': 'bh', '\u092E': 'm',
  '\u092F': 'y', '\u0930': 'r', '\u0932': 'l', '\u0935': 'v',
  '\u0936': '\u015B', '\u0937': '\u1E63', '\u0938': 's', '\u0939': 'h',
};
const HALANT = '\u094D', ANUSVARA = '\u0902', VISARGA = '\u0903';
const NUKTA = '\u093C';

function isConsonant(ch) { return ch in CONSONANTS; }
function isVowelSign(ch) { return ch in VOWEL_SIGNS; }

function convert(text) {
  var tokens = [];
  var i = 0;
  function pushSyllable(txt) { tokens.push({ text: txt, type: 'syllable' }); }
  function pushOther(txt) { tokens.push({ text: txt, type: 'other' }); }

  while (i < text.length) {
    var ch = text[i];
    if (ch === ' ' || ch === '\n') { pushOther(ch); i++; }
    else if (ch in VOWELS) { pushSyllable(VOWELS[ch]); i++; }
    else if (isConsonant(ch)) {
      var syl = '';
      var endsWithHalant = false;
      while (i < text.length && isConsonant(text[i])) {
        syl += CONSONANTS[text[i]]; i++;
        if (i < text.length && text[i] === NUKTA) i++;
        if (i < text.length && text[i] === HALANT) {
          i++;
          if (i < text.length && isConsonant(text[i])) {
            endsWithHalant = false;
          } else {
            endsWithHalant = true; break;
          }
        } else { break; }
      }
      if (endsWithHalant) {
        syl += '\u0323';
      } else if (i < text.length && isVowelSign(text[i])) {
        syl += VOWEL_SIGNS[text[i]]; i++;
      } else {
        syl += 'a';
      }
      pushSyllable(syl);
    } else if (ch === ANUSVARA) {
      var last = tokens.length > 0 ? tokens[tokens.length-1] : null;
      if (last && last.type === 'syllable') last.text += '\u1E43';
      i++;
    } else if (ch === VISARGA) {
      var last = tokens.length > 0 ? tokens[tokens.length-1] : null;
      if (last && last.type === 'syllable') last.text += '\u1E25';
      i++;
    } else if (ch === HALANT) { i++; }
    else { pushOther(ch); i++; }
  }
  return tokens.map(t => t.text).join('');
}

console.log('=== halant dot-below tests ===');
console.log('ओम् →', convert('ओम्'));        // should be: ōm̤ (dot below m)
console.log('राम् →', convert('राम्'));       // rām̤
console.log('ब्रह्मा →', convert('ब्रह्मा')); // brahmā (cluster, no trailing halant)
console.log('त्वया →', convert('त्वया'));      // tvayā (cluster, no trailing halant)
console.log('विद्यत् →', convert('विद्यत्')); // vidyat̤ (trailing halant on t)
console.log('सरस्वती →', convert('सरस्वती')); // sarasvatī (cluster)
console.log('देवी →', convert('देवी'));        // dēvī
