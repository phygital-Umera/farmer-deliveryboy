import { Product, WeightOption, unit, Unit } from '@/types/OrderType';
// import { commonTadkaItems } from '@/data/mockProducts';

export { unit, Unit };

export interface ApiProductSelling {
  id: string;
  productId: string;
  qty: number;
  price: number;
  sellingPrice: number;
  margin?: number;
  cutPrice?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  productNumber?: string;
  barcode?: string;
  unit?: unit | string;
  sellingPrice?: number;
  cutPrice?: number;
  availableStock?: number;
  isOutOfStock?: boolean;
  cgst?: number;
  sgst?: number;
  taxPercent?: number;
  rackNo?: string;
  description?: string;
  productselling?: ApiProductSelling[];
  category?: {
    id: string;
    name: string;
  };
  subCategory?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  images?: string[];
  createdAt?: string;
}

/**
 * Normalizes quantity value into a comparable scalar for sorting
 * (grams for KG/GRAM, ml for LTR/ML, count for PCS/PACKET)
 */
export const getNormalizedQuantity = (qty: number, unitVal?: unit | string): number => {
  const u = (unitVal || '').trim().toUpperCase();
  const numQty = Number(qty) || 0;

  if (u === unit.KG) {
    // If admin entered grams directly (e.g., 250, 500)
    if (numQty >= 50) return numQty;
    return numQty * 1000;
  }

  if (u === unit.GRAM) {
    if (numQty < 1 && numQty > 0) return numQty * 1000;
    return numQty;
  }

  if (u === unit.LTR) {
    // If admin entered ml directly (e.g., 250, 500)
    if (numQty >= 50) return numQty;
    return numQty * 1000;
  }

  if (u === unit.ML) {
    if (numQty < 1 && numQty > 0) return numQty * 1000;
    return numQty;
  }

  return numQty;
};

/**
 * Formats quantity and unit based on fixed Prisma enum:
 * KG, GRAM, LTR, ML, PCS, PACKET
 */
export const formatWeightQuantity = (qty: number, unitVal?: unit | string): string => {
  const u = (unitVal || '').trim().toUpperCase();
  const numQty = Number(qty);

  if (isNaN(numQty) || numQty <= 0) {
    return `1 ${unitVal ? unitVal.toLowerCase() : 'unit'}`;
  }

  // 1. GRAM
  if (u === unit.GRAM) {
    if (numQty >= 1000) {
      const kgVal = numQty / 1000;
      return `${Number(kgVal.toFixed(2))} kg`;
    }
    if (numQty < 1) {
      return `${Math.round(numQty * 1000)} g`;
    }
    return `${numQty} g`;
  }

  // 2. KG
  if (u === unit.KG) {
    if (numQty < 1) {
      return `${Math.round(numQty * 1000)} g`;
    }
    if (numQty >= 50) {
      if (numQty >= 1000) {
        return `${Number((numQty / 1000).toFixed(2))} kg`;
      }
      return `${numQty} g`;
    }
    return `${numQty} kg`;
  }

  // 3. ML
  if (u === unit.ML) {
    if (numQty >= 1000) {
      const lVal = numQty / 1000;
      return `${Number(lVal.toFixed(2))} L`;
    }
    if (numQty < 1) {
      return `${Math.round(numQty * 1000)} ml`;
    }
    return `${numQty} ml`;
  }

  // 4. LTR
  if (u === unit.LTR) {
    if (numQty < 1) {
      return `${Math.round(numQty * 1000)} ml`;
    }
    if (numQty >= 50) {
      if (numQty >= 1000) {
        return `${Number((numQty / 1000).toFixed(2))} L`;
      }
      return `${numQty} ml`;
    }
    return `${numQty} L`;
  }

  // 5. PCS
  if (u === unit.PCS) {
    return numQty === 1 ? '1 pc' : `${numQty} pcs`;
  }

  // 6. PACKET
  if (u === unit.PACKET) {
    return numQty === 1 ? '1 pkt' : `${numQty} pkts`;
  }

  return `${numQty} ${unitVal ? unitVal.toLowerCase() : 'unit'}`;
};

/**
 * Returns default weight label for single-price fallback when productselling is empty
 */
export const getDefaultWeightLabel = (unitVal?: unit | string): string => {
  const u = (unitVal || '').trim().toUpperCase();

  switch (u) {
    case unit.KG:
      return '1 kg';
    case unit.GRAM:
      return '500 g';
    case unit.LTR:
      return '1 L';
    case unit.ML:
      return '500 ml';
    case unit.PCS:
      return '1 pc';
    case unit.PACKET:
      return '1 pkt';
    default:
      return `1 ${unitVal ? unitVal.toLowerCase() : 'unit'}`;
  }
};

/**
 * Selects the most intuitive default weight option based on unit type
 */
export const getDefaultOption = (
  options: WeightOption[],
  unitVal?: unit | string
): WeightOption | undefined => {
  if (!options || options.length === 0) return undefined;

  const u = (unitVal || '').trim().toUpperCase();

  // Weight (KG, GRAM)
  if (u === unit.KG || u === unit.GRAM) {
    return (
      options.find((w) => w.weight === '1 kg') ||
      options.find((w) => w.weight === '500 g') ||
      options.find((w) => w.weight === '250 g') ||
      options[0]
    );
  }

  // Volume (LTR, ML)
  if (u === unit.LTR || u === unit.ML) {
    return (
      options.find((w) => w.weight === '1 L' || w.weight === '1 l') ||
      options.find((w) => w.weight === '500 ml') ||
      options.find((w) => w.weight === '1000 ml') ||
      options[0]
    );
  }

  // Count (PCS)
  if (u === unit.PCS) {
    return (
      options.find((w) => w.weight === '1 pc' || w.weight === '1 pcs') ||
      options[0]
    );
  }

  // Packets (PACKET)
  if (u === unit.PACKET) {
    return (
      options.find((w) => w.weight === '1 pkt' || w.weight === '1 pkts' || w.weight === '1 packet' || w.weight === '1 pack') ||
      options[0]
    );
  }

  return options[0];
};

