/**
 * Removes properties with `undefined` or empty string values from an object.
 *
 * @template T - The type of the input object.
 * @param {T} obj - The object to clean.
 * @returns {Partial<T>} A new object with only the properties that have valid values.
 */
export const cleanObject = <T extends Record<string, any>>(
  obj: T,
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== "",
    ),
  ) as Partial<T>;
};

/**
 * Serializes various types of `params` into a string format.
 *
 * @param {any} params - The parameter value to be serialized.
 * @returns {string} - A string representation of the parameter.
 *
 * - If `params` is an `Error` object, it extracts `name`, `message`, and `stack`.
 * - If `params` is `FormData`, it converts it to a URL-encoded string.
 * - If `params` is an object, it converts it to JSON.
 * - If `params` throws an error during serialization, it logs a fallback error message.
 */
export const serializeParams = (params: any): string => {
  try {
    if (params instanceof Error) {
      return JSON.stringify({
        name: params.name,
        message: params.message,
        stack: params.stack,
      });
    }
    return JSON.stringify(params);
  } catch (error) {
    return `Serialization Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};
