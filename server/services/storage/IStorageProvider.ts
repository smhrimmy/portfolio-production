export interface UploadedFile {
  buffer: Buffer
  mimetype: string
  originalname: string
  size: number
}

export interface StorageResult {
  providerId: string
  providerUrl: string
  thumbnailUrl?: string
}

export interface IStorageProvider {
  upload(file: UploadedFile, folderId?: string): Promise<StorageResult>
  delete(providerId: string): Promise<void>
  getUrl(providerId: string): Promise<string>
}
