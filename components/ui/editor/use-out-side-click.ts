import { useEffect, useRef } from "react";

export const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            try {
                if (
                    target.closest("[role=dialog]") ||
                    target.closest(".chakra-portal")
                )
                    return;
            } catch {}

            if (ref.current && !ref.current.contains(target)) {
                callback();
            }
        };

        document.addEventListener("click", handleClick, true);
        return () => {
            document.removeEventListener("click", handleClick, true);
        };
    }, [ref, callback]);

    return ref;
};
