import dayjs from 'dayjs';

// NOTE: グローバルに定義が必要な拡張プラグインはここで定義

// 日本時間に変換する
import 'dayjs/locale/ja';

// プラグイン拡張
dayjs.locale('ja');

// export default 構文を提供し、“モジュール毎に1つのもの” のように見栄えを良くします。¥
export default dayjs;
