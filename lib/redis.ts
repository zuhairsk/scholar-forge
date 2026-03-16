import Redis from 'ioredis'

type MaybeString = string | null

export interface RedisLike {
  get(key: string): Promise<MaybeString>
  set(key: string, value: string, mode?: string, durationSeconds?: number): Promise<'OK' | null>
  del(key: string): Promise<number>
  incr(key: string): Promise<number>
}

class MockRedis implements RedisLike {
  private store = new Map<string, { value: string; expiresAt?: number }>()

  private prune(key: string) {
    const item = this.store.get(key)
    if (!item) return
    if (item.expiresAt && Date.now() > item.expiresAt) this.store.delete(key)
  }

  async get(key: string) {
    this.prune(key)
    return this.store.get(key)?.value ?? null
  }

  async set(key: string, value: string, mode?: string, durationSeconds?: number) {
    let expiresAt: number | undefined
    if (mode?.toUpperCase() === 'EX' && typeof durationSeconds === 'number') {
      expiresAt = Date.now() + durationSeconds * 1000
    }
    this.store.set(key, { value, expiresAt })
    return 'OK' as const
  }

  async del(key: string) {
    const existed = this.store.delete(key)
    return existed ? 1 : 0
  }

  async incr(key: string) {
    this.prune(key)
    const cur = Number(this.store.get(key)?.value ?? '0')
    const next = (Number.isFinite(cur) ? cur : 0) + 1
    this.store.set(key, { value: String(next) })
    return next
  }
}

let warned = false
export let isMockRedis = false

function warnMock() {
  if (warned) return
  warned = true
  console.warn('Redis not configured, using in-memory fallback')
}

function createRedis(): RedisLike {
  const url = process.env.REDIS_URL
  if (!url) {
    isMockRedis = true
    warnMock()
    return new MockRedis()
  }

  try {
    const client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
    })

    client.connect().catch((err) => {
      console.warn('Redis connection failed, using in-memory fallback:', err?.message ?? err)
      isMockRedis = true
    })

    // If it errors later, we still keep the process up; queues will fall back.
    client.on('error', (err) => {
      console.warn('Redis error:', err?.message ?? err)
    })

    return client as unknown as RedisLike
  } catch (e) {
    console.warn('Redis init failed, using in-memory fallback:', e)
    isMockRedis = true
    warnMock()
    return new MockRedis()
  }
}

const globalForRedis = globalThis as unknown as { redis?: RedisLike }
export const redis: RedisLike = globalForRedis.redis ?? createRedis()
if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

