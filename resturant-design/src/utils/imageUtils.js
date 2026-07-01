const assetFiles = import.meta.glob("../assets/**/*.{png,jpg,jpeg,svg}", {
  eager: true,
  as: "url",
});

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80";

const normalizeAssetPath = (src) => {
  if (!src) return "";
  return src
    .replace(/^\/+/, "")
    .replace(/^src\//, "")
    .replace(/^assets\//, "")
    .replace(/^src\/assets\//, "");
};

export function resolveAssetImage(src) {
  if (!src) return DEFAULT_IMAGE_URL;
  if (/^https?:\/\//.test(src)) return src;

  const normalized = normalizeAssetPath(src);
  const candidate = `../assets/${normalized}`;
  return assetFiles[candidate] || DEFAULT_IMAGE_URL;
}

export function getFoodImageUrl(id) {
  if (!id) return DEFAULT_IMAGE_URL;
  return resolveAssetImage(`foods/${id}.jpg`);
}
