/**
 * NovaEstate Mobile - Formatting Utilities
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-CA').format(num);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const getImageUrl = (img: any): string | null => {
  if (!img) return null;
  if (typeof img === 'string' && img.trim().length > 0) {
    return img.trim();
  }
  if (typeof img === 'object') {
    if (typeof img.uri === 'string' && img.uri.trim().length > 0) return img.uri.trim();
    if (typeof img.url === 'string' && img.url.trim().length > 0) return img.url.trim();
    if (typeof img.MediaURL === 'string' && img.MediaURL.trim().length > 0) return img.MediaURL.trim();
  }
  return null;
};
