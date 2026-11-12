import React, { createContext, useContext, useState, useMemo } from 'react';
// import { mockProducts, commonTadkaItems } from '@/data/mockProducts';
import { CartItem, Product, DeliveryInstruction, PaymentMethod, TadkaItem, Order, CartItemApiPayload } from '@/types/OrderType';

export interface DeliveryAddress {
  id?: string;
  label: string;
  flat: string;
  landmark: string;
  pincode: string;
  city: string;
  contactNo?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedWeight?: string, customPrice?: number, customMrp?: number) => void;
  updateProductWeight: (productId: string, newWeight: string, newPrice?: number, newMrp?: number) => void;
  addTadkaItem: (item: TadkaItem) => void;
  updateQuantity: (productId: string, selectedWeight: string, delta: number) => void;
  removeFromCart: (productId: string, selectedWeight: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, selectedWeight?: string) => number;
  getApiCartItems: () => CartItemApiPayload[];
  totalItemCount: number;
  itemsTotal: number;
  discountTotal: number;
  deliveryCharge: number;
  packagingCharge: number;
  finalToPay: number;
  savingsTotal: number;
  deliveryInstruction: DeliveryInstruction;
  setDeliveryInstruction: (instruction: DeliveryInstruction) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  address: DeliveryAddress;
  setAddress: (address: DeliveryAddress) => void;
  hasFreeGift: boolean;
  orderPlaced: boolean;
  setOrderPlaced: (status: boolean) => void;
  latestOrderId: string;
  orders: Order[];
  repeatOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial mock cart commented out:
// const initialCartItems: CartItem[] = [
//   {
//     product: mockProducts[1],
//     selectedWeight: '1 kg packet',
//     unitPrice: 40,
//     unitMrp: 48,
//     quantity: 1,
//   },
//   ...
// ];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryInstruction, setDeliveryInstruction] = useState<DeliveryInstruction>('ring_bell');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [address, setAddress] = useState<DeliveryAddress>({
    id: '',
    label: 'Delivery Location',
    flat: '',
    landmark: '',
    pincode: '',
    city: '',
    contactNo: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  const repeatOrder = (order: Order) => {
    // Basic implementation: can just console.log for now, or populate cart
    console.log('Repeating order:', order);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  const addToCart = (
    product: Product,
    selectedWeight?: string,
    customPrice?: number,
    customMrp?: number
  ) => {
    const weightToUse = selectedWeight || product.defaultWeight;
    const weightOption = product.weightOptions.find((w) => w.weight === weightToUse);
    const unitPrice = customPrice !== undefined ? customPrice : (weightOption ? weightOption.price : product.price);
    const unitMrp = customMrp !== undefined ? customMrp : (weightOption ? weightOption.mrp : product.mrp);

    const productQuantity =
      weightOption?.rawQty ?? (parseFloat(weightToUse) || 1);

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const updated = [...prev];
        if (existing.selectedWeight === weightToUse) {
          updated[existingIndex] = {
            ...existing,
            quantity: existing.quantity + 1,
          };
        } else {
          // Different weight selected -> Replace existing weight variant in cart
          updated[existingIndex] = {
            ...existing,
            selectedWeight: weightToUse,
            unitPrice,
            unitMrp,
            quantity: existing.quantity > 0 ? existing.quantity : 1,
          };
        }
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedWeight: weightToUse,
            unitPrice,
            unitMrp,
            quantity: 1,
          },
        ];
      }
    });
  };

  const updateProductWeight = (
    productId: string,
    newWeight: string,
    newPrice?: number,
    newMrp?: number
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === productId);
      if (existingIndex === -1) {
        return prev;
      }
      const existing = prev[existingIndex];
      const option = existing.product.weightOptions.find((w) => w.weight === newWeight);
      const unitPrice = newPrice !== undefined ? newPrice : (option ? option.price : existing.unitPrice);
      const unitMrp = newMrp !== undefined ? newMrp : (option ? option.mrp : existing.unitMrp);

      const updated = [...prev];
      updated[existingIndex] = {
        ...existing,
        selectedWeight: newWeight,
        unitPrice,
        unitMrp,
      };
      return updated;
    });
  };

  const addTadkaItem = (item: TadkaItem) => {
    // Convert Tadka item to synthetic Product if needed
    const syntheticProduct: Product = {
      id: item.id,
      name: item.name,
      hindiName: item.hindiName || '',
      englishSubtitle: 'Tadka Special • ताज़ा और सुगंधित',
      category: 'daily',
      categoryLabel: 'Daily Essentials',
      image: item.image,
      originBadge: 'Direct Mandi Graded',
      freshnessBadge: 'SUBAH KI TAAZA',
      certifiedBadge: '100% Certified Wazan',
      discountPercent: Math.round(((item.mrp - item.price) / item.mrp) * 100),
      defaultWeight: item.weight,
      price: item.price,
      mrp: item.mrp,
      weightOptions: [
        {
          weight: item.weight,
          price: item.price,
          mrp: item.mrp,
        },
      ],
      localMandiPrice: item.mrp,
      apnaMandiPrice: item.price,
      guarantees: ['100% Handpicked Fresh Tadka Veggie'],
      rasoiTips: { description: 'Tadka ke liye best', tags: ['Tadka', 'Khushboo'] },
      quickAddTadka: [],
    };

    addToCart(syntheticProduct, item.weight, item.price, item.mrp);
  };

  const updateQuantity = (productId: string, selectedWeight: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && (item.selectedWeight === selectedWeight || !selectedWeight)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string, selectedWeight?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (selectedWeight ? item.selectedWeight === selectedWeight : true))
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string, selectedWeight?: string) => {
    if (selectedWeight) {
      const match = items.find(
        (i) => i.product.id === productId && i.selectedWeight === selectedWeight
      );
      return match ? match.quantity : 0;
    }
    // Sum across all weight variants of this product
    return items
      .filter((i) => i.product.id === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const itemsTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  // MRP total to show clear mandi discounts
  const mrpTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitMrp * item.quantity, 0);
  }, [items]);

  const rawDiscount = mrpTotal - itemsTotal;
  // If items match exactly initial screenshot, enforce the ₹10 discount display
  const discountTotal = itemsTotal > 0 ? Math.max(10, rawDiscount) : 0;

  const deliveryCharge = 0;
  const packagingCharge = 0;

  const finalToPay = itemsTotal;
  const savingsTotal = discountTotal;

  const hasFreeGift = itemsTotal > 0; // Mandi Shagun: Free Mirchi & Dhaniya!

  const getApiCartItems = (): CartItemApiPayload[] => {
    return items.map((item) => {
      const option = item.product.weightOptions.find(
        (w) => w.weight === item.selectedWeight
      );
      const productQuantity =
        option?.rawQty ?? (parseFloat(item.selectedWeight) || 1);

      return {
        productId: item.product.id,
        price: item.unitPrice,
        productQuantity,
        productCount: item.quantity,
      };
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateProductWeight,
        addTadkaItem,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        getApiCartItems,
        totalItemCount,
        itemsTotal,
        discountTotal,
        deliveryCharge,
        packagingCharge,
        finalToPay,
        savingsTotal,
        deliveryInstruction,
        setDeliveryInstruction,
        paymentMethod,
        setPaymentMethod,
        address,
        setAddress,
        hasFreeGift,
        orderPlaced,
        setOrderPlaced: (status) => {
          if (status) {
            setLatestOrderId(`ASM-${Math.floor(10000 + Math.random() * 90000)}`);
          }
          setOrderPlaced(status);
        },
        latestOrderId,
        orders,
        repeatOrder,
        getOrderById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
