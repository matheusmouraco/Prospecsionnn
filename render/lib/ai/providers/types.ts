export type Part = { type: "text"; text: string } | { type: "image"; mime: string; data: string };

export type ImageRequest = {
  parts: Part[];
  /** e.g. "16:9"; undefined lets the model follow the base image */
  aspectRatio?: string;
  size: "1K" | "2K";
};

export type ImageResult = {
  mime: string;
  /** base64 */
  data: string;
  model: string;
  costUsd: number;
};

/** Every image model sits behind this interface, so switching provider touches only this folder. */
export interface ImageProvider {
  readonly id: string;
  generate(req: ImageRequest): Promise<ImageResult>;
}

/** Error with a message that is safe to show to the user (Portuguese). */
export class FriendlyError extends Error {
  constructor(
    message: string,
    readonly status = 500,
    readonly detail?: string,
  ) {
    super(message);
  }
}
