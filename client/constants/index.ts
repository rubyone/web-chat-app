// API_URL is the URL of the API server. It is used by the client to make requests to the server.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'
// WEBSOCKET_URL is the URL of the websocket server. It is used by the client to connect to the websocket server.
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://127.0.0.1:8080'