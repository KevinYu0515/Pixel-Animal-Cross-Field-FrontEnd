import { ref } from 'vue'

const currentTime = ref('')

const updateTime = () => {
    const d = new Date()
    currentTime.value = d.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,   
    })
    timerId = setInterval(updateTime, 1000)
}

let timerId: ReturnType<typeof setInterval> | undefined

const clearTime = () => clearInterval(timerId);

export { currentTime, updateTime, clearTime, timerId };
