import productsData from "@/data/products.json";
import type { Category, Product, SelectedVariant } from "@/types";
import { create } from "zustand";

interface BundleBuilderState {
  // Data
  categories: Category[];
  products: Map<string, Product>;

  // Selection state
  selections: {
    cameras: SelectedVariant[];
    plan: SelectedVariant[];
    sensors: SelectedVariant[];
    accessories: SelectedVariant[];
  };

  // UI state
  expandedStep: string | null;
  selectedVariant: { [productId: string]: string | null };

  // Computed Total Metrics
  totalPrice: number;
  savings: number;

  // Actions - Selection Mutations
  addSelection: (
    category: string,
    productId: string,
    variantId: string | null,
  ) => void;
  removeSelection: (
    category: string,
    productId: string,
    variantId: string | null,
  ) => void;
  updateQuantity: (
    category: string,
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => void;

  // Actions - UI Updates
  setExpandedStep: (stepId: string | null) => void;
  selectVariant: (productId: string, variantId: string | null) => void;

  // Actions - Computation Engine
  calculateTotals: () => void;

  // Manual Save Action (localStorage boundary)
  saveBundleData: () => void;

  // Optimised Helper Selectors
  getProductById: (id: string) => Product | undefined;
  getSelectedCount: (category: string) => number;
  getAllSelections: () => SelectedVariant[];
  getActiveCategories: () => Category[];
}

const STORAGE_KEY = "bundle-builder-store";

const INITIAL_SELECTIONS = {
  cameras: [
    { productId: "wyze-cam-v4", variantId: "white", quantity: 1 },
    { productId: "wyze-cam-pan-v3", variantId: "white", quantity: 2 },
  ],
  plan: [
    { productId: "wyze-cam-unlimited", variantId: "default", quantity: 1 },
  ],
  sensors: [
    { productId: "wyze-sense-hub", variantId: "default", quantity: 1 },
    {
      productId: "wyze-sense-motion-sensor",
      variantId: "default",
      quantity: 2,
    },
  ],
  accessories: [
    { productId: "wyze-microsd-card-256gb", variantId: "default", quantity: 2 },
  ],
};

const getInitialState = () => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (e) {
      console.error(
        "Failed parsing persistent state, falling back to seed data",
        e,
      );
    }
  }

  return {
    selections: INITIAL_SELECTIONS,
    selectedVariant: {
      "wyze-cam-v4": "white",
      "wyze-cam-pan-v3": "white",
      "wyze-cam-floodlight-v2": "white",
      "wyze-battery-cam-pro": "white",
    },
  };
};

const savedData = getInitialState();
const initialProducts = (productsData.products as Product[]).map(
  (p) => [p.id, p] as [string, Product],
);
const productsMap = new Map<string, Product>(initialProducts);
const initialSelections = savedData.selections;

// Fast compute initial state totals to prevent asynchronous hydration layout shifting
const computeInitialTotals = (
  selections: BundleBuilderState["selections"],
  productsMap: Map<string, Product>,
) => {
  let total = 0;
  let savings = 0;
  Object.values(selections).forEach((categorySelections) => {
    categorySelections.forEach((selection) => {
      const product = productsMap.get(selection.productId);
      if (product) {
        total += product.price * selection.quantity;
        savings +=
          (product.compareAtPrice - product.price) * selection.quantity;
      }
    });
  });
  return {
    totalPrice: total,
    savings: Math.round(savings * 100) / 100,
  };
};

const initialTotals = computeInitialTotals(initialSelections, productsMap);

const initialState = {
  categories: productsData.categories as Category[],
  products: productsMap,
  selections: initialSelections,
  expandedStep: "cameras",
  selectedVariant: savedData.selectedVariant,
  ...initialTotals,
};

export const useBundleStore = create<BundleBuilderState>()((set, get) => ({
  ...initialState,

  addSelection: (category, productId, variantId) => {
    set((state) => {
      const categoryKey = category as keyof typeof state.selections;
      const normalizedVariant = variantId || "default";

      const existing = state.selections[categoryKey].find(
        (s) => s.productId === productId && s.variantId === normalizedVariant,
      );

      let updatedSelections: SelectedVariant[];
      if (existing) {
        updatedSelections = state.selections[categoryKey].map((s) =>
          s.productId === productId && s.variantId === normalizedVariant
            ? { ...s, quantity: s.quantity + 1 }
            : s,
        );
      } else {
        updatedSelections = [
          ...state.selections[categoryKey],
          { productId, variantId: normalizedVariant, quantity: 1 },
        ];
      }

      return {
        selections: { ...state.selections, [categoryKey]: updatedSelections },
      };
    });
    get().calculateTotals();
  },

  removeSelection: (category, productId, variantId) => {
    set((state) => {
      const categoryKey = category as keyof typeof state.selections;
      const normalizedVariant = variantId || "default";

      const updatedSelections = state.selections[categoryKey].filter(
        (s) =>
          !(s.productId === productId && s.variantId === normalizedVariant),
      );

      return {
        selections: { ...state.selections, [categoryKey]: updatedSelections },
      };
    });
    get().calculateTotals();
  },

  updateQuantity: (category, productId, variantId, quantity) => {
    if (quantity <= 0) {
      get().removeSelection(category, productId, variantId);
      return;
    }

    set((state) => {
      const categoryKey = category as keyof typeof state.selections;
      const normalizedVariant = variantId || "default";

      const updatedSelections = (state.selections[categoryKey] =
        state.selections[categoryKey].map((s) =>
          s.productId === productId && s.variantId === normalizedVariant
            ? { ...s, quantity }
            : s,
        ));

      return {
        selections: { ...state.selections, [categoryKey]: updatedSelections },
      };
    });
    get().calculateTotals();
  },

  setExpandedStep: (stepId) => set({ expandedStep: stepId }),

  selectVariant: (productId, variantId) => {
    set((state) => ({
      selectedVariant: {
        ...state.selectedVariant,
        [productId]: variantId || "default",
      },
    }));
  },

  calculateTotals: () => {
    const state = get();
    let total = 0;
    let savings = 0;

    Object.values(state.selections).forEach((categorySelections) => {
      categorySelections.forEach((selection) => {
        const product = state.products.get(selection.productId);
        if (product) {
          total += product.price * selection.quantity;
          savings +=
            (product.compareAtPrice - product.price) * selection.quantity;
        }
      });
    });

    set({
      totalPrice: total,
      savings: Math.round(savings * 100) / 100,
    });
  },

  getProductById: (id) => get().products.get(id),

  // Evaluates distinct unique product item selections (Length of active selections matching requirement)
  getSelectedCount: (category) => {
    const categoryKey = category as keyof BundleBuilderState["selections"];
    const list = get().selections[categoryKey] || [];
    return list.filter((item) => item.quantity > 0).length;
  },

  getAllSelections: () => {
    const state = get();
    return [
      ...state.selections.cameras,
      ...state.selections.plan,
      ...state.selections.sensors,
      ...state.selections.accessories,
    ].filter((s) => s.quantity > 0);
  },

  getActiveCategories: () => {
    const state = get();
    return state.categories.filter((category) => {
      const categoryKey = category.id as keyof BundleBuilderState["selections"];
      const items = state.selections[categoryKey] || [];
      return items.some((item) => item.quantity > 0);
    });
  },

  saveBundleData: () => {
    const { selections, selectedVariant } = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selections, selectedVariant }),
    );
  },
}));
