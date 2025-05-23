// utils/gtag.ts
export const GA_TRACKING_ID = "G-Z0SVEFB4XM"; // Замените на ваш реальный GA4 ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Отправка просмотра страницы
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Отправка произвольного события
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
