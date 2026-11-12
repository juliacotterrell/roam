
"use client";

import { useEffect } from "react";
import { initialiseDatabase } from "./travel_service";

export default function DatabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initialiseDatabase().catch((error) => {
      console.error("Failed to initialise Roam database:", error);
    });
  }, []);

  return <>{children}</>;
}
