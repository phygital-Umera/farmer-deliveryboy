package com.farmerpro.deliveryboy;

import androidx.annotation.NonNull;
import com.capacitorjs.plugins.pushnotifications.MessagingService;
import com.google.firebase.messaging.RemoteMessage;
import java.util.Map;

/**
 * Replaces the Capacitor push plugin's service (see AndroidManifest.xml) so we
 * can ring an alarm for "ORDER_ASSIGNED" data messages even when the app is
 * closed. Everything is still forwarded to the plugin so JS listeners work.
 */
public class OrderAlarmMessagingService extends MessagingService {

    public static final String TYPE_ORDER_ASSIGNED = "ORDER_ASSIGNED";

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        Map<String, String> data = remoteMessage.getData();
        if (TYPE_ORDER_ASSIGNED.equals(data.get("type"))) {
            OrderAlarm.show(getApplicationContext(), remoteMessage.getMessageId(), data);
        }
        super.onMessageReceived(remoteMessage);
    }
}
