"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/store/settings.store";

export default function SettingsSync() {
    const { fetchSettings } = useSettingsStore();

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return null;
}
