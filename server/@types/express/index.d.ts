export default {}

export declare global {
  namespace Express {
    interface Request {
      verified?: boolean
    }
  }
}
