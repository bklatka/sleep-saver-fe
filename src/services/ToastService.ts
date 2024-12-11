import { makeAutoObservable } from 'mobx';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  severity: ToastSeverity;
}

class ToastService {
  toasts: Toast[] = [];
  private counter = 0;

  constructor() {
    makeAutoObservable(this);
  }

  show(message: string, severity: ToastSeverity = 'info') {
    const id = this.counter++;
    this.toasts.push({ id, message, severity });

    // Auto-remove after 6 seconds
    setTimeout(() => {
      this.remove(id);
    }, 6000);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}

export const toastService = new ToastService(); 