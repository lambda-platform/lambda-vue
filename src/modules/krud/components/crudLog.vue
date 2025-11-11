<template>
    <div class="crud-log">
        <div class="fieldset">
            <legend>{{ lang.registration_history }}</legend>
            <a-table :columns="logColumns" :dataSource="logs" size="small" :height="logs.length >= 3 ? 200 : 100"
            ></a-table>
        </div>
        <div class="fieldset">
            <legend>{{ lang.Information_viewing_history }}</legend>
            <a-table :columns="readColumns" :dataSource="reads" size="small" :height="reads.length >= 3 ? 200 : 80"
            ></a-table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import dayjs from "../../../utils/dayjs";
import {formatDateTime} from "../../../utils/date";

export default {
    name: 'crudLog',
    props: ['form', 'grid', 'rowId'],
    data () {
        return {
            logs: [],
            reads: [],
            logColumns: [
                {
                    title: 'Бүртгэлийн төрөл',
                    dataIndex: 'action',
                    key: 'action'
                },
                {
                    title: 'Хэрэглэгч',
                    dataIndex: 'user',
                    key: 'user'
                },
                {
                    title: 'Огноо',
                    dataIndex: 'created_at',
                    key: 'created_at'
                }
            ],
            readColumns: [
                {
                    title: 'Хэрэглэгч',
                    dataIndex: 'user',
                    key: 'user'
                },
                {
                    title: 'Огноо',
                    dataIndex: 'created_at',
                    key: 'created_at'
                }
            ],
        }
    },
    computed: {
        lang () {
            const labels = [
                'registration_history',
                'Information_viewing_history',
            ]
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('crud.' + labels[i])
                return obj
            }, {})
        },
    },
    methods: {
        getLog () {
            this.logs = []
            this.reads = []
            axios.post('/crud_log/history', {
                schemaId: this.form,
                rowId: this.rowId
            }).then(res => {
                res.data.forEach(log => {

                    let datetime =formatDateTime(log.created_at)
                    const lastName = log.last_name ? log.last_name.charAt(0) + '.' : ""
                    if (log.action !== 'view') {
                        this.logs.push({
                            action: log.action == 'store' ? 'Бүртгэсэн' : 'Зассан',
                            user: lastName + log.first_name,
                            created_at:datetime
                        })
                    }
                    if (log.action === 'view') {


                        this.reads.push({
                            user: lastName + log.first_name,
                            created_at:datetime
                        })
                    }

                })
            })
        }
    },
    watch: {
        rowId () {
            this.getLog()
        }
    },
    mounted () {
        this.getLog()
    }
}

</script>
