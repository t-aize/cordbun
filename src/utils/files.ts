export const DEFAULT_ATTACHMENT_SIZE_LIMIT = 10 * 1024 * 1024;
export const NITRO_BASIC_ATTACHMENT_SIZE_LIMIT = 50 * 1024 * 1024;
export const NITRO_ATTACHMENT_SIZE_LIMIT = 500 * 1024 * 1024;

export const BOOST_LEVEL_2_ATTACHMENT_SIZE_LIMIT = 50 * 1024 * 1024;
export const BOOST_LEVEL_3_ATTACHMENT_SIZE_LIMIT = 100 * 1024 * 1024;

export enum EmbedImageFormat {
	JPG = "jpg",
	JPEG = "jpeg",
	PNG = "png",
	WebP = "webp",
	GIF = "gif",
}

export type AttachmentUrl<F extends string = string> = `attachment://${F}`;

export type FileFieldName<N extends number = number> = `files[${N}]`;

export interface AttachmentPayload {
	id: number;
	filename: string;
	description?: string;
}

export interface FileAttachment {
	name: FileFieldName;
	filename: string;
	data: Blob | ArrayBuffer | Uint8Array;
	contentType?: string | undefined;
}

export const Files = {
	url: <F extends string>(filename: F): AttachmentUrl<F> => `attachment://${filename}`,

	fileFieldName: <N extends number>(index: N): FileFieldName<N> => `files[${index}]`,

	createPayload: (id: number, filename: string, description?: string): AttachmentPayload => ({
		id,
		filename,
		...(description && { description }),
	}),

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

	isValidEmbedImageFilename: (filename: string): boolean => {
		const ext = filename.split(".").pop()?.toLowerCase();
		return ext !== undefined && Object.values(EmbedImageFormat).includes(ext as EmbedImageFormat);
	},

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

	mimeTypeFromExtension: (filename: string): string | undefined => {
		const ext = filename.split(".").pop()?.toLowerCase();
		const mimeTypes: Record<string, string> = {
			jpg: "image/jpeg",
			jpeg: "image/jpeg",
			png: "image/png",
			webp: "image/webp",
			gif: "image/gif",
			mp4: "video/mp4",
			webm: "video/webm",
			mp3: "audio/mpeg",
			ogg: "audio/ogg",
			wav: "audio/wav",
			pdf: "application/pdf",
			json: "application/json",
			txt: "text/plain",
		};
		return ext ? mimeTypes[ext] : undefined;
	},
} as const;
