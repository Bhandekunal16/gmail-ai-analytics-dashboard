/**
 * Safe decryption and decoding helper for backend responses.
 * When the backend has encryption middleware enabled, responses may come
 * as { data: "<encrypted-or-base64-payload>" }.
 */

export function tryDecodeResponsePayload(rawData: unknown): unknown {
  if (!rawData) return rawData;

  // If already an object and not an encrypted string wrapper
  if (typeof rawData === 'object' && rawData !== null) {
    const obj = rawData as Record<string, unknown>;

    // If it's a wrapper like { success: true, data: "..." } where data is a string
    if (typeof obj.data === 'string') {
      const decoded = tryDecodeString(obj.data);
      if (decoded !== undefined) {
        return { ...obj, data: decoded };
      }
    }
    return rawData;
  }

  // If rawData itself is a string that might be base64 or encoded JSON
  if (typeof rawData === 'string') {
    const decoded = tryDecodeString(rawData);
    if (decoded !== undefined) {
      return decoded;
    }
  }

  return rawData;
}

function tryDecodeString(str: string): unknown | undefined {
  const trimmed = str.trim();
  // 1. Direct JSON check
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // not direct JSON
    }
  }

  // 2. Base64 encoded JSON check
  try {
    const binary = atob(trimmed);
    if ((binary.startsWith('{') && binary.endsWith('}')) || (binary.startsWith('[') && binary.endsWith(']'))) {
      return JSON.parse(binary);
    }
  } catch {
    // not valid base64
  }

  return undefined;
}
