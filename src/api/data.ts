import { hhmmToTimestamp } from "@/utils/dataHandler";
import { defaultBasicInfo } from "@/data/mainPage";
const BACKEND_API = import.meta.env.VITE_BACKEND_API || 'http://localhost:5555';

async function loadData() {
   try {
      const res = await fetch(`${BACKEND_API}/look_forward_ratio`);
      const data = await res.json();
      const yData: number[] = data.look_forward_percentages.map((num: string) => Number(parseFloat(num).toFixed(3)));

      const xData: string[] = data.labels;

      const chartData: ChartCoordiate[] = yData.map((y, i) => ({
         x: hhmmToTimestamp(xData[i]),
         y,
      }));

      return {
         chartData,
         basicInfo: data.basicInfo || defaultBasicInfo
      };
   } catch (error) {
      console.error('Error loading data:', error);
      return {
         chartData: [],
         basicInfo: defaultBasicInfo,
      };
   }
}

export { loadData };
