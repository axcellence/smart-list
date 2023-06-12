import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TodoItem } from "./types";

const seedItems: TodoItem[] = [
  {
    id: 1,
    text: "Milk",
    completed: false,
    category: "Dairy and eggs",
  },
  {
    id: 2,
    text: "Eggs",
    completed: false,
    category: "Dairy and eggs",
  },
  {
    id: 3,
    text: "Bread",
    completed: false,
    category: "Breads and bakery",
  },
  {
    id: 4,
    text: "Butter",
    completed: false,
    category: "Dairy and eggs",
  },
  {
    id: 5,
    text: "Cheese",
    completed: false,
    category: "Dairy and eggs",
  },
  {
    id: 6,
    text: "Apples",
    completed: false,
    category: "Fruits and vegetables",
  },
];

interface GroceryListState {
  items: TodoItem[];
  addItem: (item: TodoItem) => void;
  removeItem: (id: number) => void;
}

export const useGroceryListStore = create<GroceryListState>()(
  persist(
    (set) => ({
      items: seedItems,
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "grocery-list-storage",
    }
  )
);