'use server';

export async function uploadAction (formData: FormData) {
  const res = await fetch('/api/layout/import', {
    method: 'post',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await res.json());
  }
}