<template>
    <section class="excel-import-container">

        <div class="excel-import-tools">
            <div class="excel-import-tools-left">
                <label>{{ lang.excelImportModalTitle }}</label>
            </div>

            <div class="excel-import-tools-right" style="display: flex">
                <a-button type="default" v-if="options.excelUploadSample" :href="baseUrl+options.excelUploadSample" shape="round" class="example-btn">

                    Жишээ файл татах
                </a-button>
            </div>
        </div>

        <div class="excel-import-body">
            <div class="excel-import-btns">
                <a-upload :action="`${baseUrl}/lambda/krud/upload`"
                        v-model="excelForm.excelFile"
                        @change="success"
                        class="ant-btn-default"
                        style="width: 200px"
                        size="small">

                    <div class="flex">
                        <inline-svg class="svg-icon"
                            src="/assets/icons/duotone/Files/Upload.svg"
                        />
                      Файл оруулах
                    </div>

                </a-upload>

                <a-button  type="primary" v-if="excelForm.excelFile"
                          @click="excelImport">{{ lang.save }}
                </a-button>
            </div>

            <div class="excel_upload_loading notif" v-if="isLoading" style="padding:20px">
                Ачаалж байна түр хүлээнэ үү ...
            </div>
            <div v-else>
                <div v-if="summary==null" class="notif" style="height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    padding:20px;
    color: #ccc;">
                    Эксел файлаа оруулаад өгөгдөл хадгалах товчийг дарна уу
                </div>
                <div v-else-if="summary==1" class="notif" style="height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    color: #149755;">
                    Амжилттай хадгалагдлаа, Хүснэгтээ дахин ачаалж мэдээллээ шалгана уу

                </div>
                <div v-else style="padding: 20px">
                    <div>
                        <h3> Эксел файл оруулах үеийн лог </h3></div>
                    <div>Доорх алдааг засаж дахин оруулна уу, алдаа гараагүй өгөгдлүүд баазад орсон</div>
                    <div style="border-top:1px dotted #eee; padding: 20px; overflow-y: auto">
                        <ul>
                            <li v-for="sum in summary" :key="sum">
                                {{ sum.row }} - {{ sum.error }}
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<script>

import axios from "axios"
import {LoadingOutlined} from "@ant-design/icons-vue";
export default {
    components: {LoadingOutlined},
    props: ["schemaID", "schema", "options", "baseUrl"],
    data() {
        return {
            isLoading: false,
            excelForm: {
                excelFile: null,
                schemaID: this.schemaID
            },
            summary: null
        }
    },

    created() {
        console.log("schema:");
        console.log(this.schema);
        console.log(this.options);
    },

    computed: {
        lang() {
            const labels = ['excelImportModalTitle', 'save'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
    },

    methods: {
        excelImport() {
            this.isLoading = true;
            axios.post(this.baseUrl+'/lambda/krud/import-excel/'+this.schemaID, this.excelForm).then(res => {
                console.log("excelImport:");
                console.log(res.data);
                if (res.data.status) {
                    this.summary = 1;
                } else {
                    this.summary = res.data.data;
                }
            }).catch(e => {
                console.log(e.message);
            });

        },
        success(val) {
            if(val.file.status === "done"){
                this.excelForm.excelFile = val.file.response;
            }

        },
    }
};
</script>

<style lang="scss">

@import "scss/print.scss";

</style>
