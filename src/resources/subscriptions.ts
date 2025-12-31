import type { Rest } from "../rest/client.js";
import type { PaginationParams } from "./utils.js";

/**
 * Status of a subscription.
 * @see {@link https://discord.com/developers/docs/resources/subscription#subscription-statuses}
 */
export enum SubscriptionStatus {
	/** Subscription is active and scheduled to renew */
	Active = 0,
	/** Subscription is active but will not renew */
	Ending = 1,
	/** Subscription is inactive and not being charged */
	Inactive = 2,
}

/**
 * Represents a subscription in Discord.
 * Subscriptions represent a user making recurring payments for at least one SKU over an ongoing period.
 * @see {@link https://discord.com/developers/docs/resources/subscription#subscription-object}
 */
export interface Subscription {
	/** ID of the subscription */
	id: string;
	/** ID of the user who is subscribed */
	user_id: string;
	/** List of SKUs subscribed to */
	sku_ids: string[];
	/** List of entitlements granted for this subscription */
	entitlement_ids: string[];
	/** List of SKUs that this user will be subscribed to at renewal */
	renewal_sku_ids: string[] | null;
	/** Start of the current subscription period (ISO8601 timestamp) */
	current_period_start: string;
	/** End of the current subscription period (ISO8601 timestamp) */
	current_period_end: string;
	/** Current status of the subscription */
	status: SubscriptionStatus;
	/** When the subscription was canceled (ISO8601 timestamp) */
	canceled_at: string | null;
	/** ISO3166-1 alpha-2 country code of the payment source. Missing unless queried with a private OAuth scope. */
	country?: string;
}

/**
 * Query parameters for listing SKU subscriptions.
 * @see {@link https://discord.com/developers/docs/resources/subscription#list-sku-subscriptions-query-string-params}
 */
export type ListSkuSubscriptionsParams = PaginationParams & {
	/** User ID for which to return subscriptions. Required except for OAuth queries. */
	user_id?: string;
};

/**
 * API methods for interacting with Discord subscriptions.
 * @see {@link https://discord.com/developers/docs/resources/subscription}
 */
export class SubscriptionsAPI {
	private readonly rest: Rest;

	constructor(rest: Rest) {
		this.rest = rest;
	}

	/**
	 * Returns all subscriptions containing the SKU, filtered by user.
	 *
	 * @param skuId - The ID of the SKU
	 * @param params - Query parameters for filtering and pagination
	 * @see {@link https://discord.com/developers/docs/resources/subscription#list-sku-subscriptions}
	 */
	async listForSku(skuId: string, params: ListSkuSubscriptionsParams = {}): Promise<Subscription[]> {
		return this.rest.get(`/skus/${skuId}/subscriptions`, { query: params });
	}

	/**
	 * Get a subscription by its ID.
	 *
	 * @param skuId - The ID of the SKU
	 * @param subscriptionId - The ID of the subscription
	 * @see {@link https://discord.com/developers/docs/resources/subscription#get-sku-subscription}
	 */
	async get(skuId: string, subscriptionId: string): Promise<Subscription> {
		return this.rest.get(`/skus/${skuId}/subscriptions/${subscriptionId}`);
	}
}
