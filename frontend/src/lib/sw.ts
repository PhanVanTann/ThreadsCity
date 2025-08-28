export type WSOptions = {
  roomId: string;
  userId: string;
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
};
export type NotificationWSOptions = {
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
};

export function connectChatWS({
  roomId,
  userId,
  onMessage,
  onOpen,
  onClose,
  onError,
}: WSOptions) {
  const url =
    (location.protocol === "https:" ? "wss://" : "ws://") +
    `localhost:8000/ws/chat/${roomId}/`;

  let ws = new WebSocket(url);

  ws.onopen = () => {
    onOpen?.();
    // (tuỳ chọn) gửi ping/hello
    // ws.send(JSON.stringify({ type: "hello", userId }));
  };

  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      onMessage(data);
    } catch {}
  };

  ws.onclose = (ev) => onClose?.(ev);
  ws.onerror = (ev) => onError?.(ev);

  return {
    send: (payload: { send_id: string; receiver_id: string; text?: string; media?: any }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      }
    },
    close: () => ws.close(),
    raw: ws,
  };
}

export function connectNotificationWS({
  onMessage,
  onOpen,
  onClose,
  onError,
}: NotificationWSOptions) {
  const url =
    (location.protocol === "https:" ? "wss://" : "ws://") +
    `localhost:8000/ws/notifications/`;

  let ws = new WebSocket(url);
  console.log(ws)

  ws.onopen = () => {
    onOpen?.();

  };

  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      onMessage(data);
    } catch {}
  };

  ws.onclose = (ev) => onClose?.(ev);
  ws.onerror = (ev) => onError?.(ev);

  return {
    close: () => ws.close(),
    raw: ws,
  };
}