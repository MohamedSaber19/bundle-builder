import { useBundleStore } from "@/store/bundleStore";
import { Minus, Plus } from "lucide-react";

import type { Product } from "@/types";
import { getProductAsset } from "@/utils/imageLoader";
import React from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const selectedVariantMap = useBundleStore((state) => state.selectedVariant);
  const addSelection = useBundleStore((state) => state.addSelection);
  const updateQuantity = useBundleStore((state) => state.updateQuantity);
  const selectVariant = useBundleStore((state) => state.selectVariant);

  // Normalized variant mapping strategy across components and actions
  const hasVariants = product.variants.length > 0;
  const activeVariantId = hasVariants
    ? selectedVariantMap[product.id] || product.variants[0].id
    : "default";

  // Highly-optimized slice subscription for atomic re-renders
  const currentQuantity = useBundleStore((state) => {
    const categoryKey = product.category as
      | "cameras"
      | "plan"
      | "sensors"
      | "accessories";
    const selection = state.selections[categoryKey]?.find(
      (s) => s.productId === product.id && s.variantId === activeVariantId,
    );
    return selection ? selection.quantity : 0;
  });

  const isSelected = currentQuantity > 0;

  const handleVariantSelect = (e: React.MouseEvent, variantId: string) => {
    e.stopPropagation();
    selectVariant(product.id, variantId);
  };

  const handleStepperChange = (newQty: number) => {
    if (newQty <= 0) {
      updateQuantity(product.category, product.id, activeVariantId, 0);
    } else if (currentQuantity === 0 && newQty === 1) {
      addSelection(product.category, product.id, activeVariantId);
    } else {
      updateQuantity(product.category, product.id, activeVariantId, newQty);
    }
  };

  const handleCardClick = () => {
    // Toggles the baseline selection state
    if (currentQuantity === 0) {
      addSelection(product.category, product.id, activeVariantId);
    } else {
      updateQuantity(product.category, product.id, activeVariantId, 0);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative border-2 rounded-xl p-2.5 font-sans transition-all flex flex-col justify-between cursor-pointer ${
        isSelected
          ? "border-card-selected bg-white"
          : "bg-white hover:border-gray-300 border-white"
      }`}
    >
      {product.discountBadge && (
        <div className="absolute top-4 left-4 bg-card-badge-bg text-white text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap z-10">
          {product.discountBadge}
        </div>
      )}

      <div className="flex flex-col min-[1260px]:flex-row gap-4 items-start">
        <div className="w-full min-[1261px]:w-24 min-[1261px]:h-full flex-shrink-0 flex items-center justify-center bg-transparent pt-4">
          {product.image ? (
            <img
              src={getProductAsset(product.image) || ""}
              alt={product.name}
              className="w-24 h-auto object-contain"
            />
          ) : (
            <div className="text-gray-300 text-xs">No Image</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-base text-card-title tracking-tight">
            {product.name}
          </h4>
          <p className="text-xs text-card-desc mt-1 leading-snug">
            {product.description}{" "}
            <a
              href={product.learnMoreUrl}
              onClick={(e) => e.stopPropagation()}
              className="text-brand-purple hover:underline font-medium inline-block"
            >
              Learn More
            </a>
          </p>

          {hasVariants && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {product.variants.map((variant) => {
                const isActive = activeVariantId === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={(e) => handleVariantSelect(e, variant.id)}
                    className={`flex items-center gap-1 py-1 px-1.5 max-h-[29px] rounded-xs border text-[10px] font-normal transition-all cursor-pointer ${
                      isActive
                        ? "border-card-variant-selected text-card-title bg-card-variant-selected-bg shadow-xs"
                        : "border-card-variant-unselected text-card-desc bg-white hover:bg-gray-50"
                    }`}
                  >
                    {variant.image && (
                      <img
                        src={getProductAsset(variant.image) || ""}
                        alt={variant.label}
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    {variant.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-gray-100">
        {/* Render quantity control conditionally based on data configuration settings */}
        {product.category !== "plan" && (
          <div className="flex items-center gap-2 px-1 py-2 w-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStepperChange(currentQuantity - 1);
              }}
              disabled={currentQuantity === 0}
              className={`w-5 h-5 flex items-center justify-center rounded text-sm font-bold transition-colors ${
                currentQuantity === 0
                  ? "border-btn-disabled-border bg-white text-btn-disabled-icon cursor-not-allowed border"
                  : "bg-btn-enabled-bg text-btn-enabled-icon hover:bg-gray-50 cursor-pointer"
              }`}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </button>

            <span className="w-5 text-center font-bold text-base text-card-title">
              {currentQuantity}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStepperChange(currentQuantity + 1);
              }}
              className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </button>
          </div>
        )}

        <div className="flex flex-row min-[1261px]:flex-col items-baseline gap-1.5 ms-auto">
          {product.compareAtPrice > product.price && (
            <div className="text-sm font-semibold text-card-price-old line-through leading-none">
              ${product.compareAtPrice.toFixed(2)}
            </div>
          )}
          <div className="text-sm font-bold text-card-price-now leading-none">
            ${product.price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
