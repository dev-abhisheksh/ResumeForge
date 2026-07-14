export const containsKeyword = (text: string, keyword: string): boolean => {
  const kw = keyword.toLowerCase().trim();
  const txt = text.toLowerCase();
  if (!kw) return false;

  const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const isAlphanumeric = /^[a-z0-9\s]+$/i.test(kw);

  const regex = isAlphanumeric
    ? new RegExp(`\\b${escaped}\\b`, "i")
    : new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i");

  return regex.test(txt);
};
