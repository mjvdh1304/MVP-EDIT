import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitProduct } from "@/services/api";

const SubmitProduct = () => {
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [certs, setCerts] = useState("");
  const [nutritionFacts, setNutritionFacts] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isFromExternalDB, setIsFromExternalDB] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Prefill from scanner state or Open Food Facts data
    const state = (location && (location as any).state) || {};
    
    if (state.barcode) setBarcode(state.barcode);
    
    // Check if data comes from external database
    if (state.isFromExternalDB && state.prefillData) {
      setIsFromExternalDB(true);
      const data = state.prefillData;
      
      if (data.name) setName(data.name);
      if (data.brand) setBrand(data.brand);
      if (data.category) setCategory(data.category);
      
      if (data.ingredients && Array.isArray(data.ingredients)) {
        setIngredientsText(data.ingredients.map((i: any) => i.name).join('\n'));
      }
      
      if (data.certifications && Array.isArray(data.certifications)) {
        setCerts(data.certifications.join(', '));
      }
      
      if (data.nutritionFacts) {
        const facts = data.nutritionFacts;
        const factLines = [];
        if (facts.calories) factLines.push(`Calories: ${facts.calories}`);
        if (facts.protein) factLines.push(`Protein: ${facts.protein}`);
        if (facts.carbohydrates) factLines.push(`Carbs: ${facts.carbohydrates}`);
        if (facts.fat) factLines.push(`Fat: ${facts.fat}`);
        if (facts.sugars) factLines.push(`Sugars: ${facts.sugars}`);
        setNutritionFacts(factLines.join('\n'));
      }
    } else if (state.product && state.product.name) {
      setName(state.product.name);
    }
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
      
      {isFromExternalDB && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Product found in Open Food Facts!</strong> The information below has been pre-filled. 
            Please review and add any additional details before submitting.
          </p>
        </div>
      )}
      
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
          <label className="text-sm block mb-1">Brand</label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <label className="text-sm block mb-1">Category</label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Snacks, Beverages" />
        </div>
        <div>
          <label className="text-sm block mb-1">Ingredients (one per line or comma separated)</label>
          <Textarea 
            value={ingredientsText} 
            onChange={(e) => setIngredientsText(e.target.value)} 
            rows={6}
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Certifications (comma separated)</label>
          <Input 
            value={certs} 
            onChange={(e) => setCerts(e.target.value)} 
            placeholder="e.g., organic, vegan, gluten-free"
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Nutrition Facts (optional)</label>
          <Textarea 
            value={nutritionFacts} 
            onChange={(e) => setNutritionFacts(e.target.value)} 
            rows={4}
            placeholder="e.g., Calories: 150, Protein: 5g"
          />
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
