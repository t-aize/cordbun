export enum TimestampStyle {
	ShortTime = "t",
	MediumTime = "T",
	ShortDate = "d",
	LongDate = "D",
	LongDateShortTime = "f",
	FullDateShortTime = "F",
	ShortDateShortTime = "s",
	ShortDateMediumTime = "S",
	Relative = "R",
}

export enum GuildNavigationType {
	Customize = "customize",
	Browse = "browse",
	Guide = "guide",
	LinkedRoles = "linked-roles",
}

export type FormattedUser<T extends string = string> = `<@${T}>`;
export type FormattedUserNick<T extends string = string> = `<@!${T}>`;
export type FormattedChannel<T extends string = string> = `<#${T}>`;
export type FormattedRole<T extends string = string> = `<@&${T}>`;
export type SlashCommand<N extends string = string, I extends string = string> = `</${N}:${I}>`;
export type CustomEmoji<N extends string = string, I extends string = string> = `<:${N}:${I}>`;
export type AnimatedEmoji<N extends string = string, I extends string = string> = `<a:${N}:${I}>`;
export type Timestamp<T extends number = number> = `<t:${T}>`;
export type TimestampStyled<T extends number = number, S extends TimestampStyle = TimestampStyle> = `<t:${T}:${S}>`;
export type GuildNavigation<
	T extends GuildNavigationType | `linked-roles:${string}` = GuildNavigationType | `linked-roles:${string}`,
> = `<id:${T}>`;
export type Email<U extends string = string, D extends string = string> = `<${U}@${D}>`;
export type PhoneNumber<T extends string = string> = `<+${T}>`;

export type Italic<T extends string = string> = `*${T}*`;
export type Bold<T extends string = string> = `**${T}**`;
export type Underline<T extends string = string> = `__${T}__`;
export type Strikethrough<T extends string = string> = `~~${T}~~`;
export type Spoiler<T extends string = string> = `||${T}||`;
export type BoldItalic<T extends string = string> = `***${T}***`;
export type UnderlineItalic<T extends string = string> = `__*${T}*__`;
export type UnderlineBold<T extends string = string> = `__**${T}**__`;
export type UnderlineBoldItalic<T extends string = string> = `__***${T}***__`;
export type InlineCode<T extends string = string> = `\`${T}\``;
export type CodeBlock<T extends string = string> = `\`\`\`\n${T}\n\`\`\``;
export type CodeBlockLang<L extends string = string, T extends string = string> = `\`\`\`${L}\n${T}\n\`\`\``;
export type BlockQuote<T extends string = string> = `> ${T}`;
export type BlockQuoteMulti<T extends string = string> = `>>> ${T}`;
export type Header1<T extends string = string> = `# ${T}`;
export type Header2<T extends string = string> = `## ${T}`;
export type Header3<T extends string = string> = `### ${T}`;
export type Subtext<T extends string = string> = `-# ${T}`;
export type MaskedLink<T extends string = string, U extends string = string> = `[${T}](${U})`;
export type ListItem<T extends string = string> = `- ${T}`;

export const Format = {
	userMention: <T extends string>(userId: T): FormattedUser<T> => `<@${userId}>`,

	userMentionNick: <T extends string>(userId: T): FormattedUserNick<T> => `<@!${userId}>`,

	channelMention: <T extends string>(channelId: T): FormattedChannel<T> => `<#${channelId}>`,

	roleMention: <T extends string>(roleId: T): FormattedRole<T> => `<@&${roleId}>`,

	slashCommand: <N extends string, I extends string>(name: N, commandId: I): SlashCommand<N, I> =>
		`</${name}:${commandId}>`,

	customEmoji: <N extends string, I extends string>(name: N, id: I): CustomEmoji<N, I> => `<:${name}:${id}>`,

	animatedEmoji: <N extends string, I extends string>(name: N, id: I): AnimatedEmoji<N, I> => `<a:${name}:${id}>`,

	timestamp: <T extends number>(unix: T): Timestamp<T> => `<t:${unix}>`,

	timestampStyled: <T extends number, S extends TimestampStyle>(unix: T, style: S): TimestampStyled<T, S> =>
		`<t:${unix}:${style}>`,

	guildNavigation: <T extends GuildNavigationType | `linked-roles:${string}`>(type: T): GuildNavigation<T> =>
		`<id:${type}>`,

	email: <U extends string, D extends string>(username: U, domain: D): Email<U, D> => `<${username}@${domain}>`,

	phoneNumber: <T extends string>(number: T): PhoneNumber<T> => `<+${number}>`,

	italic: <T extends string>(text: T): Italic<T> => `*${text}*`,

	bold: <T extends string>(text: T): Bold<T> => `**${text}**`,

	underline: <T extends string>(text: T): Underline<T> => `__${text}__`,

	strikethrough: <T extends string>(text: T): Strikethrough<T> => `~~${text}~~`,

	spoiler: <T extends string>(text: T): Spoiler<T> => `||${text}||`,

	boldItalic: <T extends string>(text: T): BoldItalic<T> => `***${text}***`,

	underlineItalic: <T extends string>(text: T): UnderlineItalic<T> => `__*${text}*__`,

	underlineBold: <T extends string>(text: T): UnderlineBold<T> => `__**${text}**__`,

	underlineBoldItalic: <T extends string>(text: T): UnderlineBoldItalic<T> => `__***${text}***__`,

	inlineCode: <T extends string>(code: T): InlineCode<T> => `\`${code}\``,

	codeBlock: <T extends string>(code: T): CodeBlock<T> => `\`\`\`\n${code}\n\`\`\``,

	codeBlockLang: <L extends string, T extends string>(lang: L, code: T): CodeBlockLang<L, T> =>
		`\`\`\`${lang}\n${code}\n\`\`\``,

	blockQuote: <T extends string>(text: T): BlockQuote<T> => `> ${text}`,

	blockQuoteMulti: <T extends string>(text: T): BlockQuoteMulti<T> => `>>> ${text}`,

	header1: <T extends string>(text: T): Header1<T> => `# ${text}`,

	header2: <T extends string>(text: T): Header2<T> => `## ${text}`,

	header3: <T extends string>(text: T): Header3<T> => `### ${text}`,

	subtext: <T extends string>(text: T): Subtext<T> => `-# ${text}`,

	maskedLink: <T extends string, U extends string>(text: T, url: U): MaskedLink<T, U> => `[${text}](${url})`,

	listItem: <T extends string>(text: T): ListItem<T> => `- ${text}`,
} as const;
