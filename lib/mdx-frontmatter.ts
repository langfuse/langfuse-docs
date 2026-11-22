/**
 * Strip non-serializable values without evaluating lazy MDX outputs.
 */
export function primitiveOnly(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(Object.getOwnPropertyDescriptors(obj))
      .filter(
        ([, descriptor]) => descriptor.enumerable && "value" in descriptor,
      )
      .map(([key, { value }]) => [key, value])
      .filter(
        ([, v]) =>
          v === null ||
          typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean" ||
          (Array.isArray(v) && v.every((item) => typeof item !== "function")),
      ),
  );
}
