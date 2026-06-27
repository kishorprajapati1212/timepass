import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axiosInstance from "../../utils/AxiosInstance";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const QRScanner = ({ onBack }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        try {
          // Pause scanning to prevent multiple hits
          await scanner.stop(); 
          setLoading(true);

          const { lectureSessionId, qrToken } = JSON.parse(decodedText);

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                await axiosInstance.post("/student/mark", {
                  lectureSessionId,
                  qrToken,
                  gpsLocation: { lat: latitude, lng: longitude },
                  source: "QR",
                });
                toast.success("✅ Attendance marked successfully!");
                onBack(); // Go back home after success
              } catch (err) {
                toast.error(err.response?.data?.message || "Error marking attendance");
                onBack(); 
              }
            },
            () => {
              toast.error("Location permission required");
              onBack();
            }
          );
        } catch (err) {
          toast.error("Invalid QR Code");
        } finally {
          setLoading(false);
        }
      }
    ).catch(err => console.error("Scanner start error", err));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onBack]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
      <button onClick={onBack} className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full">
        <X size={24} />
      </button>
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Ready to Scan</h2>
        <p className="text-slate-400">Align the QR code within the frame</p>
      </div>

      <div id="reader" className="w-full max-w-xs overflow-hidden rounded-3xl border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)]"></div>

      {loading && (
        <div className="mt-8 flex flex-col items-center">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-cyan-400 font-medium">Validating your location...</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;