import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { toast } from "../lib/toast";

type Toast = {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration: number;
};

const getToastImg = (type: Toast["type"]) => {
  switch (type) {
    case "success":
      return "/images/HiBee.png";
    case "error":
      return "/images/ErrorBee.png";
    case "warning":
      return "/images/CautionBee.png";
    case "info":
      return "/images/InfoBee.png";
    default:
      return "";
  }
};

export const ToastProvider = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});

  const hideToast = (id: string) => {
    setVisibleMap((prev) => ({ ...prev, [id]: false }));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setVisibleMap((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }, 1000); // should match the leave animation duration
  };

  useEffect(() => {
    const callback = (newToast: Toast) => {
      setToasts((prev) => [...prev, newToast]);
      setVisibleMap((prev) => ({ ...prev, [newToast.id]: true }));
      setTimeout(() => hideToast(newToast.id), newToast.duration);
    };

    toast._subscribe(callback);

    return () => {
      toast._unsubscribe(callback);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-8 w-[320px] max-w-full">
      {toasts.map((t) => (
        <Transition
          key={t.id}
          show={visibleMap[t.id]}
          as={Fragment}
          appear
          enter="transform ease-out duration-1000 transition"
          enterFrom="opacity-0 -translate-x-150"
          enterTo="opacity-100 translate-x-0"
          leave="transform ease-in duration-1000 transition"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 -translate-x-150"
        >
          <div
            className={`relative px-4 py-3 rounded-lg shadow-lg text-foreground/70 flex items-start justify-between space-x-3 bg-card transition-all`}
          >
            <div className="flex items-start space-x-2 relative w-full">
              <span className="text-sm">{t.message}</span>
              <img
                src={getToastImg(t.type)}
                alt={`${t.type} icon`}
                className="absolute -top-15 -right-20 w-24 h-24"
              />
            </div>
          </div>
        </Transition>
      ))}
    </div>
  );
};
