import { useState } from "react";

const STORAGE_KEY = "hasSeenOnboarding";

export function useOnboarding() {
  const hasSeenOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY) === "true"
      : false;

  const [show, setShow] = useState(!hasSeenOnboarding);

  const complete = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShow(true);
  };

  return { show, complete, reset };
}
