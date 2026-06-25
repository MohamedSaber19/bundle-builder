# 📦 Bundle Builder Project

## 🛠️ Setup & Run Instructions

Follow these steps to get the project running locally from a clean clone:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MohamedSaber19/bundle-builder.git
   cd bundle-builder
   ```

2. **Install dependencies:**

   ```Bash
   npm install
   ```

3. **Start the development server:**

   ```Bash
   npm run dev
   ```

## ⚙️ Key Decisions

- **State Management with Zustand**: Selected Zustand as the centralized state management solution. It provides a lightweight, hook-based API that eliminates unnecessary boilerplate (unlike Redux) while avoiding the re-render performance issues of React Context. This allows us to cleanly decouple complex bundle logic, quantity updates, and financial calculations from the UI components.

- **Manual Data Persistence**: Implemented a controlled, manual save lifecycle (saveBundleData). This ensures user choices stay in active memory while editing and are only committed to long-term storage when explicitly saved.

- **Immediate Hydration Computing**: Configured the state store to safely look for saved data in localStorage at startup. Added a standalone computation loop (computeInitialTotals) during initialization to ensure pricing totals and savings reflect accurately right away on a page refresh.
