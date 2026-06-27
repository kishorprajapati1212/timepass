import crypto from "crypto";

const generateQRData = (lectureSessionId) => {
  if (!lectureSessionId) {
    lectureSessionId = "test-lecture-id";
  }
  
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString("hex");
  
  const data = JSON.stringify({
    lectureSessionId: lectureSessionId.toString(),
    timestamp,
    token: randomString,
  });
  
  const encoded = Buffer.from(data).toString("base64");
  return encoded;
};

const verifyQRData = (encodedData) => {
  try {
    if (!encodedData || typeof encodedData !== "string") {
      return { valid: false, message: "Invalid QR code: empty or not a string" };
    }

    let data;
    
    try {
      const decoded = Buffer.from(encodedData, "base64").toString("utf8");
      data = JSON.parse(decoded);
    } catch (e) {
      try {
        data = JSON.parse(encodedData);
      } catch (e2) {
        return { valid: false, message: "Invalid QR code format" };
      }
    }

    if (!data.lectureSessionId) {
      return { valid: false, message: "Invalid QR code: missing lecture session" };
    }

    const now = Date.now();
    const qrAge = now - (data.timestamp || 0);
    const maxAge = 15 * 60 * 1000;

    if (qrAge > maxAge) {
      return { valid: false, message: "QR code expired" };
    }

    return { valid: true, data };
  } catch (error) {
    return { valid: false, message: "Invalid QR code: " + error.message };
  }
};

export { generateQRData, verifyQRData };