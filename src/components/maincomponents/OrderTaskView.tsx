import React, {useState} from 'react';
import {useParams, useNavigate} from '@tanstack/react-router';
import {
  useDeliverd,
  useGetDeliveryById,
  usePickupItems,
} from '@/lib/api and mutation/deliveryOrders/useDelivery';
import {useDeliveryTab} from '@/context/DeliveryTabContext';
import {useT} from '@/i18n/LanguageContext';
import {TranslationKey} from '@/i18n/translations';
import {
  TaskStatusHeader,
  TaskCustomerCard,
  TaskChecklistCard,
  TaskPaymentCard,
  TaskActionButtons,
  TaskIssueModal,
  TaskToast,
  TaskLoadingView,
  TaskErrorView,
} from './orderTask';

export const OrderTaskView: React.FC<any> = () => {
  const navigate = useNavigate();
  const t = useT();
  const params = useParams({strict: false});
  const id = (params as any)?.id;
  const {setActiveTab} = useDeliveryTab();

  const handleGoBack = () => {
    setActiveTab('active');
    navigate({to: '/homepage'});
  };

  // Direct API call using order ID from URL params (only if id is truthy)
  const {
    data: orderDetails,
    isLoading,
    isError,
  } = useGetDeliveryById(id as string);
  const {mutate: pickupOrder} = usePickupItems();
  const {mutate: submitDelivery} = useDeliverd();

  // States
  const [showQr, setShowQr] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssueReason, setSelectedIssueReason] =
    useState<TranslationKey>('issue.doorLocked');
  const [verifiedItemIds, setVerifiedItemIds] = useState<
    Record<string, boolean>
  >({});
  const [isDelivering, setIsDelivering] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);

  // If no ID param, show not found state immediately
  if (!id) {
    return <TaskErrorView onBack={handleGoBack} />;
  }

  // Extract raw order object from API response
  const rawData: any = orderDetails?.data || orderDetails;
  const order: any = Array.isArray(rawData) ? rawData[0] : rawData;

  // Loading State
  if (isLoading) {
    return <TaskLoadingView />;
  }

  // Error / Not Found State
  if (isError || !order || !order.id) {
    return (
      <TaskErrorView
        message={t('task.fetchFail', {id: id || 'unknown'})}
        onBack={handleGoBack}
      />
    );
  }

  // Data extraction directly from API response
  const orderNo = order.orderNo
    ? `#${order.orderNo.slice(0, 8).toUpperCase()}`
    : `#${order.id.slice(0, 8).toUpperCase()}`;

  const customerName = order.customer?.user?.fullname || 'Customer';
  const customerPhone =
    order.customer?.user?.phoneNumber || order.address?.contactNo || '';
  const streetAddress = order.address?.address || 'Address';
  const landmark = order.address?.landmark || '';
  const pincode = order.address?.pincode || '';
  const status = order.status || 'ASSIGNED';
  const grandTotal = Number(order.grandTotal ?? order.subtotal ?? 0);
  const items: any[] = order.items || [];

  const handleToggleVerified = (itemId: string) => {
    setVerifiedItemIds((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
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
        ? t('task.deliveredUpi', {amount: grandTotal})
        : t('task.deliveredCash', {amount: grandTotal}),
    );
    setShowToast(true);

    setTimeout(() => {
      setIsDelivering(false);
      handleGoBack();
    }, 1500);
  };

  const handleIssueSubmit = () => {
    setShowIssueModal(false);
    setToastMessage(t('task.issueReported', {reason: t(selectedIssueReason)}));
    setShowToast(true);
    setTimeout(() => handleGoBack(), 1200);
  };

  return (
    <div className="animate-in fade-in mx-auto flex w-full max-w-md flex-col bg-[#fcf9f8] pb-28 duration-200">
      {/* Toast Alert */}
      {showToast && (
        <TaskToast message={toastMessage} onClose={() => setShowToast(false)} />
      )}

      {/* Top Header with Back Navigation */}
      <TaskStatusHeader onBack={handleGoBack} status={status} />

      <div className="mt-3 space-y-3 px-4">
        {/* Customer & Delivery Address Card */}
        <TaskCustomerCard
          customerName={customerName}
          customerPhone={customerPhone}
          streetAddress={streetAddress}
          landmark={landmark}
          pincode={pincode}
          copiedPhone={copiedPhone}
          onCopyPhone={handleCopyPhone}
        />

        {/* Produce & Bag Checklist Card (Only shown before OUT_FOR_DELIVERY / DELIVERED) */}
        {status?.toUpperCase() !== 'OUT_FOR_DELIVERY' &&
          status?.toUpperCase() !== 'DELIVERED' && (
            <TaskChecklistCard
              items={items}
              verifiedItemIds={verifiedItemIds}
              onToggleVerified={handleToggleVerified}
              onPickup={() => pickupOrder(id || '')}
            />
          )}

        {/* Bill & Cash Collection Card */}
        <TaskPaymentCard
          grandTotal={grandTotal}
          showQr={showQr}
          onDeliverUpi={() => handleDeliver(true)}
        />

        {/* Primary Delivery Action Button & Report Issue */}
        <TaskActionButtons
          status={order.status}
          isDelivering={isDelivering}
          grandTotal={grandTotal}
          onSubmitDelivery={() => submitDelivery(order.id)}
          onOpenIssueModal={() => setShowIssueModal(true)}
        />
      </div>

      {/* Delivery Issue Modal */}
      <TaskIssueModal
        isOpen={showIssueModal}
        orderNo={orderNo}
        selectedReason={selectedIssueReason}
        onSelectReason={setSelectedIssueReason}
        onClose={() => setShowIssueModal(false)}
        onSubmit={handleIssueSubmit}
      />
    </div>
  );
};

export default OrderTaskView;
