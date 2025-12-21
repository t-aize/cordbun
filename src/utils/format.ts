export const DISCORD_EPOCH = 1420070400000n;
export const CDN_URL = "https://cdn.discordapp.com";
export const MEDIA_URL = "https://media.discordapp.net";
export const API_URL = "https://discord.com/api";

export enum TimestampStyle {
	ShortTime = "t",
	LongTime = "T",
	ShortDate = "d",
	LongDate = "D",
	ShortDateTime = "f",
	LongDateTime = "F",
	ShortDateShortTime = "s",
	ShortDateLongTime = "S",
	Relative = "R",
}

export enum GuildNavigationType {
	Customize = "customize",
	Browse = "browse",
	Guide = "guide",
	LinkedRoles = "linked-roles",
}

export enum Locale {
	Indonesian = "id",
	Danish = "da",
	German = "de",
	EnglishUK = "en-GB",
	EnglishUS = "en-US",
	Spanish = "es-ES",
	SpanishLATAM = "es-419",
	French = "fr",
	Croatian = "hr",
	Italian = "it",
	Lithuanian = "lt",
	Hungarian = "hu",
	Dutch = "nl",
	Norwegian = "no",
	Polish = "pl",
	PortugueseBrazilian = "pt-BR",
	Romanian = "ro",
	Finnish = "fi",
	Swedish = "sv-SE",
	Vietnamese = "vi",
	Turkish = "tr",
	Czech = "cs",
	Greek = "el",
	Bulgarian = "bg",
	Russian = "ru",
	Ukrainian = "uk",
	Hindi = "hi",
	Thai = "th",
	ChineseChina = "zh-CN",
	Japanese = "ja",
	ChineseTaiwan = "zh-TW",
	Korean = "ko",
}

export enum ImageFormat {
	Jpeg = "jpg",
	Png = "png",
	WebP = "webp",
	Gif = "gif",
	Avif = "avif",
	Lottie = "json",
}

export function bold(text: string): string {
	return `**${text}**`;
}

export function italic(text: string): string {
	return `*${text}*`;
}

export function underline(text: string): string {
	return `__${text}__`;
}

export function strikethrough(text: string): string {
	return `~~${text}~~`;
}

export function spoiler(text: string): string {
	return `||${text}||`;
}

export function inlineCode(text: string): string {
	return `\`${text}\``;
}

export function codeBlock(text: string, language?: string): string {
	return `\`\`\`${language ?? ""}\n${text}\n\`\`\``;
}

export function blockQuote(text: string): string {
	return `>>> ${text}`;
}

export function quote(text: string): string {
	return `> ${text}`;
}

export function header(text: string, level: 1 | 2 | 3 = 1): string {
	return `${"#".repeat(level)} ${text}`;
}

export function subtext(text: string): string {
	return `-# ${text}`;
}

export function bulletList(items: string[]): string {
	return items.map((item) => `- ${item}`).join("\n");
}

export function numberedList(items: string[]): string {
	return items.map((item, i) => `${i + 1}. ${item}`).join("\n");
}

export function maskedLink(text: string, url: string): string {
	return `[${text}](${url})`;
}

export function suppressEmbed(url: string): string {
	return `<${url}>`;
}

export function userMention(userId: string): string {
	return `<@${userId}>`;
}

export function channelMention(channelId: string): string {
	return `<#${channelId}>`;
}

export function roleMention(roleId: string): string {
	return `<@&${roleId}>`;
}

export function slashCommand(name: string, commandId: string): string {
	return `</${name}:${commandId}>`;
}

export function slashCommandWithSubcommand(
	name: string,
	subcommand: string,
	commandId: string,
): string {
	return `</${name} ${subcommand}:${commandId}>`;
}

export function slashCommandWithSubcommandGroup(
	name: string,
	group: string,
	subcommand: string,
	commandId: string,
): string {
	return `</${name} ${group} ${subcommand}:${commandId}>`;
}

export function customEmoji(name: string, emojiId: string): string {
	return `<:${name}:${emojiId}>`;
}

export function animatedEmoji(name: string, emojiId: string): string {
	return `<a:${name}:${emojiId}>`;
}

export function timestamp(time: Date | number, style?: TimestampStyle): string {
	const seconds =
		typeof time === "number" ? time : Math.floor(time.getTime() / 1000);
	return style ? `<t:${seconds}:${style}>` : `<t:${seconds}>`;
}

export function guildNavigation(type: GuildNavigationType): string {
	return `<id:${type}>`;
}

export function linkedRoleNavigation(roleId: string): string {
	return `<id:linked-roles:${roleId}>`;
}

export function email(address: string): string {
	return `<${address}>`;
}

export function emailWithParams(
	address: string,
	subject?: string,
	body?: string,
): string {
	const params: string[] = [];
	if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
	if (body) params.push(`body=${encodeURIComponent(body)}`);
	return params.length > 0
		? `<${address}?${params.join("&")}>`
		: `<${address}>`;
}

export function phoneNumber(number: string): string {
	return `<+${number}>`;
}

export function snowflakeToTimestamp(snowflake: string): Date {
	const id = BigInt(snowflake);
	const timestamp = Number((id >> 22n) + DISCORD_EPOCH);
	return new Date(timestamp);
}

export function timestampToSnowflake(timestamp: Date | number): string {
	const ms = typeof timestamp === "number" ? timestamp : timestamp.getTime();
	const snowflake = (BigInt(ms) - DISCORD_EPOCH) << 22n;
	return snowflake.toString();
}

