// in seconds
import { decodeBase64Url, encodeBase64Url } from '@/utils/encoding/base64';
import { nonce } from '@/utils/nonce';

const JWT_MAX_AGE = parseInt(process.env.JWT_MAX_AGE || '1800');

export type JwtHeader = {
  alg: 'HS256'
  typ: 'JWT'
}

export type JwtClaims = {
  iss?: string
  iat?: number
  exp?: number
  sub?: string
  aud?: string
  nonce?: string
}

export type Jwt<T> = {
  header: JwtHeader
  claims: JwtClaims & T
}

export type SignedJwt<T> = Jwt<T> & {
  signature: ArrayBuffer
}

const textEncoder = new TextEncoder();

export async function sign<T> ({ ...claims }: JwtClaims & T, secret: string): Promise<string> {
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  claims.exp = now + JWT_MAX_AGE;
  claims.iat = now;
  claims.nonce = nonce(8);

  const data = `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(JSON.stringify(claims))}`;
  const key = await crypto.subtle.importKey('raw', textEncoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(data));

  return toString({ header, claims, signature });
}

export async function verify<T> (jwt: string, secret: string): Promise<JwtClaims & T> {
  const { header, claims, signature } = await fromString(jwt);

  if (header.alg !== 'HS256') {
    throw new Error('Algorithm not supported');
  }

  if (header.typ !== 'JWT') {
    throw new Error('Invalid header');
  }

  const data = jwt.slice(0, jwt.lastIndexOf('.'));
  const key = await crypto.subtle.importKey('raw', textEncoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const verified = await crypto.subtle.verify({ name: 'HMAC', hash: 'SHA-256' }, key, signature, textEncoder.encode(data));
  if (!verified) {
    throw new Error('Invalid signature');
  }

  if (claims.exp) {
    if (claims.exp * 1000 < Date.now()) {
      throw new Error('Authorization expired');
    }
  }

  return claims as JwtClaims & T;
}

async function fromString<T> (jwt: string): Promise<SignedJwt<T>> {
  const [headerStr, claimsStr, signature] = jwt.split('.');

  return {
    header: JSON.parse(decodeBase64Url(headerStr)),
    claims: JSON.parse(decodeBase64Url(claimsStr)),
    signature: dataStringToUint8Array(decodeBase64Url(signature)),
  };
}

function dataStringToUint8Array (data: string) {
  const arr = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    arr[i] = data.charCodeAt(i);
  }
  return arr;
}

function toString ({ header, claims, signature }: SignedJwt<any>): string {
  return `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(JSON.stringify(claims))}.${encodeBase64Url(String.fromCharCode(...new Uint8Array(signature)))}`;
}
