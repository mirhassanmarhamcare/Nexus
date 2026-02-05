"use client";

import { useToastStore } from "@/store/toast.store";

export default function Toast() {
    const { message, isActive } = useToastStore();

    return (
        <div
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-8 py-4 font-semibold z-[11000] transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isActive ? "translate-y-0" : "translate-y-[100px]"
                } toast`} // Added 'toast' class for potential legacy CSS hook if needed
        >
            {message}
        </div>
    );
}
