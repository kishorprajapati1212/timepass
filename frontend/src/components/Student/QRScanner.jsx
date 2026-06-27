import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";
import { X, ScanLine, CheckCircle, AlertCircle, Camera, CameraOff } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axios.js";

const QRScanner = ({ onBack }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const scannerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
    return () => { stopScanner(); };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setCameraError(null);
      startScanner();
    } catch (err) {
      console.error("Camera permission error:", err);
      setHasPermission(false);
      setCameraError("Camera access denied. Please allow camera permissions in your browser settings.");
      toast.error("Camera access denied. Please allow camera permissions.");
    }
  };

  const startScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => { handleScan(decodedText); },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      console.error("Scanner start error:", err);
      setCameraError("Failed to start camera scanner. " + err.message);
      toast.error("Failed to start camera scanner");
    }
  };

  const stopScanner = async () => {
    setScanning(false);
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch (e) {}
      try { await scannerRef.current.clear(); } catch (e) {}
      scannerRef.current = null;
    }
  };

  const handleScan = async (data) => {
    if (loading || result) return;
    setLoading(true);
    try {
      let lectureSessionId = data;
      try { const parsed = JSON.parse(data); lectureSessionId = parsed.lectureSessionId || parsed.id || data; } catch (e) {}
      const res = await axiosInstance.post("/student/mark", { lectureSessionId });
      setResult({ success: true, message: res.data?.message || "Attendance marked!" });
      toast.success("Attendance marked successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to mark attendance";
      setResult({ success: false, message: msg });
      toast.error(msg);
    } finally { setLoading(false); }
  };

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="glass-card p-8 text-center max-w-sm w-full">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${result.success ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
            {result.success ? <CheckCircle size={40} className="text-emerald-400" /> : <AlertCircle size={40} className="text-rose-400" />}
          </div>
          <h3 className="text-xl font-bold mb-2">{result.success ? "Success!" : "Failed"}</h3>
          <p className="text-slate-400 mb-6">{result.message}</p>
          <button onClick={() => { setResult(null); setLoading(false); if (hasPermission) startScanner(); }} className="btn-primary w-full">Scan Again</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2"><ScanLine size={22} className="text-cyan-400" /> Scan QR Code</h2>
        <button onClick={() => { stopScanner(); onBack(); }} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
      </div>

      {!hasPermission || cameraError ? (
        <div className="glass-card p-8 text-center">
          <CameraOff size={48} className="mx-auto text-rose-400 mb-4" />
          <h3 className="text-lg font-bold mb-2">Camera Access Required</h3>
          <p className="text-slate-400 text-sm mb-4">{cameraError || "Please allow camera access to scan QR codes."}</p>
          <button onClick={requestCameraPermission} className="btn-primary flex items-center gap-2 mx-auto">
            <Camera size={18} /> Allow Camera
          </button>
        </div>
      ) : (
        <div className="glass-card p-4 overflow-hidden">
          <div id="qr-reader" style={{ width: "100%", minHeight: "300px" }} />
          {!scanning && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      <p className="text-center text-slate-500 text-sm">Point your camera at the QR code displayed by your faculty</p>
    </div>
  );
};
export default QRScanner;
