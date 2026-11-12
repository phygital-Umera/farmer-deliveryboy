import { usePickupItems } from '@/lib/api and mutation/deliveryOrders/useDelivery';
import React, { useState } from 'react';

export interface ProduceItem {
  id: string;
  name: string;
  quantity: string;
  price?: string;
  checked?: boolean;
}

interface ProduceChecklistProps {
  orderId?: string;
  initialItems?: ProduceItem[];
  onSubmit?: (items: ProduceItem[]) => void;
  onPickup?: (items: ProduceItem[]) => void;
  className?: string;
}

const DEFAULT_ITEMS: ProduceItem[] = [
  { id: 'item-1', name: 'Fresh Tomato', quantity: '1 kg', checked: false },
  { id: 'item-2', name: 'Organic Potatoes', quantity: '2 kg', checked: false },
  { id: 'item-3', name: 'Fresh Coriander', quantity: '250 g', checked: false },
];

export const ProduceChecklist: React.FC<ProduceChecklistProps> = ({
  orderId,
  initialItems,
  onSubmit,
  onPickup,
  className = '',
}) => {
  const { mutate: pickupOrder, isPending } = usePickupItems();

  // Items initialized with manual unchecked state
  const [items, setItems] = useState<ProduceItem[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems.map((item) => ({
        ...item,
        checked: item.checked ?? false,
      }));
    }
    return DEFAULT_ITEMS;
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Delivery boy toggles each item manually
  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = items.filter((i) => i.checked).length;

  const handlePickupSubmit = () => {



      pickupOrder(orderId ||'')
 
  };

  return (
    <div className={`bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-sm max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#1b6d24] text-[20px]">inventory_2</span>
          <span className="font-bold text-[14px] text-[#1b1c1c]">Produce & Bag Checklist</span>
        </div>
        <span className="text-[11px] text-[#1b6d24] font-semibold bg-[#e8f5e9] px-2.5 py-0.5 rounded-full">
          {checkedCount}/{items.length} Checked
        </span>
      </div>

      {/* Items List - Delivery boy clicks each manually */}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
              item.checked ? 'bg-[#f6fbf6] border-[#88d982]' : 'bg-[#fcf9f8] border-[#e0e6e0]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  item.checked ? 'bg-[#1b5e20] border-[#1b5e20] text-white' : 'border-[#717a6d] bg-white'
                }`}
              >
                {item.checked && <span className="material-symbols-outlined text-[16px]">check</span>}
              </div>
              <div className="font-semibold text-[13px] text-[#1b1c1c]">{item.name}</div>
            </div>
            <span className="text-[12px] font-bold text-[#1b1c1c] bg-white px-2 py-0.5 rounded-md border border-[#e0e6e0]">
              {item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Simple Green Pick Up Button */}
      <button
        type="button"
        onClick={() => pickupOrder(orderId || '')}
        className="w-full mt-3 py-2.5 px-4 bg-[#1b5e20] hover:bg-[#144818] active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
        <span>Pick Up ({checkedCount}/{items.length})</span>
      </button>
    </div>
  );
};

export default ProduceChecklist;
