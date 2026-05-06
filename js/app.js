/**
 * Devanagari to IAST (International Alphabet of Sanskrit Transliteration) converter.
 */

const VOWELS = {
  '\u0905': 'a',   '\u0906': '\u0101',  '\u0907': 'i',   '\u0908': '\u012B',
  '\u0909': 'u',   '\u090A': '\u016B',  '\u090B': '\u1E5B', '\u0960': '\u1E5D',
  '\u090C': '\u1E37', '\u0961': '\u1E39', '\u090F': '\u0113', '\u0910': 'ai',
  '\u0913': '\u014D', '\u0914': 'au',
};

const VOWEL_SIGNS = {
  '\u093E': '\u0101',  '\u093F': 'i',   '\u0940': '\u012B',  '\u0941': 'u',
  '\u0942': '\u016B',  '\u0943': '\u1E5B', '\u0944': '\u1E5D', '\u0962': '\u1E37',
  '\u0963': '\u1E39', '\u0947': '\u0113', '\u0948': 'ai',  '\u094B': '\u014D',
  '\u094C': 'au',
};

const CONSONANTS = {
  '\u0915': 'k',   '\u0916': 'kh',  '\u0917': 'g',   '\u0918': 'gh',  '\u0919': '\u1E45',
  '\u091A': 'c',   '\u091B': 'ch',  '\u091C': 'j',   '\u091D': 'jh',  '\u091E': '\u00F1',
  '\u091F': '\u1E6D',  '\u0920': '\u1E6Dh', '\u0921': '\u1E0D',  '\u0922': '\u1E0Dh', '\u0923': '\u1E47',
  '\u0924': 't',   '\u0925': 'th',  '\u0926': 'd',   '\u0927': 'dh',  '\u0928': 'n',
  '\u092A': 'p',   '\u092B': 'ph',  '\u092C': 'b',   '\u092D': 'bh',  '\u092E': 'm',
  '\u092F': 'y',   '\u0930': 'r',   '\u0932': 'l',   '\u0935': 'v',
  '\u0936': '\u015B',  '\u0937': '\u1E63',  '\u0938': 's',   '\u0939': 'h',
};

const DIGITS = {
  '\u0966': '0', '\u0967': '1', '\u0968': '2', '\u0969': '3', '\u096A': '4',
  '\u096B': '5', '\u096C': '6', '\u096D': '7', '\u096E': '8', '\u096F': '9',
};

const HALANT = '\u094D';
const ANUSVARA = '\u0902';
const VISARGA = '\u0903';
const CHANDRABINDU = '\u0901';
const AVAGRAHA = '\u093D';
const DANDA = '\u0964';
const DOUBLE_DANDA = '\u0965';
const NUKTA = '\u093C';

// VijayaDV font Private Use Area characters — VijayaDV font (sandhi_v2 registry)

// Accent markers
const ANUDATTA = '\uE301';           // Anudātta — underline accent
const SVARITA = '\uE302';            // Svarita — vertical mark above
const DIRGHA_SVARITA = '\uE303';     // Dīrgha Svarita — extended svarita
const KAMPITA_SVARITA = '\uE304';    // Kampita Svarita → displays as Dīrgha Svarita
const UDATTA = '\uE318';             // Udātta — no visible marker (implicit)
const PRACHAYA = '\uE32B';           // Prachaya — no visible marker (implicit)
const ARDHA_SVARITA = '\uE339';      // Ardha Svarita → displays as Svarita

// Internal svarita subtypes — all display as basic Svarita
const NITYA_SVARITA = '\uE326';
const ABHINIHATA_SVARITA = '\uE327';
const KSHIPRA_SVARITA = '\uE328';
const TAIROVYANJANA_SVARITA = '\uE329';
const PRAATIHATA_SVARITA = '\uE32A';
const PAADAVRUTTHA_SVARITA = '\uE32C';
const PRASHLISHTA_SVARITA = '\uE32D';

// Jihvāmūlīya / Upadhmānīya (half-visarga) — renders as ḥ in IAST
const JIHVAMULIYA = '\uE305';        // Half-visarga before ka/kha (jihvāmūlīya) or pa/pha (upadhmānīya)

// Sandhi / structural markers — invisible in VijayaDV font, skip in IAST
const AAKARA_PRASHLESHA = '\uE300';  // āa-kāra prashlesha
const PADA_END = '\uE320';           // Pada boundary marker
const PRASHLESHA = '\uE324';         // Prashlesha / poorvarupa marker
const AARSHA_ELONGATION = '\uE33C';  // Ārsha elongation (input-only)
const WORD_BOUNDARY = '\uE340';      // Word boundary marker

