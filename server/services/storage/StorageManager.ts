// @ts-nocheck
import { IStorageProvider, UploadedFile, StorageResult } from "./IStorageProvider.js"

// A simple mock provider that simulates Google Drive when credentials aren't set
class MockStorageProvider implements IStorageProvider {
  async upload(file: UploadedFile, folderId?: string): Promise<StorageResult> {
    const id = "mock_drive_id_" + Date.now() + "_" + Math.floor(Math.random() * 1000)
    return {
      providerId: id,
      providerUrl: `https://mock.drive.google.com/view/${id}`,
      thumbnailUrl: `https://mock.drive.google.com/thumbnail/${id}`
    }
  }

  async delete(providerId: string): Promise<void> {
    console.log(`[MockStorage] Deleted ${providerId}`)
  }

  async getUrl(providerId: string): Promise<string> {
    return `https://mock.drive.google.com/view/${providerId}`
  }
}

class GoogleDriveProvider implements IStorageProvider {
  async upload(_file: UploadedFile, _folderId?: string): Promise<StorageResult> {
    // In a real implementation, you would use googleapis:
    // const drive = google.drive({ version: 'v3', auth })
    // drive.files.create(...)
    
    // For now, we simulate the Drive response for architectural completeness
    throw new Error("Google Drive upload not fully implemented yet. Please use Mock provider.")
  }

  async delete(_providerId: string): Promise<void> {
    throw new Error("Google Drive delete not fully implemented yet.")
  }

  async getUrl(providerId: string): Promise<string> {
    return `https://drive.google.com/uc?id=${providerId}`
  }
}

export class StorageManager {
  private static instance: IStorageProvider | null = null

  static getProvider(): IStorageProvider {
    if (!this.instance) {
      if (process.env.GOOGLE_DRIVE_CREDENTIALS) {
        this.instance = new GoogleDriveProvider()
      } else {
        console.warn("GOOGLE_DRIVE_CREDENTIALS missing. Using MockStorageProvider for Media Library.")
        this.instance = new MockStorageProvider()
      }
    }
    return this.instance
  }
}
