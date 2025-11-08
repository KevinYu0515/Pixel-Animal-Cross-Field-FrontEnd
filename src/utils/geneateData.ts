const generateExampleData = (): ChartCoordiate[] => {
    const now = Date.now();
    return [
        { x: now - 10000, y: 40 },
        { x: now - 8000, y: 55 },
        { x: now - 6000, y: 60 },
        { x: now - 4000, y: 75 },
        { x: now - 2000, y: 90 },
        { x: now, y: 80 }
    ]
}

export { generateExampleData };