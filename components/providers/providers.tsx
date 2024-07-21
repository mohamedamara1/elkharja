"use client";

import { DndProvider } from "react-dnd";
import { AuthProvider } from "../../app/context/auth-context";
import { HTML5Backend } from "react-dnd-html5-backend";

export function Providers({ children }: any) {
  return <AuthProvider>{children}</AuthProvider>;
}
