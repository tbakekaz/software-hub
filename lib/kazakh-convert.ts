// 新疆哈萨克（阿拉伯） ↔ 哈萨克斯坦（西里尔）
// 说明：
// - 先应用多字符组合规则，再应用单字符映射，保证序与优先级正确
// - 阿文无大小写，这里输出西里尔后做“句首/空白后标题化”的简化大小写规范
// - 该实现以常见转换实践为基准，覆盖常用组合（如 يا/يو/شش/تس、ءا→Ә 等）
// - 若需完全与指定站点的算法一致，请提供权威映射表或测试用例以逐条对齐

export type KazakhScript = 'arabic' | 'cyrillic';

type Pair = [from: string, to: string];

// 长组合（优先）
const combosArabToCyr: Pair[] = [
  // 长组合
  ['شش', 'Щ'], // shsh
  ['تس', 'Ц'], // ts
  ['يا', 'Я'],
  ['يو', 'Ю'],
  ['یو', 'Ё'],
  // ء + ا -> Ә
  ['ءا', 'Ә'],
];

// 单字符映射（阿 → 西），默认输出为大写，随后统一做大小写规范
const singlesArabToCyr: Pair[] = [
  // 元音与半元音
  ['ا', 'А'],
  ['ە', 'Е'], // “كەرەك” -> “керек” 需要 ە → Е
  ['ی', 'И'],
  ['ى', 'Ы'], // “مىسالاى” -> “мысалай” 需要 ى → Ы
  ['و', 'О'], // “وسىلاي” -> “осылай” 需要 و → О
  ['ۆ', 'Ө'],
  ['ۇ', 'Ұ'],
  ['ۈ', 'Ү'],
  ['ۋ', 'У'], // 常用作 /w/ 或半元音，结尾“…ىرۋ” -> “…ыру” 需要 → У

  // 辅音
  ['ب', 'Б'],
  ['گ', 'Г'],
  ['ع', 'Ғ'], // 也有体系用 غ，这里用常见映射到 Ғ
  ['د', 'Д'],
  ['ج', 'Ж'],
  ['ز', 'З'],
  ['ي', 'Й'],
  ['ك', 'К'],
  ['ق', 'Қ'],
  ['ل', 'Л'],
  ['م', 'М'],
  ['ن', 'Н'],
  ['ڭ', 'Ң'],
  ['پ', 'П'],
  ['ر', 'Р'],
  ['س', 'С'],
  ['ت', 'Т'],
  ['ف', 'Ф'],
  ['خ', 'Х'],
  ['ھ', 'Һ'],
  ['چ', 'Ч'],
  ['ش', 'Ш'],
];

// 反向组合（西 → 阿），与上面相对称
const combosCyrToArab: Pair[] = [
  ['Щ', 'شش'],
  ['Ц', 'تس'],
  ['Я', 'يا'],
  ['Ю', 'يو'],
  ['Ё', 'یو'],
  ['Ә', 'ءا'],
];

// 反向单字符映射（西 → 阿）
const singlesCyrToArab: Pair[] = [
  // 元音与半元音（与阿→西对应）
  ['А', 'ا'],
  ['Е', 'ە'],
  ['И', 'ی'],
  ['Ы', 'ى'],
  ['О', 'و'],
  ['Ө', 'ۆ'],
  ['Ұ', 'ۇ'],
  ['Ү', 'ۈ'],
  ['У', 'ۋ'],

  // 辅音
  ['Б', 'ب'],
  ['Г', 'گ'],
  ['Ғ', 'ع'],
  ['Д', 'د'],
  ['Ж', 'ج'],
  ['З', 'ز'],
  ['Й', 'ي'],
  ['К', 'ك'],
  ['Қ', 'ق'],
  ['Л', 'ل'],
  ['М', 'م'],
  ['Н', 'ن'],
  ['Ң', 'ڭ'],
  ['П', 'پ'],
  ['Р', 'ر'],
  ['С', 'س'],
  ['Т', 'ت'],
  ['Ф', 'ف'],
  ['Х', 'خ'],
  ['Һ', 'ھ'],
  ['Ч', 'چ'],
  ['Ш', 'ش'],
];

function applyPairs(input: string, pairs: Pair[]): string {
  let out = input;
  for (const [from, to] of pairs) {
    if (!from) continue;
    out = out.split(from).join(to);
  }
  return out;
}

// 句首/空白后标题化（简化大小写规范）
function sentenceCaseCyrillic(input: string): string {
  let result = '';
  let capitalize = true;
  const upper = (s: string) => s.toUpperCase();
  const lower = (s: string) => s.toLowerCase();

  // 先统一小写，再按条件大写更稳定
  const allLower = input.toLowerCase();
  for (const ch of allLower) {
    // 西里尔范围或特殊哈字母
    if (/[а-яёәіөұүқң]/.test(ch)) {
      result += capitalize ? upper(ch) : ch;
      capitalize = false;
      continue;
    }
    // 非字母原样
    result += ch;
    if (/[.!?؛؟]/.test(ch)) capitalize = true;
    if (/\s/.test(ch)) capitalize = true;
  }
  return result;
}

export function arabicToCyrillic(input: string): string {
  // 多字符组合优先
  let s = applyPairs(input, combosArabToCyr);
  // 单字符替换
  s = applyPairs(s, singlesArabToCyr);
  // 大小写规范（简化）
  s = sentenceCaseCyrillic(s);
  return s;
}

export function cyrillicToArabic(input: string): string {
  // 优先处理大写（先标准化到大写，映射后阿文大小写无关）
  let s = input;
  // 组合优先
  s = applyPairs(s, combosCyrToArab);
  // 单字符
  s = applyPairs(s, singlesCyrToArab);
  return s;
}

// 比较统一：将字符串按脚本统一到西里尔用于精确比较
export function normalizeForCompare(input: string, script: KazakhScript): string {
  const base = script === 'arabic' ? arabicToCyrillic(input) : input;
  return base.normalize('NFC');
}


