import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw, Download } from "lucide-react";
import { toast } from "react-toastify";

const QRGenerator = ({ lectureSessionId, onRefresh }) => {
  const [copied, setCopied] = useState(false);
  const [qrData, setQrData] = useState("");

  useEffect(() => { if (lectureSessionId) setQrData(JSON.stringify({ lectureSessionId, timestamp: Date.now() })); }, [lectureSessionId]);

  const handleCopy = () => { navigator.clipboard.writeText(lectureSessionId); setCopied(true); toast.success("Session ID copied!"); setTimeout(() => setCopied(false), 2000); };

  const handleDownload = () => {
    const svg = document.getElementById("faculty-qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => { canvas.width = img.width; canvas.height = img.height; ctx.drawImage(img, 0, 0); const link = document.createElement("a"); link.download = `attendx-qr-${lectureSessionId}.png`; link.href = canvas.toDataURL("image/png"); link.click(); };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
      toast.success("QR Code downloaded!");
    }
  };

  if (!lectureSessionId) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 text-center">
      <h3 className="font-bold text-lg mb-4">Live Session QR</h3>
      <div className="bg-white p-4 rounded-xl inline-block mb-4">
        <QRCode id="faculty-qr-code" value={qrData} size={200} level="H" />
      </div>
      <p className="text-slate-400 text-sm mb-4">Scan this QR code to mark attendance</p>
      <div className="flex items-center justify-center gap-2 mb-4">
        <code className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300 font-mono">{lectureSessionId}</code>
        <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-colors">{copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}</button>
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={onRefresh} className="btn-secondary text-sm py-2 px-4 flex items-center gap-1"><RefreshCw size={14} /> Refresh</button>
        <button onClick={handleDownload} className="btn-primary text-sm py-2 px-4 flex items-center gap-1"><Download size={14} /> Download</button>
      </div>
    </motion.div>
  );
};
export default QRGenerator;
