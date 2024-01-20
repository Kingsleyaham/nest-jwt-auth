import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPUblic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
