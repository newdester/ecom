const windows = new Map();

const clientId = request => String(request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown').split(',')[0].trim();

/**
 * Proteção por instância: impede rajadas no mesmo processo sem armazenar dados pessoais.
 * Para limite distribuído entre regiões, configure também Rate Limiting no Firewall da Vercel.
 */
export function rateLimit(request, scope, { limit, windowMs }) {
  const now = Date.now();
  const key = `${scope}:${clientId(request)}`;
  const current = windows.get(key);
  if (!current || now >= current.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }
  current.count += 1;
  const remaining = Math.max(0, limit - current.count);
  return { allowed: current.count <= limit, remaining, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

export function sendRateHeaders(response, result) {
  response.setHeader('X-RateLimit-Remaining', String(result.remaining));
  if (!result.allowed) response.setHeader('Retry-After', String(result.retryAfter));
}
