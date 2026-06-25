import wyzeBatteryPro from "@/assets/images/products/wyze-battery-cam-pro.png";
import wyzeFloodlightV2 from "@/assets/images/products/wyze-cam-floodlight-v2.png";
import wyzeCamPanV3 from "@/assets/images/products/wyze-cam-pan-v3.png";
import wyzeCamV4 from "@/assets/images/products/wyze-cam-v4.png";
import wyzeDoorbell from "@/assets/images/products/wyze-duo-cam-doorbell.png";
import microsd from "@/assets/images/products/wyze-micro-sd.png";
import camUnlimitedLogo from "@/assets/images/products/wyze-plan-cam-unlimited.png";
import senseHub from "@/assets/images/products/wyze-sense-hub.png";
import motionSensor from "@/assets/images/products/wyze-sense-motion-sensor.png";
// Variants.
import wyzeBatteryProBlack from "@/assets/images/products/wyze-battery-cam-pro-black.png";
import wyzeBatteryProWhite from "@/assets/images/products/wyze-battery-cam-pro-white.png";
import wyzeFloodlightV2Black from "@/assets/images/products/wyze-cam-floodlight-v2-black.png";
import wyzeFloodlightV2White from "@/assets/images/products/wyze-cam-floodlight-v2-white.png";
import wyzeCamPanV3Black from "@/assets/images/products/wyze-cam-pan-v3-black.png";
import wyzeCamPanV3White from "@/assets/images/products/wyze-cam-pan-v3-white.png";
import wyzeCamV4Black from "@/assets/images/products/wyze-cam-v4-black.png";
import wyzeCamV4Grey from "@/assets/images/products/wyze-cam-v4-grey.png";
import wyzeCamV4White from "@/assets/images/products/wyze-cam-v4-white.png";

// Note: If you have a microSD card image, place it in the products folder and import it here

const assetMap: Record<string, string> = {
  "/images/wyze-cam-v4.png": wyzeCamV4,
  "/images/wyze-cam-pan-v3.png": wyzeCamPanV3,
  "/images/wyze-floodlight-v2.png": wyzeFloodlightV2,
  "/images/wyze-doorbell.png": wyzeDoorbell,
  "/images/wyze-battery-pro.png": wyzeBatteryPro,
  "/images/motion-sensor.png": motionSensor,
  "/images/sense-hub.png": senseHub,
  "/images/cam-unlimited-logo.png": camUnlimitedLogo,
  "/images/microsd.png": microsd,
  // Variants.
  "/images/wyze-cam-v4-black.png": wyzeCamV4Black,
  "/images/wyze-cam-v4-white.png": wyzeCamV4White,
  "/images/wyze-cam-v4-gray.png": wyzeCamV4Grey,
  "/images/wyze-cam-pan-v3-black.png": wyzeCamPanV3Black,
  "/images/wyze-cam-pan-v3-white.png": wyzeCamPanV3White,
  "/images/wyze-floodlight-v2-black.png": wyzeFloodlightV2Black,
  "/images/wyze-floodlight-v2-white.png": wyzeFloodlightV2White,
  "/images/wyze-battery-cam-pro-black.png": wyzeBatteryProBlack,
  "/images/wyze-battery-cam-pro-white.png": wyzeBatteryProWhite,
};

export const getProductAsset = (
  jsonPath: string | null | undefined,
): string | null => {
  if (!jsonPath) return null;
  return assetMap[jsonPath] || null;
};
