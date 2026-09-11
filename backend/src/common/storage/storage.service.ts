import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageConfig } from './storage.config';
import { randomUUID } from 'node:crypto';

type FileUploadResponse = Promise<{ key: string; url: string }>;

// Gerencia o armazenamento de arquivos no MinIO/S3.
// Responsável por inicializar buckets e realizar o upload de anexos.

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;

  constructor(private readonly config: StorageConfig) {
    this.s3Client = new S3Client(this.config.minioClientConfig);
  }

  // Garante que o bucket de armazenamento exista na inicialização do módulo.
  async onModuleInit() {
    const headBucketCommand = new HeadBucketCommand({ Bucket: this.config.bucketName });

    try {
      await this.s3Client.send(headBucketCommand);
    } catch {
      await this.createBucketIfNotExists();
    }
  }

  // Cria o bucket caso ele ainda não tenha sido inicializado no MinIO.
  private async createBucketIfNotExists() {
    this.logger.log(`Bucket ${this.config.bucketName} não encontrado. Criando...`);
    await this.s3Client.send(new CreateBucketCommand({ Bucket: this.config.bucketName }));
    this.logger.log(`Bucket ${this.config.bucketName} criado com sucesso.`);
  }

  // Realiza o upload de um arquivo gerando um identificador único (UUID).
  async saveFile(file: Express.Multer.File, path: string): FileUploadResponse {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

    const fileExtension = file.originalname.split('.').pop();
    const key = `${path}/${randomUUID()}.${fileExtension}`;

    const saveCommand = new PutObjectCommand({
      Bucket: this.config.bucketName,
      ContentType: file.mimetype,
      Body: file.buffer,
      Key: key,
    });

    await this.s3Client.send(saveCommand);

    return { key, url: await this.getSignedUrl(key) };
  }

  // Gera uma URL temporária para acesso seguro ao arquivo armazenado.
  async getSignedUrl(key: string): Promise<string> {
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, getObjectCommand, { expiresIn: 3600 });
  }
}
