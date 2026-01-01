/**
 * Timestamp display styles for Discord.
 * @see {@link https://discord.com/developers/docs/reference#message-formatting-timestamp-styles}
 */
export enum TimestampStyle {
	/** Short time format (e.g., 16:20) */
	ShortTime = "t",
	/** Medium time format (e.g., 16:20:30) */
	MediumTime = "T",
	/** Short date format (e.g., 20/04/2021) */
	ShortDate = "d",
	/** Long date format (e.g., April 20, 2021) */
	LongDate = "D",
	/** Long date with short time (e.g., April 20, 2021 at 16:20) - default */
	LongDateShortTime = "f",
	/** Full date with short time (e.g., Tuesday, April 20, 2021 at 16:20) */
	FullDateShortTime = "F",
	/** Short date with short time (e.g., 20/04/2021, 16:20) */
	ShortDateShortTime = "s",
	/** Short date with medium time (e.g., 20/04/2021, 16:20:30) */
	ShortDateMediumTime = "S",
	/** Relative time (e.g., 2 months ago) */
	Relative = "R",
}

/**
 * Guild navigation types for in-app navigation.
 * @see {@link https://discord.com/developers/docs/reference#message-formatting-guild-navigation-types}
 */
export enum GuildNavigationType {
	/** Server onboarding customization tab */
	Customize = "customize",
	/** Browse channels tab */
	Browse = "browse",
	/** Server guide */
	Guide = "guide",
	/** Linked roles settings */
	LinkedRoles = "linked-roles",
}

/** User mention format: `<@USER_ID>` */
export type FormattedUser<T extends string = string> = `<@${T}>`;
/** User mention with nickname format (deprecated): `<@!USER_ID>` */
export type FormattedUserNick<T extends string = string> = `<@!${T}>`;
/** Channel mention format: `<#CHANNEL_ID>` */
export type FormattedChannel<T extends string = string> = `<#${T}>`;
/** Role mention format: `<@&ROLE_ID>` */
export type FormattedRole<T extends string = string> = `<@&${T}>`;
/** Slash command format: `</NAME:COMMAND_ID>` */
export type SlashCommand<N extends string = string, I extends string = string> = `</${N}:${I}>`;
/** Custom emoji format: `<:NAME:ID>` */
export type CustomEmoji<N extends string = string, I extends string = string> = `<:${N}:${I}>`;
/** Animated emoji format: `<a:NAME:ID>` */
export type AnimatedEmoji<N extends string = string, I extends string = string> = `<a:${N}:${I}>`;
/** Unix timestamp format: `<t:TIMESTAMP>` */
export type Timestamp<T extends number = number> = `<t:${T}>`;
/** Styled Unix timestamp format: `<t:TIMESTAMP:STYLE>` */
export type TimestampStyled<T extends number = number, S extends TimestampStyle = TimestampStyle> = `<t:${T}:${S}>`;
/** Guild navigation format: `<id:TYPE>` */
export type GuildNavigation<
	T extends GuildNavigationType | `linked-roles:${string}` = GuildNavigationType | `linked-roles:${string}`,
> = `<id:${T}>`;
/** Email format: `<USERNAME@DOMAIN>` */
export type Email<U extends string = string, D extends string = string> = `<${U}@${D}>`;
/** Phone number format: `<+PHONE_NUMBER>` */
export type PhoneNumber<T extends string = string> = `<+${T}>`;

/** Italic text: `*text*` */
export type Italic<T extends string = string> = `*${T}*`;
/** Bold text: `**text**` */
export type Bold<T extends string = string> = `**${T}**`;
/** Underlined text: `__text__` */
export type Underline<T extends string = string> = `__${T}__`;
/** Strikethrough text: `~~text~~` */
export type Strikethrough<T extends string = string> = `~~${T}~~`;
/** Spoiler text: `||text||` */
export type Spoiler<T extends string = string> = `||${T}||`;
/** Bold italic text: `***text***` */
export type BoldItalic<T extends string = string> = `***${T}***`;
/** Underlined italic text: `__*text*__` */
export type UnderlineItalic<T extends string = string> = `__*${T}*__`;
/** Underlined bold text: `__**text**__` */
export type UnderlineBold<T extends string = string> = `__**${T}**__`;
/** Underlined bold italic text: `__***text***__` */
export type UnderlineBoldItalic<T extends string = string> = `__***${T}***__`;
/** Inline code: `` `code` `` */
export type InlineCode<T extends string = string> = `\`${T}\``;
/** Code block: ``` ```code``` ``` */
export type CodeBlock<T extends string = string> = `\`\`\`\n${T}\n\`\`\``;
/** Code block with language: ``` ```lang\ncode``` ``` */
export type CodeBlockLang<L extends string = string, T extends string = string> = `\`\`\`${L}\n${T}\n\`\`\``;
/** Block quote: `> text` */
export type BlockQuote<T extends string = string> = `> ${T}`;
/** Multi-line block quote: `>>> text` */
export type BlockQuoteMulti<T extends string = string> = `>>> ${T}`;
/** Header level 1: `# text` */
export type Header1<T extends string = string> = `# ${T}`;
/** Header level 2: `## text` */
export type Header2<T extends string = string> = `## ${T}`;
/** Header level 3: `### text` */
export type Header3<T extends string = string> = `### ${T}`;
/** Subtext: `-# text` */
export type Subtext<T extends string = string> = `-# ${T}`;
/** Masked link: `[text](url)` */
export type MaskedLink<T extends string = string, U extends string = string> = `[${T}](${U})`;
/** List item: `- text` */
export type ListItem<T extends string = string> = `- ${T}`;

