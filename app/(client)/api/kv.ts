///
import { VercelKV } from '@vercel/kv';
import { isKvConfigured } from '@/src/utils/runtime';

let kv: VercelKV;

if (isKvConfigured) {
  kv = new VercelKV({
    url: process.env.OSSL_KV_REST_API_URL!,
    token: process.env.OSSL_KV_REST_API_TOKEN!,
  });
} else {
  kv = new Proxy({}, {
    get (target: {}, p: string | symbol, receiver: any): any {
      throw new Error('kv not configured');
    },
  }) as VercelKV;
}

/**
 * @deprecated
 */
export default kv;
