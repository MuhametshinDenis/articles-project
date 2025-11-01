import express from 'express';
import { JwtToken } from '../../jwt-manager/types/jwt-token.type';

export interface AuthenticatedRequest extends express.Request {
  user?: JwtToken;
}
