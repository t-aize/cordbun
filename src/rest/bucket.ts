import type { RateLimitBucket, RateLimitData, RouteLike } from "./types.js";

const DEFAULT_SWEEP_INTERVAL = 300_000;

/**
 * Manages rate limit buckets for the REST client.
 * Handles tracking, synchronization, and cleanup of rate limit state.
 * @see {@link https://discord.com/developers/docs/topics/rate-limits}
 */
export class BucketManager {
	/** Timestamp when the global rate limit resets (0 if not limited) */
	globalReset = 0;

	private readonly buckets = new Map<string, RateLimitBucket>();
	private readonly bucketKeys = new Map<string, string>();
	private readonly locks = new Map<string, Promise<void>>();
	private sweepTimer: Timer | null = null;

	/**
	 * Gets the rate limit bucket for a route key.
	 * @param key - The route key to look up
	 * @returns The bucket if found, undefined otherwise
	 */
	get(key: string): RateLimitBucket | undefined {
		const bucketKey = this.bucketKeys.get(key) ?? key;
		return this.buckets.get(bucketKey);
	}

	/**
	 * Updates a rate limit bucket with new data from response headers.
	 * @param key - The route key
	 * @param data - The rate limit data from response headers
	 */
	update(key: string, data: RateLimitData): void {
		if (data.bucket) {
			this.bucketKeys.set(key, data.bucket);
		}

		const bucketKey = data.bucket ?? key;

		this.buckets.set(bucketKey, {
			limit: data.limit,
			remaining: data.remaining,
			reset: data.reset * 1000,
		});
	}

	/**
	 * Gets the delay in milliseconds before a request can be made.
	 * @param key - The route key to check
	 * @returns The delay in milliseconds, or 0 if not rate limited
	 */
	getDelay(key: string): number {
		const now = Date.now();

		if (this.globalReset > now) {
			return this.globalReset - now;
		}

		const bucket = this.get(key);
		if (!bucket) return 0;

		if (bucket.remaining <= 0 && bucket.reset > now) {
			return bucket.reset - now;
		}

		return 0;
	}

	/**
	 * Acquires a slot in the rate limit bucket for a request.
	 * Waits if rate limited and decrements the remaining count.
	 * Uses a mutex to prevent race conditions with concurrent requests.
	 * @param key - The route key to acquire
	 */
	async acquire(key: string): Promise<void> {
		const bucketKey = this.bucketKeys.get(key) ?? key;

		while (this.locks.has(bucketKey)) {
			await this.locks.get(bucketKey);
		}

		let unlock: () => void;
		const lock = new Promise<void>((resolve) => {
			unlock = resolve;
		});
		this.locks.set(bucketKey, lock);

		try {
			const delay = this.getDelay(key);
			if (delay > 0) {
				await Bun.sleep(delay);
			}

			const bucket = this.get(key);
			if (bucket && bucket.remaining > 0) {
				bucket.remaining--;
			}
		} finally {
			this.locks.delete(bucketKey);
			unlock!();
		}
	}

	/**
	 * Sets the global rate limit reset timestamp.
	 * @param reset - The timestamp when the global limit resets (milliseconds)
	 */
	setGlobalReset(reset: number): void {
		this.globalReset = reset;
	}

	/**
	 * Removes expired buckets from memory.
	 * @returns The number of buckets that were removed
	 */
	sweep(): number {
		const now = Date.now();
		let swept = 0;

		for (const [key, bucket] of this.buckets) {
			if (bucket.reset < now) {
				this.buckets.delete(key);
				swept++;
			}
		}

		for (const [routeKey, bucketKey] of this.bucketKeys) {
			if (!this.buckets.has(bucketKey)) {
				this.bucketKeys.delete(routeKey);
			}
		}

		return swept;
	}

	/**
	 * Starts the automatic bucket sweeper.
	 * @param interval - The sweep interval in milliseconds (default: 5 minutes)
	 */
	startSweeper(interval = DEFAULT_SWEEP_INTERVAL): void {
		if (this.sweepTimer) return;
		this.sweepTimer = setInterval(() => this.sweep(), interval);
	}

	/**
	 * Stops the automatic bucket sweeper.
	 */
	stopSweeper(): void {
		if (this.sweepTimer) {
			clearInterval(this.sweepTimer);
			this.sweepTimer = null;
		}
	}

	/**
	 * Cleans up all resources held by the bucket manager.
	 */
	destroy(): void {
		this.stopSweeper();
		this.buckets.clear();
		this.bucketKeys.clear();
		this.locks.clear();
		this.globalReset = 0;
	}
}

/**
 * Generates a unique key for rate limit bucketing.
 * Accounts for major parameters (channel_id, guild_id, webhook_id/token).
 * @param method - The HTTP method
 * @param route - The route path
 * @returns A unique bucket key
 * @see {@link https://discord.com/developers/docs/topics/rate-limits}
 */
export const getRouteKey = (method: string, route: RouteLike): string => {
	let majorId = "";

	const webhookMatch = route.match(/\/webhooks\/(\d+)\/([^/]+)/);
	if (webhookMatch) {
		majorId = `${webhookMatch[1]}:${webhookMatch[2]}`;
	} else {
		const majorParams = route.match(/\/(channels|guilds|webhooks)\/(\d+)/);
		majorId = majorParams?.[2] ?? "";
	}

	const routeWithoutIds = route.replace(/\/\d+/g, "/:id");
	return `${method}:${routeWithoutIds}:${majorId}`;
};
