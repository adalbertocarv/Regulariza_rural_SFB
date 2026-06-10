import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs';

const isS3Configured = !!(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_BUCKET_NAME
);

let s3Client: S3Client | null = null;
if (isS3Configured) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.AWS_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true, // CRÍTICO para funcionar com o MinIO local
  });
}

// Local fallback setup
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export interface UploadResult {
  url: string;
  filename: string;
}

export const StorageService = {
  upload: async (
    buffer: Buffer,
    originalName: string,
    mimetype: string
  ): Promise<UploadResult> => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(originalName);
    const filename = `${uniqueSuffix}${ext}`;

    if (isS3Configured && s3Client) {
      const bucketName = process.env.AWS_BUCKET_NAME!;
      const endpoint = process.env.AWS_ENDPOINT;
      const region = process.env.AWS_REGION || 'us-east-1';

      // Upload to S3/MinIO
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: filename,
          Body: buffer,
          ContentType: mimetype,
        })
      );

      // Formulate URL
      let url = '';
      if (endpoint) {
        // Formato para MinIO ou endpoints customizados
        url = `${endpoint.replace(/\/$/, '')}/${bucketName}/${filename}`;
      } else {
        // Formato padrão AWS S3
        url = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;
      }

      return { url, filename };
    } else {
      // Local fallback
      const filePath = path.join(uploadsDir, filename);
      await fs.promises.writeFile(filePath, buffer);

      const baseUrl = process.env.UPLOAD_BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
      const url = `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;

      return { url, filename };
    }
  },
};
