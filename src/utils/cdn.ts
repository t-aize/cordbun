/**
 * Base URL for Discord's CDN.
 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
 */
export const CDN_BASE_URL = "https://cdn.discordapp.com";

/**
 * Base URL for Discord's media proxy (used for sticker GIFs).
 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
 */
export const MEDIA_BASE_URL = "https://media.discordapp.net";

/**
 * Supported image formats for Discord CDN.
 * @see {@link https://discord.com/developers/docs/reference#image-formatting-image-formats}
 */
export enum ImageFormat {
	JPEG = "jpg",
	PNG = "png",
	WebP = "webp",
	GIF = "gif",
	AVIF = "avif",
	Lottie = "json",
}

/**
 * Valid image sizes for Discord CDN.
 * Image size can be any power of two between 16 and 4096.
 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
 */
export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

/** CDN URL type */
type CdnUrl<P extends string = string> = `${typeof CDN_BASE_URL}/${P}`;

/** Media URL type */
type MediaUrl<P extends string = string> = `${typeof MEDIA_BASE_URL}/${P}`;

/**
 * Builds a CDN URL with optional size parameter.
 * @param path - The path to the resource
 * @param format - The image format
 * @param size - Optional image size
 * @returns The complete CDN URL
 */
const buildUrl = <P extends string>(path: P, format: ImageFormat, size?: ImageSize): CdnUrl<`${P}.${ImageFormat}`> => {
	const base = `${CDN_BASE_URL}/${path}.${format}` as CdnUrl<`${P}.${ImageFormat}`>;
	return (size ? `${base}?size=${size}` : base) as CdnUrl<`${P}.${ImageFormat}`>;
};

/**
 * Utilities for building Discord CDN URLs.
 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
 */
