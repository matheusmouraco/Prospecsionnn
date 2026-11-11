"use client";

// Below-the-fold scroll scenes are built one per idle slot, in DOM order, so no single
// task blocks the main thread and each pin is measured after the pins above it exist.
type Job = { fn: () => void; cancelled: boolean };

const queue: Job[] = [];
let running = false;

const schedule = (cb: () => void) => {
  if ("requestIdleCallback" in window) window.requestIdleCallback(cb, { timeout: 600 });
  else setTimeout(cb, 16);
};

function pump() {
  const job = queue.shift();
  if (!job) {
    running = false;
    return;
  }
  if (!job.cancelled) job.fn();
  schedule(pump);
}

export function whenIdle(fn: () => void) {
  const job: Job = { fn, cancelled: false };
  queue.push(job);
  if (!running) {
    running = true;
    schedule(pump);
  }
  return () => {
    job.cancelled = true;
  };
}
