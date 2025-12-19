export enum EntitlementType {
	Purchase = 1,
	PremiumSubscription = 2,
	DeveloperGift = 3,
	TestModePurchase = 4,
	FreePurchase = 5,
	UserGift = 6,
	PremiumPurchase = 7,
	ApplicationSubscription = 8,
}

export enum EntitlementOwnerType {
	Guild = 1,
	User = 2,
}

export interface Entitlement {
	id: string;
	sku_id: string;
	application_id: string;
	user_id?: string;
	type: EntitlementType;
	deleted: boolean;
	starts_at: string | null;
	ends_at: string | null;
	guild_id?: string;
	consumed?: boolean;
}

export interface ListEntitlementsParams {
	user_id?: string;
	sku_ids?: string;
	before?: string;
	after?: string;
	limit?: number;
	guild_id?: string;
	exclude_ended?: boolean;
	exclude_deleted?: boolean;
}

export interface CreateTestEntitlementParams {
	sku_id: string;
	owner_id: string;
	owner_type: EntitlementOwnerType;
}
