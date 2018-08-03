// server-response-classes.ts - Declaration of responses from the server

export class LoginResponse {
  level: number;
  jwtToken: string;
  expiresAt: number;
};
