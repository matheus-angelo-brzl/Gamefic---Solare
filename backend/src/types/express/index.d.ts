import { JwtPayloadDto } from '@modules/auth/dtos/auth.dto';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayloadDto;
      file: Multer.File;
    }
  }
}
