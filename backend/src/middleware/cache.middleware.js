import { getCached, setCached } from '../cache/cache.js';

export default function cacheMiddleware(keyGenerator) {
  return async (req, res, next) => {
    try {
      const key = typeof keyGenerator === 'function' ? keyGenerator(req) : keyGenerator || req.originalUrl;
      const refreshRequested = req.query?.refresh === 'true' || req.query?.bustCache === 'true' || req.query?.noCache === 'true';
      if (!refreshRequested) {
        const cached = getCached(key);
        if (cached) {
          return res.json(cached);
        }
      }
      // override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        try { setCached(key, body); } catch (e) { /* ignore cache errors */ }
        return originalJson(body);
      };
      next();
    } catch (err) {
      next(err);
    }
  };
}