// Additional structural PUA markers — invisible, skip in IAST
const SANDHI_MARKER_E306 = '\uE306'; // Structural sandhi marker
const SANDHI_MARKER_E308 = '\uE308'; // Structural sandhi marker
const SANDHI_MARKER_E309 = '\uE309'; // Structural sandhi marker
const ASSIMILATION_MARK = '\uE325';  // Assimilation / doubling marker
const SANDHI_MARKER_E336 = '\uE336'; // Structural sandhi marker
const SANDHI_MARKER_E337 = '\uE337'; // Structural sandhi marker
const SANDHI_JOIN = '\uE338';        // Sandhi junction point
const REPH_MARKER = '\uE33B';        // Word-initial / reph structural marker
const SANDHI_MARKER_E33D = '\uE33D'; // Structural sandhi marker
const KANDA_START = '\uE341';        // Kanda boundary marker
const VERSE_START = '\uE342';        // Verse boundary marker
const VERSE_COMMENT = '\uE343';      // Verse comment marker
const SECTION_MARKER_E347 = '\uE347'; // Section marker
const VAKYA_AVASANA = '\uE348';      // Sentence-end marker
const PRAPATHAKA_START = '\uE34B';   // Prapāṭhaka boundary marker
const MULAM_VERSE = '\uE34F';        // Mūlam verse text marker
const PADA_START = '\uE351';         // Pada boundary start marker
const ANUVAKA_START = '\uE352';      // Anuvāka boundary marker

// PUA gakara — rendered as italic G in IAST
const PUA_GAKARA = '\uE321';

// Anusvara Agama (gum-kara) variants
const G_ANUSVARAGAMA_PUA = '\uE321'; // g  58145 — niranunaasika gakara (after deergha + samyoga)
const GUM = '\uE322';         // gṃ — saanunaasika gakara (standard)
const GGUM = '\uE323';        // ggṃ — gakaradvaya (after hrasva + samyoga)

function isConsonant(ch) {
  return ch in CONSONANTS;
}

