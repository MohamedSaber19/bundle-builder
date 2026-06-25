import { useBundleStore } from "@/store/bundleStore";
import React from "react";
import ReviewPanel from "../review/ReviewPanel";
import AccordionBuilder from "./AccordionBuilder";

const BundleBuilder: React.FC = () => {
  const saveBundleData = useBundleStore((state) => state.saveBundleData);

  const handleSaveSystem = () => {
    saveBundleData();
    alert("System saved! You can restore it when you come back.");
  };

  return (
    <div className="w-full bg-bg-main min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-4 py-8 grid grid-cols-1 min-[1261px]:grid-cols-[768px_399px] gap-6 min-[1261px]:gap-[29px] min-[1261px]:justify-center">
        {/* Left Column: The Accordion Builder */}
        <div className="w-full space-y-4">
          <AccordionBuilder />
        </div>

        {/* Right Column: The Review Panel */}
        <div className="w-full">
          <div className="min-[1261px]:sticky min-[1261px]:top-6">
            <ReviewPanel onSaveSystem={handleSaveSystem} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleBuilder;
