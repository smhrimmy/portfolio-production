import { Router } from "express"
import { prisma } from "../../config/db.js"

export const publicMediaRouter = Router()

publicMediaRouter.get("/:id", async (req, res) => {
  try {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } })
    if (!media) {
      return res.status(404).json({ error: { message: "Media not found" } })
    }
    res.json({
      id: media.id,
      name: media.name,
      mimeType: media.mimeType,
      url: media.providerUrl,
      thumbnailUrl: media.thumbnailUrl,
      altText: media.altText,
      caption: media.caption,
    })
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
