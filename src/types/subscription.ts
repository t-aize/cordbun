export enum SubscriptionStatus {
	Active = 0,
	Ending = 1,
	Inactive = 2,
}

export interface Subscription {
	id: string;
	user_id: string;
	sku_ids: string[];
	entitlement_ids: string[];
	renewal_sku_ids: string[] | null;
	current_period_start: string;
	current_period_end: string;
	status: SubscriptionStatus;
	canceled_at: string | null;
	country?: string;
}

export interface ListSkuSubscriptionsParams {
	before?: string;
	after?: string;
	limit?: number;
	user_id?: string;
}
