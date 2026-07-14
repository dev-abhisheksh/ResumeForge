export const normalizeKeyword = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // Remove anything in brackets
    .replace(/\.js/g, "js")
    .replace(/rest\s+apis?/g, "restapi")
    .replace(/node\.?js/g, "nodejs")
    .replace(/express\.?js/g, "express")
    .replace(/mongo\s?db/g, "mongodb")
    .replace(/[^\w+# ]/g, "") // Keep spaces
    .replace(/\s+/g, " ")
    .trim();
};
