declare type ChartCoordiate = {
    x: number,
    y: number
}

declare type BasicInfo = {
    courseName: string,
    classroom: string,
    instructor: string
}

declare type DraggableItemWithTransform = {
    image: string
    name: string
    showImage: boolean
    x: number
    y: number
    scale: number
    rotation: number
}