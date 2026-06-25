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

  // Computed
  totalPrice: number;
  savings: number;

  // Actions - Data
  setCategories: (categories: Category[]) => void;
  setProducts: (products: Product[]) => void;

  // Actions - Selection
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

  // Actions - UI
  setExpandedStep: (stepId: string | null) => void;
  selectVariant: (productId: string, variantId: string | null) => void;

  // Actions - Computed
  calculateTotals: () => void;

  // Actions - State
  resetBuilder: () => void;
  loadState: (state: Partial<BundleBuilderState>) => void;
  getState: () => BundleBuilderState;

  // 💾 Manual Save Action
  saveBundleData: () => void;

  // Helpers
  getProductById: (id: string) => Product | undefined;
  getSelectedCount: (category: string) => number;
  getAllSelections: () => SelectedVariant[];
  getActiveCategories: () => Category[];
}

const getSavedState = () => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("bundle-builder-store");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load state:", error);
    return null;
  }
};

const savedData = getSavedState();

const initialProducts = (productsData.products as Product[]).map(
  (p) => [p.id, p] as [string, Product],
);

// Compute initial totals from loaded data immediately
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

const productsMap = new Map<string, Product>(initialProducts);
const initialSelections = savedData?.selections || {
  cameras: [],
  plan: [],
  sensors: [],
  accessories: [],
};

const initialTotals = computeInitialTotals(initialSelections, productsMap);

const initialState = {
  categories: productsData.categories as Category[],
  products: productsMap,
  selections: initialSelections,
  expandedStep: "cameras",
  selectedVariant: savedData?.selectedVariant || {},
  ...initialTotals,
};

export const useBundleStore = create<BundleBuilderState>()((set, get) => ({
  ...initialState,

  setCategories: (categories: Category[]) => set({ categories }),

  setProducts: (products: Product[]) => {
    set({
      products: new Map<string, Product>(products.map((p) => [p.id, p])),
    });
  },

  addSelection: (
    category: string,
    productId: string,
    variantId: string | null,
  ) => {
    set((state) => {
      const categoryKey = category as keyof typeof state.selections;
      const normalizedVariant = variantId || null;

      const existing = state.selections[categoryKey].find(
        (s) =>
          s.productId === productId &&
          (s.variantId || null) === normalizedVariant,
      );

      let updatedSelections: SelectedVariant[];
      if (existing) {
        updatedSelections = state.selections[categoryKey].map((s) =>
          s.productId === productId &&
          (s.variantId || null) === normalizedVariant
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
        selections: {
          ...state.selections,
          [categoryKey]: updatedSelections,
        },
      };
    });
    get().calculateTotals();
  },

  removeSelection: (
    category: string,
    productId: string,
    variantId: string | null,
  ) => {
    set((state) => {
      const categoryKey = category as keyof typeof state.selections;
      const normalizedVariant = variantId || null;

      const updatedSelections = state.selections[categoryKey].filter(
        (s) =>
          !(
            s.productId === productId &&
            (s.variantId || null) === normalizedVariant
          ),
      );

      return {
        selections: {
          ...state.selections,
          [categoryKey]: updatedSelections,
        },
      };
    });
    get().calculateTotals();
  },

  updateQuantity: (
    category: string,
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      get().removeSelection(category, productId, variantId);
      return;
    }

    set((state) => {
      const categoryKey = category as keyof typeof state.selections;
      const normalizedVariant = variantId || null;

      const updatedSelections = state.selections[categoryKey].map((s) =>
        s.productId === productId && (s.variantId || null) === normalizedVariant
          ? { ...s, quantity }
          : s,
      );

      return {
        selections: {
          ...state.selections,
          [categoryKey]: updatedSelections,
        },
      };
    });
    get().calculateTotals();
  },

  setExpandedStep: (stepId: string | null) => set({ expandedStep: stepId }),

  selectVariant: (productId: string, variantId: string | null) => {
    set((state) => ({
      selectedVariant: {
        ...state.selectedVariant,
        [productId]: variantId || null,
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

  resetBuilder: () => set(initialState),

  loadState: (partialState: Partial<BundleBuilderState>) => {
    set((state) => ({ ...state, ...partialState }));
    get().calculateTotals();
  },

  getState: () => get(),
  getProductById: (id: string) => get().products.get(id),

  saveBundleData: () => {
    const { selections, selectedVariant } = get();
    const dataToSave = {
      selections,
      selectedVariant,
    };
    localStorage.setItem("bundle-builder-store", JSON.stringify(dataToSave));
  },

  getSelectedCount: (category: string) => {
    const categoryKey = category as keyof BundleBuilderState["selections"];
    const list = get().selections[categoryKey] || [];
    return list.reduce((sum, item) => sum + item.quantity, 0);
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
}));
