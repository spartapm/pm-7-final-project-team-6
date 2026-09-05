"use client";

import { Suspense } from "react";
import MeInner from "./MeInner";

export default function MePage() {
  return (
    <Suspense>
      <MeInner />
    </Suspense>
  );
}
