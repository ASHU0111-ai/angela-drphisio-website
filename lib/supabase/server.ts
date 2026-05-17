import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL environment variable')
  }

  return connectionString
}

function getPool() {
  if (!global.__pgPool) {
    global.__pgPool = new Pool({ connectionString: getConnectionString() })
  }
  return global.__pgPool
}

export async function createClient() {
  return getPool()
}

export async function query(text: string, values: any[] = []) {
  return getPool().query(text, values)
}
