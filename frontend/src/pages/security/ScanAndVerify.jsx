import React, { useState, useEffect, useRef, useContext } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { scanVisitorQR, exitVisitor } from "../../api/visitorApi";
import { ThemeContext } from "../../App";

export default function ScanAndVerify() {
  const { theme } = useContext(ThemeContext);

  const [qrResult, setQrResult] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [manualData, setManualData] = useState("");
  const [scanStatus, setScanStatus] = useState("Scanning… please hold steady");

  const scannerRef = useRef(null);
  const detailsRef = useRef(null);

  const extractCode = (raw) => raw?.split("\n")[0].trim() || null;

  const scrollToDetails = () => {
    if (detailsRef.current)
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScanData = async (rawText) => {
    try {
      setError("");
      setSuccessMsg("");
      setScanStatus("QR detected! Fetching visitor details…");

      const code = extractCode(rawText);
      if (!code || !code.startsWith("VMS_VISITOR:")) {
        setError("❌ Invalid QR format");
        setScanStatus("Scanning… please hold steady");
        return;
      }

      const res = await scanVisitorQR(code);
      setQrResult(res.data);

      setSuccessMsg(`Visitor Found: ${res.data.name} ✔️`);
      setTimeout(() => setSuccessMsg(""), 3000);

      setScanStatus("Scan complete ✔️");

      setTimeout(scrollToDetails, 500);
    } catch (err) {
      setError("❌ Invalid or expired QR code");
      setScanStatus("Scanning… please hold steady");
      setQrResult(null);
    }
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-scanner-box");

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length > 0) {
          html5QrCode.start(
            devices[0].id,
            { fps: 30, qrbox: { width: 260, height: 260 } },
            (decodedText) => {
              html5QrCode.stop();
              handleScanData(decodedText);
            }
          );
          scannerRef.current = html5QrCode;
        }
      })
      .catch(() => {
        setError("Camera access failed ❌");
        setScanStatus("Unable to access camera");
      });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleManualSubmit = () => handleScanData(manualData);

  const handleExit = async () => {
    try {
      await exitVisitor(qrResult.id);
      setSuccessMsg("Visitor exited successfully ✔️");
      setTimeout(() => setSuccessMsg(""), 3000);
      setQrResult({ ...qrResult, status: "EXITED", canExit: false });
    } catch (err) {
      setError("❌ Error while exiting visitor");
    }
  };

  return (
    <div
      className={`p-10 min-h-screen transition-all duration-500 ${
        theme === "dark" ? "bg-gradient-to-b from-slate-900 to-slate-800" : "bg-gray-50"
      }`}
    >
      <h1
        className={`text-4xl font-bold text-center mb-6 ${
          theme === "dark" ? "text-purple-300" : "text-purple-700"
        }`}
      >
        Scan & Verify <span className="text-black dark:text-white">Visitor</span>
      </h1>

      <p
        className={`text-center text-lg font-semibold mb-4 animate-pulse ${
          theme === "dark" ? "text-blue-300" : "text-blue-600"
        }`}
      >
        {scanStatus}
      </p>

      {/* SCANNER CARD */}
      <div className="flex justify-center">
        <div
          className={`
            relative p-4 rounded-2xl shadow-2xl border 
            ${theme === "dark" 
              ? "bg-white/10 border-purple-500/40 backdrop-blur-xl text-white"
              : "bg-white border-purple-300"}
          `}
        >
          <div className="absolute inset-0 border-4 border-purple-500 rounded-2xl animate-pulse pointer-events-none"></div>

          <div id="qr-scanner-box" style={{ width: "350px", height: "350px" }}></div>
        </div>
      </div>

      <p className="text-center mt-3 text-gray-600 dark:text-gray-300">
        Hold device 20–40 cm from QR for best results
      </p>

      {error && (
        <div className="mt-4 text-center text-red-500 dark:text-red-300 font-semibold">
          {error}
        </div>
      )}

      {successMsg && (
        <div
          className="mt-6 mx-auto w-1/2 bg-green-100 border border-green-300 
                                    text-green-800 py-3 px-4 rounded-lg shadow text-center animate-fadeIn
                                    dark:bg-green-900 dark:text-green-300 dark:border-green-700"
        >
          {successMsg}
        </div>
      )}

      {/* ---- MANUAL ENTRY SECTION (FIXED & BEAUTIFUL) ---- */}
      <div className="mt-12 flex flex-col items-center">
        <h2
          className={`text-2xl font-bold mb-4 ${
            theme === "dark" ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Enter QR Data Manually
        </h2>

        <div className="flex items-center gap-4 w-full max-w-xl">
          <input
            type="text"
            value={manualData}
            onChange={(e) => setManualData(e.target.value)}
            placeholder="VMS_VISITOR:24"
            className={`
              flex-1 px-4 py-3 rounded-lg shadow-md text-lg transition-all
              ${theme === "dark"
                ? "bg-white/10 border border-white/20 text-white placeholder-gray-300"
                : "bg-white border border-gray-300 text-gray-800"}
            `}
          />

          <button
            onClick={handleManualSubmit}
            className="
              px-6 py-3 bg-purple-600 text-white rounded-lg text-lg 
              shadow hover:bg-purple-700 transition-all
            "
          >
            Submit
          </button>
        </div>
      </div>

      {/* VISITOR DETAILS CARD */}
      {qrResult && (
        <div
          ref={detailsRef}
          className={`
            mt-12 mx-auto w-2/3 p-6 rounded-2xl shadow-xl border animate-fadeIn
            ${theme === "dark"
              ? "bg-white/10 backdrop-blur-xl border-white/20 text-white"
              : "bg-white border-purple-300 text-gray-800"}
          `}
        >
          <h2 className="text-3xl font-bold mb-6">Visitor Details</h2>

          <div className="space-y-3 text-lg">
            <p>👤 <strong>Name:</strong> {qrResult.name}</p>
            <p>📧 <strong>Email:</strong> {qrResult.email}</p>
            <p>📞 <strong>Phone:</strong> {qrResult.phone}</p>
            <p>🎯 <strong>Purpose:</strong> {qrResult.purpose}</p>
            <p>🛡️ <strong>Staff:</strong> {qrResult.staffUsername}</p>
            <p>⏱️ <strong>Entry Time:</strong> {qrResult.entryTime}</p>

            <p className="mt-3">
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-white ${
                  qrResult.status === "EXITED"
                    ? "bg-green-600"
                    : "bg-yellow-500"
                }`}
              >
                {qrResult.status}
              </span>
            </p>
          </div>

          {qrResult.canExit && qrResult.status !== "EXITED" && (
            <button
              onClick={handleExit}
              className="bg-red-600 text-white px-4 py-2 rounded mt-6 shadow hover:bg-red-700"
            >
              Exit Visitor
            </button>
          )}
        </div>
      )}
    </div>
  );
}

