import { timingSafeEqual } from 'node:crypto';

const readToken = request => String(request.headers.authorization || '')
  .replace(/^Bearer\s+/i, '')
  .trim();

export function adminIsAuthorized(request) {
  const expected = String(process.env.ADMIN_DASHBOARD_TOKEN || '');
  const received = readToken(request);
  if (!expected || !received) return false;
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(received, 'utf8');
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function adminDashboardIsConfigured() {
  return Boolean(process.env.ADMIN_DASHBOARD_TOKEN);
}
