import 'dotenv/config'

const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  maxSockets: 100

  maxFreeSockets: 10

  freeSocketTimeout: 30000
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

export default {
  https: production,
  staticResourceCacheDuration: 20,
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
}
