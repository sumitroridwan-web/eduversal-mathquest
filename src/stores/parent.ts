"use client";

import { create } from "zustand";

interface ParentState {
  selectedChildId: string;
  setChild: (id: string) => void;
}

export const useParent = create<ParentState>((set) => ({
  selectedChildId: "stu-1",
  setChild: (id) => set({ selectedChildId: id }),
}));
