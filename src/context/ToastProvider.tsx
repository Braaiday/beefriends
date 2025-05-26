import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { toast } from "../lib/toast";

type Toast = {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration: number;
};

const getIcon = (type: Toast["type"]) => {
  switch (type) {
    case "success":
      return "mdi:check-circle";
    case "error":
      return "mdi:alert-circle";
    case "warning":
      return "mdi:alert";
    case "info":
      return "mdi:information";
    default:
      return "mdi:information";
  }
};

const getBgColor = (type: Toast["type"]) => {
  switch (type) {
    case "success":
      return "bg-green-600";
    case "error":
      return "bg-red-600";
    case "warning":
      return "bg-yellow-500";
    case "info":
      return "bg-blue-600";
    default:
      return "bg-gray-600";
  }
};

export const ToastProvider = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    toast._subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(newToast.id), newToast.duration);
    });
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 w-[320px] max-w-full">
      {toasts.map((t) => (
        <Transition
          key={t.id}
          show
          as={Fragment}
          appear
          enter="transform ease-out duration-300 transition"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`relative px-4 py-3 rounded-lg shadow-md text-white flex items-start justify-between space-x-3 ${getBgColor(
              t.type
            )}`}
          >
            <div className="flex items-start space-x-2">
              <Icon icon={getIcon(t.type)} className="w-5 h-5 mt-0.5" />
              <span className="text-sm">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
            </button>
          </div>
        </Transition>
      ))}
    </div>
  );
};
