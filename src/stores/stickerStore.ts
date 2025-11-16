import { defineStore } from 'pinia'
import { baseDraggableImage } from '@/utils/draggableImage'

const STORAGE_KEY = 'stickers-store-v1'

interface StickerTransform {
    x: number
    y: number
    scale: number
    rotation: number,
    showImage: boolean
}

interface StickerState {
    stickerMap: Record<string, StickerTransform>
}

export const defaultDraggableImageTransform = {
    x: 100,
    y: 500,
    scale: 1,
    rotation: 0,
    showImage: true
}

export const useStickerStore = defineStore('sticker', {
    state: (): StickerState => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(STORAGE_KEY)
                if (saved) {
                    const parsed = JSON.parse(saved) as Partial<StickerState>
                    return {
                        stickerMap: parsed.stickerMap ?? {}
                    }
                }
            } catch (err) {
                console.warn('Failed to parse stickers from localStorage', err)
            }
        }

        return {
            stickerMap: {},
        }
    },
    getters: {
        draggableImage: (state) => {
            return (
                baseDraggableImage.map((item) => {
                    const saved = state.stickerMap[item.name];
                    return {
                        ...item,
                        x: saved?.x ?? defaultDraggableImageTransform.x,
                        y: saved?.y ?? defaultDraggableImageTransform.y,
                        scale: saved?.scale ?? defaultDraggableImageTransform.scale,
                        rotation: saved?.rotation ?? defaultDraggableImageTransform.rotation,
                        showImage: saved?.showImage ?? defaultDraggableImageTransform.showImage
                    }
                })
            )
        }
    },

    actions: {
        setSticker(key: string, payload: StickerTransform) {
            this.stickerMap[key] = payload
            if (typeof window !== 'undefined') {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ stickerMap: this.stickerMap })
                )
            }
        },

        setStickerVisible(key: string, visible: boolean) {
            this.setSticker(key, { ...this.stickerMap[key], showImage: visible } as StickerTransform)
        },
    },
})