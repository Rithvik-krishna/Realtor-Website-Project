/**
 * Official Real Estate IDX / TRREB Media Metadata Helper
 * Purely deterministic, compliant helper for reading official listing media metadata.
 * NO AI, NO heuristics, NO pixel analysis, NO fabricated labels.
 */

export interface MediaItem {
  url?: string;
  MediaURL?: string;
  LargeURL?: string;
  HugeURL?: string;
  MediaDescription?: string;
  MediaCaption?: string;
  MediaLabel?: string;
  PhotoDescription?: string;
  PhotoType?: string;
  RoomName?: string;
  DisplayCaption?: string;
  Category?: string;
  Description?: string;
  caption?: string;
  label?: string;
  [key: string]: any;
}

/**
 * Returns official IDX media label in exact priority order:
 * 1. media.MediaDescription
 * 2. media.MediaCaption
 * 3. media.PhotoDescription
 * 4. media.RoomName
 * 5. Other official metadata fields (MediaLabel, PhotoType, DisplayCaption, Category, Description)
 * 6. Fallback: "Photo ${index + 1}"
 *
 * Never guesses, never uses AI, never fabricates labels.
 */
export function getPhotoLabel(media: MediaItem | string | undefined | null, index: number): string {
  if (!media) {
    return `Photo ${index + 1}`;
  }

  // If string URL (no attached metadata object)
  if (typeof media === 'string') {
    return `Photo ${index + 1}`;
  }

  // Priority inspection per IDX specifications
  const officialLabel =
    media.MediaDescription ||
    media.MediaCaption ||
    media.PhotoDescription ||
    media.RoomName ||
    media.MediaLabel ||
    media.PhotoType ||
    media.DisplayCaption ||
    media.Category ||
    media.Description ||
    media.caption ||
    media.label;

  if (officialLabel && typeof officialLabel === 'string' && officialLabel.trim().length > 0) {
    return officialLabel.trim();
  }

  return `Photo ${index + 1}`;
}

/**
 * Checks whether an item or list of items contains official media metadata
 */
export function hasOfficialMediaMetadata(mediaList: Array<MediaItem | string>): boolean {
  if (!Array.isArray(mediaList) || mediaList.length === 0) return false;
  return mediaList.some((item, idx) => {
    if (typeof item === 'string') return false;
    const label = getPhotoLabel(item, idx);
    return !label.startsWith('Photo ');
  });
}
