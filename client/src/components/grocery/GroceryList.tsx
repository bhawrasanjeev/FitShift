import React, { useState, useEffect } from 'react';
import { GroceryEntry, OptimizedFood } from '../../types';
import { Button } from '../ui/Button';
import {
  Copy,
  Check,
  IndianRupee,
  ShoppingCart,
  Info,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export interface GroceryListProps {
  groceryList?: GroceryEntry[];
  foods?: OptimizedFood[];
  dailyBudgetLimit?: number;
}

export const GroceryList: React.FC<GroceryListProps> = ({
  groceryList = [],
  foods = [],
  dailyBudgetLimit,
}) => {
  const [copied, setCopied] = useState(false);
  const [items, setItems] = useState<GroceryEntry[]>([]);

  useEffect(() => {
    if (groceryList && groceryList.length > 0) {
      setItems(groceryList.map((item) => ({ ...item, checked: false })));
    } else if (foods && foods.length > 0) {
      // Derive grocery entries from foods if groceryList was not directly provided
      const derived: GroceryEntry[] = foods.map((f, idx) => ({
        id: `food-${idx}`,
        name: f.name,
        category: f.isSupplement ? 'Supplements' : 'Protein Staples',
        weeklyQuantity: `${(f.quantityGrams * 7).toFixed(0)}g`,
        weeklyGrams: f.quantityGrams * 7,
        estimatedWeeklyCost: Math.round(f.estimatedCost * 7),
        estimatedDailyCost: f.estimatedCost,
        checked: false,
      }));
      setItems(derived);
    } else {
      setItems([]);
    }
  }, [groceryList, foods]);

  const toggleItemCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const totalWeeklyCost = items.reduce((sum, item) => sum + item.estimatedWeeklyCost, 0);
  const totalDailyCost = items.reduce((sum, item) => sum + item.estimatedDailyCost, 0);
  const checkedCount = items.filter((i) => i.checked).length;

  const handleCopy = async () => {
    const formatted = items
      .map(
        (item) =>
          `[${item.checked ? 'x' : ' '}] ${item.name} (${item.weeklyQuantity}) - ~₹${item.estimatedWeeklyCost}/week [${item.category}]`
      )
      .join('\n');

    const textToCopy = `FitShift Real Weekly Grocery Shopping List (Est. Total: ₹${totalWeeklyCost}/week):\n\n${formatted}\n\nGenerated deterministically from FitShift Indian Diet & Staples Engine.`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Group items by category
  const categories = Array.from(new Set(items.map((i) => i.category || 'Pantry Staples')));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Weekly Grocery Shopping List
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Aggregated whole-food ingredients and staple requirements derived directly from your active meal plan.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              leftIcon={
                copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
              className="text-xs"
            >
              {copied ? 'Copied to Clipboard' : 'Copy Shopping List'}
            </Button>
          </div>
        )}
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5 text-xs text-zinc-600">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Authentic Pricing Lineage:</strong> Quantities and pricing reflect 7-day requirements calculated from FitShift&apos;s verified Indian staples dataset (<code className="font-mono text-[11px] text-zinc-700">clean_staples.csv</code> &amp; <code className="font-mono text-[11px] text-zinc-700">price.csv</code>).
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-12 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-600 flex items-center justify-center mx-auto shadow-2xs">
            <ShoppingCart className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
              Grocery list is not available yet
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Generate an optimized diet plan through the onboarding wizard to calculate your weekly grocery requirements.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Weekly Est. Grocery Spend
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1 flex items-center">
                <IndianRupee className="w-5 h-5 inline stroke-[2.5]" />
                <span>₹{totalWeeklyCost}</span>
                <span className="text-xs font-normal text-zinc-400 ml-1.5">/ 7 days</span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                ~₹{totalDailyCost.toFixed(1)}/day {dailyBudgetLimit ? `(Budget: ₹${dailyBudgetLimit})` : ''}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Weekly Staples
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
                {items.length} <span className="text-xs font-normal text-zinc-400">items</span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                Across {categories.length} categories
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Shopping Checklist
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
                {checkedCount} / {items.length} <span className="text-xs font-normal text-zinc-400">purchased</span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                Tap checkbox to track cart
              </span>
            </div>
          </div>

          {/* Grouped Grocery Items List */}
          <div className="space-y-5">
            {categories.map((category) => {
              const categoryItems = items.filter((item) => (item.category || 'Pantry Staples') === category);
              return (
                <div
                  key={category}
                  className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-2xs"
                >
                  <div className="px-5 py-3 bg-zinc-50/80 border-b border-zinc-100 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      {category}
                    </h3>
                    <span className="text-[11px] text-zinc-400">
                      {categoryItems.length} items
                    </span>
                  </div>

                  <div className="divide-y divide-zinc-100">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleItemCheck(item.id)}
                        className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                          item.checked ? 'bg-zinc-50/70 text-zinc-400' : 'hover:bg-zinc-50/40 text-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <button
                            type="button"
                            aria-label={`Toggle ${item.name}`}
                            className="shrink-0 text-emerald-600 focus:outline-none"
                          >
                            {item.checked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-300 hover:text-zinc-400" />
                            )}
                          </button>
                          <div>
                            <h4
                              className={`text-sm font-bold truncate ${
                                item.checked ? 'line-through text-zinc-400' : 'text-zinc-950'
                              }`}
                            >
                              {item.name}
                            </h4>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Weekly Amount: <strong className="text-zinc-800">{item.weeklyQuantity}</strong>
                              <span className="text-zinc-400 ml-2">
                                (~{(item.weeklyGrams / 7).toFixed(0)}g / day)
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-sm font-bold flex items-center justify-end ${
                              item.checked ? 'line-through text-zinc-400' : 'text-zinc-900'
                            }`}
                          >
                            <IndianRupee className="w-3.5 h-3.5 inline" />
                            <span>₹{item.estimatedWeeklyCost}</span>
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            ~₹{item.estimatedDailyCost.toFixed(1)} / day
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
