import { applyDecorators, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

// Decorator personalizado para simplificar o upload de arquivos via Multer.
// Encapsula o FileInterceptor e permite passar configurações opcionais do Multer.

const defaultOptions: MulterOptions = {
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por arquivo
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não permitido');
    }

    callback(null, true);
  },
};

export function Upload(fieldName = 'file', options = defaultOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)));
}

// Alias para o decorator UploadedFile do NestJS.
// Utilizado para recuperar o arquivo processado pelo Multer no controller.
export const File = UploadedFile;
