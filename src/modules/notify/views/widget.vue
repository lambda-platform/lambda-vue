<template>
    <a-popover placement="bottom" overlayClassName="header-notice-wrapper"  trigger="click"  :overlayStyle="{ width: isMobile?'250px':'300px', top: '50px' }">
        <span class="header-notice">
            <a-badge :count="count">
                <span class="btn btn-icon">
                 <span class="svg-icon">
                     <inline-svg
                          src="/assets/icons/duotune/general/gen007.svg"
                      />
                 </span>
                </span>
            </a-badge>
        </span>
        <template #content>
            <div class="header-notification-info">
                <h3>{{ lang.notice }}</h3>
            </div>
            <a-list v-if="notifications.length > 0" >
                <a-list-item v-for="(notif, index) in notifications" :class="notif.seen ? 'seen' : ''">
                    <a-list-item-meta :title="`${notif.title}, ${notif.first_name != null ? notif.first_name : notif.login}`" :description="`${notif.body} \n ${$date(notif.created_at)}`" @click="setSeen(notif.id, notif.link)">

                    </a-list-item-meta>
                </a-list-item>
            </a-list>
            <div v-else class="no-notifs">
                {{ lang.no_notice }}
            </div>

            <a class="all-notif" href="javascript:void(0)" @click="getAllNotification">
                <span>{{ lang.view_all_notifications }}</span> &nbsp;
                <i class="ti-arrow-right"></i>
            </a>
        </template>
    </a-popover>
</template>

<script>
import {
    initializeApp,
    getApps
} from '@firebase/app'
import {getMessaging, getToken, onMessage} from '@firebase/messaging'

import axios from 'axios'
export default {
    props: ['userID', 'isMobile'],
    data () {
        return {
            notifications: [],
            count: 0
        }
    },

    mounted () {
        if(window.init.firebase_config.apiKey){
            if (getApps().length === 0) {
                this.initFirebase()
                this.getNotificationGrant()
            }
            this.getUnseenNotification()
        }

    },
    computed: {
        lang () {
            const labels = ['notice', 'no_notice', 'view_all_notifications']
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('notify.' + labels[i])
                return obj
            }, {})
        },
    },
    methods: {

        getNotificationGrant () {
            Notification.requestPermission().then((permission) => {
                if (permission !== 'granted') {
                    console.log('Unable to get permission to notify.')
                }
            })
        },
        initFirebase () {

            var firebaseConfig = {
                apiKey: window.init.firebase_config.apiKey,
                authDomain: window.init.firebase_config.authDomain,
                databaseURL: window.init.firebase_config.databaseURL,
                projectId: window.init.firebase_config.projectId,
                storageBucket: window.init.firebase_config.storageBucket,
                messagingSenderId: window.init.firebase_config.messagingSenderId,
                appId: window.init.firebase_config.appId,
                measurementId: window.init.firebase_config.measurementId
            }
            try {
                // Initialize Firebase
                const app = initializeApp(firebaseConfig)

                const messaging = getMessaging(app);

                getToken(messaging, window.init.firebase_config.publicKey).then((currentToken) => {

                    if (currentToken) {
                        axios.get('/lambda/notify/token/' + this.$props.userID + '/' + currentToken).then(o => {

                        })
                    } else {
                        console.log('No Instance ID token available. Request permission to generate one.')
                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err)
                })

                onMessage(messaging, (payload) => {
                    this.notify(payload.data)
                })
            } catch (e){

            }



        },

        getUnseenNotification () {
            axios.get('/lambda/notify/new/' + this.$props.userID).then(o => {
                this.count = o.data.count
                this.notifications = o.data.notifications
            })
        },
        getAllNotification () {
            axios.get('/lambda/notify/all/' + this.$props.userID).then(o => {
                this.count = 0
                this.notifications = o.data.notifications
            })
        },

        setSeen (id, link) {
            axios.get('/lambda/notify/seen/' + id).then(o => {
                if (o.status) {
                    this.count = this.count >= 1 ? this.count - 1 : 0
                    let currentNotif = this.notifications.find(item => item.id == id)
                    if (currentNotif) {
                        currentNotif.seen = true
                    }
                    this.$router.push(link)
                }
            })
        },

        notify (msg) {
            console.log(msg)
            // let parsedMsg = JSON.parse(msg.message);
            // console.log(parsedMsg);

            let nIndex = this.notifications.findIndex(noti => noti.id == msg.id)

            if (nIndex == -1) {
                this.notifications.unshift({
                    title: msg.title,
                    body: msg.body,
                    link: msg.link,
                    first_name: msg.first_name,
                    created_at: msg.created_at,
                    id: msg.id,
                })
                this.count = this.count + 1
            }
            let notificationAudio = new Audio(msg.sound)
            notificationAudio.play()
            new Notification(msg.title, {
                title: msg.title,
                body: msg.body,
                icon: msg.icon,
            })

        },
    }
}
</script>

<style lang="scss">
.ivu-notice {
    top: auto !important;
    bottom: 30px;

    a {
        color: #565656;
        font-size: 12px;

        h4 {
            margin-bottom: 5px;
            font-weight: 500;
            font-size: 14px;
        }
    }

    &-notice {

    }
}
</style>
