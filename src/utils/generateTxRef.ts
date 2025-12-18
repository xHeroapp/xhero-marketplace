export function generateTxRef(prefix = "tx") {
  const randomPart = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const timestamp = Date.now().toString(36); // compact & unique
  return `${prefix}_${timestamp}_${randomPart}`;
}
