import { EventEmitter } from "node:events";
import { API_BASE_URL, ApiVersion } from "../constants/index.js";
import {
	type ApiErrorResponse,
	ApplicationRoleConnectionMetadataAPI,
	ApplicationsAPI,
	AutoModerationAPI,
	EmojisAPI,
	EntitlementsAPI,
	GuildScheduledEventsAPI,
	GuildsAPI,
	GuildTemplatesAPI,
	InvitesAPI,
	LobbiesAPI,
	PollsAPI,
	SkusAPI,
	SoundboardsAPI,
	StageInstancesAPI,
	StickersAPI,
	SubscriptionsAPI,
	UsersAPI,
	VoiceAPI,
} from "../resources/index.js";
import { DEFAULT_ATTACHMENT_SIZE_LIMIT, Files } from "../utils/index.js";
import { BucketManager, getRouteKey } from "./bucket.js";
import type { RESTEvents } from "./events.js";
import {
	CloudflareError,
	FileTooLargeError,
	type HttpMethod,
	type RateLimitData,
	RateLimitError,
	type RateLimitResponse,
	type RateLimitScope,
	RESTError,
	type RESTOptions,
	type RESTResponse,
	type RequestOptions,
	type RouteLike,
	TimeoutError,
} from "./types.js";

const INVALID_REQUEST_WINDOW = 600_000;

const LIB_VERSION = "0.0.1";
const LIB_URL = "https://github.com/cordbun/cordbun";

const VALID_API_VERSIONS = Object.values(ApiVersion).filter((v) => typeof v === "number") as ApiVersion[];
const VALID_AUTH_TYPES = ["Bot", "Bearer"] as const;

type ResolvedRESTOptions = Required<Omit<RESTOptions, "userAgent">> & {
	userAgent: string;
};

/**
 * REST client for making requests to the Discord API.
 * Handles rate limiting, retries, and provides typed API methods.
 *
 * @example
 * ```typescript
 * const rest = new REST("Bot YOUR_TOKEN");
 *
 * // Using typed API methods
 * const user = await rest.users.getCurrentUser();
 *
 * // Using raw methods
 * const guilds = await rest.get<Guild[]>("/users/@me/guilds");
 * ```
 *
 * @see {@link https://discord.com/developers/docs/reference}
 */
export class REST extends EventEmitter<RESTEvents> {
	/** API methods for application role connection metadata */
	public readonly applicationRoleConnectionMetadata = new ApplicationRoleConnectionMetadataAPI(this);
	/** API methods for applications */
	public readonly applications = new ApplicationsAPI(this);
	/** API methods for auto moderation */
	public readonly autoModeration = new AutoModerationAPI(this);
	/** API methods for emojis */
	public readonly emojis = new EmojisAPI(this);
	/** API methods for entitlements */
	public readonly entitlements = new EntitlementsAPI(this);
	/** API methods for guild scheduled events */
	public readonly guildScheduledEvents = new GuildScheduledEventsAPI(this);
	/** API methods for guild templates */
	public readonly guildTemplates = new GuildTemplatesAPI(this);
	/** API methods for guilds */
	public readonly guilds = new GuildsAPI(this);
	/** API methods for invites */
	public readonly invites = new InvitesAPI(this);
	/** API methods for lobbies */
	public readonly lobbies = new LobbiesAPI(this);
	/** API methods for polls */
	public readonly polls = new PollsAPI(this);
	/** API methods for SKUs */
	public readonly skus = new SkusAPI(this);
	/** API methods for soundboards */
	public readonly soundboards = new SoundboardsAPI(this);
	/** API methods for stage instances */
	public readonly stageInstances = new StageInstancesAPI(this);
	/** API methods for stickers */
	public readonly stickers = new StickersAPI(this);
	/** API methods for subscriptions */
	public readonly subscriptions = new SubscriptionsAPI(this);
	/** API methods for users */
	public readonly users = new UsersAPI(this);
	/** API methods for voice */
	public readonly voice = new VoiceAPI(this);

	private token: string;
	private config: ResolvedRESTOptions;
	private readonly buckets = new BucketManager();
	private invalidRequestCount = 0;
	private invalidRequestResetTime = Date.now() + INVALID_REQUEST_WINDOW;
	private readonly invalidRequestWarningTimer: Timer | null = null;

