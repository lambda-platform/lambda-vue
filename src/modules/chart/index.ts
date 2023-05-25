import { App } from "vue";
import Chart from "./Chart.vue";
import ChartRest from "./ChartRest.vue";

/**
 * Initialize Chart component
 * @param app vue instance
 */
export function installChart(app: App<Element>) {
    app.component("Chart", Chart);
    app.component("ChartRest", ChartRest);
}
