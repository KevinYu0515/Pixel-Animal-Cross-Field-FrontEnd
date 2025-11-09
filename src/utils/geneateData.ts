const generateExampleData = (count = 10, interval = 1000) => {
    const now = Date.now();
    const data = [];

    for (let i = count - 1; i >= 0; i--) {
        data.push({
            x: now - i * interval,
            y: 40 + Math.sin(i / 2) * 30 + Math.random() * 5
        });
    }

    return data;
};

/**
 * 在每兩個點之間插入 n 個內插點
 * @param {Array<{x: number, y: number}>} data - 原始點陣列
 * @param {number} n - 每兩點之間要插入的點數 (預設 50)
 * @returns {Array<{x: number, y: number}>} - 新的平滑資料
 */
const densifyData = (data: ChartCoordiate[], n = 50) => {
    const result = [];

    for (let i = 0; i < data.length - 1; i++) {
        const p1 = data[i];
        const p2 = data[i + 1];

        // 先放入當前點
        result.push(p1);

        // 插入 n 個中間點
        for (let j = 1; j <= n; j++) {
            const t = j / (n + 1);
            result.push({
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            });
        }
    }

    // 加入最後一個點
    result.push(data[data.length - 1]);
    return result;
};

export { generateExampleData, densifyData };