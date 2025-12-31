import type { Rest } from "../rest/client.js";

/**
 * Types of SKUs (stock-keeping units).
 * @see {@link https://discord.com/developers/docs/resources/sku#sku-object-sku-types}
 */
export enum SkuType {
	/** Durable one-time purchase */
	Durable = 2,
	/** Consumable one-time purchase */
	Consumable = 3,
	/** Represents a recurring subscription */
	Subscription = 5,
	/** System-generated group for each SUBSCRIPTION SKU created */
	SubscriptionGroup = 6,
}

/**
 * Flags for SKUs indicating availability and subscription type.
 * @see {@link https://discord.com/developers/docs/resources/sku#sku-object-sku-flags}
 */
export enum SkuFlags {
	/** SKU is available for purchase */
	Available = 1 << 2,
	/** Recurring SKU that can be purchased by a user and applied to a single server */
	GuildSubscription = 1 << 7,
	/** Recurring SKU purchased by a user for themselves */
	UserSubscription = 1 << 8,
}

/**
 * Represents a SKU (stock-keeping unit) in Discord.
 * SKUs represent premium offerings that can be made available to your application's users or guilds.
 * @see {@link https://discord.com/developers/docs/resources/sku#sku-object}
 */
export interface Sku {
	/** ID of the SKU */
	id: string;
	/** Type of SKU */
	type: SkuType;
	/** ID of the parent application */
	application_id: string;
	/** Customer-facing name of your premium offering */
	name: string;
	/** System-generated URL slug based on the SKU's name */
	slug: string;
	/** SKU flags combined as a bitfield */
	flags: SkuFlags;
}

/**
 * API methods for interacting with Discord SKUs.
 * @see {@link https://discord.com/developers/docs/resources/sku}
 */
export class SkusAPI {
	private readonly rest: Rest;

	constructor(rest: Rest) {
		this.rest = rest;
	}

	/**
	 * Returns all SKUs for a given application.
	 *
	 * Because of how SKU and subscription systems work, you will see two SKUs
	 * for your subscription offering. For integration and testing entitlements
	 * for Subscriptions, you should use the SKU with `type: 5`.
	 *
	 * @param applicationId - The ID of the application
	 * @see {@link https://discord.com/developers/docs/resources/sku#list-skus}
	 */
	async list(applicationId: string): Promise<Sku[]> {
		return this.rest.get(`/applications/${applicationId}/skus`);
	}
}
