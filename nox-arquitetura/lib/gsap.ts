"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.inOut", duration: 1.1 });
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Fired once the preloader has left (or immediately when it is skipped). */
export const READY_EVENT = "nox:ready";

export function isReady() {
  return typeof document !== "undefined" && document.documentElement.dataset.ready === "1";
}

export function onReady(cb: () => void) {
  if (isReady()) {
    cb();
    return () => {};
  }
  window.addEventListener(READY_EVENT, cb, { once: true });
  return () => window.removeEventListener(READY_EVENT, cb);
}

export function markReady() {
  document.documentElement.dataset.ready = "1";
  window.dispatchEvent(new Event(READY_EVENT));
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
