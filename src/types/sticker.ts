import type { User } from "./user.js";

export enum StickerType {
	Standard = 1,
	Guild = 2,
}

export enum StickerFormatType {
	Png = 1,
	Apng = 2,
	Lottie = 3,
	Gif = 4,
}

export interface Sticker {
	id: string;
	pack_id?: string;
	name: string;
	description: string | null;
	tags: string;
	type: StickerType;
	format_type: StickerFormatType;
	available?: boolean;
	guild_id?: string;
	user?: User;
	sort_value?: number;
}

export interface StickerItem {
	id: string;
	name: string;
	format_type: StickerFormatType;
}

export interface StickerPack {
	id: string;
	stickers: Sticker[];
	name: string;
	sku_id: string;
	cover_sticker_id?: string;
	description: string;
	banner_asset_id?: string;
}

export interface ListStickerPacksResponse {
	sticker_packs: StickerPack[];
}

export interface CreateGuildStickerParams {
	name: string;
	description: string;
	tags: string;
	file: Blob;
}

export interface ModifyGuildStickerParams {
	name?: string;
	description?: string | null;
	tags?: string;
}
