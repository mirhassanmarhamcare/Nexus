"use client";

import { useUIStore } from "@/store/ui.store";
import { useEffect } from "react";

export default function ThemeSync() {
    const theme = useUIStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return null;
}
