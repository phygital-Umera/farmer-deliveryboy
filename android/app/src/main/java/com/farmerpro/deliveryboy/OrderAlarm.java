package com.farmerpro.deliveryboy;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import java.util.Map;

/**
 * Shows a loud, repeating "new order assigned" alarm notification.
 * Works when the app is in the background or fully closed, because it is
 * triggered from the FCM messaging service, not from the WebView.
 */
public final class OrderAlarm {

    // Changing sound/importance of an existing channel is ignored by Android,
    // so bump this id if the channel settings ever change.
    public static final String CHANNEL_ID = "order_alarm_v1";

    // Stop ringing after this long even if nobody taps it.
    private static final long RING_TIMEOUT_MS = 2 * 60 * 1000L;

    private OrderAlarm() {}

    public static Uri soundUri(Context ctx) {
        return Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + ctx.getPackageName() + "/" + R.raw.order_alarm);
    }

    public static void ensureChannel(Context ctx) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = ctx.getSystemService(NotificationManager.class);
        if (nm == null || nm.getNotificationChannel(CHANNEL_ID) != null) return;

        NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "New order alarm", NotificationManager.IMPORTANCE_HIGH);
        channel.setDescription("Rings when a new order is assigned to you");
        AudioAttributes attrs = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build();
        channel.setSound(soundUri(ctx), attrs);
        channel.enableVibration(true);
        channel.setVibrationPattern(new long[] { 0, 800, 400, 800, 400, 800 });
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        channel.setBypassDnd(true); // only honoured if the user allows it
        nm.createNotificationChannel(channel);
    }

    public static void show(Context ctx, String messageId, Map<String, String> data) {
        ensureChannel(ctx);

        String orderId = data.get("orderId");
        String title = data.containsKey("title") ? data.get("title") : "New order assigned";
        String body = data.containsKey("body") ? data.get("body") : "Tap to view the order";

        // Extras mirror an FCM tap so the Capacitor plugin fires
        // "pushNotificationActionPerformed" in JS with the same data.
        Intent intent = new Intent(ctx, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra("google.message_id", messageId != null ? messageId : String.valueOf(System.currentTimeMillis()));
        for (Map.Entry<String, String> e : data.entrySet()) {
            intent.putExtra(e.getKey(), e.getValue());
        }

        int notificationId = orderId != null ? orderId.hashCode() : (int) System.currentTimeMillis();
        PendingIntent pi = PendingIntent.getActivity(
            ctx,
            notificationId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder b = new NotificationCompat.Builder(ctx, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setSound(soundUri(ctx)) // pre-Android 8
            .setVibrate(new long[] { 0, 800, 400, 800, 400, 800 })
            .setAutoCancel(true)
            .setTimeoutAfter(RING_TIMEOUT_MS)
            .setContentIntent(pi)
            .setFullScreenIntent(pi, true);

        Notification n = b.build();
        n.flags |= Notification.FLAG_INSISTENT; // keep repeating the sound until tapped/dismissed

        try {
            NotificationManagerCompat.from(ctx).notify(notificationId, n);
        } catch (SecurityException ignored) {
            // POST_NOTIFICATIONS not granted (Android 13+)
        }
    }
}
