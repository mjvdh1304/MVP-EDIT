import React, { useCallback, useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';

const ScanPage: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [manual, setManual] = useState('');
  const navigate = useNavigate();

  const handleDetected = useCallback(async (code: string) => {
    setMessage(`Scanned: ${code} — looking up...`);
    setRecent((r) => [code, ...r].slice(0, 6));
    try {
      const product = await api.getProductByBarcode(code);
      if (product) {
        const id = (product as any).id;
        if (id) {
          navigate(`/product/${encodeURIComponent(id)}`);
        } else {
          navigate('/submit', { state: { barcode: code, product } });
        }
      } else {
        navigate('/submit', { state: { barcode: code } });
      }
    } catch (err: any) {
      setMessage(`Lookup failed: ${err?.message || 'unknown error'}`);
    }
  }, [navigate]);

  const handleManual = async () => {
    if (!manual) return;
    setMessage(`Looking up ${manual}...`);
    try {
      const product = await api.getProductByBarcode(manual);
      if (product) {
        const id = (product as any).id;
        if (id) navigate(`/product/${encodeURIComponent(id)}`);
        else navigate('/submit', { state: { barcode: manual, product } });
      } else {
        navigate('/submit', { state: { barcode: manual } });
      }
    } catch (e: any) {
      setMessage(`Lookup failed: ${e?.message || 'unknown error'}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scan Barcode / QR</h1>
      <p className="mb-4">Allow camera access to scan barcodes or QR codes. You can also upload an image or enter a code manually.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <BarcodeScanner onDetected={handleDetected} onError={(e) => setMessage(`Scanner error: ${e.message}`)} />
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Enter barcode / QR code</label>
            <div className="flex gap-2">
              <input className="input" value={manual} onChange={(e) => setManual(e.target.value)} />
              <button className="btn" onClick={handleManual}>Lookup</button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Recent scans</h3>
            <div className="bg-card p-2 rounded max-h-48 overflow-auto">
              {recent.length === 0 ? <div className="text-sm text-muted-foreground">No recent scans</div> : (
                <ul className="space-y-1">
                  {recent.map((r) => (
                    <li key={r} className="flex items-center justify-between">
                      <span className="text-sm">{r}</span>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard?.writeText(r); setMessage('Copied to clipboard'); }}>Copy</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setManual(r); }}>Use</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {message && <div className="mt-2 p-2 bg-gray-100 rounded">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
