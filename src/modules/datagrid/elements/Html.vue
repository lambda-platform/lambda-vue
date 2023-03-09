<template>
    <div class="dg-html" v-html="getValue"></div>
</template>

<script>
function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}
function getNumber(value) {
    return Number(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}


export default {
    computed: {
        getValue() {
            if(this.params.type === "Number"){
                if(this.params.value !== null){
                    if(isNumeric(this.params.value)){
                        return getNumber(this.params.value);
                    } else {
                        let regex = />(\d+(?:\.\d+)?)</;

                        let match = this.params.value.match(regex);
                        let formattedNumber = getNumber(match[1]);

                        return this.params.value.replace(regex, `>${formattedNumber}<`);
                    }
                } else {
                    return ""
                }

            } else {
                return this.params.value
            }

        }
    }
}
</script>