/**
 * Utilities for formatting Discord message content.
 * Discord uses a subset of markdown with custom extensions for mentions, timestamps, etc.
 * @see {@link https://discord.com/developers/docs/reference#message-formatting}
 */
export const Format = {
	/**
	 * Creates a user mention.
	 * @param userId - The user ID to mention
	 * @returns Formatted user mention
	 */
	userMention: <T extends string>(userId: T): FormattedUser<T> => `<@${userId}>`,

	/**
	 * Creates a user mention with nickname format (deprecated).
	 * @param userId - The user ID to mention
	 * @returns Formatted user mention with nickname
	 * @deprecated Use userMention instead
	 */
	userMentionNick: <T extends string>(userId: T): FormattedUserNick<T> => `<@!${userId}>`,

	/**
	 * Creates a channel mention.
	 * @param channelId - The channel ID to mention
	 * @returns Formatted channel mention
	 */
	channelMention: <T extends string>(channelId: T): FormattedChannel<T> => `<#${channelId}>`,

	/**
	 * Creates a role mention.
	 * @param roleId - The role ID to mention
	 * @returns Formatted role mention
	 */
	roleMention: <T extends string>(roleId: T): FormattedRole<T> => `<@&${roleId}>`,

	/**
	 * Creates a clickable slash command reference.
	 * @param name - The command name (can include subcommands)
	 * @param commandId - The command ID
	 * @returns Formatted slash command
	 */
	slashCommand: <N extends string, I extends string>(name: N, commandId: I): SlashCommand<N, I> =>
		`</${name}:${commandId}>`,

	/**
	 * Creates a custom emoji reference.
	 * @param name - The emoji name
	 * @param id - The emoji ID
	 * @returns Formatted custom emoji
	 */
	customEmoji: <N extends string, I extends string>(name: N, id: I): CustomEmoji<N, I> => `<:${name}:${id}>`,

	/**
	 * Creates an animated emoji reference.
	 * @param name - The emoji name
	 * @param id - The emoji ID
	 * @returns Formatted animated emoji
	 */
	animatedEmoji: <N extends string, I extends string>(name: N, id: I): AnimatedEmoji<N, I> => `<a:${name}:${id}>`,

	/**
	 * Creates a timestamp that displays in the user's timezone.
	 * @param unix - Unix timestamp in seconds
	 * @returns Formatted timestamp
	 */
	timestamp: <T extends number>(unix: T): Timestamp<T> => `<t:${unix}>`,

	/**
	 * Creates a styled timestamp that displays in the user's timezone.
	 * @param unix - Unix timestamp in seconds
	 * @param style - The display style
	 * @returns Formatted styled timestamp
	 */
	timestampStyled: <T extends number, S extends TimestampStyle>(unix: T, style: S): TimestampStyled<T, S> =>
		`<t:${unix}:${style}>`,

	/**
	 * Creates a guild navigation link.
	 * @param type - The navigation type
	 * @returns Formatted guild navigation
	 */
	guildNavigation: <T extends GuildNavigationType | `linked-roles:${string}`>(type: T): GuildNavigation<T> =>
		`<id:${type}>`,

	/**
	 * Creates a clickable email link.
	 * @param username - The email username
	 * @param domain - The email domain
	 * @returns Formatted email
	 */
	email: <U extends string, D extends string>(username: U, domain: D): Email<U, D> => `<${username}@${domain}>`,

	/**
	 * Creates a clickable phone number link.
	 * @param number - The phone number
	 * @returns Formatted phone number
	 */
	phoneNumber: <T extends string>(number: T): PhoneNumber<T> => `<+${number}>`,

	/**
	 * Formats text as italic.
	 * @param text - The text to format
	 * @returns Italic text
	 */
	italic: <T extends string>(text: T): Italic<T> => `*${text}*`,

	/**
	 * Formats text as bold.
	 * @param text - The text to format
	 * @returns Bold text
	 */
	bold: <T extends string>(text: T): Bold<T> => `**${text}**`,

	/**
	 * Formats text as underlined.
	 * @param text - The text to format
	 * @returns Underlined text
	 */
	underline: <T extends string>(text: T): Underline<T> => `__${text}__`,

	/**
	 * Formats text with strikethrough.
	 * @param text - The text to format
	 * @returns Strikethrough text
	 */
	strikethrough: <T extends string>(text: T): Strikethrough<T> => `~~${text}~~`,

	/**
	 * Formats text as a spoiler (hidden until clicked).
	 * @param text - The text to format
	 * @returns Spoiler text
	 */
	spoiler: <T extends string>(text: T): Spoiler<T> => `||${text}||`,

	/**
	 * Formats text as bold and italic.
	 * @param text - The text to format
	 * @returns Bold italic text
	 */
	boldItalic: <T extends string>(text: T): BoldItalic<T> => `***${text}***`,

	/**
	 * Formats text as underlined and italic.
	 * @param text - The text to format
	 * @returns Underlined italic text
	 */
	underlineItalic: <T extends string>(text: T): UnderlineItalic<T> => `__*${text}*__`,

	/**
	 * Formats text as underlined and bold.
	 * @param text - The text to format
	 * @returns Underlined bold text
	 */
	underlineBold: <T extends string>(text: T): UnderlineBold<T> => `__**${text}**__`,

	/**
	 * Formats text as underlined, bold, and italic.
	 * @param text - The text to format
	 * @returns Underlined bold italic text
	 */
	underlineBoldItalic: <T extends string>(text: T): UnderlineBoldItalic<T> => `__***${text}***__`,

	/**
	 * Formats text as inline code.
	 * @param code - The code to format
	 * @returns Inline code
	 */
	inlineCode: <T extends string>(code: T): InlineCode<T> => `\`${code}\``,

	/**
	 * Formats text as a code block.
	 * @param code - The code to format
	 * @returns Code block
	 */
	codeBlock: <T extends string>(code: T): CodeBlock<T> => `\`\`\`\n${code}\n\`\`\``,

	/**
	 * Formats text as a code block with syntax highlighting.
	 * @param lang - The language for syntax highlighting
	 * @param code - The code to format
	 * @returns Code block with language
	 */
	codeBlockLang: <L extends string, T extends string>(lang: L, code: T): CodeBlockLang<L, T> =>
		`\`\`\`${lang}\n${code}\n\`\`\``,

	/**
	 * Formats text as a single-line block quote.
	 * @param text - The text to format
	 * @returns Block quote
	 */
	blockQuote: <T extends string>(text: T): BlockQuote<T> => `> ${text}`,

	/**
	 * Formats text as a multi-line block quote.
	 * @param text - The text to format
	 * @returns Multi-line block quote
	 */
	blockQuoteMulti: <T extends string>(text: T): BlockQuoteMulti<T> => `>>> ${text}`,

	/**
	 * Formats text as a level 1 header.
	 * @param text - The text to format
	 * @returns Header 1
	 */
	header1: <T extends string>(text: T): Header1<T> => `# ${text}`,

	/**
	 * Formats text as a level 2 header.
	 * @param text - The text to format
	 * @returns Header 2
	 */
	header2: <T extends string>(text: T): Header2<T> => `## ${text}`,

	/**
	 * Formats text as a level 3 header.
	 * @param text - The text to format
	 * @returns Header 3
	 */
	header3: <T extends string>(text: T): Header3<T> => `### ${text}`,

	/**
	 * Formats text as subtext (smaller, dimmed text).
	 * @param text - The text to format
	 * @returns Subtext
	 */
	subtext: <T extends string>(text: T): Subtext<T> => `-# ${text}`,

	/**
	 * Creates a masked link (hyperlink with custom text).
	 * @param text - The display text
	 * @param url - The URL to link to
	 * @returns Masked link
	 */
	maskedLink: <T extends string, U extends string>(text: T, url: U): MaskedLink<T, U> => `[${text}](${url})`,

	/**
	 * Formats text as a list item.
	 * @param text - The text to format
	 * @returns List item
	 */
	listItem: <T extends string>(text: T): ListItem<T> => `- ${text}`,
} as const;
