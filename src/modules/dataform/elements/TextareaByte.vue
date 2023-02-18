<template>
    <lambda-form-item :label=label :name="model.component" :meta="meta">
        <a-textarea v-model:value="value"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    @change="changeFormData"
        />
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"

export default {
    mixins: [mixin],
    data() {
        return {
            value: null
        }
    },
    methods: {
        init() {
            if (this.model.form[this.model.component] !== null && this.model.form[this.model.component] !== "") {
                this.value = atob(this.model.form[this.model.component]);
            }
        },
        changeFormData() {
            this.model.form[this.model.component] = btoa(this.value)
        }
    },
    mounted() {
        this.init()
    },
    watch: {
        itemValue(value, oldValue) {
            if ((oldValue && !value) || (value && !oldValue)) {
                if (value) {
                    this.init()
                } else {
                    this.value = null;
                }
            }
        }
    },
};
</script>