function isVowelSign(ch) {
  return ch in VOWEL_SIGNS;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function devanagariToIAST(text) {
  // tokens: array of { text, type: 'syllable'|'other'|'gum-kara', accent: null|'anudatta'|'svarita' }
  // Each consonant-cluster+vowel or standalone vowel is one syllable token.
  // Accent PUA chars mark only the immediately preceding syllable token.
  var tokens = [];
  var i = 0;

  function lastAccentable() {
    for (var j = tokens.length - 1; j >= 0; j--) {
      if (tokens[j].type === 'syllable' || tokens[j].type === 'gum-kara') return tokens[j];
    }
    return null;
  }

  function pushSyllable(txt) {
    tokens.push({ text: txt, type: 'syllable', accent: null });
  }

  function pushOther(txt) {
    tokens.push({ text: txt, type: 'other', accent: null });
  }

  while (i < text.length) {
    var ch = text[i];

    // Anudātta — mark preceding syllable
    if (ch === ANUDATTA) {
      var s = lastAccentable();
      if (s) s.accent = 'anudatta';
      i++;

    // Svarita (basic + Ardha Svarita + all internal svarita subtypes)
    } else if (ch === SVARITA || ch === ARDHA_SVARITA ||
               ch === NITYA_SVARITA || ch === ABHINIHATA_SVARITA ||
               ch === KSHIPRA_SVARITA || ch === TAIROVYANJANA_SVARITA ||
               ch === PRAATIHATA_SVARITA || ch === PAADAVRUTTHA_SVARITA ||
               ch === PRASHLISHTA_SVARITA) {
      var s = lastAccentable();
      if (s) s.accent = 'svarita';
      i++;

    // Dīrgha Svarita + Kampita Svarita
    } else if (ch === DIRGHA_SVARITA || ch === KAMPITA_SVARITA) {
      var s = lastAccentable();
      if (s) s.accent = 'dirgha-svarita';
      i++;

    // Udātta and Prachaya — no visible marker
    } else if (ch === UDATTA || ch === PRACHAYA) {
      i++;

    // Jihvāmūlīya / Upadhmānīya — render as VijayaDV glyph in IAST
    } else if (ch === JIHVAMULIYA) {
      tokens.push({ text: ch, type: 'jihvamuliya', accent: null });
      i++;

    // PUA gakara — rendered as italic G
    } else if (ch === PUA_GAKARA) {
      tokens.push({ text: 'g', type: 'gum-kara', accent: null });
      i++;

    // Anusvara Agama gum-kara variants
    } else if (ch === GUM) {
      tokens.push({ text: 'g\u1E43', type: 'gum-kara', accent: null });
      i++;
    } else if (ch === GGUM) {
      tokens.push({ text: 'gg\u1E43', type: 'gum-kara', accent: null });
      i++;

    // PRASHLESHA (E324) — rendered as Devanagari avagraha ऽ in IAST
    } else if (ch === PRASHLESHA) {
      tokens.push({ text: '\u093D', type: 'avagraha', accent: null });
      i++;

    // All other PUA characters — drop
    } else if (ch.charCodeAt(0) >= 0xE000 && ch.charCodeAt(0) <= 0xF8FF) {
      i++;

    // Whitespace
    } else if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
      pushOther(ch);
      i++;

    // Standalone vowel — one syllable
    } else if (ch in VOWELS) {
      pushSyllable(VOWELS[ch]);
      i++;

    // Consonant cluster + vowel — one syllable
    } else if (isConsonant(ch)) {
      var syl = '';
      var endsWithHalant = false;
      // Consume consonant cluster (consonant + halant pairs)
      while (i < text.length && isConsonant(text[i])) {
        syl += CONSONANTS[text[i]];
        i++;
        if (i < text.length && text[i] === NUKTA) i++;
        if (i < text.length && text[i] === HALANT) {
          i++;
          // Check if another consonant follows — if so, continue cluster
          if (i < text.length && isConsonant(text[i])) {
            endsWithHalant = false;
          } else {
            endsWithHalant = true;
            break;
          }
        } else {
          break;
        }
      }
      // Add vowel, or dot-below for trailing halant on 'm'
      if (endsWithHalant && syl.endsWith('m')) {
        syl += '\u0323'; // combining dot below on final m
      } else if (endsWithHalant) {
        // other consonants: just leave bare consonant, no inherent 'a'
      } else if (i < text.length && isVowelSign(text[i])) {
        syl += VOWEL_SIGNS[text[i]];
        i++;
      } else {
        syl += 'a';
      }
      pushSyllable(syl);

    // Anusvara/visarga/chandrabindu — attach to preceding syllable
    } else if (ch === ANUSVARA) {
      var s = lastAccentable();
      if (s) s.text += '\u1E43'; else pushSyllable('\u1E43');
      i++;
    } else if (ch === VISARGA) {
      var s = lastAccentable();
      if (s) s.text += '\u1E25'; else pushSyllable('\u1E25');
      i++;
    } else if (ch === CHANDRABINDU) {
      var s = lastAccentable();
      if (s) s.text += 'm\u0310'; else pushSyllable('m\u0310');
      i++;

    } else if (ch === AVAGRAHA) {
      tokens.push({ text: '\u093D', type: 'avagraha', accent: null });
      i++;
    } else if (ch === HALANT) {
      i++;
    } else if (ch === DOUBLE_DANDA) {
      pushOther('||');
      i++;
    } else if (ch === DANDA) {
      pushOther('|');
      i++;
    } else if (ch in DIGITS) {
      pushOther(DIGITS[ch]);
      i++;
    } else if (ch === NUKTA) {
      i++;
    } else {
      pushOther(ch);
      i++;
    }
  }

  // Render tokens as HTML
  return tokens.map(function (t) {
    var escaped = escapeHtml(t.text);
    if (t.type === 'gum-kara') {
      var cls = 'gum-kara';
      if (t.accent) cls += ' accent-' + t.accent;
      return '<span class="' + cls + '">' + escaped + '</span>';
    }
    if (t.type === 'avagraha') {
      return '<span class="avagraha">' + escaped + '</span>';
    }
    if (t.type === 'jihvamuliya') {
      return '<span class="jihvamuliya">' + escaped + '</span>';
    }
    if (t.accent) {
      return '<span class="accent-' + t.accent + '">' + escaped + '</span>';
    }
    return escaped;
  }).join('');
}

