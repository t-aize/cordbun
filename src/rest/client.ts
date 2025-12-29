import { EventEmitter } from "node:events";
import { API_BASE_URL, ApiVersion } from "../constants/index.js";
import type { ApiErrorResponse } from "../resources/index.js";
import { buildMultipartBody, createFileAttachment } from "../utils/index.js";
import { BucketManager, getRouteKey } from "./bucket.js";
import type { RestEvents } from "./events.js";
import {
	CloudflareError,
	type HttpMethod,
	type RateLimitData,
	RateLimitError,
	type RateLimitResponse,
	type RateLimitScope,
	type RequestOptions,
	RestError,
	type RestOptions,
	type RestResponse,
} from "./types.js";

const DEFAULT_OPTIONS: Required<Omit<RestOptions, "userAgent">> = {
	authType: "Bot",
	version: 10,
	retries: 3,
	timeout: 15000,
	invalidRequestWarningInterval: 0,
	sweepInterval: 300_000,
};

const INVALID_REQUEST_WINDOW = 600_000;

const LIB_VERSION = "0.0.1";
const LIB_URL = "https://github.com/cordbun/cordbun";

const VALID_API_VERSIONS = Object.values(ApiVersion).filter(
	(v) => typeof v === "number",
) as ApiVersion[];
const VALID_AUTH_TYPES = ["Bot", "Bearer"] as const;

export class Rest extends EventEmitter<RestEvents> {
	private token: string;
	private config: Required<Omit<RestOptions, "userAgent">> & {
		userAgent?: string;
	};
	private readonly buckets = new BucketManager();
	private invalidRequestCount = 0;
	private invalidRequestResetTime = Date.now() + INVALID_REQUEST_WINDOW;
	private readonly invalidRequestWarningTimer: Timer | null = null;

	constructor(token: string, options: RestOptions = {}) {
		super();
		this.validateOptions(options);

		this.token = token;
		this.config = { ...DEFAULT_OPTIONS, ...options };

		if (this.config.sweepInterval > 0) {
			this.buckets.startSweeper(this.config.sweepInterval);
		}

		if (this.config.invalidRequestWarningInterval > 0) {
			this.invalidRequestWarningTimer = setInterval(() => {
				if (this.invalidRequestCount > 0) {
					this.emit("invalidRequestWarning", {
						count: this.invalidRequestCount,
						remainingTime: Math.max(
							0,
							this.invalidRequestResetTime - Date.now(),
						),
					});
				}
			}, this.config.invalidRequestWarningInterval);
		}
	}

	async request<T>(
		method: HttpMethod,
		route: string,
		opts: RequestOptions = {},
		retryCount = 0,
	): Promise<RestResponse<T>> {
		const routeKey = getRouteKey(method, route);
		const url = this.buildUrl(route, opts.query);

		await this.buckets.acquire(routeKey);

		const headers = this.buildHeaders(opts);
		const body = this.buildBody(opts, headers);

		this.emit("request", { method, route: routeKey, path: url });

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
		const startTime = performance.now();

		try {
			const response = await fetch(url, {
				method,
				headers,
				body,
				signal: controller.signal,
			});

			const latency = performance.now() - startTime;
			this.emit("response", {
				method,
				route: routeKey,
				path: url,
				status: response.status,
				latency,
			});

			const rateLimit = this.parseRateLimitHeaders(response.headers);
			if (rateLimit) {
				this.buckets.update(routeKey, rateLimit);
			}

			if (response.status === 429) {
				this.trackInvalidRequest();
				await this.handleRateLimit(response, routeKey);
			}

			if (response.status === 401 || response.status === 403) {
				this.trackInvalidRequest();
			}

			if (response.status === 204) {
				return {
					data: undefined as T,
					status: response.status,
					headers: response.headers,
					rateLimit,
				};
			}

			const contentType = response.headers.get("Content-Type");
			if (!contentType?.includes("application/json")) {
				throw new CloudflareError(response.status);
			}

			const responseData = await response.json();

			if (!response.ok) {
				throw RestError.fromResponse(
					responseData as ApiErrorResponse,
					response.status,
					rateLimit ?? undefined,
				);
			}

			return {
				data: responseData as T,
				status: response.status,
				headers: response.headers,
				rateLimit,
			};
		} catch (error) {
			if (error instanceof RateLimitError && retryCount < this.config.retries) {
				await Bun.sleep(error.retryAfter * 1000);
				return this.request(method, route, opts, retryCount + 1);
			}

			if (
				error instanceof RestError &&
				error.status >= 500 &&
				retryCount < this.config.retries
			) {
				await Bun.sleep(1000 * (retryCount + 1));
				return this.request(method, route, opts, retryCount + 1);
			}

			if (
				error instanceof CloudflareError &&
				retryCount < this.config.retries
			) {
				await Bun.sleep(1000 * (retryCount + 1));
				return this.request(method, route, opts, retryCount + 1);
			}

			throw error;
		} finally {
			clearTimeout(timeoutId);
		}
	}

