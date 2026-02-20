/**
 * Appends Supabase image transformation parameters to storage URLs.
 * Non-Supabase URLs are returned unchanged.
 */
const SUPABASE_STORAGE_HOST = "fhvjjbnjecwbdslvemsa.supabase.co";

type ImageOptions = {
    width?: number;
    height?: number;
    quality?: number;
};

export function optimizeImageUrl(
    url: string,
    { width = 1200, quality = 75, height }: ImageOptions = {}
): string {
    if (!url || !url.includes(SUPABASE_STORAGE_HOST)) return url;

    // Avoid double-appending if already transformed
    if (url.includes("?width=") || url.includes("&width=")) return url;

    const params = new URLSearchParams();
    params.set("width", String(width));
    params.set("quality", String(quality));
    if (height) params.set("height", String(height));

    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${params.toString()}`;
}
