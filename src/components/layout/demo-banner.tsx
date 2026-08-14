"use client";

import { motion } from "motion/react";
import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex shrink-0 items-center gap-2 border-t border-border bg-card px-4 py-2 text-xs text-muted-foreground"
    >
      <Info className="h-3.5 w-3.5 shrink-0" />
      <p>
        Portfolio Demo — Authentication is intentionally omitted. Recipient
        identity is stored locally in your browser. See Configuration for live
        status.
      </p>
    </motion.footer>
  );
}
