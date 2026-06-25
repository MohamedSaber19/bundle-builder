import camerasIcon from "@/assets/icons/camera.png";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import extraProtectionIcon from "@/assets/icons/extra-protection.png";
import planIcon from "@/assets/icons/plan.png";
import sensorsIcon from "@/assets/icons/sensors.png";
import { useBundleStore } from "@/store/bundleStore";
import type { Product } from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import React, { useMemo } from "react";
import ProductCard from "./ProductCard";

const stepIcons: Record<string, string> = {
  cameras: camerasIcon,
  plan: planIcon,
  sensors: sensorsIcon,
  accessories: extraProtectionIcon,
};

const AccordionBuilder: React.FC = () => {
  const { categories, products, selections, expandedStep, setExpandedStep } =
    useBundleStore();

  const productsByCategory = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach((product) => {
      if (!map[product.category]) map[product.category] = [];
      map[product.category].push(product);
    });
    return map;
  }, [products]);

  return (
    <Accordion.Root
      type="single"
      collapsible
      value={expandedStep || undefined}
      onValueChange={(value) => setExpandedStep(value || null)}
    >
      {categories.map((category, index) => {
        const categoryKey = category.id as keyof typeof selections;
        const categorySelections = selections[categoryKey] || [];

        // Sum up the total combined quantities for all selected items in this category
        const selectedCount = categorySelections.filter(
          (item) => item.quantity > 0,
        ).length;

        const categoryProducts = productsByCategory[category.id] || [];
        const stepNumber = index + 1;

        // Find the next category details dynamically for the button
        const nextCategory = categories[index + 1];

        return (
          <Accordion.Item key={category.id} value={category.id}>
            <Accordion.Header className="flex">
              <Accordion.Trigger className="w-full flex flex-col bg-transparent border-b border-accordion-border group transition-colors duration-200 data-[state=open]:border-b-0">
                {/* Top Division: Step Metadata */}
                <div className="w-full px-[15px] pt-[15px] py-[5px] text-left group-data-[state=open]:bg-bg-container rounded-t-xl">
                  <span className="text-xs font-normal tracking-wider text-accordion-step block uppercase">
                    step {stepNumber} of 4
                  </span>
                </div>

                {/* Divider Line */}
                <div className="w-full border-t border-accordion-border" />

                {/* Bottom Division: Title, Icon & Selection State */}
                <div className="w-full px-[15px] py-5 flex items-center justify-between text-left group-data-[state=open]:bg-bg-container group-data-[state=open]:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      <img
                        src={stepIcons[category.id] || "⚙️"}
                        alt={category.label}
                      />
                    </span>
                    <h3 className="text-base lg:text-lg xl:text-2xl font-semibold text-accordion-title">
                      {category.label}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-brand-purple font-medium text-sm">
                    <span>{selectedCount} selected</span>
                    <img
                      src={ChevronUpIcon}
                      alt="Chevron Up"
                      className="size-3 group-data-[state=open]:rotate-180 transition-transform duration-300"
                    />
                  </div>
                </div>
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content
              className="px-[15px] pt-[15px] pb-5 bg-bg-container rounded-b-xl overflow-hidden data-animation"
              data-animation=""
            >
              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 min-[1260px]:!grid-cols-2 gap-[15px]">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Dynamic Action Button Panel */}
              {nextCategory && (
                <div className="mt-6 flex justify-center w-full">
                  <button
                    type="button"
                    onClick={() => setExpandedStep(nextCategory.id)}
                    className="px-6 py-2 border border-brand-purple text-brand-purple font-normal rounded-lg bg-transparent  hover:bg-white transition-colors duration-200 cursor-pointer text-lg"
                  >
                    Next: {nextCategory.label}
                  </button>
                </div>
              )}
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};

export default AccordionBuilder;
