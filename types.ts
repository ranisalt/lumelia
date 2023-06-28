type TelegramUser = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

type TelegramChat = {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  // title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TelegramMessageEntity = {
  type:
    | "mention"
    | "hashtag"
    | "cashtag"
    | "bot_command"
    | "url"
    | "email"
    | "phone_number"
    | "bold"
    | "italic"
    | "underline"
    | "strikethrough"
    | "spoiler"
    | "code"
    | "pre"
    | "text_link"
    | "text_mention"
    | "custom_emoji";
  offset: number;
  length: number;
};

export type TelegramMessage = {
  message_id: number;
  from: TelegramUser;
  // date: number;
  chat: TelegramChat;
  text: string;
  entities?: TelegramMessageEntity[];
};
