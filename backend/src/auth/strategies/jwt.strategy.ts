import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { authCookieNames } from '../constants';

const cookieExtractor = (request?: Request): string | null => {
  if (!request?.cookies) {
    return null;
  }

  return request.cookies[authCookieNames.accessToken] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') ??
        'local-access-secret-change-me',
    });
  }

  validate(payload: { sub: string; email: string; name: string }) {
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
