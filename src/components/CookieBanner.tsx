import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "site-cookies-accepted";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md z-40 card-stead p-4 flex items-start gap-3 shadow-xl">
      <p className="text-sm text-ink-700 flex-1">
        We use cookies to improve your browsing experience and analyze site traffic. By clicking accept you agree to our use of cookies.
      </p>
      <button
        onClick={() => { localStorage.setItem(STORAGE_KEY, "1"); setShow(false); }}
        className="btn btn-sm btn-primary"
      >Accept</button>
      <button onClick={() => setShow(false)} aria-label="Dismiss" className="text-ink-500 hover:text-ink-900"><X className="h-4 w-4" /></button>
    </div>
  );
}
