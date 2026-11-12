# New-order alarm push: backend contract

The delivery-boy Android app rings a loud, repeating alarm when an order is
assigned, even when the app is closed. The phone does this only when it
receives a Firebase Cloud Messaging (FCM) push. The backend needs to do
two things:

1. Store each delivery boy's device token (2 endpoints).
2. Send an FCM **data-only** message when an order's status becomes `ASSIGNED`.

## 1. Device token endpoints

Both endpoints are authenticated with the delivery boy's normal `Bearer` JWT.
They are called by `src/lib/pushNotifications/orderAlarmPush.ts`.

### `POST /api/v1/delivery/device-token`

Called after login, and again whenever FCM rotates the token.

```json
{ "token": "<fcm registration token>", "platform": "android", "language": "mr" }
```

- `language` is the rider's app language: `en`, `mr` (Marathi) or `hi`
  (Hindi). The app calls this endpoint again whenever the rider changes
  language. Use it to write `title` and `body` of the push in that language.
- Upsert by `token`, linked to the logged-in delivery user.
  One user can have several tokens (several phones).
- If the same token is already stored for another user, move it to this user
  (the phone changed hands or a different account logged in).
- Response: `200`/`201`. The body is ignored.

### `DELETE /api/v1/delivery/device-token`

Called on logout.

```json
{ "token": "<fcm registration token>" }
```

Delete that token. Response: `200`/`204`.

## 2. Send the push when an order is assigned

Wherever an order is assigned to a delivery boy (status → `ASSIGNED`), send
to **every** token of that delivery user.

**It must be a data-only message** (no `notification` block) with
`priority: "high"`. A `notification` block makes Android show its own normal
notification and skips the app's alarm code when the app is closed.

All `data` values must be strings.

| key       | required | value                                         |
|-----------|----------|-----------------------------------------------|
| `type`    | yes      | exactly `ORDER_ASSIGNED`                      |
| `orderId` | yes      | order id (same id used in `/delivery/orders/:id`) |
| `title`   | no       | e.g. `New order assigned`                     |
| `body`    | no       | e.g. `#ASM-1A2B · 3 items · ₹450 COD`          |

### Example (Node, `firebase-admin`)

```js
import admin from 'firebase-admin';

await admin.messaging().sendEachForMulticast({
  tokens,                       // all tokens of the assigned delivery user
  data: {
    type: 'ORDER_ASSIGNED',
    orderId: String(order.id),
    title: 'New order assigned',
    body: `Order ${order.orderNo} · ₹${order.grandTotal}`,
  },
  android: {
    priority: 'high',
    ttl: 10 * 60 * 1000,        // drop if phone is offline for >10 min
  },
});
```

Clean up tokens that FCM reports as
`messaging/registration-token-not-registered` or
`messaging/invalid-registration-token` in the response.

## Firebase project setup (one time)

1. Create a Firebase project (or reuse an existing one).
2. Add an Android app with package name **`com.farmerpro.deliveryboy`**.
3. Download `google-services.json` and put it at
   `android/app/google-services.json` in the delivery-boy app repo.
   It is git-ignored.
4. Backend: create a service account key (Project settings → Service
   accounts) and initialise `firebase-admin` with it.

## Testing

Send the example message above with a real token (it appears in the app's
`POST /delivery/device-token` request). Kill the app and lock the phone. It
should ring for up to 2 minutes or until the notification is tapped, and
tapping it opens that order.
