import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import LayoutPage from '@/pages/ControlPage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: MainPage,
        },
        {
            path: '/control',
            name: 'Control',
            component: LayoutPage,
        },
    ],
})

export default router
