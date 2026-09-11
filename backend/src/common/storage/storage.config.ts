import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageConfig {
  public readonly region: string;
  public readonly endpoint: string;
  public readonly bucketName: string;
  public readonly credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.endpoint = this.configService.getOrThrow<string>('AWS_S3_ENDPOINT');
    this.bucketName = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

    this.credentials = {
      accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
    };
  }

  get minioClientConfig() {
    return {
      region: this.region,
      endpoint: this.endpoint,
      credentials: this.credentials,
      forcePathStyle: true, // Necessário para MinIO
    };
  }
}