/**
 * Dynamic certified badge adapted to the product unit
 */
export const getCertifiedBadgeByUnit = (unitVal?: unit | string): string => {
  const u = (unitVal || '').trim().toUpperCase();

  if (u === unit.KG || u === unit.GRAM) {
    return '100% Certified Wazan';
  }
  if (u === unit.LTR || u === unit.ML) {
    return '100% Pure & Certified';
  }
  if (u === unit.PCS || u === unit.PACKET) {
    return '100% Verified Quality';
  }
  return '100% Verified Quality';
};

/**
 * Dynamic trust guarantees adapted to the product unit
 */
export const getGuaranteesByUnit = (unitVal?: unit | string): string[] => {
  const u = (unitVal || '').trim().toUpperCase();

  if (u === unit.KG || u === unit.GRAM) {
    return [
      'Haath se chuni hui shuddh quality',
      'Digital kaante par poora taul (Certified Wazan)',
      'Doorstep replacement ya instant refund',
    ];
  }
  if (u === unit.LTR || u === unit.ML) {
    return [
      'Shuddh aur hygienic packing',
      'Sahi maap aur tamper-proof seal',
      'Doorstep replacement ya instant refund',
    ];
  }
  return [
    'Haath se chuni hui shuddh quality',
    'Original packaging aur taaza batch',
    'Doorstep replacement ya instant refund',
  ];
};

export const mapApiProductToProduct = (apiProd: ApiProduct): Product => {
  const sortedSelling = [...(apiProd.productselling || [])].sort(
    (a, b) => getNormalizedQuantity(a.qty, apiProd.unit) - getNormalizedQuantity(b.qty, apiProd.unit)
  );

  let weightOptions: WeightOption[] = [];

  if (sortedSelling.length > 0) {
    weightOptions = sortedSelling.map((s) => {
      const price = Number(s.sellingPrice) || 0;
      const margin = Number(s.margin) || 10;
      const cutPrice = Number(s.cutPrice) || 0;
      const mrp = cutPrice > 0 ? cutPrice : Math.round(price * (1 + margin / 100));

      return {
        weight: formatWeightQuantity(s.qty, apiProd.unit),
        price,
        mrp: mrp > price ? mrp : Math.round(price * 1.15),
        cutPrice: cutPrice > 0 ? cutPrice : undefined,
        rawQty: Number(s.qty) || 1,
        note: s.margin ? `Bachat ${s.margin}%` : undefined,
      };
    });
  } else {
    const basePrice = Number(apiProd.sellingPrice) || 0;
    const baseCutPrice = Number(apiProd.cutPrice) || 0;
    const defaultLabel = getDefaultWeightLabel(apiProd.unit);
    const mrp = baseCutPrice > 0 ? baseCutPrice : Math.round(basePrice * 1.15);
    weightOptions = [
      {
        weight: defaultLabel,
        price: basePrice,
        mrp,
        cutPrice: baseCutPrice > 0 ? baseCutPrice : undefined,
        rawQty: 1,
      },
    ];
  }

  // Default weight option (smart detection based on unit)
  const defaultOption = getDefaultOption(weightOptions, apiProd.unit) || weightOptions[0];

  const defaultWeight = defaultOption?.weight || getDefaultWeightLabel(apiProd.unit);
  const price = defaultOption?.price || Number(apiProd.sellingPrice) || 0;
  const cutPrice = defaultOption?.cutPrice ?? (Number(apiProd.cutPrice) > 0 ? Number(apiProd.cutPrice) : undefined);
  const mrp = cutPrice ? cutPrice : (defaultOption?.mrp || Math.round(price * 1.15));

  const image =
    apiProd.images && apiProd.images.length > 0 && apiProd.images[0]
      ? apiProd.images[0]
      : '';

  const formattedName = apiProd.name
    ? apiProd.name.charAt(0).toUpperCase() + apiProd.name.slice(1)
    : 'Product';

  const categoryName = apiProd.category?.name || 'daily';

  return {
    id: apiProd.id,
    name: formattedName,
    hindiName: apiProd.subCategory?.name || '',
    englishSubtitle:
      apiProd.description && apiProd.description !== 'sss'
        ? apiProd.description
        : `${apiProd.category?.name || 'Fresh'} • Mandi Grade Quality`,
    category: categoryName.toLowerCase(),
    categoryLabel: apiProd.category?.name || 'Daily Essentials',
    unit: apiProd.unit,
    image,
    originBadge: 'Direct Mandi Supply',
    freshnessBadge: 'TAAZA HARVEST',
    certifiedBadge: getCertifiedBadgeByUnit(apiProd.unit),
    discountPercent:
      cutPrice && cutPrice > price
        ? Math.round(((cutPrice - price) / cutPrice) * 100)
        : mrp > price
        ? Math.round(((mrp - price) / mrp) * 100)
        : 10,
    defaultWeight,
    price,
    mrp,
    cutPrice,
    weightOptions,
    localMandiPrice: Math.round(price * 1.1),
    apnaMandiPrice: price,
    guarantees: getGuaranteesByUnit(apiProd.unit),
    rasoiTips: {
      description: apiProd.description || 'Taaza aur shuddh rasoi ke liye uttam.',
      tags: ['Fresh', 'Purity', 'High Quality'],
    },
    quickAddTadka: [], // commonTadkaItems commented out
  };
};
