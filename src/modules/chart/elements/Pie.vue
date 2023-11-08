<template>
    <div>
        <div  ref="chart" class="chart" >
        </div>
        Нийт: {{numberValue(total)}}
        <div class="legend">

            <div style="display: flex; align-items: center; margin-bottom: 4px;"        @click="legendItemClick(index)" v-for="(legend, index) in legends" :key="legend.index" :class="`${legend.hide ? 'legend-container hidden-legend' : 'legend-container'}`">
                <div :style="`background-color: ${legend.color};`" class="legend-color"></div>
                <div class="legend-title">
                    <div class="legend-name">{{legend.title}}:</div>
                    <div class="value-percent">{{legend.value}}&nbsp;&nbsp;{{legend.percent}}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {getNumber} from '../../../utils/number';
import * as echarts from 'echarts';
export default {
    props: ['title', 'value', 'type', 'chart_title', 'id', 'chart_filter', 'filters', "hideTitle", "limit", "projectDomain", "isRest", "xData", "chartData","labels", "colors"],
    methods: {
        numberValue(v){
            return getNumber(v)
        },
        legendItemClick(index) {

            // Handle the legend item click event
            const legendData = this.chart.getOption().legend[0].data;
            const seriesIndex = index; // Map the legend item index to the series index if needed
            const selected = this.chart.getOption().legend[0].selected;
            this.legends[index].hide = !this.legends[index].hide;
            selected[legendData[seriesIndex]] = !selected[legendData[seriesIndex]];


            this.chart.dispatchAction({
                type: 'legendToggleSelect',
                name: this.legends[index].title
            });

        },
        createCustomLegend(seriesData) {
            const legendData = this.chart.getOption().legend[0].data;

            let total = 0;
            for (let i = 0; i < seriesData.length; i++) {
                total += seriesData[i].value*1;
            }

            this.total = total;
            this.legends = legendData.map((legend, i)=>{

                let value = 0;

                let index = seriesData.findIndex(data=>data.name === legend)

                if(index >= 0){
                    value = seriesData[index].value;
                }

                let percentage = getNumber((value / total * 100));


                return {
                    color:this.colors ? this.colors[i] : this.chart.getOption().color[i],
                    title:legend,
                    value:getNumber(value),
                    percent:getNumber(percentage),
                    hide:false
                }
            })
        },
        callData() {
            if (this.value.length >= 1 && this.title.length >= 1) {
                let newFilter = [];
                if (this.filters) {
                    this.filters.map(filter__ => {
                        if (this.chart_filter) {
                            this.chart_filter.map(chart_filter => {
                                if (filter__.name === chart_filter.field && filter__.table === chart_filter.table) {
                                    newFilter.push(chart_filter);
                                }
                            })
                        }
                    })
                }

                if (this.instance === null) {
                    this.dataCaller([]);
                } else {
                    if (newFilter.length >= 1) {
                        this.lastFilter = newFilter
                        this.dataCaller(newFilter);
                    } else {
                        if (this.lastFilter.length >= 1) {
                            this.lastFilter = [];
                            this.dataCaller([]);
                        }
                    }
                }
            }
        },
        dataCaller(filter) {
            let url = '/ve/get-data-pie';
            if(this.projectDomain){
                url = this.projectDomain+url;
            }
            axios.post(url, {
                value: this.value,
                title: this.title,
                filters: this.filters,
                limit: this.limit ? this.limit.toString() : undefined
            }).then(response => {
                this.elementData = response.data;
                this.initChart();
            }).catch(error => {
                console.log(error)
            })
        },

        initChart() {
            if (this.instance) {
                this.instance.dispose();
                this.instance = null;
            }
            var dom = this.$refs.chart;
            var wrapper = dom.parentElement;
            dom.style.height = (wrapper.offsetWidth / 100)*80 + 'px';

            var myChart = echarts.init(dom, null, {
                renderer: 'canvas',
                useDirtyRect: false
            });
            this.instance = myChart;

            let series = [];
            let seriesData = [];
            let totalValue = 0;



            let value_field = this.value[0].name;
            let title_field = this.title[0].name;



            this.elementData.map(sdata => {

                if(sdata[title_field] !== null && sdata[value_field] !== null){
                    totalValue = totalValue + sdata[value_field];
                    let name = sdata[title_field]

                   if(this.labels && this.labels.length >= 1){
                       let labelIndex = this.labels.findIndex(label=>label.value === name);
                       if(labelIndex >= 0){
                           name = this.labels[labelIndex].label;
                       }
                    }


                    seriesData.push({
                        value: sdata[value_field],
                        name: name
                    });

                }

            });



            if (this.type === 'PieChart') {


                series.push({
                    name: this.chart_title,
                    type: 'pie',

                    center: ['50%', '50%'],
                    radius: ['25%', '80%'],
                    itemStyle: {
                        borderRadius: 3,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    data: seriesData,
                    color: this.colors ? this.colors : undefined,

                    label: {
                        show: false,
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: (params) =>{
                            let data = params.data;
                            let value = data.value;
                            let name = data.name;

                            let total = 0;
                            for (let i = 0; i < seriesData.length; i++) {
                                total += seriesData[i].value;
                            }

                            let percentage = getNumber((value / total * 100));

                            return `${params.seriesName}<br/>${name}: ${getNumber(value)}  ${percentage}%`;
                        }
                    },
                });
            }

            if (this.type === 'FunnelChart') {
                series.push({
                    name: this.chart_title,
                    type: 'funnel',
                    radius: '70%',
                    center: ['50%', '60%'],
                    data: seriesData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                });
            }

            if (this.type === 'TreeMapChart') {
                series.push({
                    name: this.chart_title,
                    type: 'treemap',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: seriesData,
                    // color: ["#B3B9F6", "#7AADFF", "#6CD0FF", "#6B2D90", "#FF78BE", "#FF6EF8", "#E070FC"],
                    levels:[

                        {
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 2,
                                gapWidth: 1
                            },
                            emphasis: {
                                itemStyle: {
                                    borderColor: '#fff'
                                }
                            }
                        },
                        {
                            colorSaturation: [0.35, 0.5],
                            itemStyle: {
                                borderWidth: 2,
                                gapWidth: 1,
                                borderColorSaturation: 0.6
                            }
                        }
                    ],
                    roam: 'move',
                    itemStyle: {
                        borderRadius: 3,
                        borderColor: '#fff',

                        normal: {
                            label: {
                                formatter: (e) => {
                                    let percent = Math.round(e.data.value / (totalValue / 100) * 100) / 100;
                                    return `${e.data.name}: ${percent}%, ${getNumber(e.data.value)}`;
                                },
                                textStyle: {
                                    baseline: 'top'
                                }
                            }
                        },
                    }
                });
            }

            let titles = this.elementData.filter(data_ => data_[title_field] !== null).map(data_ => {

                if(this.labels && this.labels.length >= 1){
                    let labelIndex = this.labels.findIndex(label=>label.value === data_[title_field]);
                    if(labelIndex >= 0){
                        return this.labels[labelIndex].label;
                    }
                }
                return data_[title_field]
            });


            let options = {

                title: !this.hideTitle ? {
                    text: this.chart_title,
                    textStyle: {
                        fontFamily: 'Arial',
                        fontWeight: "normal"
                    }
                } : undefined,
                toolbox: {
                    feature: {
                        saveAsImage: {
                            title: 'Татах'
                        },
                        dataView: { show: true, readOnly: false,   title: 'Өгөгдөл', close:"Хаах" },
                    }
                },
                tooltip: this.type === 'TreeMapChart' ? {
                    trigger: 'item',
                    formatter: (e) => {
                        let percent = Math.round(e.data.value / (totalValue / 100) * 100) / 100;
                        return `${e.data.name}: ${percent}% <br> ${getNumber(e.data.value)}`;
                    }
                } : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                    // formatter: "{b} : {c} ({d}%)"
                    // formatter: "{b} : {c}"

                },
                legend: {
                    orient: 'horizontal',
                    left: 5,
                    bottom: 0,
                    type: 'scroll',
                    data: titles,
                    show: this.type !== 'PieChart'
                },
                series: series,


            }

            myChart.setOption(options);

            // myChart.on('click', function (event) {
            //     console.log(event)

            // });

            myChart.on('click', (event) => {
                if (event.data) {
                    this.$emit("changeFilter", {
                        value: event.data.name,
                        id: this.id,
                        field: this.title[0].name,
                        table: this.title[0].table,
                    });
                } else {
                    this.$emit("unFilter");
                }
            });

            window.addEventListener('resize', ()=>{


                this.$refs.chart.style.height = (this.$refs.chart.parentElement.offsetWidth / 100)*75 + 'px';
                myChart.resize();

            });

            // myChart.on('legendselectchanged', function (event) {
            //     console.log(event)
            //     console.log('legendselectchanged')
            // });
            this.chart = myChart;
            if(this.type === 'PieChart'){
                this.createCustomLegend(seriesData);
            }

        },


    },

    mounted() {

        if(!this.isRest){
            this.callData();
        } else {
            this.elementData = [...this.chartData];
            this.initChart();
        }

    },

    data() {
        return {
            elementData: [],
            instance: null,
            timeout: null,
            lastFilter: [],
            chart:null,
            legends:[],
            total:0
        }
    },

    watch: {

        type: function (val) {
            this.initChart();
        },

        'value': {
            handler: function (after, befor) {

                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);

            },
            deep: true
        },

        // 'chart_filter': {
        //     handler: function (after, befor) {
        //         if (this.timeout) {
        //             clearTimeout(this.timeout);
        //         }
        //         this.callData();
        //     },
        //     deep: true
        // },

        'chart_title': {
            handler: function (after, befor) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }

                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);

            },
            deep: true
        },

        'title': {
            handler: function (after, befor) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);

            },
            deep: true
        }

    }
}
</script>
