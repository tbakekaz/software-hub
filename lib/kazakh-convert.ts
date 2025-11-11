// 新疆哈萨克（阿拉伯） ↔ 哈萨克斯坦（西里尔）
// 说明：
// - 先应用多字符组合规则，再应用单字符映射，保证序与优先级正确
// - 阿文无大小写，这里输出西里尔后做“句首/空白后标题化”的简化大小写规范
// - 已优化算法，添加更多规则和上下文处理，提高准确性
// - 如发现错误，请提供具体例子以便进一步改进

export type KazakhScript = 'arabic' | 'cyrillic';

type Pair = [from: string, to: string];

// 长组合（优先，按长度和优先级排序）
const combosArabToCyr: Pair[] = [
  // 最长组合优先
  ['شش', 'Щ'], // shsh
  ['تس', 'Ц'], // ts
  // 双字符组合
  ['يا', 'Я'],
  ['يو', 'Ю'],
  ['یو', 'Ё'],
  // Hamza 影响元音
  ['ءا', 'Ә'],
  ['ئا', 'Ә'], // 另一种写法
  ['ءو', 'Ө'],
  ['ءۇ', 'Ү'],
  ['ءى', 'І'],
  // 常见双字符音节
  ['ۇي', 'ҮЙ'],
];

// 单字符映射（阿 → 西），默认输出为大写，随后统一做大小写规范
const singlesArabToCyr: Pair[] = [
  // 元音与半元音
  ['ا', 'А'], // 基本映射；在د后通过上下文规则变为Ә
  ['ە', 'Е'], // “كەرەك” -> “керек” 需要 ە → Е
  ['ی', 'И'], // 基本映射；在元音后通过上下文规则变为й
  ['ى', 'Ы'], // 基本映射；在词中通过上下文规则变为і，词尾保持ы
  ['و', 'О'], // 基本映射；带 Hamza 情况在组合中处理为 Ө
  ['ۆ', 'Ө'],
  ['ۇ', 'Ұ'],
  ['ۈ', 'Ү'],
  ['ۋ', 'У'], // 常用作 /w/ 或半元音，结尾“…ىرۋ” -> “…ыру” 需要 → У
  ['ئ', 'И'], // 另一种写法
  ['ء', ''], // 单独出现时通常不转换

  // 辅音
  ['ب', 'Б'],
  ['گ', 'Г'],
  ['ع', 'Ғ'], // 也有体系用 غ，这里用常见映射到 Ғ
  ['د', 'Д'],
  ['ج', 'Ж'],
  ['ز', 'З'],
  ['ي', 'И'], // 无点 ya 在词中多作元音 i
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
  ['ح', 'Х'], // 根据用户指定：ح = Х
  ['ھ', 'Һ'],
  ['چ', 'Ч'],
  ['ش', 'Ш'],
  // 其他可能的字符
  ['غ', 'Ғ'], // 另一种写法
  ['ض', 'Д'], // 可能的变体
  ['ط', 'Т'], // 可能的变体
  ['ظ', 'З'], // 可能的变体
  ['ذ', 'З'], // 可能的变体
  ['ث', 'С'], // 可能的变体
];

// 反向组合（西 → 阿），与上面相对称
const combosCyrToArab: Pair[] = [
  ['Щ', 'شش'],
  ['Ц', 'تس'],
  ['Я', 'يا'],
  ['Ю', 'يو'],
  ['Ё', 'یو'],
  ['Ә', 'ءا'],
  // 小写版本
  ['щ', 'شش'],
  ['ц', 'تس'],
  ['я', 'يا'],
  ['ю', 'يو'],
  ['ё', 'یو'],
  ['ә', 'ءا'],
];

// 反向单字符映射（西 → 阿），包含大小写
const singlesCyrToArab: Pair[] = [
  // 元音与半元音（大写）
  ['А', 'ا'],
  ['Е', 'ە'],
  ['И', 'ی'],
  ['Ы', 'ى'],
  ['О', 'و'],
  ['Ө', 'ۆ'],
  ['Ұ', 'ۇ'],
  ['Ү', 'ۈ'],
  ['У', 'ۋ'],

  // 辅音（大写）
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
  ['Х', 'ح'], // 根据用户指定：Х = ح
  ['Һ', 'ھ'],
  ['Ч', 'چ'],
  ['Ш', 'ش'],

  // 小写版本（与大写对应）
  ['а', 'ا'],
  ['е', 'ە'],
  ['и', 'ی'],
  ['ы', 'ى'],
  ['о', 'و'],
  ['ө', 'ۆ'],
  ['ұ', 'ۇ'],
  ['ү', 'ۈ'],
  ['у', 'ۋ'],
  ['б', 'ب'],
  ['г', 'گ'],
  ['ғ', 'ع'],
  ['д', 'د'],
  ['ж', 'ج'],
  ['з', 'ز'],
  ['й', 'ي'],
  ['к', 'ك'],
  ['қ', 'ق'],
  ['л', 'ل'],
  ['м', 'م'],
  ['н', 'ن'],
  ['ң', 'ڭ'],
  ['п', 'پ'],
  ['р', 'ر'],
  ['с', 'س'],
  ['т', 'ت'],
  ['ф', 'ف'],
  ['х', 'ح'], // 根据用户指定：х = ح
  ['һ', 'ھ'],
  ['ч', 'چ'],
  ['ш', 'ش'],
];

function applyPairs(input: string, pairs: Pair[]): string {
  let out = input;
  for (const [from, to] of pairs) {
    if (!from) continue;
    out = out.split(from).join(to);
  }
  return out;
}

// 句首标题化（仅在句首或句末标点后），不因空白而标题化，避免每个词首大写
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
  }
  return result;
}

// 上下文相关的特殊规则处理
function applyContextualRules(input: string): string {
  let s = input;
  
  // 规则1: د + ا → د + Ә（特殊规则：ا在د后变成Ә）
  s = s.replace(/د([ا])/g, 'دӘ');
  
  // 规则2: ي在元音后 → й（半元音），否则 → и（元音）
  // 先处理元音后的ي → й（需要在组合规则之前处理）
  s = s.replace(/([اەوۆۇۈӘӨҮ])ي/g, '$1й');
  
  // 规则3: ى在词中（前后都有非空白字符）→ і，在词尾 → ы
  // 先处理词中的ى → і（前后都有字母）
  s = s.replace(/([^\s\u200C\u200D])ى([^\s\u200C\u200D])/g, '$1і$2');
  
  return s;
}

export function arabicToCyrillic(input: string): string {
  // 多字符组合优先
  let s = applyPairs(input, combosArabToCyr);
  // 上下文相关规则
  s = applyContextualRules(s);
  // 单字符替换
  s = applyPairs(s, singlesArabToCyr);
  // 大小写规范（简化）
  s = sentenceCaseCyrillic(s);
  return s;
}

export function cyrillicToArabic(input: string): string {
  // 处理大小写：先处理大写，再处理小写
  let s = input;
  // 组合优先（包含大小写）
  s = applyPairs(s, combosCyrToArab);
  // 单字符（包含大小写）
  s = applyPairs(s, singlesCyrToArab);
  return s;
}

// 比较统一：将字符串按脚本统一到西里尔用于精确比较
export function normalizeForCompare(input: string, script: KazakhScript): string {
  const base = script === 'arabic' ? arabicToCyrillic(input) : input;
  return base.normalize('NFC');
}


