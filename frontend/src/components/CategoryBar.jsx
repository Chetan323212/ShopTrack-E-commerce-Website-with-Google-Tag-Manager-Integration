import React from "react";
import { Headphones, Watch, Laptop, Lamp, Shield, Grid } from "lucide-react";
import { CATEGORIES } from "../data/products";

const CATEGORY_ICONS = {
  all: Grid,
  Audio: Headphones,
  Wearables: Watch,
  Computing: Laptop,
  "Smart Living": Lamp,
  Accessories: Shield,
};

export const CategoryBar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full py-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2.5 min-w-max pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Grid;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`category-pill-${cat.id.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-brand-600 text-white shadow-glow scale-[1.02]"
                  : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-brand-400"}`} />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
