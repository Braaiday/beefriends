type ToastType = "success" | "error" | "info" | "warning";

type ToastConfig = {
  duration?: number;
};

type ToastFn = (message: string, config?: ToastConfig) => void;

type ToastAPI = {
  success: ToastFn;
  error: ToastFn;
  info: ToastFn;
  warning: ToastFn;
  _subscribe: (callback: (t: InternalToast) => void) => void;
};

type InternalToast = {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
};

const subscribers: ((t: InternalToast) => void)[] = [];

const notify = (type: ToastType, message: string, config?: ToastConfig) => {
  const id = Date.now().toString();
  const duration = config?.duration ?? 4000;
  const toast: InternalToast = { id, type, message, duration };
  subscribers.forEach((cb) => cb(toast));
};

export const toast: ToastAPI = {
  success: (msg, config) => notify("success", msg, config),
  error: (msg, config) => notify("error", msg, config),
  info: (msg, config) => notify("info", msg, config),
  warning: (msg, config) => notify("warning", msg, config),
  _subscribe: (cb) => subscribers.push(cb),
};
