<template>
    <a :href="link" :target="this.params.linkTarget" v-if="params.value != '' && params.value != null" >
        <i v-if="this.params.icon" :class="this.params.icon"></i>
        <span v-if="!this.params.showOnlyIcon">{{ params.value }}</span>
    </a>
    <span v-else>
            ...
    </span>
</template>

<script>

import {convertLink} from "../utils/formula"

export default{
    computed: {
        link() {
            return convertLink(this.params.link, this.params.node.data);
        }
    }
};
</script>
