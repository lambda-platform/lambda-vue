<template>
    <lambda-form-item :label=label :name="model.component" :meta="meta">
        <a-date-picker
            v-model:value="model.form[model.component]"

            :locale="locale"
            :placeholder="placeholder"
            :disabled="disabled || autoFillCurrentDate"

            v-if="withTimeZone"

        ></a-date-picker>

        <a-date-picker
            v-model:value="model.form[model.component]"

            :locale="locale"
            :placeholder="placeholder"
            :disabled="disabled || autoFillCurrentDate"
            v-if="!withTimeZone"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"

        ></a-date-picker>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
import axios from "axios"

import mn_MN from "../../../antlocale/date_mn_MN";

export default {
    mixins: [mixin],
    data() {
        return {
            locale: mn_MN
        }
    },
    methods: {},
    computed: {
        autoFillCurrentDate() {
            return this.meta.autoFillCurrentDate === true
        },
        withTimeZone() {
            return window.withTimezone ? true : false;
        }
    },
    beforeMount() {
        if (this.model.form[this.model.component] !== null) {
            if (typeof this.model.form[this.model.component] === 'string') {
                this.model.form[this.model.component] = this.model.form[this.model.component];
            }
        }
    },
    mounted() {
        if (this.itemValue === null) {
            if (this.autoFillCurrentDate) {
                axios.get("/lambda/krud/today").then(({data}) => {
                    this.model.form[this.model.component] = data.today;
                });
            }

        }
    }
};
</script>
