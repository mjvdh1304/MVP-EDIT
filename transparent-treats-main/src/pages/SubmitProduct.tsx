import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitProduct } from "@/services/api";

const SubmitProduct = () => {
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [certs, setCerts] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Prefill barcode or product if navigated from scanner
    const state = (location && (location as any).state) || {};
    if (state.barcode) setBarcode(state.barcode);
    if (state.product && state.product.name) setName(state.product.name);
  }, [location]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const ingredients = ingredientsText
      .split(/\n|,/) // support newline or comma separated
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, idx) => ({ id: idx + 1, name }));

    const payload = {
      barcode,
      name,
      ingredients,
      certifications: certs.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const res = await submitProduct(payload);
      setLoading(false);
      setMessage(res.message || 'Submitted');
      // Redirect to products list after a short delay
      setTimeout(() => nav('/products'), 1200);
    } catch (err) {
      setLoading(false);
      setMessage('Submission failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-card rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Submit a Product</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm block mb-1">Barcode</label>
          <Input value={barcode} onChange={(e) => setBarcode(e.target.value)} />
        </div>
        <div>
          <label className="text-sm block mb-1">Product Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm block mb-1">Ingredients (one per line or comma separated)</label>
          <Textarea value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} />
        </div>
        <div>
          <label className="text-sm block mb-1">Certifications (comma separated)</label>
          <Input value={certs} onChange={(e) => setCerts(e.target.value)} />
        </div>
        {message && <div className="text-sm text-muted-foreground">{message}</div>}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitProduct;
