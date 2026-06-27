export const parseQR = (qrText) => {
  try {
    return JSON.parse(qrText);
  } catch {
    return null;
  }
};

export const isQRValid = (payload) => {
  if (!payload) return false;

  const { token, lecID, expiresAt } = payload;

  if (!token || !lecID || !expiresAt) return false;

  if (Date.now() > expiresAt) return false;

  return true;
};