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
import en_EN from "../../../antlocale/date_en_EN";
import dayjs from "../../../utils/dayjs";
import {getUTCValue} from "../../../utils/date";

export default {
    mixins: [mixin],

    methods: {},
    computed: {
        autoFillCurrentDate() {
            return this.meta.autoFillCurrentDate === true
        },
        withTimeZone() {
            return window.withTimezone ? true : false;
        },
        locale(){
            if(this.$i18n.locale === "mn_MN"){
                return mn_MN
            } else {
                return en_EN
            }

        }
    },
    beforeMount() {
        if (this.model.form[this.model.component] !== null) {
            if (typeof this.model.form[this.model.component] === 'string' && this.withTimeZone) {
                this.model.form[this.model.component] = dayjs(this.model.form[this.model.component]);
            }
        }
    },
    mounted() {
        if (this.itemValue === null) {
            if (this.autoFillCurrentDate) {
                axios.get("/lambda/krud/today").then(({data}) => {
                    if(window.withTimezone){
                        this.model.form[this.model.component] = dayjs(data.today);
                    } else {
                        this.model.form[this.model.component] = getUTCValue(data.today);
                    }
                });
            }

        }
    }
};
</script>