	/**
	 * Creates a new REST client.
	 * @param token - The bot token or OAuth2 access token
	 * @param options - Configuration options
	 */
	constructor(token: string, options: RESTOptions = {}) {
		super();
		this.token = token;
		this.config = this.validateOptions(options);

		if (this.config.sweepInterval > 0) {
			this.buckets.startSweeper(this.config.sweepInterval);
		}

		if (this.config.invalidRequestWarningInterval > 0) {
			this.invalidRequestWarningTimer = setInterval(() => {
				if (this.invalidRequestCount > 0) {
					this.emit("invalidRequestWarning", {
						count: this.invalidRequestCount,
						remainingTime: Math.max(0, this.invalidRequestResetTime - Date.now()),
					});
				}
			}, this.config.invalidRequestWarningInterval);
		}
	}

	/**
	 * Makes a request to the Discord API.
	 * Handles rate limiting, retries, and error parsing.
	 *
	 * @typeParam T - The expected response type
	 * @param method - The HTTP method to use
	 * @param route - The API route (e.g., "/users/@me")
	 * @param opts - Request options
	 * @param retryCount - Current retry attempt (internal use)
	 * @returns The response data, status, headers, and rate limit info
	 * @throws {@link RESTError} When the API returns an error response
	 * @throws {@link RateLimitError} When rate limited (before retry)
	 * @throws {@link TimeoutError} When the request times out after all retries
	 * @throws {@link CloudflareError} When blocked by Cloudflare
	 */
	async request<T>(
		method: HttpMethod,
		route: RouteLike,
		opts: RequestOptions = {},
		retryCount = 0,
	): Promise<RESTResponse<T>> {
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
				throw RESTError.fromResponse(responseData as ApiErrorResponse, response.status, rateLimit ?? undefined);
			}

