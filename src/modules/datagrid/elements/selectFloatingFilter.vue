<template>
    <a-select
        ref="select"
        v-model:value="selected"
        allowClear
        showSearch
        @change="valueChanged"
        :options="options"
    />
</template>

<script>

import axios from "axios";


export default {
    components: {

    },
    computed: {
        lang() {
            const labels = ['choosevalue',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
    },
    data() {
        return {
            loading: true,
            options: [],
            selected: null,
            currentValue: null
        }
    },

    created() {
        let dataUrl = `/lambda/krud/${this.params.schemaID}/options`;
        axios.post(dataUrl, this.params.column.filter.relation).then(({data}) => {
            this.options = data;
            this.loading = false;
        });
    },

    methods: {

        setMeta(item) {
            item.schemaID = this.params.schemaID;
            return item;
        },

        valueChanged(v) {
            this.params.filterData(this.params.column.model, v);
        },

        onParentModelChanged(parentModel) {
            this.currentValue = !parentModel ? null : parentModel.filter
        }
    }
};
</script>
