// src/hook/useClickOutside.ts
import { useEffect } from "react";
import type { RefObject } from "react";

type Options = { enabled?: boolean; onEscape?: () => void };
type AnyRef = RefObject<HTMLElement | null>;

export function useClickOutside(
  refs: AnyRef | AnyRef[],
  onOutside: (ev: MouseEvent | TouchEvent) => void,
  { enabled = true, onEscape }: Options = {}
) {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    const list = Array.isArray(refs) ? refs : [refs];

    const isInside = (target: EventTarget | null) =>
      list.some(r => {
        const el = r.current;
        return el && target instanceof Node && el.contains(target);
      });

    const handleDown = (e: MouseEvent | TouchEvent) => {
      const target = (e as MouseEvent).target ?? (e as TouchEvent).target;
      if (!isInside(target)) onOutside(e);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape?.();
    };

    document.addEventListener("mousedown", handleDown, true);
    document.addEventListener("touchstart", handleDown, true);
    if (onEscape) document.addEventListener("keydown", handleKey, true);

    return () => {
      document.removeEventListener("mousedown", handleDown, true);
      document.removeEventListener("touchstart", handleDown, true);
      if (onEscape) document.removeEventListener("keydown", handleKey, true);
    };
  }, [enabled, onOutside, onEscape]);
}
