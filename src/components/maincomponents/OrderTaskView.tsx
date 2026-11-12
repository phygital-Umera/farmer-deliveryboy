import React, { useState } from 'react';
import { useDeliverd, useGetDeliveryById, usePickupItems } from '@/lib/api and mutation/deliveryOrders/useDelivery';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useDeliveryTab } from '@/context/DeliveryTabContext';
import { useT } from '@/i18n/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

const ISSUE_REASONS: TranslationKey[] = [
  'issue.doorLocked',
  'issue.refused',
  'issue.wrongAddress',
  'issue.quality',
  'issue.reschedule',
];

export const OrderTaskView: React.FC<any> = () => {
  const navigate = useNavigate();
  const t = useT();
  const params = useParams({ strict: false });
  const id = (params as any)?.id;
  const { setActiveTab } = useDeliveryTab();

  const handleGoBack = () => {
    setActiveTab('active');
    navigate({ to: '/homepage' });
  };

  // Direct API call using order ID from URL params (only if id is truthy)
  const { data: orderDetails, isLoading, isError, refetch } = useGetDeliveryById(id as string);
  const { mutate: pickupOrder, isPending: isPickingUp } = usePickupItems();
  const { mutate: submitDelivery } = useDeliverd();

  // States
  const [showQr, setShowQr] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssueReason, setSelectedIssueReason] = useState<TranslationKey>('issue.doorLocked');
  const [verifiedItemIds, setVerifiedItemIds] = useState<Record<string, boolean>>({});
  const [isDelivering, setIsDelivering] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);

  // If no ID param, show not found state immediately
  if (!id) {
    return (
      <div className="p-8 text-center max-w-md mx-auto pt-20">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-3xl">error_outline</span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">{t('task.notFound')}</h3>
        <p className="text-xs text-gray-500 mb-5">
          {t('task.noId')}
        </p>
        <button
          type="button"
          onClick={handleGoBack}
          className="px-4 py-2.5 bg-[#1b5e20] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#144818] active:scale-95"
        >
          {t('task.backToOrders')}
        </button>
      </div>
    );
  }

  // Extract raw order object from API response
  const rawData: any = orderDetails?.data || orderDetails;
  const order: any = Array.isArray(rawData) ? rawData[0] : rawData;

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#1b5e20] border-t-transparent" />
        <span className="text-sm font-semibold text-[#525e54]">{t('task.loading')}</span>
      </div>
    );
  }

  // Error / Not Found State
  if (isError || !order || !order.id) {
    return (
      <div className="p-8 text-center max-w-md mx-auto pt-20">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-3xl">error_outline</span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">{t('task.notFound')}</h3>
        <p className="text-xs text-gray-500 mb-5">
          {t('task.fetchFail', { id: id || 'unknown' })}
        </p>
        <button
          type="button"
          onClick={handleGoBack}
          className="px-4 py-2.5 bg-[#1b5e20] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#144818] active:scale-95"
        >
          {t('task.backToOrders')}
        </button>
      </div>
    );
  }

  // Data extraction directly from API response
  const orderNo = order.orderNo
    ? `#${order.orderNo.slice(0, 8).toUpperCase()}`
    : `#${order.id.slice(0, 8).toUpperCase()}`;

  const customerName = order.customer?.user?.fullname || 'Customer';
  const customerPhone = order.customer?.user?.phoneNumber || order.address?.contactNo || '';
  const streetAddress = order.address?.address || 'Address';
  const landmark = order.address?.landmark || '';
  const pincode = order.address?.pincode || '';
  const status = order.status || 'ASSIGNED';
  const grandTotal = Number(order.grandTotal ?? order.subtotal ?? 0);
  const subtotal = Number(order.subtotal ?? grandTotal);
  const tax = Number(order.totalTax ?? 0);
  const items: any[] = order.items || [];

  const handleToggleVerified = (itemId: string) => {
    setVerifiedItemIds((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleVerifyAll = () => {
    const all: Record<string, boolean> = {};
    items.forEach((it) => {
      all[it.id] = true;
    });
    setVerifiedItemIds(all);
  };

  const handleCopyPhone = () => {
    if (customerPhone) {
      navigator.clipboard.writeText(customerPhone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleDeliver = (viaUpi: boolean = false) => {
    setIsDelivering(true);
    setToastMessage(
      viaUpi
        ? t('task.deliveredUpi', { amount: grandTotal })
        : t('task.deliveredCash', { amount: grandTotal })
    );
    setShowToast(true);

    setTimeout(() => {
      setIsDelivering(false);
      handleGoBack();
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-28 bg-[#fcf9f8]  animate-in fade-in duration-200">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed inset-x-4 top-4 z-50 bg-[#1b6d24] text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[28px] text-[#acf4a4]">
            check_circle
          </span>
          <div className="flex-1 text-[13px] font-bold leading-tight">
            {toastMessage}
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Top Header with Back Navigation */}
      <div className="px-4 py-2.5 flex items-center border border-stroke justify-between bg-[#fcf9f8]/95  sticky top-0 z-30 shadow-2xs">
        <button
          type="button"
          onClick={handleGoBack}
          className="flex items-center gap-1 text-xs font-bold text-[#1b5e20] hover:text-[#144818] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>{t('task.back')}</span>
        </button>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#e8f5e9] text-[#1b5e20] border border-[#a0f399]">
          {t(`status.${String(status).toUpperCase()}`, undefined, status)}
        </span>
      </div>

      <div className="px-4 space-y-3 mt-3">
        {/* Order Identifier Banner */}
        {/* <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-[#e8ece7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-[#525e54]">Order No</div>
              <div className="font-extrabold text-[15px] text-[#1b1c1c] tracking-tight">
                {orderNo}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-[#525e54]">Status</div>
            <div className="text-[12px] font-bold text-[#1b5e20] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#1b5e20] animate-ping" />
              Assigned
            </div>
          </div>
        </div> */}

        {/* Merged Customer & Delivery Address Card (Matching Image 2) */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-[#e8ece7] flex flex-col gap-1">
          {/* Top Row: Customer Name on Left, Phone Number on Right */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-headline font-bold text-[17px] text-[#1b1c1c] tracking-tight truncate">
              {customerName}
            </h3>

            {customerPhone && (
              <button
                type="button"
                onClick={handleCopyPhone}
                className="flex items-center gap-1 text-[13px] font-semibold text-[#41493e] hover:text-[#1b6d24] transition-colors shrink-0 active:scale-95"
                title="Click to copy phone number"
              >
                <span>{customerPhone}</span>
                <span className="material-symbols-outlined text-[14px] text-[#717a6d]">
                  {copiedPhone ? 'check' : 'content_copy'}
                </span>
                {copiedPhone && (
                  <span className="text-[10px] text-green-700 font-bold ml-0.5">{t('task.copied')}</span>
                )}
              </button>
            )}
          </div>

          {/* Address Line */}
          <div className="text-[14px] text-[#525e54] leading-snug">
            {streetAddress}
            {pincode && <span className="text-[#717a6d]">, PIN: {pincode}</span>}
          </div>

          {/* Landmark with Green Flag Icon */}
          {landmark && (
            <div className="flex items-center gap-1.5 text-[13px] text-[#1b6d24] font-medium">
              <span className="material-symbols-outlined text-[17px] text-[#1b6d24] shrink-0">
                flag
              </span>
              <span>{landmark}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[#e0e6e0]/70 my-0.5" />

          {/* Action Buttons: Call Customer & Quick SMS */}
          {customerPhone && (
            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <a
                href={`tel:${customerPhone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#e8f5e9] text-[#1b5e20] hover:bg-[#d8eed9] rounded-xl font-bold text-[13px] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>{t('task.callCustomer')}</span>
              </a>

              <a
                href={`sms:${customerPhone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#f2f4f2] text-[#1b1c1c] hover:bg-[#e4e7e4] rounded-xl font-bold text-[13px] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">sms</span>
                <span>{t('task.sms')}</span>
              </a>
            </div>
          )}
        </div>

        {/* Produce & Bag Checklist Card (Only shown before OUT_FOR_DELIVERY) */}
        {status?.toUpperCase() !== 'OUT_FOR_DELIVERY' && status?.toUpperCase() !== 'DELIVERED' && (
          <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#1b6d24] text-[20px]">
                  inventory_2
                </span>
                <h2 className="text-[14px] text-[#1b1c1c] font-bold">
                  {t('task.checklist')}
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#1b6d24] font-semibold bg-[#e8f5e9] px-2.5 py-0.5 rounded-full">
                  {t('task.checked', { done: Object.values(verifiedItemIds).filter(Boolean).length, total: items.length })}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {items.map((item) => {
                const isChecked = !!verifiedItemIds[item.id];
                const qty = item.productQuantity || item.totalQuantity || item.productCount || 1;
                const name = item.productName || 'Fresh Produce';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleVerified(item.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                      isChecked
                        ? 'bg-[#f6fbf6] border-[#88d982]'
                        : 'bg-[#fcf9f8] border-[#e0e6e0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked
                            ? 'bg-[#1b5e20] border-[#1b5e20] text-white'
                            : 'border-[#717a6d] bg-white'
                        }`}
                      >
                        {isChecked && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                      </div>
                      <div className="font-semibold text-[13px] text-[#1b1c1c]">
                        {name}
                      </div>
                    </div>

                    <span className="text-[12px] font-bold text-[#1b1c1c] bg-white px-2.5 py-0.5 rounded-md border border-[#e0e6e0]">
                      {qty} kg
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Simple Green Pick Up Button */}
            <button
              type="button"
              onClick={() => pickupOrder(id || '')}
              className="w-full mt-3 py-2.5 px-4 bg-[#1b5e20] hover:bg-[#144818] active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>{t('task.pickUp', { done: Object.values(verifiedItemIds).filter(Boolean).length, total: items.length })}</span>
            </button>
          </div>
        )}

        {/* Bill & Cash Collection Card */}
        <div className="bg-gradient-to-r from-[#e8f5e9] to-[#f1f8e9] border border-[#c8e6c9] rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-[#1b5e20] flex items-center justify-center shadow-2xs">
                <span className="material-symbols-outlined text-[19px]">payments</span>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#1b5e20]">
                  {t('task.cod')}
                </div>
                <div className="text-[11px] font-semibold text-[#525e54]">
                  {t('task.collectFromCustomer')}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-[#525e54]">{t('task.grandTotal')}</div>
              <div className="font-black text-[24px] text-[#1b5e20] leading-none">
                ₹{grandTotal}
              </div>
            </div>
          </div>

          {/* Subtotal & Tax Breakdown */}
         
          {/* Expandable UPI QR toggle */}
       

          {showQr && (
            <div className="flex flex-col items-center p-3 bg-white rounded-xl space-y-2 border border-gray-200 animate-in fade-in">
              <div className="w-36 h-36 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                <svg className="w-full h-full text-gray-900" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M5 5h30v30H5V5zm6 6v18h18V11H11zm54-6h30v30H65V5zm6 6v18h18V11H71zM5 65h30v30H5V65zm6 6v18h18V71H11zm54 0h6v6h-6v-6zm12 0h6v6h-6v-6zm12 0h6v6h-6v-6zm-24 12h6v6h-6v-6zm12 0h12v6H77v-6zm-36-36h6v6h-6v-6zm12 0h6v6h-6v-6zm12 0h6v6h-6v-6zm-24 12h18v6H41v-6zm24 0h6v6h-6v-6zm-18 12h6v18h-6V65zm12 0h6v6h-6v-6zm6 6h6v6h-6v-6zm-6 6h18v6H59v-6z" />
                  <rect fill="currentColor" height="10" width="10" x="15" y="15" />
                  <rect fill="currentColor" height="10" width="10" x="75" y="15" />
                  <rect fill="currentColor" height="10" width="10" x="15" y="75" />
                </svg>
              </div>
              <div className="text-center text-xs font-bold text-[#1b1c1c]">
                {t('task.upiScan', { amount: grandTotal })}
              </div>
              <button
                type="button"
                onClick={() => handleDeliver(true)}
                className="w-full py-2 bg-[#1b5e20] text-white rounded-lg text-xs font-bold shadow-xs active:scale-95"
              >
                {t('task.paidUpi', { amount: grandTotal })}
              </button>
            </div>
          )}
        </div>

        {/* Primary Delivery Action Button */}
       {order.status !=='DELIVERED' && <div className="pt-2 space-y-2">
          <button
            type="button"
            disabled={isDelivering}
            onClick={() => {submitDelivery(order.id)}}
            className={`w-full py-3 px-4 bg-[#1b5e20] text-white rounded-xl font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-md hover:bg-[#144818] active:scale-[0.98] transition-all ${
              isDelivering ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
            <span>{t('task.markDelivered', { amount: grandTotal })}</span>
          </button>

          {/* Report Issue Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowIssueModal(true)}
              className="text-[#ba1a1a] text-xs font-bold flex items-center justify-center gap-1 mx-auto py-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">report_problem</span>
              <span>{t('task.reportIssueBtn')}</span>
            </button>
          </div>
        </div>}
      </div>

      {/* Delivery Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-8 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a] text-2xl">
                  report_problem
                </span>
                <h3 className="text-[17px] font-bold text-[#1b1c1c]">{t('task.reportIssue')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="w-8 h-8 rounded-full bg-[#f0eded] flex items-center justify-center hover:bg-[#eae7e7]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#525e54]">
              {t('task.selectIssue', { orderNo })}
            </p>

            <div className="space-y-2">
              {ISSUE_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedIssueReason(reason)}
                  className={`w-full text-left p-3 rounded-xl text-[13px] font-semibold transition-colors flex items-center justify-between ${
                    selectedIssueReason === reason
                      ? 'bg-[#ffdad6]/60 border border-[#ba1a1a] text-[#93000a]'
                      : 'bg-[#f6f3f2] text-[#1b1c1c] hover:bg-[#eeebe9]'
                  }`}
                >
                  <span>{t(reason)}</span>
                  {selectedIssueReason === reason && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowIssueModal(false);
                setToastMessage(t('task.issueReported', { reason: t(selectedIssueReason) }));
                setShowToast(true);
                setTimeout(() => handleGoBack(), 1200);
              }}
              className="w-full py-2.5 bg-[#ba1a1a] hover:bg-[#a01616] text-white rounded-xl text-[12px] font-bold active:scale-95 shadow-xs"
            >
              {t('task.submitSupport')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTaskView;
