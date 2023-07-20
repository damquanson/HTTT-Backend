export default {
  UPLOAD_TYPE_PNG: 'image/png',
  UPLOAD_TYPE_JPEG: 'image/jpeg',
};

export const MAX_TOPIC_LINE_QA = 10;
export const MAX_QUESTION_LINE_QA = 10;
export const MAX_TEXT_LINE_QA = 5000;

export type ORDER = 'ASC' | 'DESC';

export const FOLDER_LINE_QA_IMAGE = 'line-qa/image/';
export const FOLDER_LINE_QA_FILE_IMPORT = 'line-qa/import/';
export const FOLDER_LINE_DATA_AUDIO = 'line-qa/data/audio/';
export const FOLDER_LINE_DATA_IMAGE = 'line-qa/data/image/';
export const FOLDER_LINE_DATA_FILE = 'line-qa/data/file/';
export const FOLDER_LINE_DATA_VIDEO = 'line-qa/data/video/';

export const PREVENT_ACTION_CONFIRM_LINE_QA = 'prevent_confirm_line:';
export const CONFIRM_MESSAGE_LINE_QA =
  'この回答で問題をご解決できましたでしょうか？';
export const ANSWER_DONE_MESSAGE_LINE_QA =
  'お問い合わせありがとうございます。ご質問等がございましたらお気楽にご連絡くださいませ！';

export const MESSAGE_SHOW_ALL_TOPIC =
  '以下のカテゴリごとを選択することで該当のカテゴリの問い合わせ質問が表示されます。';

export const TIME_EXPIRED_DOCUMENT_3 = 14; // 14 days

export const TIME_ZONE = 'Asia/Tokyo'; // time zone of japanese

export const CRON_JP_OH = '0 15 * * *'; // for time zone of japanese

export const MAX_LENGTH_RANDOM_PASSWORD_PUBLIC_URL = 5;

export const DEFAULT_CONTENT = '{}';

export const MAX_LENGTH_BUILDING_CODE = 10;

export const REGEX_NUMBER_REQUIRED = /^\d+$/;

export const MAX_LENGTH_VARCHAR_255 = 255;

export const MAX_LENGTH_ZIP_CODE = 7;
