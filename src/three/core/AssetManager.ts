import * as THREE from "three"

class AssetManagerCore {
  private textureCache: Map<string, THREE.Texture> = new Map()
  private pending: Map<string, Promise<any>> = new Map()

  async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url)!
    }

    if (this.pending.has(url)) {
      return this.pending.get(url)
    }

    const promise = new Promise<THREE.Texture>((resolve, reject) => {
      const loader = new THREE.TextureLoader()
      loader.load(
        url,
        (texture) => {
          this.textureCache.set(url, texture)
          this.pending.delete(url)
          resolve(texture)
        },
        undefined,
        (error) => {
          this.pending.delete(url)
          reject(error)
        }
      )
    })

    this.pending.set(url, promise)
    return promise
  }

  disposeAll() {
    this.textureCache.forEach(texture => texture.dispose())
    this.textureCache.clear()
    this.pending.clear()
  }

  disposeTexture(url: string) {
    const tex = this.textureCache.get(url)
    if (tex) {
      tex.dispose()
      this.textureCache.delete(url)
    }
  }
}

export const AssetManager = new AssetManagerCore()