function formatDevanagari(text) {
  // Keep original text with all PUA characters intact for VijayaDV font rendering.
  // Apply accent color highlights per syllable.
  var tokens = [];
  var i = 0;

  function lastAccentable() {
    for (var j = tokens.length - 1; j >= 0; j--) {
      if (tokens[j].type === 'syllable') return tokens[j];
    }
    return null;
  }

  while (i < text.length) {
    var ch = text[i];

    // Accent PUA — mark preceding syllable's color, keep char for VijayaDV font rendering
    if (ch === ANUDATTA) {
      var s = lastAccentable();
      if (s) { s.accent = 'anudatta'; s.text += ch; }
      i++;

    // Svarita (basic + Ardha Svarita + all internal svarita subtypes)
    } else if (ch === SVARITA || ch === ARDHA_SVARITA ||
               ch === NITYA_SVARITA || ch === ABHINIHATA_SVARITA ||
               ch === KSHIPRA_SVARITA || ch === TAIROVYANJANA_SVARITA ||
               ch === PRAATIHATA_SVARITA || ch === PAADAVRUTTHA_SVARITA ||
               ch === PRASHLISHTA_SVARITA) {
      var s = lastAccentable();
      if (s) { s.accent = 'svarita'; s.text += ch; }
      i++;

    // Dīrgha Svarita + Kampita Svarita
    } else if (ch === DIRGHA_SVARITA || ch === KAMPITA_SVARITA) {
      var s = lastAccentable();
      if (s) { s.accent = 'dirgha-svarita'; s.text += ch; }
      i++;

    // Udātta and Prachaya — no color class, keep char for font rendering
    } else if (ch === UDATTA || ch === PRACHAYA) {
      var s = lastAccentable();
      if (s) s.text += ch;
      i++;
    } else if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
      tokens.push({ text: ch, type: 'other', accent: null });
      i++;
    } else if (ch in VOWELS) {
      tokens.push({ text: ch, type: 'syllable', accent: null });
      i++;
    } else if (isConsonant(ch)) {
      var syl = ch;
      i++;
      while (i < text.length) {
        if (text[i] === NUKTA) {
          syl += text[i]; i++;
        } else if (text[i] === HALANT) {
          syl += text[i]; i++;
          if (i < text.length && isConsonant(text[i])) {
            syl += text[i]; i++;
          } else {
            break;
          }
        } else if (isVowelSign(text[i])) {
          syl += text[i]; i++;
          break;
        } else {
          break;
        }
      }
      tokens.push({ text: syl, type: 'syllable', accent: null });
    } else if (ch === ANUSVARA || ch === VISARGA || ch === CHANDRABINDU) {
      var s = lastAccentable();
      if (s) s.text += ch;
      else tokens.push({ text: ch, type: 'syllable', accent: null });
      i++;
    } else if (ch === DANDA || ch === DOUBLE_DANDA) {
      tokens.push({ text: ch, type: 'other', accent: null });
      i++;
    } else {
      // Keep all other chars (including unknown PUA) as-is
      var s = lastAccentable();
      if (s && ch.charCodeAt(0) >= 0xE000 && ch.charCodeAt(0) <= 0xF8FF) {
        s.text += ch; // attach unknown PUA to preceding syllable for font rendering
      } else {
        tokens.push({ text: ch, type: 'other', accent: null });
      }
      i++;
    }
  }

  return tokens.map(function (t) {
    var escaped = escapeHtml(t.text);
    if (t.accent) {
      return '<span class="accent-' + t.accent + '">' + escaped + '</span>';
    }
    return escaped;
  }).join('');
}

function withLineNumbers(html) {
  var rows = html.split('\n').map(function (line, idx) {
    return '<tr>' +
      '<td class="line-num">' + (idx + 1) + '</td>' +
      '<td class="line-content">' + line + '</td>' +
      '</tr>';
  }).join('');
  return '<table class="output-table"><tbody>' + rows + '</tbody></table>';
}

document.addEventListener('DOMContentLoaded', function () {
  const inputEl = document.getElementById('devanagari-input');
  const outputEl = document.getElementById('iast-output');
  const sanskritEl = document.getElementById('sanskrit-output');
  const convertBtn = document.getElementById('convert-btn');
  const clearBtn = document.getElementById('clear-btn');
  const copyBtn = document.getElementById('copy-btn');
  const sampleBtn = document.getElementById('sample-btn');

  const sampleText =
    'मेधा देवी जुषमाणा न आगा द्विश्वाची भद्रा सुमनस्यमाना।\n' +
    'त्वया जुष्टा नुदमाना दुरुक्ता न्बृह द्वदेम विदथे सुवीराः।।\n' +
    'त्वया जुष्ट ऋषि र्भवति देवि त्वया ब्रह्मा गतश्री रुत त्वया।\n' +
    'त्वया जुष्टश्चित्रँ विन्दते वसु सा नो जुषस्व द्रविणोन मेधे।।';

  function doConvert() {
    const input = inputEl.value.trim();
    if (!input) {
      sanskritEl.innerHTML = '';
      outputEl.innerHTML = '';
      return;
    }
    sanskritEl.innerHTML = withLineNumbers(formatDevanagari(input));
    outputEl.innerHTML = withLineNumbers(devanagariToIAST(input));
  }

  convertBtn.addEventListener('click', doConvert);

  inputEl.addEventListener('input', function () {
    doConvert();
    localStorage.setItem('t13r-input', inputEl.value);
  });

  // Restore previous input from local cache
  var saved = localStorage.getItem('t13r-input');
  if (saved) {
    inputEl.value = saved;
    doConvert();
  }

  clearBtn.addEventListener('click', function () {
    inputEl.value = '';
    sanskritEl.innerHTML = '';
    outputEl.innerHTML = '';
    localStorage.removeItem('t13r-input');
    inputEl.focus();
  });

  copyBtn.addEventListener('click', function () {
    const text = outputEl.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(function () {
      copyBtn.textContent = 'Copied!';
      setTimeout(function () {
        copyBtn.textContent = 'Copy IAST';
      }, 1500);
    });
  });

  sampleBtn.addEventListener('click', function () {
    inputEl.value = sampleText;
    doConvert();
  });
});
