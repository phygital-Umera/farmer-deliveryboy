import React, { useState } from 'react';
import { Order } from '../../../types';
import { usePickupItems } from '@/lib/api and mutation/deliveryOrders/useDelivery';

export interface ProduceItem {
  id: string;
  name: string;
  quantity: string;
  checked?: boolean;
}

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onSubmit?: (items: ProduceItem[]) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onSubmit,
}) => {
  const { mutate: pickupOrder, isPending: isPickingUp } = usePickupItems();
  // Initialize checklist items from order if available, else fallback to standard produce items
  const [items, setItems] = useState<ProduceItem[]>(() => {
    if (order?.items && order.items.length > 0) {
      return order.items.map((it, idx) => ({
        id: it.id || `item-${idx}`,
        name: it.name,
        quantity: it.quantityStr || '1 kg',
        checked: false, // manual check by delivery boy
      }));
    }
    return [
      { id: '1', name: 'Fresh Tomato', quantity: '1 kg', checked: false },
      { id: '2', name: 'Organic Potatoes', quantity: '2 kg', checked: false },
      { id: '3', name: 'Fresh Coriander', quantity: '250 g', checked: false },
    ];
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = items.filter((i) => i.checked).length;

  const handleSubmit = () => {
    if (order?.id) {
      pickupOrder(order.id, {
        onSuccess: () => {
          setIsSubmitted(true);
          if (onSubmit) {
            onSubmit(items);
          }
          setTimeout(() => {
            onClose();
          }, 900);
        },
      });
    } else {
      setIsSubmitted(true);
      if (onSubmit) {
        onSubmit(items);
      }
      setTimeout(() => {
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1b6d24]">
              Delivery Receipt
            </span>
            <h3 className="font-black text-lg text-gray-900 leading-tight">
              {order.orderNumber}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Merged Customer & Delivery Address Card (Matching Image 2) */}
        {(() => {
          const customerPhone = order.customerPhone || (order as any)?.customer?.user?.phoneNumber || (order.address as any)?.contactNo || '';
          return (
            <div className="bg-white rounded-2xl p-3.5 border border-[#e8ece7] shadow-2xs flex flex-col gap-2">
              {/* Top Row: Customer Name on Left, Phone Number on Right */}
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-[16px] text-[#1b1c1c] tracking-tight truncate">
                  {order.customerName}
                </h4>
                {customerPhone && (
                  <span className="text-[13px] font-semibold text-[#41493e] shrink-0">
                    {customerPhone}
                  </span>
                )}
              </div>

              {/* Address Line */}
              <div className="text-[13px] text-[#525e54] leading-snug">
                {typeof order.address === 'string'
                  ? order.address
                  : (order.address as any)?.address || (order.address as any)?.flatAndBuilding || order.address?.fullAddress || 'Delivery Address'}
              </div>

              {/* Landmark with Green Flag Icon */}
              {typeof order.address === 'object' && ((order.address as any)?.landmark || (order.address as any)?.sectorOrArea) && (
                <div className="flex items-center gap-1.5 text-[12px] text-[#1b6d24] font-medium">
                  <span className="material-symbols-outlined text-[15px] text-[#1b6d24] shrink-0">
                    flag
                  </span>
                  <span>{(order.address as any)?.landmark || (order.address as any)?.sectorOrArea}</span>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-[#e0e6e0]/70 my-0.5" />

              {/* Action Buttons: Call Customer & Quick SMS */}
              {customerPhone && (
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a
                    href={`tel:${customerPhone}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[#e8f5e9] text-[#1b5e20] hover:bg-[#d8eed9] rounded-xl font-bold text-[12px] active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>Call Customer</span>
                  </a>

                  <a
                    href={`sms:${customerPhone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[#f2f4f2] text-[#1b1c1c] hover:bg-[#e4e7e4] rounded-xl font-bold text-[12px] active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">sms</span>
                    <span>Quick SMS</span>
                  </a>
                </div>
              )}
            </div>
          );
        })()}

        {/* Stitch Produce & Bag Checklist */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#1b6d24] text-[20px]">
                inventory_2
              </span>
              <span className="font-bold text-[14px] text-[#1b1c1c]">
                Produce & Bag Checklist
              </span>
            </div>
            <span className="text-[11px] text-[#1b6d24] font-semibold bg-[#e8f5e9] px-2 py-0.5 rounded-full">
              {checkedCount}/{items.length} Checked
            </span>
          </div>

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
                      item.checked
                        ? 'bg-[#1b5e20] border-[#1b5e20] text-white'
                        : 'border-[#717a6d] bg-white'
                    }`}
                  >
                    {item.checked && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </div>
                  <div className="font-semibold text-[13px] text-[#1b1c1c]">
                    {item.name}
                  </div>
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
            onClick={handleSubmit}
            className="w-full mt-3 py-2.5 px-4 bg-[#1b5e20] hover:bg-[#144818] active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>Pick Up ({checkedCount}/{items.length})</span>
          </button>
        </div>

        {/* Financial & Payment Summary */}
        <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Mode:</span>
            <span className="font-bold text-gray-900">{order.paymentModeLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount Collected:</span>
            <span className="font-black text-[#1b6d24] text-sm">
              ₹{order.totalCashToCollect}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
            <span className="text-gray-700">Rider Trip Earnings:</span>
            <span className="text-[#1b5e20] text-sm">₹{order.tripEarnings}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black active:scale-95 transition-all"
        >
          Close Receipt
        </button>
      </div>
    </div>
  );
};

export default OrderDetailModal;
