import LectureSession from "../../models/lecture/LectureSession.js";
import { generateQRData } from "../../utils/generateQR.js";

const rotateQRCode = async (lectureSessionId) => {
  try {
    const newQR = generateQRData(lectureSessionId);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await LectureSession.findByIdAndUpdate(lectureSessionId, {
      qrCode: newQR,
      qrExpiresAt: expiresAt,
    });

    console.log(`✅ QR rotated for lecture: ${lectureSessionId}`);
    return newQR;
  } catch (error) {
    console.error(`❌ QR rotation failed for ${lectureSessionId}:`, error.message);
    return null;
  }
};

const startQrRotationScheduler = () => {
  // Rotate QR every 5 minutes for active lectures
  setInterval(async () => {
    try {
      const activeLectures = await LectureSession.find({ status: "ACTIVE" });

      for (const lecture of activeLectures) {
        // Check if QR is about to expire (within 1 minute)
        if (!lecture.qrExpiresAt || new Date(lecture.qrExpiresAt) <= new Date(Date.now() + 60 * 1000)) {
          await rotateQRCode(lecture._id);
        }
      }
    } catch (error) {
      console.error("QR Scheduler Error:", error.message);
    }
  }, 60 * 1000); // Check every minute

  console.log("🔄 QR Rotation Scheduler started");
};

export { rotateQRCode, startQrRotationScheduler };
