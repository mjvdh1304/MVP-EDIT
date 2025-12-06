import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onDetected: (code: string) => void;
  onError?: (err: Error) => void;
  facingMode?: 'environment' | 'user';
};

const BarcodeScanner: React.FC<Props> = ({ onDetected, onError, facingMode = 'environment' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scanning, setScanning] = useState(false);
  const detectorRef = useRef<any | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('idle');
  const [torchAvailable, setTorchAvailable] = useState(false);
  const currentStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof (window as any).BarcodeDetector !== 'undefined') {
      try {
        // @ts-ignore
        detectorRef.current = new BarcodeDetector({ formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'upc_a', 'upc_e'] });
      } catch (e) {
        detectorRef.current = null;
      }
    }
    return () => {
      stop();
      detectorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // enumerate devices
    (async () => {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        const cams = list.filter((d) => d.kind === 'videoinput');
        setDevices(cams);
        if (cams.length) {
          // prefer back-facing device if available
          const back = cams.find((c) => /back|rear|environment/i.test(c.label));
          setSelectedDeviceId(back?.deviceId || cams[0].deviceId);
        }
      } catch (e) {
        // ignore
      }
    })();

    // auto-start on touch devices for convenience
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      start().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    setScanning(true);
    setStatus('requesting_permissions');
    try {
      const constraints: MediaStreamConstraints = selectedDeviceId
        ? { video: { deviceId: { exact: selectedDeviceId } } }
        : { video: { facingMode } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      currentStreamRef.current = stream;
      // detect torch availability
      try {
        const track = stream.getVideoTracks()[0];
        // @ts-ignore
        const caps = track.getCapabilities?.();
        setTorchAvailable(!!(caps as any)?.torch);
      } catch (e) {
        setTorchAvailable(false);
      }
      setStatus('scanning');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      // If BarcodeDetector is available, poll the video frames for detections
      if (detectorRef.current && videoRef.current) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const interval = setInterval(async () => {
          try {
            if (!videoRef.current || !ctx) return;
            canvas.width = videoRef.current.videoWidth || 640;
            canvas.height = videoRef.current.videoHeight || 480;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageBitmap = await createImageBitmap(canvas);
            const detections = await detectorRef.current!.detect(imageBitmap as any);
            if (detections && detections.length) {
              onDetected(detections[0].rawValue || detections[0].rawData as any);
              clearInterval(interval);
              stop();
            }
          } catch (err) {
            // ignore frame-by-frame errors
          }
        }, 500);
      }
      setStatus('ready');
    } catch (err: any) {
      setScanning(false);
      setStatus('error');
      if (onError) onError(err);
    }
  }

  function stop() {
    setScanning(false);
    try {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((t) => t.stop());
        currentStreamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setStatus('stopped');
      setTorchAvailable(false);
    } catch (e) {
      // ignore
    }
  }

  async function toggleTorch() {
    try {
      const stream = currentStreamRef.current;
      if (!stream) return;
      const track = stream.getVideoTracks()[0];
      // @ts-ignore
      const cap = track.getCapabilities?.();
      if (!(cap as any)?.torch) return;
      // @ts-ignore
      const constraints = { advanced: [{ torch: !(track as any).torchOn } ] };
      // try to toggle
      // @ts-ignore
      await track.applyConstraints(constraints);
      // store flag
      (track as any).torchOn = !(track as any).torchOn;
    } catch (e) {
      // ignore
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      if (detectorRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageBitmap = await createImageBitmap(canvas);
          const detections = await detectorRef.current.detect(imageBitmap as any);
          if (detections && detections.length) {
            onDetected(detections[0].rawValue || (detections[0] as any).rawData);
            return;
          }
        }
      }
      // If no detector available or no detection, error
      if (onError) onError(new Error('No barcode detected in image; try a different photo or use the camera.'));
    } catch (err) {
      if (onError) onError(err as Error);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="barcode-scanner">
      <div style={{ position: 'relative' }}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <strong className="text-sm">Status:</strong>
            <span className="text-sm text-muted-foreground">{status}</span>
          </div>
          <div className="flex items-center gap-2">
            {devices.length > 1 && (
              <select value={selectedDeviceId || ''} onChange={(e) => setSelectedDeviceId(e.target.value)} className="border rounded px-2 py-1 text-sm">
                {devices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>
                ))}
              </select>
            )}
            {torchAvailable && (
              <button className="btn btn-ghost" onClick={toggleTorch} title="Toggle flashlight">Flash</button>
            )}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <video ref={videoRef} style={{ width: '100%', height: 'auto', borderRadius: 8, background: '#000' }} />
          {/* Overlay */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
            <div style={{ width: 220, height: 140, border: '2px solid rgba(255,255,255,0.6)', borderRadius: 8, boxShadow: '0 0 12px rgba(0,0,0,0.6)' }} />
            <div style={{ height: 8 }} />
            <div style={{ width: 220, height: 2, background: 'rgba(255,0,0,0.6)', animation: 'scanline 1.5s linear infinite' }} />
          </div>
        </div>

        <style>{`@keyframes scanline {0%{transform:translateY(-60px);}50%{transform:translateY(60px);}100%{transform:translateY(-60px);}}`}</style>

        <div className="mt-3 flex gap-2">
          {!scanning ? (
            <>
              <button className="btn" onClick={() => start()}>
                Start camera
              </button>
              <label style={{ marginLeft: 8 }} className="btn">
                Upload image
                <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </label>
            </>
          ) : (
            <div>
              <button className="btn" onClick={() => stop()}>
                Stop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
