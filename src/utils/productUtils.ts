import { Product, ProductVolumeVariant } from '../types';

/**
 * Returns the configured volume variants for a product, or a smart default (12ml, 50ml, 100ml)
 * with proportional pricing if the product doesn't have custom variants yet.
 */
export function getProductVolumeVariants(product: Product): ProductVolumeVariant[] {
  if (product.volumeVariants && Array.isArray(product.volumeVariants) && product.volumeVariants.length > 0) {
    const valid = product.volumeVariants.filter(
      (v) => v && typeof v.volume === 'string' && v.volume.trim() !== ''
    );
    if (valid.length > 0) {
      return valid.map((v) => ({
        volume: v.volume.trim(),
        price: Number(v.price) || product.price || 1499,
        salePrice:
          v.salePrice !== undefined && v.salePrice !== null && Number(v.salePrice) > 0
            ? Number(v.salePrice)
            : undefined,
      }));
    }
  }

  const basePrice = product.price || 1499;
  const baseSale = product.salePrice && product.salePrice > 0 ? product.salePrice : Math.round(basePrice * 0.85);

  // If already tagged as attar or pure oil
  if (
    product.category?.toLowerCase().includes('attar') ||
    product.volume?.toLowerCase().includes('oil') ||
    product.name?.toLowerCase().includes('attar')
  ) {
    return [
      { volume: '6ml', price: Math.max(150, Math.round(basePrice * 0.55)), salePrice: Math.max(120, Math.round(baseSale * 0.55)) },
      { volume: '12ml', price: basePrice, salePrice: baseSale },
      { volume: '24ml', price: Math.round(basePrice * 1.8), salePrice: Math.round(baseSale * 1.8) },
    ];
  }

  // Standard Perfume defaults: 12ml, 50ml, 100ml with distinct prices
  return [
    { volume: '12ml', price: Math.max(399, Math.round(basePrice * 0.35)), salePrice: Math.max(299, Math.round(baseSale * 0.35)) },
    { volume: '50ml', price: Math.max(899, Math.round(basePrice * 0.7)), salePrice: Math.max(699, Math.round(baseSale * 0.7)) },
    { volume: '100ml', price: basePrice, salePrice: baseSale },
  ];
}
