<template>
    <lambda-form-item :label=label :name="model.component" :meta="meta">

        <div class="file-uploader">
            <a-upload
                v-model:file-list="uploadList"
                :disabled="disabled"
                :multiple="this.isMultiple"
                name="file"


                :action="`${url ? url : ''}/lambda/krud/upload`"
                @preview="handleView"
                @change="handleChange"
                @remove="handleRemove"
            >
                <a-button type="dashed" block v-if="!disabled">

                    <loading-outlined v-if="loading"></loading-outlined>
                    <i class="ti ti-file" v-else></i>
                    {{ lang.pleaseSelectFile }}
                </a-button>
            </a-upload>

        </div>

    </lambda-form-item>
</template>

<script>
import mixin from './_mixin'
import { message } from 'ant-design-vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'

export default {
    mixins: [mixin],
    components: {
        LoadingOutlined,
        PlusOutlined,
    },
    computed: {
        lang () {
            const labels = ['viewPhotos', '_delete', 'pleaseSelectFile'
            ]
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i])
                return obj
            }, {})
        },
        isMultiple(){
            if(this.meta.file) {
                if (typeof this.meta.file.isMultiple !== 'undefined' && this.meta.file.isMultiple) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    },
    mounted () {

        this.init()
    },
    data () {
        return {
            defaultList: [],
            uploadList: [],
            showImage: false,
            showImageUrl: '',
            loading: false
        }
    },

    watch: {

        itemValue (value, oldValue) {
            if ((oldValue && !value) || (value && !oldValue)) {
                if (value) {
                    this.init()
                } else {
                    this.uploadList = [];
                }
            }
        }

    },

    methods: {
        init () {

            if (this.model.form[this.model.component]) {
                if (this.isMultiple) {
                    if (JSON.stringify(this.uploadList !== this.model.form[this.model.component])) {
                        let list = JSON.parse(this.model.form[this.model.component])
                        if (Array.isArray(list)) {
                            this.uploadList = list
                        }
                    }
                } else {
                    let name = this.model.form[this.model.component].split("/")
                    let fileName= "";
                    if(name.length >= 1){
                        fileName = name[name.length-1]
                    }

                    if (this.uploadList.length >= 1) {
                        if (this.uploadList[0].response !== this.model.form[this.model.component]) {
                            this.uploadList = [{
                                status: 'done',
                                thumbUrl: this.model.form[this.model.component],
                                response: this.model.form[this.model.component],
                                name:fileName
                            }]
                        }
                    } else {
                        this.uploadList = [{
                            status: 'done',
                            thumbUrl: this.model.form[this.model.component],
                            response: this.model.form[this.model.component],
                            name:fileName
                        }]
                    }
                }
            }

        },
        onVisibleChange (v) {
            this.showImage = v
        },
        handleView (file) {
            this.showImageUrl = `${this.url ? this.url : ''}`+file.response;

            const a = document.createElement('a')
            a.href = `${this.url ? this.url : ''}`+file.response;
            a.target = "_blank";
            a.click()
        },
        handleChange (info) {

            if (info.file.status === 'uploading') {
                this.loading = true

                return
            }
            if (info.file.status === 'done') {

                if (!this.isMultiple) {
                    this.model.form[this.model.component] = info.file.response
                    this.uploadList = [{
                        status: 'done',
                        thumbUrl: this.url+this.model.form[this.model.component],
                        response: this.model.form[this.model.component],
                        name: info.file.name
                    }]
                } else {
                    this.uploadList = this.uploadList.map(u => {
                        return {
                            status: 'done',
                            thumbUrl: this.url+u.response,
                            response: u.response,
                            name: u.name
                        }
                    })
                    this.model.form[this.model.component] = JSON.stringify(this.uploadList)
                }
                this.loading = false
            }
            if (info.file.status === 'error') {
                this.uploadList = this.uploadList.filter(u=>u.status === 'done');
                this.loading = false;
                message.error(this.$t("alertMessage.errorMsg"))
            }
        },

        success (val) {

            if(this.meta.file) {
                if (this.isMultiple) {
                    this.uploadList = this.$refs.upload.fileList
                    this.model.form[this.model.component] = JSON.stringify(this.uploadList.map(item => {
                        return {
                            name: item.name,
                            response: item.response
                        }
                    }))
                } else {
                    this.model.form[this.model.component] = val
                }
            } else {
                this.model.form[this.model.component] = val
            }

        },

        handleRemove (e) {


                if (this.isMultiple) {
                    this.model.form[this.model.component] = JSON.stringify(this.uploadList.filter(u=>u.response !== e.response))
                } else {
                    this.model.form[this.model.component] = null
                }




        },

    }
}
</script>
