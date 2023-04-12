<template>
    <a-button @click='close' v-if='withBackButton' style='margin-right: 8px'>
        Буцах
    </a-button>
    <a-button v-for='extraButton in extraButtons' :key='extraButton.index' :disabled='!editMode'
              :to='createWithTemplate(extraButton.url)' target='_blank'
              :style='!editMode ? `margin-right: 8px;` : `margin-right: 8px; color:${extraButton.color}; border-color:${extraButton.color}`'>
        <i :class='extraButton.icon' :style='!editMode ? `` :`color:${extraButton.color}`'></i>
        {{ extraButton.title }}
    </a-button>
    <a-button type="primary" :loading='asyncMode' html-type="submit">
                    <span v-if='!asyncMode'>
                        {{ save_btn_text !== 'Хадгалах' && save_btn_text !== '' ? save_btn_text : lang.save }}
                    </span>
        <span v-else>
                        {{ lang.pleaseWait }}
                    </span>
    </a-button>
    <a-button @click="handleReset" v-if='!editMode && !disableReset'
              style='margin-left: 8px'>
        {{ lang.fillInTheNewOne }}
    </a-button>
    <span v-for='button in getFooterButtons()' class='extra-buttons'>
                    <a-popconfirm
                        title="Энэ үйлдлийг хийх үү?"
                        ok-text="Тийм"
                        cancel-text="Үгүй"
                        v-for='option in button.options'
                        @confirm="setAndSend(button.model, option.value)"
                        :key='button.index'
                    >
                        <a-button type='info' :loading='asyncMode'
                        >
                         {{ option.label }}
                        </a-button>
                    </a-popconfirm>

                </span>
</template>

<script>
export default {
    name: "formFooter",
    props:["withBackButton", "save_btn_text", "asyncMode", "lang", "extraButtons", "schemaID", "editMode", "disableReset", "handleReset", "getFooterButtons", "setAndSend", "createWithTemplate"]
}
</script>

<style scoped>

</style>
