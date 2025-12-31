export const CDN_BASE_URL = "https://cdn.discordapp.com";
export const MEDIA_BASE_URL = "https://media.discordapp.net";

export enum ImageFormat {
	JPEG = "jpg",
	PNG = "png",
	WebP = "webp",
	GIF = "gif",
	AVIF = "avif",
	Lottie = "json",
}

export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

type CdnUrl<P extends string = string> = `${typeof CDN_BASE_URL}/${P}`;
type MediaUrl<P extends string = string> = `${typeof MEDIA_BASE_URL}/${P}`;

const buildUrl = <P extends string>(path: P, format: ImageFormat, size?: ImageSize): CdnUrl<`${P}.${ImageFormat}`> => {
	const base = `${CDN_BASE_URL}/${path}.${format}` as CdnUrl<`${P}.${ImageFormat}`>;
	return (size ? `${base}?size=${size}` : base) as CdnUrl<`${P}.${ImageFormat}`>;
};

export const CDN = {
	emoji: <I extends string>(emojiId: I, format: ImageFormat = ImageFormat.WebP, size?: ImageSize) =>
		buildUrl(`emojis/${emojiId}`, format, size),

	guildIcon: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`icons/${guildId}/${hash}`, format, size),

	guildSplash: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`splashes/${guildId}/${hash}`, format, size),

	guildDiscoverySplash: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`discovery-splashes/${guildId}/${hash}`, format, size),

	guildBanner: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`banners/${guildId}/${hash}`, format, size),

	userBanner: <U extends string, H extends string>(
		userId: U,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`banners/${userId}/${hash}`, format, size),

	defaultUserAvatar: <I extends number>(index: I): CdnUrl<`embed/avatars/${I}.${ImageFormat.PNG}`> =>
		`${CDN_BASE_URL}/embed/avatars/${index}.${ImageFormat.PNG}`,

	userAvatar: <U extends string, H extends string>(
		userId: U,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`avatars/${userId}/${hash}`, format, size),

	guildMemberAvatar: <G extends string, U extends string, H extends string>(
		guildId: G,
		userId: U,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`guilds/${guildId}/users/${userId}/avatars/${hash}`, format, size),

	avatarDecoration: <A extends string>(asset: A): CdnUrl<`avatar-decoration-presets/${A}.${ImageFormat.PNG}`> =>
		`${CDN_BASE_URL}/avatar-decoration-presets/${asset}.${ImageFormat.PNG}`,

	applicationIcon: <A extends string, H extends string>(
		applicationId: A,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-icons/${applicationId}/${hash}`, format, size),

	applicationCover: <A extends string, H extends string>(
		applicationId: A,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-icons/${applicationId}/${hash}`, format, size),

	applicationAsset: <A extends string, I extends string>(
		applicationId: A,
		assetId: I,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-assets/${applicationId}/${assetId}`, format, size),

	achievementIcon: <A extends string, C extends string, H extends string>(
		applicationId: A,
		achievementId: C,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-assets/${applicationId}/achievements/${achievementId}/icons/${hash}`, format, size),

	storePageAsset: <A extends string, I extends string>(
		applicationId: A,
		assetId: I,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-assets/${applicationId}/store/${assetId}`, format, size),

	stickerPackBanner: <I extends string>(assetId: I, format: ImageFormat = ImageFormat.PNG, size?: ImageSize) =>
		buildUrl(`app-assets/710982414301790216/store/${assetId}`, format, size),

	teamIcon: <T extends string, H extends string>(
		teamId: T,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`team-icons/${teamId}/${hash}`, format, size),

	sticker: <I extends string>(
		stickerId: I,
		format: ImageFormat = ImageFormat.PNG,
	): CdnUrl<`stickers/${I}.${ImageFormat}`> => `${CDN_BASE_URL}/stickers/${stickerId}.${format}`,

	stickerGif: <I extends string>(stickerId: I): MediaUrl<`stickers/${I}.${ImageFormat.GIF}`> =>
		`${MEDIA_BASE_URL}/stickers/${stickerId}.${ImageFormat.GIF}`,

	roleIcon: <R extends string, H extends string>(
		roleId: R,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`role-icons/${roleId}/${hash}`, format, size),

	guildScheduledEventCover: <E extends string, H extends string>(
		eventId: E,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`guild-events/${eventId}/${hash}`, format, size),

	guildMemberBanner: <G extends string, U extends string, H extends string>(
		guildId: G,
		userId: U,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`guilds/${guildId}/users/${userId}/banners/${hash}`, format, size),

	guildTagBadge: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`guild-tag-badges/${guildId}/${hash}`, format, size),

	isAnimatedHash: (hash: string): hash is `a_${string}` => hash.startsWith("a_"),

	defaultAvatarIndex: (userId: string): number => Number((BigInt(userId) >> 22n) % 6n),

	legacyDefaultAvatarIndex: (discriminator: number): number => discriminator % 5,
} as const;
