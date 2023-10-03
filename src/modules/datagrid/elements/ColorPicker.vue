<template>
  <input type="color"  :name="model.component" v-model="model.form[model.component]"
         :disabled="disabled"
  >
</template>

<script>

export default {
    props: ["model", "label", "rule", "meta"],
    components:{
        ColorPicker:ColorPicker
    },
    computed: {
        value() {
            return this.$props.model.form[this.model.component];
        }
    },
    beforeMount(){
        if(this.value === null){
            this.$props.model.form[this.model.component] = '';
        }
    },
    watch: {
        value(value) {

            if(value === null){
                this.$props.model.form[this.model.component] = '';
            }

        }
    }
};
</script>
