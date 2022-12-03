<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <a-date-picker
            v-model:value="model.form[model.component]"
            mode="date"
            :placeholder="placeholder"
            :disabled="disabled || autoFillCurrentDate"
            valueFormat="YYYY-MM-DD"

          ></a-date-picker>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
import axios from "axios"
export default {
    mixins:[mixin],
    computed:{
        autoFillCurrentDate(){
            return this.meta.autoFillCurrentDate === true
        }
    },
    mounted () {
        if(this.itemValue === null){
            axios.get("/lambda/krud/today").then(({data})=>{
                this.model.form[this.model.component] = data.today;
            });
        }
    }
};
</script>
