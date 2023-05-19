import { NextRequest, NextResponse } from 'next/server';
import { merge } from '@/src/core/commands';
import kv from '@/app/api/kv';

export async function POST (req: NextRequest) {
  const commands = merge(await req.json());
  let success: boolean;
  try {
    const pipeline = kv.multi();

    for (let command of commands) {
      switch (command.type) {
        case 'update-library-item':
          pipeline.hset('library', { [command.id]: command.payload });
          break;
        case 'delete-library-item':
          pipeline.hdel('library', command.id);
          break;
        case 'update-dashboard-item':
          pipeline.hset(`dashboard:${command.dashboard}`, { [command.id]: command.payload });
          break;
        case 'delete-dashboard-item':
          pipeline.hdel(`dashboard:${command.dashboard}`, command.id);
          break;
      }
    }

    await pipeline.exec();
    success = true;
  } catch {
    success = false;
  }

  return NextResponse.json({ kv: success });
}
