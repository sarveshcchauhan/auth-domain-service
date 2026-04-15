import { v4 as uuid } from "uuid";

export const createContext = (userId?: string) => ({
  traceId: uuid(),
  correlationId: uuid(),
  userId
});