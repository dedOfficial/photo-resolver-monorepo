import * as express from 'express';

declare global {
  namespace Express {
    export interface User {
        id: string;
    }
    export interface Request {
      user?: {
        id: string;
      };
    }
  }
}