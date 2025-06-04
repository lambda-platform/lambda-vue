<template>
    <img :src="baseUrl  + params.value" class="ag-grid-image"/>
</template>
<script>
export default {
    computed:{
        baseUrl(){
            if(this.params){
                if(this.params.colDef.url){
                    return this.params.colDef.url
                }
            }
           return ""
        }
    }
};
</script>