	async get<T>(route: string, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("GET", route, opts)).data;
	}

	async post<T>(route: string, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("POST", route, opts)).data;
	}

	async put<T>(route: string, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("PUT", route, opts)).data;
	}

	async patch<T>(route: string, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("PATCH", route, opts)).data;
	}

	async delete<T>(route: string, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("DELETE", route, opts)).data;
	}

	setToken(token: string): void {
		this.token = token;
	}

	destroy(): void {
		this.buckets.stopSweeper();
		if (this.invalidRequestWarningTimer) {
			clearInterval(this.invalidRequestWarningTimer);
		}
		this.removeAllListeners();
	}

	private validateOptions(options: RestOptions): void {
		if (
			options.authType !== undefined &&
			!VALID_AUTH_TYPES.includes(options.authType)
		) {
			throw new TypeError(
				`Invalid authType: ${options.authType}. Must be one of: ${VALID_AUTH_TYPES.join(", ")}`,
			);
		}

		if (options.version !== undefined) {
			if (
				!Number.isInteger(options.version) ||
				!VALID_API_VERSIONS.includes(
					options.version as (typeof VALID_API_VERSIONS)[number],
				)
			) {
				throw new TypeError(
					`Invalid version: ${options.version}. Must be one of: ${VALID_API_VERSIONS.join(", ")}`,
				);
			}
		}

		if (options.retries !== undefined) {
			if (!Number.isInteger(options.retries) || options.retries < 0) {
				throw new TypeError(
					`Invalid retries: ${options.retries}. Must be a non-negative integer`,
				);
			}
		}

		if (options.timeout !== undefined) {
			if (typeof options.timeout !== "number" || options.timeout <= 0) {
				throw new TypeError(
					`Invalid timeout: ${options.timeout}. Must be a positive number`,
				);
			}
		}

		if (options.userAgent !== undefined) {
			if (
				typeof options.userAgent !== "string" ||
				options.userAgent.trim() === ""
			) {
				throw new TypeError("Invalid userAgent: Must be a non-empty string");
			}
		}
	}

	private trackInvalidRequest(): void {
		const now = Date.now();
		if (now >= this.invalidRequestResetTime) {
			this.invalidRequestCount = 0;
			this.invalidRequestResetTime = now + INVALID_REQUEST_WINDOW;
		}
		this.invalidRequestCount++;
	}

	private buildHeaders(opts: RequestOptions): Headers {
		const headers = new Headers({
			"User-Agent":
				this.config.userAgent ?? `DiscordBot (${LIB_URL}, ${LIB_VERSION})`,
		});

		if (opts.auth !== false) {
			headers.set("Authorization", `${this.config.authType} ${this.token}`);
		}

		if (opts.reason) {
			headers.set("X-Audit-Log-Reason", encodeURIComponent(opts.reason));
		}

		if (opts.headers) {
			for (const [key, value] of Object.entries(opts.headers)) {
				headers.set(key, value);
			}
		}

		return headers;
	}

	private buildUrl(route: string, query?: RequestOptions["query"]): string {
		const url = new URL(`${API_BASE_URL}/v${this.config.version}${route}`);

		if (query) {
			for (const [key, value] of Object.entries(query)) {
				if (value !== undefined) {
					url.searchParams.set(key, String(value));
				}
			}
		}

		return url.toString();
	}

	private buildBody(
		opts: RequestOptions,
		headers: Headers,
	): string | FormData | undefined {
		if (opts.files?.length) {
			const files = opts.files.map((file, i) =>
				createFileAttachment(i, file.name, file.data, file.contentType),
			);
			const payload = (opts.body ?? {}) as Record<string, unknown>;
			return buildMultipartBody(payload, files);
		}

		if (opts.body) {
			headers.set("Content-Type", "application/json");
			return JSON.stringify(opts.body);
		}

		return undefined;
	}

	private parseRateLimitHeaders(headers: Headers): RateLimitData | null {
		const limit = headers.get("X-RateLimit-Limit");
		if (!limit) return null;

		const scope = headers.get("X-RateLimit-Scope") as RateLimitScope | null;

		return {
			limit: Number(limit),
			remaining: Number(headers.get("X-RateLimit-Remaining") ?? 0),
			reset: Number(headers.get("X-RateLimit-Reset") ?? 0),
			resetAfter: Number(headers.get("X-RateLimit-Reset-After") ?? 0),
			bucket: headers.get("X-RateLimit-Bucket") ?? "",
			global: headers.get("X-RateLimit-Global") === "true",
			...(scope && { scope }),
		};
	}

	private async handleRateLimit(
		response: Response,
		routeKey: string,
	): Promise<never> {
		const data = (await response.json()) as RateLimitResponse;
		const rateLimit = this.parseRateLimitHeaders(response.headers);

		if (data.global) {
			this.buckets.setGlobalReset(Date.now() + data.retry_after * 1000);
		}

		if (rateLimit) {
			this.buckets.update(routeKey, rateLimit);
		}

		this.emit("rateLimited", {
			route: routeKey,
			global: data.global,
			limit: rateLimit?.limit ?? 0,
			remaining: 0,
			retryAfter: data.retry_after,
			scope: rateLimit?.scope,
		});

		throw new RateLimitError(data.retry_after, data.global, rateLimit?.scope);
	}
}
