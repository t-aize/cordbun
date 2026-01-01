/**
 * Default file upload size limit (10 MiB) for all users.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export const DEFAULT_ATTACHMENT_SIZE_LIMIT = 10 * 1024 * 1024;

/**
 * File upload size limit (50 MiB) for Nitro Basic subscribers.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export const NITRO_BASIC_ATTACHMENT_SIZE_LIMIT = 50 * 1024 * 1024;

/**
 * File upload size limit (500 MiB) for Nitro subscribers.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export const NITRO_ATTACHMENT_SIZE_LIMIT = 500 * 1024 * 1024;

/**
 * File upload size limit (50 MiB) for servers with Boost Level 2.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export const BOOST_LEVEL_2_ATTACHMENT_SIZE_LIMIT = 50 * 1024 * 1024;

/**
 * File upload size limit (100 MiB) for servers with Boost Level 3.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export const BOOST_LEVEL_3_ATTACHMENT_SIZE_LIMIT = 100 * 1024 * 1024;

/**
 * Supported image formats for embed images.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export enum EmbedImageFormat {
	JPG = "jpg",
	JPEG = "jpeg",
	PNG = "png",
	WebP = "webp",
	GIF = "gif",
}

/**
 * Template literal type for attachment URLs used in embeds.
 * Format: `attachment://filename`
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export type AttachmentUrl<F extends string = string> = `attachment://${F}`;

/**
 * Template literal type for file field names in multipart requests.
 * Format: `files[n]` where n is the index.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export type FileFieldName<N extends number = number> = `files[${N}]`;

/**
 * Represents an attachment payload for the `attachments` field in requests.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export interface AttachmentPayload {
	/** Snowflake placeholder matching the file index */
	id: number;
	/** Name of the file */
	filename: string;
	/** Description of the file (max 1024 characters) */
	description?: string;
}

/**
 * Represents a file to be uploaded via multipart form data.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export interface FileAttachment {
	/** The field name (e.g., `files[0]`) */
	name: FileFieldName;
	/** The filename to use */
	filename: string;
	/** The file data */
	data: Blob | ArrayBuffer | Uint8Array;
	/** Optional MIME type */
	contentType?: string | undefined;
}

/**
 * Utilities for working with file attachments and uploads.
 * @see {@link https://discord.com/developers/docs/reference#uploading-files}
 */
export const Files = {
	/**
	 * Creates an attachment URL for use in embeds.
	 * @param filename - The filename to reference
	 * @returns An attachment URL in the format `attachment://filename`
	 */
	url: <F extends string>(filename: F): AttachmentUrl<F> => `attachment://${filename}`,

	/**
	 * Creates a file field name for multipart uploads.
	 * @param index - The file index
	 * @returns A field name in the format `files[n]`
	 */
	fileFieldName: <N extends number>(index: N): FileFieldName<N> => `files[${index}]`,

	/**
	 * Creates an attachment payload object.
	 * @param id - The snowflake placeholder (file index)
	 * @param filename - The filename
	 * @param description - Optional description
	 * @returns An attachment payload object
	 */
	createPayload: (id: number, filename: string, description?: string): AttachmentPayload => ({
		id,
		filename,
		...(description && { description }),
	}),

	/**
	 * Creates a file attachment object for upload.
	 * @param index - The file index
	 * @param filename - The filename
	 * @param data - The file data
	 * @param contentType - Optional MIME type
	 * @returns A file attachment object
	 */
	createFile: (
		index: number,
		filename: string,
		data: Blob | ArrayBuffer | Uint8Array,
		contentType?: string,
	): FileAttachment => ({
		name: Files.fileFieldName(index),
		filename,
		data,
		contentType,
	}),

	/**
	 * Checks if a filename has a valid embed image extension.
	 * Only `.jpg`, `.jpeg`, `.png`, `.webp`, and `.gif` are supported.
	 * @param filename - The filename to check
	 * @returns True if the file can be used in embeds
	 */
	isValidEmbedImageFilename: (filename: string): boolean => {
		const ext = filename.split(".").pop()?.toLowerCase();
		return ext !== undefined && Object.values(EmbedImageFormat).includes(ext as EmbedImageFormat);
	},

	/**
	 * Builds a multipart form data body for file uploads.
	 * @param payload - The JSON payload
	 * @param files - Array of files to attach
	 * @returns A FormData object ready for upload
	 */
	buildMultipartBody: (payload: Record<string, unknown>, files: FileAttachment[]): FormData => {
		const formData = new FormData();

		formData.append("payload_json", JSON.stringify(payload));

		for (const file of files) {
			const blob =
				file.data instanceof Blob
					? file.data
					: new Blob([file.data], file.contentType ? { type: file.contentType } : undefined);
			formData.append(file.name, blob, file.filename);
		}

		return formData;
	},
} as const;
