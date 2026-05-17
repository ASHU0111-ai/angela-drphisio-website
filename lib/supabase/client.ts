type SupabaseError = {
  message: string
}

type SupabaseResponse<T = any> = {
  data: T | null
  error: SupabaseError | null
}

class TableQuery {
  table: string
  params = new URLSearchParams()
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET'
  payload: any = null
  eqField: string | null = null
  eqValue: string | number | null = null

  constructor(table: string) {
    this.table = table
  }

  order(column: string, opts: { ascending: boolean }) {
    this.params.set('order', column)
    this.params.set('direction', opts.ascending ? 'asc' : 'desc')
    return this
  }

  limit(count: number) {
    this.params.set('limit', String(count))
    return this
  }

  insert(records: any[]) {
    this.method = 'POST'
    this.payload = Array.isArray(records) ? records[0] : records
    return this
  }

  update(values: object) {
    this.method = 'PATCH'
    this.payload = values
    return this
  }

  delete() {
    this.method = 'DELETE'
    return this
  }

  eq(field: string, value: string | number) {
    this.eqField = field
    this.eqValue = value

    if (this.method === 'DELETE') {
      return this.executeRequest()
    }

    return this
  }

  select(columns = '*') {
    // Keep the builder chain compatible with Supabase-style calls.
    // The request is executed only when the query is awaited or then() is called.
    this.params.set('select', columns)
    return this
  }

  private getUrl() {
    let path = `/api/${this.table}`
    if (this.eqField === 'id' && this.eqValue != null) {
      path += `/${encodeURIComponent(String(this.eqValue))}`
    }
    const queryString = this.params.toString()
    return queryString ? `${path}?${queryString}` : path
  }

  private async executeRequest(): Promise<SupabaseResponse<any>> {
    const url = this.getUrl()
    const options: RequestInit = {
      method: this.method,
      headers: {
        'content-type': 'application/json',
      },
    }

    if (this.method !== 'GET' && this.payload != null) {
      options.body = JSON.stringify(this.payload)
    }

    const response = await fetch(url, options)
    const json = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        data: null,
        error: {
          message:
            json?.error?.message || json?.error || response.statusText || 'Request failed',
        },
      }
    }

    return {
      data: json,
      error: null,
    }
  }

  then(onFulfilled: any, onRejected: any) {
    return this.executeRequest().then(onFulfilled, onRejected)
  }
}

export function createClient() {
  return {
    from(table: string) {
      return new TableQuery(table)
    },
  }
}
