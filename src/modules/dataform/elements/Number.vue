<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <a-input-number type="number"
                        v-if="meta.no_format"
               v-model:value="model.form[model.component]"
                        :placeholder="placeholder"
                        :disabled="disabled"

                        :number="true" />
        <a-input-number
                        v-else
                        v-model:value="model.form[model.component]"
                        :formatter="value => {
  const [integer, fractional] = `${value}`.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formattedInteger}${fractional ? '.'+fractional.slice(0, meta.precision ? meta.precision * 1 : 3) : ''}`;
}"
                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                        :placeholder="placeholder"
                        :disabled="disabled"
        />
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
    mounted() {
        console.log(this.meta.precision)
    }

};
</script>
