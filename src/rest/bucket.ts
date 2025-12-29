import type { RateLimitBucket, RateLimitData } from "./types.js";

const DEFAULT_SWEEP_INTERVAL = 300_000;

export class BucketManager {
	globalReset = 0;

	private readonly buckets = new Map<string, RateLimitBucket>();
	private readonly bucketKeys = new Map<string, string>();
	private sweepTimer: Timer | null = null;

	get(key: string): RateLimitBucket | undefined {
		const bucketKey = this.bucketKeys.get(key) ?? key;
		return this.buckets.get(bucketKey);
	}

	update(key: string, data: RateLimitData): void {
		if (data.bucket) {
			this.bucketKeys.set(key, data.bucket);
		}

		const bucketKey = data.bucket ?? key;
		const existing = this.buckets.get(bucketKey);

		this.buckets.set(bucketKey, {
			limit: data.limit,
			remaining: data.remaining,
			reset: data.reset * 1000,
			processing: existing?.processing ?? null,
		});
	}

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

	isLimited(key: string): boolean {
		return this.getDelay(key) > 0;
	}

	async acquire(key: string): Promise<void> {
		const delay = this.getDelay(key);
		if (delay > 0) {
			await Bun.sleep(delay);
		}

		const bucket = this.get(key);
		if (bucket?.processing) {
			await bucket.processing;
			return this.acquire(key);
		}
	}

	setGlobalReset(reset: number): void {
		this.globalReset = reset;
	}

	sweep(): number {
		const now = Date.now();
		let swept = 0;

		for (const [key, bucket] of this.buckets) {
			if (bucket.reset < now && !bucket.processing) {
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

	startSweeper(interval = DEFAULT_SWEEP_INTERVAL): void {
		if (this.sweepTimer) return;
		this.sweepTimer = setInterval(() => this.sweep(), interval);
	}

	stopSweeper(): void {
		if (this.sweepTimer) {
			clearInterval(this.sweepTimer);
			this.sweepTimer = null;
		}
	}
}

export const getRouteKey = (method: string, route: string): string => {
	const majorParams = route.match(/\/(channels|guilds|webhooks)\/(\d+)/);
	const majorId = majorParams?.[2] ?? "";
	const routeWithoutIds = route.replace(/\/\d+/g, "/:id");
	return `${method}:${routeWithoutIds}:${majorId}`;
};
