import { SetMetadata } from '@nestjs/common';

// Define a constant key to avoid typos
export const IS_PUBLIC_KEY = 'isPublic';

// The decorator simply attaches { "isPublic": true } to whatever route it is placed on

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
