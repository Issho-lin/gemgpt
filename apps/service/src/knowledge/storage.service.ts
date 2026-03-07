import { BadRequestException, Injectable } from '@nestjs/common';
import { createHmac, randomUUID } from 'node:crypto';

type GetPresignedUploadUrlParams = {
  userId: string;
  knowledgeBaseId: string;
  filename: string;
  contentType?: string;
};

@Injectable()
export class StorageService {
  async getPresignedUploadUrl(params: GetPresignedUploadUrlParams) {
    const endpoint = process.env.MINIO_ENDPOINT;
    const accessKey = process.env.MINIO_ACCESS_KEY;
    const secretKey = process.env.MINIO_SECRET_KEY;
    const region = process.env.MINIO_REGION || 'us-east-1';
    const bucket = process.env.MINIO_BUCKET || 'gemgpt';
    const maxSize = Number(process.env.MINIO_MAX_FILE_SIZE || 100 * 1024 * 1024);

    if (!endpoint || !accessKey || !secretKey) {
      throw new BadRequestException(
        'MinIO config is missing: MINIO_ENDPOINT/MINIO_ACCESS_KEY/MINIO_SECRET_KEY',
      );
    }

    const objectName = params.filename?.trim();
    if (!objectName) {
      throw new BadRequestException('filename is required');
    }

    const contentType = params.contentType?.trim() || 'application/octet-stream';

    const cleanedEndpoint = endpoint.replace(/\/$/, '');
    const now = new Date();

    const y = now.getUTCFullYear();
    const m = `${now.getUTCMonth() + 1}`.padStart(2, '0');
    const d = `${now.getUTCDate()}`.padStart(2, '0');
    const hh = `${now.getUTCHours()}`.padStart(2, '0');
    const mm = `${now.getUTCMinutes()}`.padStart(2, '0');
    const ss = `${now.getUTCSeconds()}`.padStart(2, '0');

    const dateStamp = `${y}${m}${d}`;
    const amzDate = `${dateStamp}T${hh}${mm}${ss}Z`;

    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
    const expiration = expiresAt.toISOString();

    const shortId = randomUUID().split('-')[0];

    const lastDotIndex = objectName.lastIndexOf('.');
    const baseName = lastDotIndex !== -1 ? objectName.substring(0, lastDotIndex) : objectName;
    const extension = lastDotIndex !== -1 ? objectName.substring(lastDotIndex) : '';

    const key = `knowledge/${params.knowledgeBaseId}/${baseName}_${shortId}${extension}`;

    const algorithm = 'AWS4-HMAC-SHA256';
    const credential = `${accessKey}/${dateStamp}/${region}/s3/aws4_request`;

    const policyObject = {
      expiration,
      conditions: [
        { bucket },
        ['eq', '$key', key],
        ['eq', '$Content-Type', contentType],
        { 'x-amz-algorithm': algorithm },
        { 'x-amz-credential': credential },
        { 'x-amz-date': amzDate },
        ['content-length-range', 1, maxSize],
      ],
    };

    const policy = Buffer.from(JSON.stringify(policyObject)).toString('base64');

    const sign = (k: Buffer | string, v: string) => createHmac('sha256', k).update(v).digest();
    const kDate = sign(`AWS4${secretKey}`, dateStamp);
    const kRegion = sign(kDate, region);
    const kService = sign(kRegion, 's3');
    const kSigning = sign(kService, 'aws4_request');
    const signature = createHmac('sha256', kSigning).update(policy).digest('hex');

    return {
      url: cleanedEndpoint,
      fields: {
        key,
        bucket,
        'Content-Type': contentType,
        Policy: policy,
        'X-Amz-Algorithm': algorithm,
        'X-Amz-Credential': credential,
        'X-Amz-Date': amzDate,
        'X-Amz-Signature': signature,
      },
      maxSize,
    };
  }
}
