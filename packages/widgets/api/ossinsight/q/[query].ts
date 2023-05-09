import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function (req: VercelRequest, res: VercelResponse) {
  const { query, ...rest } = req.query;

  const uri = new URL(`https://api.ossinsight.io/q/${query}`);
  Object.entries(rest).forEach(([k, v]) => {
    if (typeof v === 'string') {
      uri.searchParams.append(k, v);
    } else {
      v.forEach(i => uri.searchParams.append(k, i));
    }
  });

  const response = await fetch(uri.toString())

  res.status(response.status).json(await response.json());
}
