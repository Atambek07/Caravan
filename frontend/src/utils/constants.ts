export const COLORS = {
  primary: '#2563EB',
  secondary: '#1E293B',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F8FAFC',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: 'Новый',
  CONFIRMED: 'Подтверждён',
  PROCESSING: 'В обработке',
  READY_TO_SHIP: 'Готов к отгрузке',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELED: 'Отменён',
};

export const ORDER_STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  NEW: 'info',
  CONFIRMED: 'primary',
  PROCESSING: 'warning',
  READY_TO_SHIP: 'secondary',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELED: 'error',
};
