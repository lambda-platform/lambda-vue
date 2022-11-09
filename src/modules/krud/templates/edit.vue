<template>
    <div class="card drawer-wrappper">
        <common :parent="parent" :title="title" :hideAction="true" :permissions="permissions"></common>

        <section class="offcanvas-template">
            <div class="crud-page">
                <div class="crud-page-body">
                    <div class="" >
                        <div class="ant-drawer-content">
                            <div class="ant-drawer-wrapper-body">

                                <div class="ant-drawer-body">
                                    <dataform
                                        ref="form"
                                        :hideTitle="true"
                                        :schemaID="form"
                                        :title="title"
                                        :url="url"
                                        :editMode="editMode"
                                        :onSuccess="onSuccess"
                                        :onReady="onReadyEdit"
                                        :do_render="true"
                                        :permissions="permissions"
                                        :page_id="page_id"
                                        :user_condition="user_condition ? user_condition.formCondition : null"
                                        :onError="onError"

                                    >
                                    </dataform>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

    </div>
</template>
<script>

import common from '../components/common'
import Krudtools from '../components/krudtools'
import mixins from './mixin'

export default {
    inheritAttrs: false,
    name: 'Canvas',
    mixins: [mixins],
    data () {
        return {
            form_width: 800,

            exportLoading: false,
        }
    },
    components: {

        common,
        Krudtools
    },
    methods: {


        templateOnSuccess () {
            this.editMode = true;
            this.$refs.form.editModel(this.actions);
        },
        onReadyEdit(){
            if(this.actions){
                this.editMode = true;
                this.$refs.form.editModel(this.actions);
            }
        }
    },
    mounted () {

    },
}
</script>
