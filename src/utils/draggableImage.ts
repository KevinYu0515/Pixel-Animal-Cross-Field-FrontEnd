import { ref, reactive } from 'vue'
import Animal1 from '@/assets/image/bird1.png'
import Animal2 from '@/assets/image/bird2.png'

interface DraggableItem {
    image: string
    name: string
    showImage: boolean
}

function getFileName(path: string) {
    const parts = path.split('/');
    const file = parts[parts.length - 1];
    return file.split('.')[0];
}

const showToolbar = ref(false);

const draggableImage = reactive<DraggableItem[]>([{
    image: Animal1,
    name: getFileName(Animal1),
    showImage: true
}, {
    image: Animal2,
    name: getFileName(Animal2),
    showImage: true
}])
let mouseNearTop = false
let mouseInToolbar = false

const onMouseMove = (e: MouseEvent) => {
    mouseNearTop = e.clientY < 50;
    updateToolbarVisibility()
}

const onToolbarEnter = () => {
    mouseInToolbar = true
    updateToolbarVisibility()
}

const onToolbarLeave = () => {
    mouseInToolbar = false
    updateToolbarVisibility()
}

const updateToolbarVisibility = () => {
    showToolbar.value = mouseNearTop || mouseInToolbar
}

const handleUpload = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (!target.files) return

    Array.from(target.files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
            draggableImage.push({
                image: event.target?.result as string,
                name: file.name,
                showImage: true
            })
        }
        reader.readAsDataURL(file)
    })
    target.value = ''
}

const removeImage = (index: number) => {
    draggableImage.splice(index, 1)
}

export { draggableImage, showToolbar, onMouseMove, onToolbarEnter, onToolbarLeave, handleUpload, removeImage };