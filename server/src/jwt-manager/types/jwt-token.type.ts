import { TokenPayload } from './token-payload.type';

export type JwtToken = TokenPayload & { iat: number; exp: number };
