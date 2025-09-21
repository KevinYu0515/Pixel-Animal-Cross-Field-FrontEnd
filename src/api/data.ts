async function loadData() {
    const res = await fetch("http://127.0.0.1:8000/look_forward_ratio");
    const data = await res.json();
    const yData: number[] = data.look_forward_percentages.map((num: Number) => num.toFixed(3));

    const now = Date.now();
    const xData: number[] = yData.map((_, index: number) => {
       return now - (yData.length - 1 - index) * 1000;
    });

    const chartData: ChartCoordiate[] = yData.map((y, i) => ({
       x: xData[i],
       y,
    }));
    console.log(chartData)
    return chartData;
}

export { loadData };
