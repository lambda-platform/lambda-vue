<template>
<!--    <mSelect label="label"-->
<!--             v-model="selected"-->
<!--             :options="options"-->
<!--             :placeholder="lang.choosevalue"-->
<!--             :allow-empty="false"-->
<!--             @input="valueChanged">-->
<!--    </mSelect>-->
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
        //console.log(this.params);
        // if (this.params.column.filter.relation.parentFieldOfForm != null && this.params.column.filter.relation.parentFieldOfTable != null) {
        //     this.$watch("model.form." + this.params.column.filter.relation.parentFieldOfForm, {
        //         handler: (value, oldValue) => {
        //             console.log(value);
        //             // this.meta.filter.relation.filter = this.meta.filter.relation.parentFieldOfTable + "=" + value;
        //             // axios.post(dataUrl, this.meta.filter.relation).then(({data}) => {
        //             //     this.options = data;
        //             //     this.loading = false;
        //             // });
        //         },
        //         deep: true
        //     });
        // }

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
