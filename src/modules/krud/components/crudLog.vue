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
import moment from 'moment'

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
                    if (log.action !== 'view') {
                        this.logs.push({
                            action: log.action == 'store' ? 'Бүртгэсэн' : 'Зассан',
                            user: log.last_name.charAt(0) + '.' + log.first_name,
                            created_at:moment(log.created_at).format("YYYY-MM-DD HH:mm:ss")
                        })
                    }
                    if (log.action === 'view') {
                        this.reads.push({
                            user: log.last_name.charAt(0) + '.' + log.first_name,
                            created_at:moment(log.created_at).format("YYYY-MM-DD HH:mm:ss")
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
