import * as crypto from 'crypto';


export function signRequest(params: {
    secret: string;
    method: string; // UPPERCASE
    endpoint: string; // endpoint to get or post transactions provided by yaya wallet
    body?: unknown; // object for POST, undefined/empty for GET
    timestamp: string; // ms since epoch (string)
    }) {
    const { secret, method, endpoint, body, timestamp } = params;
    const bodyString = body ? JSON.stringify(body) : '';
    const prehash = `${timestamp}${method}${endpoint}${bodyString}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(prehash); // keyed hash with SHA 256
    const signature = hmac.digest('base64'); // base64 encoded signature
    return signature;
}