			return {
				data: responseData as T,
				status: response.status,
				headers: response.headers,
				rateLimit,
			};
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				if (retryCount < this.config.retries) {
					return this.request(method, route, opts, retryCount + 1);
				}
				throw new TimeoutError(this.config.timeout);
			}

			if (error instanceof RateLimitError && retryCount < this.config.retries) {
				await Bun.sleep(error.retryAfter * 1000);
				return this.request(method, route, opts, retryCount + 1);
			}

			if (error instanceof RESTError && error.status >= 500 && retryCount < this.config.retries) {
				await Bun.sleep(1000 * (retryCount + 1));
				return this.request(method, route, opts, retryCount + 1);
			}

			if (error instanceof CloudflareError && retryCount < this.config.retries) {
				await Bun.sleep(1000 * (retryCount + 1));
				return this.request(method, route, opts, retryCount + 1);
			}

			throw error;
		} finally {
			clearTimeout(timeoutId);
		}
	}

	/**
	 * Makes a GET request to the Discord API.
	 * @typeParam T - The expected response type
	 * @param route - The API route
	 * @param opts - Request options
	 * @returns The response data
	 */
	async get<T>(route: RouteLike, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("GET", route, opts)).data;
	}

	/**
	 * Makes a POST request to the Discord API.
	 * @typeParam T - The expected response type
	 * @param route - The API route
	 * @param opts - Request options
	 * @returns The response data
	 */
	async post<T>(route: RouteLike, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("POST", route, opts)).data;
	}

	/**
	 * Makes a PUT request to the Discord API.
	 * @typeParam T - The expected response type
	 * @param route - The API route
	 * @param opts - Request options
	 * @returns The response data
	 */
	async put<T>(route: RouteLike, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("PUT", route, opts)).data;
	}

	/**
	 * Makes a PATCH request to the Discord API.
	 * @typeParam T - The expected response type
	 * @param route - The API route
	 * @param opts - Request options
	 * @returns The response data
	 */
	async patch<T>(route: RouteLike, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("PATCH", route, opts)).data;
	}

	/**
	 * Makes a DELETE request to the Discord API.
	 * @typeParam T - The expected response type (defaults to void for 204 responses)
	 * @param route - The API route
	 * @param opts - Request options
	 * @returns The response data
	 */
	async delete<T = void>(route: RouteLike, opts?: RequestOptions): Promise<T> {
		return (await this.request<T>("DELETE", route, opts)).data;
	}

	/**
	 * Updates the token used for authentication.
	 * @param token - The new token
	 */
	setToken(token: string): void {
		this.token = token;
	}

	/**
	 * Cleans up all resources held by the REST client.
	 * Should be called when the client is no longer needed.
	 */
	destroy(): void {
		this.buckets.destroy();
		if (this.invalidRequestWarningTimer) {
			clearInterval(this.invalidRequestWarningTimer);
		}
		this.removeAllListeners();
	}

	private validateOptions(options: RESTOptions): ResolvedRESTOptions {
		if (options.authType !== undefined && !VALID_AUTH_TYPES.includes(options.authType)) {
			throw new TypeError(
				`Invalid authType: ${options.authType}. Must be one of: ${VALID_AUTH_TYPES.join(", ")}`,
			);
		}

		if (options.version !== undefined) {
			if (
				!Number.isInteger(options.version) ||
				!VALID_API_VERSIONS.includes(options.version as (typeof VALID_API_VERSIONS)[number])
			) {
				throw new TypeError(
					`Invalid version: ${options.version}. Must be one of: ${VALID_API_VERSIONS.join(", ")}`,
				);
			}
		}

		if (options.retries !== undefined) {
			if (!Number.isInteger(options.retries) || options.retries < 0) {
				throw new TypeError(`Invalid retries: ${options.retries}. Must be a non-negative integer`);
			}
		}

		if (options.timeout !== undefined) {
			if (typeof options.timeout !== "number" || options.timeout <= 0) {
				throw new TypeError(`Invalid timeout: ${options.timeout}. Must be a positive number`);
			}
		}

		if (options.userAgent !== undefined) {
			if (typeof options.userAgent !== "string" || options.userAgent.trim() === "") {
				throw new TypeError("Invalid userAgent: Must be a non-empty string");
			}
		}

		return {
			authType: options.authType ?? "Bot",
			version: options.version ?? 10,
			retries: options.retries ?? 3,
			timeout: options.timeout ?? 15000,
			invalidRequestWarningInterval: options.invalidRequestWarningInterval ?? 0,
			sweepInterval: options.sweepInterval ?? 300_000,
			userAgent: options.userAgent ?? `DiscordBot (${LIB_URL}, ${LIB_VERSION})`,
		};
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
			"User-Agent": this.config.userAgent,
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

	private buildUrl(route: RouteLike, query?: RequestOptions["query"]): string {
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

	private getFileSize(data: Blob | ArrayBuffer | Uint8Array): number {
		if (data instanceof Blob) return data.size;
		return data.byteLength;
	}

	private isBufferLike(value: unknown): value is Buffer | ArrayBuffer | Uint8Array {
		return (
			value instanceof ArrayBuffer ||
			value instanceof Uint8Array ||
			(typeof Buffer !== "undefined" && Buffer.isBuffer(value))
		);
	}

	private buildBody(
		opts: RequestOptions,
		headers: Headers,
	): string | FormData | ArrayBuffer | Uint8Array | undefined {
		if (opts.files?.length) {
			for (const file of opts.files) {
				const size = this.getFileSize(file.data);
				if (size > DEFAULT_ATTACHMENT_SIZE_LIMIT) {
					throw new FileTooLargeError(file.name, size, DEFAULT_ATTACHMENT_SIZE_LIMIT);
				}
			}

			const files = opts.files.map((file, i) => Files.createFile(i, file.name, file.data, file.contentType));
			const payload = (opts.body ?? {}) as Record<string, unknown>;
			return Files.buildMultipartBody(payload, files);
		}

		if (opts.body === undefined) {
			return undefined;
		}

		if (typeof opts.body === "string") {
			if (!headers.has("Content-Type")) {
				headers.set("Content-Type", "text/plain");
			}
			return opts.body;
		}

		if (this.isBufferLike(opts.body)) {
			if (!headers.has("Content-Type")) {
				headers.set("Content-Type", "application/octet-stream");
			}
			return opts.body instanceof ArrayBuffer ? new Uint8Array(opts.body) : opts.body;
		}

		headers.set("Content-Type", "application/json");
		return JSON.stringify(opts.body);
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

	private async handleRateLimit(response: Response, routeKey: string): Promise<never> {
		const rateLimit = this.parseRateLimitHeaders(response.headers);
		const scope = rateLimit?.scope;

		if (scope !== "shared") {
			this.trackInvalidRequest();
		}

		const retryAfterHeader = response.headers.get("Retry-After");
		let retryAfter: number;
		let global: boolean;

		const contentType = response.headers.get("Content-Type");
		if (contentType?.includes("application/json")) {
			const data = (await response.json()) as RateLimitResponse;
			retryAfter = data.retry_after;
			global = data.global;
		} else {
			retryAfter = retryAfterHeader ? Number(retryAfterHeader) : 1;
			global = rateLimit?.global ?? false;
		}

		if (global) {
			this.buckets.setGlobalReset(Date.now() + retryAfter * 1000);
		}

		if (rateLimit) {
			this.buckets.update(routeKey, rateLimit);
		}

		this.emit("rateLimited", {
			route: routeKey,
			global,
			limit: rateLimit?.limit ?? 0,
			remaining: 0,
			retryAfter,
			scope,
		});

		throw new RateLimitError(retryAfter, global, scope);
	}
}