export const CDN = {
	/**
	 * Gets a custom emoji URL.
	 * @param emojiId - The emoji ID
	 * @param format - Image format (default: WebP)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	emoji: <I extends string>(emojiId: I, format: ImageFormat = ImageFormat.WebP, size?: ImageSize) =>
		buildUrl(`emojis/${emojiId}`, format, size),

	/**
	 * Gets a guild icon URL.
	 * @param guildId - The guild ID
	 * @param hash - The icon hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	guildIcon: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`icons/${guildId}/${hash}`, format, size),

	/**
	 * Gets a guild splash URL.
	 * @param guildId - The guild ID
	 * @param hash - The splash hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	guildSplash: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`splashes/${guildId}/${hash}`, format, size),

	/**
	 * Gets a guild discovery splash URL.
	 * @param guildId - The guild ID
	 * @param hash - The discovery splash hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	guildDiscoverySplash: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`discovery-splashes/${guildId}/${hash}`, format, size),

	/**
	 * Gets a guild banner URL.
	 * @param guildId - The guild ID
	 * @param hash - The banner hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	guildBanner: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`banners/${guildId}/${hash}`, format, size),

	/**
	 * Gets a user banner URL.
	 * @param userId - The user ID
	 * @param hash - The banner hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	userBanner: <U extends string, H extends string>(
		userId: U,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`banners/${userId}/${hash}`, format, size),

	/**
	 * Gets a default user avatar URL.
	 * @param index - The avatar index (0-5 for new users, 0-4 for legacy)
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	defaultUserAvatar: <I extends number>(index: I): CdnUrl<`embed/avatars/${I}.${ImageFormat.PNG}`> =>
		`${CDN_BASE_URL}/embed/avatars/${index}.${ImageFormat.PNG}`,

	/**
	 * Gets a user avatar URL.
	 * @param userId - The user ID
	 * @param hash - The avatar hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	userAvatar: <U extends string, H extends string>(
		userId: U,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`avatars/${userId}/${hash}`, format, size),

	/**
	 * Gets a guild member avatar URL.
	 * @param guildId - The guild ID
	 * @param userId - The user ID
	 * @param hash - The avatar hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	guildMemberAvatar: <G extends string, U extends string, H extends string>(
		guildId: G,
		userId: U,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`guilds/${guildId}/users/${userId}/avatars/${hash}`, format, size),

	/**
	 * Gets an avatar decoration URL.
	 * @param asset - The avatar decoration asset
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	avatarDecoration: <A extends string>(asset: A): CdnUrl<`avatar-decoration-presets/${A}.${ImageFormat.PNG}`> =>
		`${CDN_BASE_URL}/avatar-decoration-presets/${asset}.${ImageFormat.PNG}`,

	/**
	 * Gets an application icon URL.
	 * @param applicationId - The application ID
	 * @param hash - The icon hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	applicationIcon: <A extends string, H extends string>(
		applicationId: A,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-icons/${applicationId}/${hash}`, format, size),

	/**
	 * Gets an application cover image URL.
	 * @param applicationId - The application ID
	 * @param hash - The cover hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	applicationCover: <A extends string, H extends string>(
		applicationId: A,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-icons/${applicationId}/${hash}`, format, size),

	/**
	 * Gets an application asset URL.
	 * @param applicationId - The application ID
	 * @param assetId - The asset ID
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	applicationAsset: <A extends string, I extends string>(
		applicationId: A,
		assetId: I,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-assets/${applicationId}/${assetId}`, format, size),

	/**
	 * Gets an achievement icon URL.
	 * @param applicationId - The application ID
	 * @param achievementId - The achievement ID
	 * @param hash - The icon hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	achievementIcon: <A extends string, C extends string, H extends string>(
		applicationId: A,
		achievementId: C,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-assets/${applicationId}/achievements/${achievementId}/icons/${hash}`, format, size),

	/**
	 * Gets a store page asset URL.
	 * @param applicationId - The application ID
	 * @param assetId - The asset ID
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	storePageAsset: <A extends string, I extends string>(
		applicationId: A,
		assetId: I,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`app-assets/${applicationId}/store/${assetId}`, format, size),

	/**
	 * Gets a sticker pack banner URL.
	 * @param assetId - The banner asset ID
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	stickerPackBanner: <I extends string>(assetId: I, format: ImageFormat = ImageFormat.PNG, size?: ImageSize) =>
		buildUrl(`app-assets/710982414301790216/store/${assetId}`, format, size),

	/**
	 * Gets a team icon URL.
	 * @param teamId - The team ID
	 * @param hash - The icon hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	teamIcon: <T extends string, H extends string>(
		teamId: T,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`team-icons/${teamId}/${hash}`, format, size),

	/**
	 * Gets a sticker URL.
	 * @param stickerId - The sticker ID
	 * @param format - Image format (default: PNG)
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	sticker: <I extends string>(
		stickerId: I,
		format: ImageFormat = ImageFormat.PNG,
	): CdnUrl<`stickers/${I}.${ImageFormat}`> => `${CDN_BASE_URL}/stickers/${stickerId}.${format}`,

	/**
	 * Gets a sticker GIF URL (uses media.discordapp.net).
	 * @param stickerId - The sticker ID
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	stickerGif: <I extends string>(stickerId: I): MediaUrl<`stickers/${I}.${ImageFormat.GIF}`> =>
		`${MEDIA_BASE_URL}/stickers/${stickerId}.${ImageFormat.GIF}`,

	/**
	 * Gets a role icon URL.
	 * @param roleId - The role ID
	 * @param hash - The icon hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	roleIcon: <R extends string, H extends string>(
		roleId: R,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`role-icons/${roleId}/${hash}`, format, size),

	/**
	 * Gets a guild scheduled event cover URL.
	 * @param eventId - The event ID
	 * @param hash - The cover hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	guildScheduledEventCover: <E extends string, H extends string>(
		eventId: E,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`guild-events/${eventId}/${hash}`, format, size),

	/**
	 * Gets a guild member banner URL.
	 * @param guildId - The guild ID
	 * @param userId - The user ID
	 * @param hash - The banner hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	guildMemberBanner: <G extends string, U extends string, H extends string>(
		guildId: G,
		userId: U,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`guilds/${guildId}/users/${userId}/banners/${hash}`, format, size),

	/**
	 * Gets a guild tag badge URL.
	 * @param guildId - The guild ID
	 * @param hash - The badge hash
	 * @param format - Image format (default: PNG)
	 * @param size - Optional image size
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	guildTagBadge: <G extends string, H extends string>(
		guildId: G,
		hash: H,
		format: ImageFormat = ImageFormat.PNG,
		size?: ImageSize,
	) => buildUrl(`guild-tag-badges/${guildId}/${hash}`, format, size),

	/**
	 * Checks if an image hash indicates an animated image.
	 * Animated images have hashes starting with `a_`.
	 * @param hash - The image hash
	 * @returns True if the hash indicates an animated image
	 */
	isAnimatedHash: (hash: string): hash is `a_${string}` => hash.startsWith("a_"),

	/**
	 * Calculates the default avatar index for a user on the new username system.
	 * @param userId - The user ID
	 * @returns The avatar index (0-5)
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	defaultAvatarIndex: (userId: string): number => Number((BigInt(userId) >> 22n) % 6n),

	/**
	 * Calculates the default avatar index for a user on the legacy username system.
	 * @param discriminator - The user's discriminator
	 * @returns The avatar index (0-4)
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints}
	 */
	legacyDefaultAvatarIndex: (discriminator: number): number => discriminator % 5,
} as const;
