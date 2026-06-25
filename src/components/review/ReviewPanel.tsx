import { useBundleStore } from "@/store/bundleStore";
import { cn } from "@/utils/cn";
import { getProductAsset } from "@/utils/imageLoader";
import React from "react";
import shippingIcon from "../../assets/images/fast-shipping.png";
import SatisfactionBadge from "../../assets/images/satisfaction-badge.png";

interface ReviewPanelProps {
  onSaveSystem?: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  cameras: "CAMERAS",
  sensors: "SENSORS",
  accessories: "ACCESSORIES",
  plan: "PLAN",
};

const CATEGORY_ORDER = ["cameras", "sensors", "accessories", "plan"];

const ReviewPanel: React.FC<ReviewPanelProps> = ({ onSaveSystem }) => {
  const selections = useBundleStore((state) => state.selections);
  const products = useBundleStore((state) => state.products);
  const updateQuantity = useBundleStore((state) => state.updateQuantity);
  const discountedTotal = useBundleStore((state) => state.totalPrice);
  const netSavings = useBundleStore((state) => state.savings);
  // Derive whether items exist using a simple boolean check (primitives don't break equality loops)
  const hasItems = [
    ...selections.cameras,
    ...selections.plan,
    ...selections.sensors,
    ...selections.accessories,
  ].some((s) => s.quantity > 0);

  const originalTotal = hasItems ? discountedTotal + netSavings + 5.99 : 0;

  return (
    <div className="w-full bg-bg-container border rounded-xl p-6 font-sans shadow-xs text-review-itemTitle">
      <h2 className="text-2xl font-semibold tracking-tight text-card-title">
        Your security system
      </h2>
      <p className="text-sm text-card-desc mt-1 mb-6 leading-snug">
        Review your personalized protection system designed to keep what matters
        most safe.
      </p>

      <div className="grid grid-cols-1 md:max-[1260px]:grid-cols-2 min-[1261px]:flex min-[1261px]:flex-col gap-6 items-start">
        <div className="w-full space-y-6">
          {CATEGORY_ORDER.map((categoryId) => {
            // Filter out non-active elements to prevent rendering empty shell headers
            const activeSelections = (
              selections[categoryId as keyof typeof selections] || []
            ).filter((item) => item.quantity > 0);

            if (activeSelections.length === 0) return null;

            return (
              <div
                key={categoryId}
                className="border-t border-review-border pt-4 first:border-t-0 first:pt-0"
              >
                <h3 className="text-xs font-normal text-review-category-title tracking-wider uppercase mb-3">
                  {CATEGORY_LABELS[categoryId]}
                </h3>

                <div className="space-y-4">
                  {activeSelections.map((selection) => {
                    const product = products.get(selection.productId);
                    if (!product) return null;

                    const itemPrice = product.price * selection.quantity;
                    const itemOldPrice =
                      (product.compareAtPrice || product.price) *
                      selection.quantity;

                    return (
                      <div
                        key={`${selection.productId}-${selection.variantId || "default"}`}
                        className="flex items-center justify-between gap-2 w-full"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {product.image && (
                            <img
                              src={getProductAsset(product.image) || ""}
                              alt=""
                              className={cn(
                                "w-10 h-10 object-contain flex-shrink-0 bg-white rounded-sm",
                                product.category === "plan" &&
                                  "bg-transparent w-5 h-5 -me-1",
                              )}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-normal text-sm text-review-item-title truncate">
                              {product.category === "plan" ? (
                                <>
                                  <span className="font-extrabold text-black">
                                    Cam{" "}
                                  </span>
                                  <span className="text-brand-purple font-medium">
                                    Unlimited
                                  </span>
                                </>
                              ) : (
                                product.name
                              )}
                            </p>
                            {/* Render the selected variant text */}
                            {selection.variantId &&
                              selection.variantId !== "default" &&
                              (() => {
                                const variantObj = product.variants?.find(
                                  (v) => v.id === selection.variantId,
                                );
                                return variantObj ? (
                                  <span className="block text-[10px] text-review-category-title  font-normal mt-0.5">
                                    ({variantObj.label})
                                  </span>
                                ) : null;
                              })()}
                          </div>
                        </div>

                        {product.category !== "plan" && (
                          <div className="flex w-18 items-center gap-1 overflow-hidden flex-shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  categoryId,
                                  selection.productId,
                                  selection.variantId,
                                  selection.quantity - 1,
                                )
                              }
                              className="w-5 h-5 flex items-center rounded justify-center bg-white text-review-btn-icon font-bold transition-colors cursor-pointer"
                            >
                              —
                            </button>
                            <span className="w-5 text-center font-bold text-xs text-review-item-title">
                              {selection.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  categoryId,
                                  selection.productId,
                                  selection.variantId,
                                  selection.quantity + 1,
                                )
                              }
                              className="w-5 h-5 flex items-center justify-center bg-white text-review-btn-icon font-bold transition-colors rounded cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        )}

                        <div className="text-right flex-shrink-0 min-w-[65px]">
                          {product.compareAtPrice > product.price && (
                            <div className="text-xs text-review-price-old line-through leading-none mb-0.5">
                              ${itemOldPrice.toFixed(2)}
                            </div>
                          )}
                          <div className="text-sm font-bold text-review-price-now leading-none">
                            {product.price === 0 ? (
                              <span className="text-brand-teal uppercase">
                                FREE
                              </span>
                            ) : (
                              `$${itemPrice.toFixed(2)}`
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {hasItems && (
            <div className="border-t border-review-border pt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-sm">
                  <img
                    src={shippingIcon}
                    alt="Fast shipping"
                    className="object-contain flex-shrink-0"
                  />
                </div>
                <p className="font-normal text-sm text-review-item-title">
                  Fast Shipping
                </p>
              </div>
              <div className="text-right flex-shrink-0 min-w-[65px]">
                <div className="text-xs text-review-price-old line-through leading-none mb-0.5">
                  $5.99
                </div>
                <div className="text-sm font-bold text-review-price-now leading-none uppercase">
                  FREE
                </div>
              </div>
            </div>
          )}
        </div>

        {hasItems && (
          <div className="w-full space-y-4 md:max-[1260px]:border-l md:max-[1260px]:border-review-border md:max-[1260px]:pl-6 min-[1261px]:border-t min-[1261px]:border-review-border min-[1261px]:pt-6">
            <div className="flex items-center justify-between gap-4">
              <img
                src={SatisfactionBadge}
                alt="Satisfaction Badge"
                className="w-[74px] h-[74px] flex-shrink-0"
              />

              <div className="text-right">
                <span className="inline-block bg-brand-purple text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1">
                  as low as $19.19/mo
                </span>
                <div className="flex items-baseline justify-end gap-2">
                  <span className="text-base text-review-price-old line-through font-semibold">
                    ${originalTotal.toFixed(2)}
                  </span>
                  <span className="text-3xl font-black text-review-price-now">
                    ${discountedTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {netSavings > 0 && (
              <div className="w-full text-center py-2 rounded-lg mb-0">
                <p className="text-xs font-normal text-review-saving-text">
                  Congrats! You're saving ${netSavings.toFixed(2)} on your
                  security bundle!
                </p>
              </div>
            )}

            <button
              type="button"
              className="w-full py-3.5 bg-brand-purple text-white font-bold rounded-lg hover:opacity-80 transition-colors shadow-xs text-sm cursor-pointer mb-0"
            >
              Checkout
            </button>

            <button
              type="button"
              onClick={onSaveSystem}
              className="w-full text-center text-xs font-medium text-review-price-old underline italic hover:text-review-item-title transition-colors cursor-pointer block pt-1 mt-0"
            >
              Save my system for later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPanel;
