export function generateOrderNumber(): string {
  const prefix = 'SN';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'completed':
    case 'sent':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'pending':
    case 'processing':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'expired':
    case 'failed':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'cancelled':
    case 'refunded':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

export function getServiceEmoji(serviceName: string): string {
  const emojiMap: Record<string, string> = {
    'Netflix': '🎬',
    'Spotify': '🎵',
    'Xbox Game Pass': '🎮',
    'Disney+': '🏰',
    'YouTube Premium': '▶️',
    'Apple TV+': '🍎',
    'Amazon Prime': '📦',
    'Hulu': '📺',
    'HBO Max': '🎭',
    'Paramount+': '⭐',
  };
  return emojiMap[serviceName] || '📱';
}

export function daysUntilExpiry(endDate: Date | string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
