import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {useAuthContext} from './AuthContext';

interface WebSocketContextType {
  livePrices: Record<string, any>;
  isConnected: boolean;
  subscribeToInstrument: (instrumentToken: string) => void;
  unsubscribeFromInstrument: (instrumentToken: string) => void;
  getPrice: (instrumentToken: string) => any;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [livePrices, setLivePrices] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [subscribedInstruments, setSubscribedInstruments] = useState<
    Set<string>
  >(new Set());
  const {user} = useAuthContext();
  const userId = user?.id;

  // Function to send subscription updates to server
  const updateSubscriptions = () => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      subscribedInstruments.size > 0
    ) {
      const subscribeMessage = {
        type: 'SUBSCRIBE',
        instruments: Array.from(subscribedInstruments),
      };
      socket.send(JSON.stringify(subscribeMessage));
    }
  };

  // Subscribe to an instrument
  const subscribeToInstrument = useCallback((instrumentToken: string) => {
    setSubscribedInstruments((prev) => {
      if (prev.has(instrumentToken)) return prev;
      const newSet = new Set(prev);
      newSet.add(instrumentToken);
      return newSet;
    });
  }, []);

  // Unsubscribe from an instrument
  const unsubscribeFromInstrument = useCallback((instrumentToken: string) => {
    setSubscribedInstruments((prev) => {
      if (!prev.has(instrumentToken)) return prev;
      const newSet = new Set(prev);
      newSet.delete(instrumentToken);
      return newSet;
    });
  }, []);

  // Get price for an instrument
  const getPrice = useCallback(
    (instrumentToken: string) => {
      return livePrices[instrumentToken];
    },
    [livePrices],
  );

  // Send subscriptions when socket connects or subscriptions change
  useEffect(() => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      subscribedInstruments.size > 0
    ) {
      updateSubscriptions();
    }
  }, [subscribedInstruments, socket]);

  // WebSocket connection management
  useEffect(() => {
    if (!userId) return;

    let reconnectTimeout: any;
    let currentSocket: WebSocket | null = null;

    const connect = () => {
      const ws = new WebSocket(
        `${import.meta.env.VITE_WS_SERVER_URL}?userId=${userId}`,
      );

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setSocket(ws);
        currentSocket = ws;

        // Send initial subscriptions if any
        if (subscribedInstruments.size > 0) {
          const subscribeMessage = {
            type: 'SUBSCRIBE',
            instruments: Array.from(subscribedInstruments),
          };
          ws.send(JSON.stringify(subscribeMessage));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (
            data.type === 'LIVE_TICKS' &&
            data.data &&
            Array.isArray(data.data)
          ) {
            const priceMap: Record<string, any> = {};
            data.data.forEach((tick: any) => {
              if (tick.instrument_token) {
                priceMap[tick.instrument_token] = tick;
              }
            });
            setLivePrices((prev) => ({...prev, ...priceMap}));
          }
        } catch (err) {
          console.error('❌ WebSocket parse error:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('❌ WebSocket error:', err);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('⚠️ WebSocket disconnected. Reconnecting...');
        setIsConnected(false);
        setSocket(null);
        currentSocket = null;

        // Auto reconnect after 3 seconds
        reconnectTimeout = setTimeout(() => {
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
        currentSocket.close();
      }
    };
  }, [userId]);

  return (
    <WebSocketContext.Provider
      value={useMemo(
        () => ({
          livePrices,
          isConnected,
          subscribeToInstrument,
          unsubscribeFromInstrument,
          getPrice,
        }),
        [livePrices, isConnected, subscribeToInstrument, unsubscribeFromInstrument, getPrice],
      )}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
