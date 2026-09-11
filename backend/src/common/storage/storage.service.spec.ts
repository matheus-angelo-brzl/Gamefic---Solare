import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { createConfigServiceMock } from '@test/factories/config.factory';
import { HeadBucketCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageConfig } from './storage.config';
import { S3Client } from '@aws-sdk/client-s3';
import { StorageService } from './storage.service';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

describe('StorageService', () => {
  let storageConfig: DeepMockProxy<StorageConfig>;
  let s3ClientMock: DeepMockProxy<S3Client>;
  let service: StorageService;

  const mockConfigService = createConfigServiceMock();

  beforeEach(() => {
    s3ClientMock = mockDeep<S3Client>();
    (S3Client as jest.Mock).mockReturnValue(s3ClientMock);

    storageConfig = new StorageConfig(mockConfigService);
    service = new StorageService(storageConfig);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should create bucket if it does not exist', async () => {
      s3ClientMock.send.mockRejectedValueOnce(new Error('NotFound') as never);
      s3ClientMock.send.mockResolvedValueOnce({} as never);

      await service.onModuleInit();

      expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(HeadBucketCommand));
      expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(CreateBucketCommand));
    });

    it('should not create bucket if it already exists', async () => {
      s3ClientMock.send.mockResolvedValue({} as never);

      await service.onModuleInit();

      expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(HeadBucketCommand));
      expect(s3ClientMock.send).not.toHaveBeenCalledWith(expect.any(CreateBucketCommand));
    });
  });

  describe('saveFile', () => {
    it('should upload a file and return its key and signed URL', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test content'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const mockSignedUrl = 'http://signed-url.com';
      (getSignedUrl as jest.Mock).mockResolvedValue(mockSignedUrl);
      s3ClientMock.send.mockResolvedValue({} as never);

      const result = await service.saveFile(mockFile, 'test-bucket');

      expect(result).toEqual({
        key: expect.stringMatching(/^test-bucket\/.*\.jpg$/) as string,
        url: mockSignedUrl,
      });

      expect(s3ClientMock.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(getSignedUrl).toHaveBeenCalledWith(
        s3ClientMock,
        expect.any(GetObjectCommand),
        { expiresIn: 3600 },
      );
    });
  });

  describe('getSignedUrl', () => {
    it('should return a signed URL for a given key', async () => {
      const mockKey = 'test-key.jpg';
      const mockSignedUrl = 'http://signed-url.com';
      (getSignedUrl as jest.Mock).mockResolvedValue(mockSignedUrl);

      const result = await service.getSignedUrl(mockKey);

      expect(result).toBe(mockSignedUrl);
      expect(getSignedUrl).toHaveBeenCalledWith(
        s3ClientMock,
        expect.any(GetObjectCommand),
        { expiresIn: 3600 },
      );
    });
  });
});
