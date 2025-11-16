import { defineStore } from 'pinia'

const STORAGE_KEY = 'layout-store-v1'

interface LayoutState {
    leftWidth: number
    leftSectionHeight: number
    topHeight: number
}

export const useLayoutStore = defineStore('layout', {
    state: (): LayoutState => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                try {
                    const parsed = JSON.parse(saved) as Partial<LayoutState>
                    return {
                        leftWidth: parsed.leftWidth ?? 800,
                        leftSectionHeight: parsed.leftSectionHeight ?? 460,
                        topHeight: parsed.topHeight ?? 300,
                    }
                } catch {
                    // localStorage 裡是壞掉的資料就忽略，走預設值
                }
            }
        }
        return {
            leftWidth: 800,
            leftSectionHeight: 460,
            topHeight: 300,
        }
    },
    actions: {
        setLeftWidth(v: number) {
            this.leftWidth = v
        },
        setLeftSectionHeight(v: number) {
            this.leftSectionHeight = v
        },
        setTopHeight(v: number) {
            this.topHeight = v
        },
    },
})