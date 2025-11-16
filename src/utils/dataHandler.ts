const generateExampleData = (count = 100, interval = 1000) => {
    const now = Date.now();
    const data = [];
    let current = 50;

    for (let i = count - 1; i >= 0; i--) {
        const delta = (Math.random() - 0.5) * 15;
        current += delta;

        current = Math.max(10, Math.min(90, current));

        data.push({
            x: now - i * interval,
            y: Number(current.toFixed(2))
        });
    }

    return data;
};

/**
 * 使用內插法插入 n 個點，增加資料連續性
 * @param {Array<{x: number, y: number}>} data
 * @param {number} n
 * @returns {Array<{x: number, y: number}>}
 */
const densifyData = (data: ChartCoordiate[], n = 20) => {
    const result = [];

    for (let i = 0; i < data.length - 1; i++) {
        const p1 = data[i];
        const p2 = data[i + 1];

        result.push(p1);

        for (let j = 1; j <= n; j++) {
            const t = j / (n + 1);
            result.push({
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            });
        }
    }

    result.push(data[data.length - 1]);
    return result;
};

/**
 * 將 "HH:mm" 轉成 timestamp (毫秒)
 * @param {string} timeStr
 * @param {Date} [baseDate=new Date()] 
 * @returns {number}
 * @throws {Error}
 */
function hhmmToTimestamp(timeStr: string, baseDate = new Date()) {
    if (typeof timeStr !== 'string') {
        throw new Error('timeStr 必須是字串，例如 "14:30"');
    }

    const [hStr, mStr] = timeStr.split(':');
    const hours = Number.parseInt(hStr, 10);
    const minutes = Number.parseInt(mStr, 10);

    if (
        Number.isNaN(hours) || Number.isNaN(minutes) ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59
    ) {
        throw new Error(`時間格式錯誤："${timeStr}"，預期為 HH:mm，例如 "09:05"`);
    }

    const d = new Date(baseDate);
    d.setHours(hours, minutes, 0, 0);

    return d.getTime();
}


function groupPointsByHour(points: ChartCoordiate[], minPoints: number = 5) {
    const sorted = [...points].sort((a, b) => a.x - b.x)

    const groups: {
        hourStart: number
        points: ChartCoordiate[]
    }[] = []

    let currentHourStart: number | null = null
    let currentPoints: ChartCoordiate[] = []

    for (const p of sorted) {
        const hourStart = Math.floor(p.x / (1000 * 60 * 60)) * (1000 * 60 * 60)

        if (currentHourStart === null || hourStart !== currentHourStart) {
            if (currentPoints.length > minPoints && currentHourStart !== null) {
                groups.push({
                    hourStart: currentHourStart,
                    points: currentPoints,
                })
            }
            currentHourStart = hourStart
            currentPoints = [p]
        } else {
            currentPoints.push(p)
        }
    }

    if (currentPoints.length > minPoints && currentHourStart !== null) {
        groups.push({
            hourStart: currentHourStart,
            points: currentPoints,
        })
    }

    return groups
}

export { generateExampleData, hhmmToTimestamp, groupPointsByHour, densifyData };