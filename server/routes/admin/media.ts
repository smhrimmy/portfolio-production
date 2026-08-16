import { Router } from "express"
import multer from "multer"
import { StorageManager } from "../../services/storage/StorageManager.js"

export const adminMediaRouter = Router()
import { prisma } from "../../config/db.js"

// Use memory storage for multer since we upload to a provider
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
})

// List media
adminMediaRouter.get("/", async (_req, res) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" }
    })
    res.json(media)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Upload media
adminMediaRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: { message: "No file provided" } })
    }

    const { altText, caption, folderId } = req.body

    const provider = StorageManager.getProvider()
    
    // 1. Upload to storage provider (e.g. Google Drive)
    const storageResult = await provider.upload({
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size
    }, folderId)

    // 2. Save metadata to Prisma
    const media = await prisma.media.create({
      data: {
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        providerId: storageResult.providerId,
        providerUrl: storageResult.providerUrl,
        thumbnailUrl: storageResult.thumbnailUrl,
        altText: altText || null,
        caption: caption || null,
        folderId: folderId || null
      }
    })

    res.json(media)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Update metadata
adminMediaRouter.put("/:id", async (req, res) => {
  try {
    const { altText, caption } = req.body
    const media = await prisma.media.update({
      where: { id: req.params.id },
      data: { altText, caption }
    })
    res.json(media)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Delete media
adminMediaRouter.delete("/:id", async (req, res) => {
  try {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } })
    if (!media) {
      return res.status(404).json({ error: { message: "Media not found" } })
    }

    // 1. Delete from storage provider
    const provider = StorageManager.getProvider()
    await provider.delete(media.providerId)

    // 2. Delete from Prisma
    await prisma.media.delete({ where: { id: media.id } })

    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