export function getDefaultAvatarIndex(userId: string): number {
	return Number((BigInt(userId) >> 22n) % 6n);
}

export function getLegacyDefaultAvatarIndex(discriminator: string): number {
	return Number.parseInt(discriminator, 10) % 5;
}

export function isAnimatedHash(hash: string): boolean {
	return hash.startsWith("a_");
}

export function cdnUrl(
	path: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	let url = `${CDN_URL}/${path}.${format}`;
	if (size) url += `?size=${size}`;
	return url;
}

export function emojiUrl(
	emojiId: string,
	format: ImageFormat = ImageFormat.WebP,
	size?: number,
): string {
	return cdnUrl(`emojis/${emojiId}`, format, size);
}

export function guildIconUrl(
	guildId: string,
	iconHash: string,
	format?: ImageFormat,
	size?: number,
): string {
	const fmt =
		format ?? (isAnimatedHash(iconHash) ? ImageFormat.Gif : ImageFormat.Png);
	return cdnUrl(`icons/${guildId}/${iconHash}`, fmt, size);
}

export function guildSplashUrl(
	guildId: string,
	splashHash: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`splashes/${guildId}/${splashHash}`, format, size);
}

export function guildDiscoverySplashUrl(
	guildId: string,
	splashHash: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`discovery-splashes/${guildId}/${splashHash}`, format, size);
}

export function guildBannerUrl(
	guildId: string,
	bannerHash: string,
	format?: ImageFormat,
	size?: number,
): string {
	const fmt =
		format ?? (isAnimatedHash(bannerHash) ? ImageFormat.Gif : ImageFormat.Png);
	return cdnUrl(`banners/${guildId}/${bannerHash}`, fmt, size);
}

export function userBannerUrl(
	userId: string,
	bannerHash: string,
	format?: ImageFormat,
	size?: number,
): string {
	const fmt =
		format ?? (isAnimatedHash(bannerHash) ? ImageFormat.Gif : ImageFormat.Png);
	return cdnUrl(`banners/${userId}/${bannerHash}`, fmt, size);
}

export function defaultUserAvatarUrl(index: number): string {
	return `${CDN_URL}/embed/avatars/${index}.png`;
}

export function userAvatarUrl(
	userId: string,
	avatarHash: string,
	format?: ImageFormat,
	size?: number,
): string {
	const fmt =
		format ?? (isAnimatedHash(avatarHash) ? ImageFormat.Gif : ImageFormat.Png);
	return cdnUrl(`avatars/${userId}/${avatarHash}`, fmt, size);
}

export function guildMemberAvatarUrl(
	guildId: string,
	userId: string,
	avatarHash: string,
	format?: ImageFormat,
	size?: number,
): string {
	const fmt =
		format ?? (isAnimatedHash(avatarHash) ? ImageFormat.Gif : ImageFormat.Png);
	return cdnUrl(
		`guilds/${guildId}/users/${userId}/avatars/${avatarHash}`,
		fmt,
		size,
	);
}

export function guildMemberBannerUrl(
	guildId: string,
	userId: string,
	bannerHash: string,
	format?: ImageFormat,
	size?: number,
): string {
	const fmt =
		format ?? (isAnimatedHash(bannerHash) ? ImageFormat.Gif : ImageFormat.Png);
	return cdnUrl(
		`guilds/${guildId}/users/${userId}/banners/${bannerHash}`,
		fmt,
		size,
	);
}

export function avatarDecorationUrl(asset: string): string {
	return `${CDN_URL}/avatar-decoration-presets/${asset}.png`;
}

export function applicationIconUrl(
	applicationId: string,
	iconHash: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`app-icons/${applicationId}/${iconHash}`, format, size);
}

export function applicationCoverUrl(
	applicationId: string,
	coverHash: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`app-icons/${applicationId}/${coverHash}`, format, size);
}

export function applicationAssetUrl(
	applicationId: string,
	assetId: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`app-assets/${applicationId}/${assetId}`, format, size);
}

export function teamIconUrl(
	teamId: string,
	iconHash: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`team-icons/${teamId}/${iconHash}`, format, size);
}

export function stickerUrl(
	stickerId: string,
	format: ImageFormat = ImageFormat.Png,
): string {
	if (format === ImageFormat.Gif) {
		return `${MEDIA_URL}/stickers/${stickerId}.gif`;
	}
	return `${CDN_URL}/stickers/${stickerId}.${format}`;
}

export function stickerPackBannerUrl(
	assetId: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`app-assets/710982414301790216/store/${assetId}`, format, size);
}

export function roleIconUrl(
	roleId: string,
	iconHash: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`role-icons/${roleId}/${iconHash}`, format, size);
}

export function guildScheduledEventCoverUrl(
	eventId: string,
	coverHash: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`guild-events/${eventId}/${coverHash}`, format, size);
}

export function guildTagBadgeUrl(
	guildId: string,
	badgeHash: string,
	format: ImageFormat = ImageFormat.Png,
	size?: number,
): string {
	return cdnUrl(`guild-tag-badges/${guildId}/${badgeHash}`, format, size);
}

export function escapeMarkdown(text: string): string {
	return text.replace(/([*_~`|\\<>[\]()])/g, "\\$1");
}

export function escapeMentions(text: string): string {
	return text.replace(/@/g, "@\u200b");
}

export function escapeAll(text: string): string {
	return escapeMentions(escapeMarkdown(text));
}
