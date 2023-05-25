'use server';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

export async function logout () {
  (cookies() as RequestCookies).delete('auth');
}