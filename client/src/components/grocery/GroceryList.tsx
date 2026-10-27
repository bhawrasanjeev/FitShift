import React, { useState } from 'react';
import { GroceryItem, GroceryCategory } from '../../types';
import { Button } from '../ui/Button';
import {
  Copy,
  Check,
  IndianRupee,
  Sparkles,
} from 'lucide-react';

export interface GroceryListProps {
  items: GroceryItem[];
}

export const GroceryList: React.FC<GroceryListProps> = ({ items }) => {
  const [list, setList] = useState<GroceryItem[]>(items);
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: string) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const totalCost = list.reduce((sum, item) => sum + item.approxCostRupees, 0);

  const categories: GroceryCategory[] = [
    'Protein Staples',
    'Grains & Carbs',
    'Dairy & Fermented',
    'Vegetables & Greens',
    'Fruits & Quick Fuel',
    'Spices & Pantry Essentials',
  ];

  const handleCopy = async () => {
    const formatted = list
      .map(
        (i) =>
          `[${i.checked ? 'x' : ' '}] ${i.name} - ${i.estimatedQuantity} (~₹${i.approxCostRupees})`
      )
      .join('\n');

    const textToCopy = `FitShift Weekly Grocery Plan (Est. Total: ₹${totalCost}):\n\n${formatted}\n\nGenerated for balanced Indian home nutrition.`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Weekly Grocery Restock Plan
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Calculated automatically from your weekly meal recipes and Indian pantry staples.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-zinc-400 block font-medium">Estimated Weekly Total</span>
            <span className="text-base font-extrabold text-emerald-800 flex items-center justify-end">
              <IndianRupee className="w-4 h-4 inline" />
              {totalCost}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            className="text-xs"
          >
            {copied ? 'Copied to Clipboard!' : 'Copy Grocery List'}
          </Button>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5 text-xs text-zinc-600">
        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p>
          Temporary checkboxes below let you tick off items while shopping in the local market or on grocery apps. Checkboxes reset on page refresh as no persistent tracking is kept.
        </p>
      </div>

      {/* Categorized Grocery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((category) => {
          const catItems = list.filter((i) => i.category === category);
          if (catItems.length === 0) return null;

          const catTotal = catItems.reduce((acc, i) => acc + i.approxCostRupees, 0);

          return (
            <div
              key={category}
              className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 tracking-tight">
                      {category}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      ({catItems.length} items)
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ~₹{catTotal}
                  </span>
                </div>

                <div className="space-y-2">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                        item.checked
                          ? 'bg-zinc-50/80 border-zinc-200 text-zinc-400 line-through'
                          : 'bg-white border-zinc-100 hover:border-zinc-300 text-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            item.checked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-zinc-300 bg-white'
                          }`}
                        >
                          {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className={`font-semibold ${item.checked ? 'text-zinc-400' : 'text-zinc-900'}`}>
                            {item.name}
                          </div>
                          {item.notes && (
                            <div className="text-[10px] text-zinc-400">{item.notes}</div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <div className="font-medium text-zinc-600">{item.estimatedQuantity}</div>
                        <div className="text-[10px] text-zinc-400">~₹{item.approxCostRupees}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
