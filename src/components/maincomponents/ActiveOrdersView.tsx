import React, { useState } from 'react';
import { Order, OrderStatus } from '../../../types';
import { useGetDelivery } from '@/lib/api and mutation/deliveryOrders/useDelivery';
import { useNavigate } from '@tanstack/react-router';
import { OrderCard } from './OrderCard';
import { ShiftSummaryCard } from './ShiftSummaryCard';

interface ActiveOrdersViewProps {
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const ActiveOrdersView: React.FC<ActiveOrdersViewProps> = ({
  orders,
  onSelectOrder,
  onRefresh,
  isRefreshing = false,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const { data: deliveyData, isLoading, refetch } = useGetDelivery();
  const navigate = useNavigate();

  // Extract raw orders from API response safely
  const rawApiOrders: any[] = Array.isArray(deliveyData?.data)
    ? deliveyData.data
    : Array.isArray(deliveyData)
      ? deliveyData
      : [];

  // Map API response to Order objects
  const mappedApiOrders: Order[] = rawApiOrders.map((item: any, index: number) => {
    const customerName = item?.customer?.user?.fullname || item?.customer?.name || 'Customer';
    const customerPhone = item?.customer?.user?.phoneNumber || item?.address?.contactNo || '';
    const street = item?.address?.address || '';
    const landmark = item?.address?.landmark || '';
    const pincode = item?.address?.pincode || '';
    const fullAddress = [street, landmark, pincode ? `PIN: ${pincode}` : ''].filter(Boolean).join(', ');

    const items = (item?.items || []).map((it: any, iIdx: number) => ({
      id: it?.id || `item-${index}-${iIdx}`,
      name: it?.productName || 'Vegetable',
      quantityStr: `${it?.productQuantity || it?.totalQuantity || it?.productCount || 1} kg`,
      priceStr: `₹${it?.totalPrice || it?.price || 0}`,
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=120&auto=format&fit=crop&q=80',
      altText: it?.productName || 'Vegetable',
      isVerified: false,
    }));

    const itemsCount = items.length;
    const itemsSummary = items.map((it: any) => it.name).join(', ') || 'Fresh produce';
    const grandTotal = Number(item?.grandTotal ?? item?.subtotal ?? 0);

    return {
      id: item?.id || `api-ord-${index}`,
      orderNumber: item?.orderNo ? `#ASM-${item.orderNo.slice(0, 4).toUpperCase()}` : `#ASM-${9395 + index}`,
      customerName,
      customerPhone,
      address: {
        flatAndBuilding: street,
        sectorOrArea: landmark,
        landmark: landmark,
        fullAddress: fullAddress || 'Delivery Address',
        city: item?.customer?.city || 'Local',
        pinCode: pincode,
      },
      distanceKm: 2.8,
      distanceStr: '2.8 km',
      status: (item?.status === 'ASSIGNED' ? 'on_the_way' : (item?.status?.toLowerCase() || 'on_the_way')) as OrderStatus,
      statusBadge: item?.status || 'ON THE WAY',
      hubLocation: 'Mandi Hub',
      timeAgo: 'Just now',
      etaStr: '20 MINS',
      targetDeliveryTime: 'Today',
      estimatedWeight: `${items.reduce((sum: number, it: any) => sum + parseFloat(it.quantityStr || '1'), 0).toFixed(1)} kg`,
      paymentMethod: 'COD',
      paymentModeLabel: 'Cash on Delivery (COD)',
      paymentStatus: 'PENDING',
      totalCashToCollect: grandTotal,
      itemsCount,
      itemsSummary,
      items,
      tripEarnings: 40,
    };
  });

  // Use API orders if available, otherwise fallback to mock orders
  const activeOrdersList: Order[] = rawApiOrders.length > 0 ? mappedApiOrders : orders;

  const handleRefreshClick = () => {
    refetch();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleNavigateOrder = (order: Order) => {
    if (onSelectOrder) {
      onSelectOrder(order);
    }
    navigate({
      to: '/ordersDetails/$id',
      params: { id: order.id },
    } as any);
  };

  // Total pending COD calculation
  const totalPendingCod = activeOrdersList.reduce((sum, o) => {
    return o.paymentMethod === 'COD' && o.paymentStatus === 'PENDING'
      ? sum + o.totalCashToCollect
      : sum;
  }, 0);

  const filteredOrders = activeOrdersList.filter((o) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q) ||
      o.address.fullAddress.toLowerCase().includes(q) ||
      o.address.sectorOrArea.toLowerCase().includes(q) ||
      o.itemsSummary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#fcf9f8] pb-28 pt-0 animate-in fade-in duration-200">
      {/* Green Shift Summary Card */}
      <ShiftSummaryCard
        ordersCount={activeOrdersList.length}
        totalCodAmount={totalPendingCod}
        isLive={true}
        onViewRoute={() => {
          if (activeOrdersList.length > 0) {
            handleNavigateOrder(activeOrdersList[0]);
          }
        }}
      />

      {/* Priority Deliveries Header */}
      <div className="px-4 pt-1 mb-2 flex items-center gap-1.5  text-[13px] text-[#1b1c1c] tracking-wider uppercase">
        <span className="material-symbols-outlined text-[17px] text-[#1b6d24]">
          bolt
        </span>
        <span>PRIORITY DELIVERIES</span>
      </div>

      {/* Orders List */}
      <div className="px-4 space-y-2.5">
        {isLoading && activeOrdersList.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-[#e8ece7] animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-3" />
            <div className="h-10 bg-gray-100 rounded mb-2" />
            <div className="h-10 bg-gray-100 rounded" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl">done_all</span>
            </div>
            <h3 className="font-bold text-gray-800 text-base mb-1">
              No assigned orders right now!
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              All assigned orders completed or no new batches assigned to you.
            </p>
            <button
              type="button"
              onClick={handleRefreshClick}
              className="px-3 py-1.5 bg-[#1b5e20] text-white rounded-lg text-xs font-bold hover:bg-[#144818] active:scale-95"
            >
              Refresh Orders
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSelectOrder={handleNavigateOrder}
              onNavigateOrder={handleNavigateOrder}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveOrdersView;
