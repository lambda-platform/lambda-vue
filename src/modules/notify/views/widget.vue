<template>
    <a-popover :placement="isMobile?'bottom':'bottomRight'" overlayClassName="header-notice-wrapper" trigger="click"
               :overlayStyle="{ width: isMobile?'250px':'350px', top: '50px' }"
    >
        <span :class="['header-notice', $attrs.class]">
            <a-badge :count="count">
                <span class="btn btn-icon">
                 <span class="svg-icon">
                     <inline-svg src="/assets/icons/duotune/general/gen007.svg"/>
                 </span>
                </span>
            </a-badge>
        </span>
        <template #content>
            <div class="notification-header">
                <h3>{{ lang.notice }}</h3>
            </div>
            <div class="notification-container">
                <a-list v-if="notifications?.length">
                    <a-list-item v-for="notif in notifications"
                                 :key="notif.id"
                                 :class="notif.seen === 0 ? 'notification-unseen' : ''"
                    >
                        <a-list-item-meta
                            :title="`${notif.title}`"
                            class="cursor-pointer"
                            @click="setSeen(notif.id, notif.link)"
                        >
                            <template #description>
                                <span>
                                    <span>{{ notif.body }} babab</span><br>
                                    <span :class="notif.seen === 0 ? 'notification-date-unseen' : 'notification-date'">{{ timeAgo(notif.created_at) }}</span>
                                </span>
                            </template>
                        </a-list-item-meta>
                        <span v-if="notif.seen === 0" class="notification-dot"></span>
                    </a-list-item>
                </a-list>
                <div v-else class="no-notification">
                    {{ lang.no_notice }}
                </div>
            </div>
            <a class="notification-footer" href="javascript:void(0)" @click="getAllNotification">
                <span>{{ lang.view_all_notifications }}</span> &nbsp;
                <i class="ti-arrow-right"></i>
            </a>
        </template>
    </a-popover>

    <a-modal
        v-model:open="isModalVisible"
        @ok="handleRequest"
        :centered="isMobile"
        wrap-class-name="full-modal"
    >
        <template #title>
            <inline-svg class="w-5 h-5" src="/assets/icons/duotune/general/gen007.svg"/>
            <div>Мэдэгдэл зөвшөөрөх</div>
        </template>
        <template #footer>
            <a-button key="submit" type="primary" @click="handleRequest">Зөвшөөрөх</a-button>
            <a-button key="back" @click="handleCancel">Дахин харуулахгүй</a-button>
        </template>
        <p>Системээс илгээж буй чухал мэдэгдлүүдийг цаг алдалгүй хүлээж авахыг хүсвэл
            <span style="white-space: nowrap;">"Зөвшөөрөх > Allow"</span> дарна уу.</p>
    </a-modal>
</template>

<script>
import {getMessaging, getToken, onMessage} from '@firebase/messaging';
import {toDateTime, getDateTime} from "../../../utils/date";
import {initializeApp, getApps} from '@firebase/app';
import moment from 'moment';
import 'moment/locale/mn'; // Import Mongolian locale
import axios from 'axios';

export default {
    props: ['userID', 'isMobile', 'extraClass'],
    inheritAttrs: false,

    data() {
        return {
            isModalVisible: false,
            notifications: [],
            count: 0,
        }
    },

    mounted() {
        this.isSupported();
        this.getUnseenNotification();
    },

    computed: {
        lang() {
            const labels = ['notice', 'no_notice', 'view_all_notifications'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('notify.' + labels[i])
                return obj;
            }, {})
        },

        timeAgo() {
            return (createdAt) => {
                // Check if the current locale is Mongolian
                if (this.$i18n.locale === 'mn_MN') {
                    moment.locale('mn');  // Set locale to Mongolian
                } else {
                    moment.locale('en');  // Set locale to English
                }
                return moment(createdAt).fromNow(); // Use moment to calculate time ago
            }
        }
    },

    methods: {
        isSupported() {
            if (!("Notification" in window)) {
                console.log("This browser does not support desktop notification");
            } else {
                if (Notification.permission === "default") {
                    const showModal = localStorage.getItem(`showNotificationModal_${this.userID}`);
                    if (showModal !== 'false') {
                        this.isModalVisible = true;
                    }
                } else if (Notification.permission === "granted") {
                    this.initializeFirebase();
                }
            }
        },

        async handleRequest() {
            this.isModalVisible = false;
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.initializeFirebase();
                } else if (permission === 'denied') {
                    console.warn('Notification permission denied.');
                }
            } catch (error) {
                console.error('Error during notification setup:', error);
            }
        },

        handleCancel() {
            this.isModalVisible = false;
            localStorage.setItem(`showNotificationModal_${this.userID}`, 'false');
        },

        initializeFirebase() {
            const maxRetries = 50;
            let retries = 0;

            if (window.init?.firebase_config) {
                if (getApps().length === 0) {
                    this.setupFirebase();
                }
            } else {
                const checkInitInterval = setInterval(() => {
                    if (window.init?.firebase_config) {
                        clearInterval(checkInitInterval);
                        if (getApps().length === 0) {
                            this.setupFirebase();
                        }
                    } else if (retries >= maxRetries) {
                        clearInterval(checkInitInterval);
                        console.error('Firebase config not found after maximum retries.');
                    }
                    retries++;
                }, 100);
            }
        },

        async setupFirebase(attempt = 0) {
            let firebaseConfig = window.init.firebase_config;
            const MAX_RETRY_ATTEMPTS = 3;

            try {
                const app = initializeApp(firebaseConfig);
                const messaging = getMessaging(app);

                onMessage(messaging, (payload) => {
                    this.notify(payload)
                });

                try {
                    const currentToken = await getToken(messaging, {vapidKey: firebaseConfig.publicKey});
                    if (currentToken) {
                        try {
                            await axios.get(`/lambda/notify/token/${this.$props.userID}/${currentToken}`);
                        } catch (error) {
                            console.error('Error sending token to server:', error);
                        }
                    } else {
                        console.warn('No registration token available. Request permission to generate one.');
                    }
                } catch (err) {
                    if (err instanceof DOMException && err.message.includes('Subscription failed - no active Service Worker')) {
                        if (attempt < MAX_RETRY_ATTEMPTS) {
                            console.error(`Service Worker not ready, retrying (${attempt + 1}/${MAX_RETRY_ATTEMPTS})...`, err);
                            setTimeout(() => this.setupFirebase(attempt + 1), 1000);
                        } else {
                            console.error('Service Worker failed to activate after multiple attempts. Please try again later.', err);
                        }
                    } else {
                        console.error('An error occurred while retrieving token.', err);
                    }
                }

            } catch (error) {
                console.error('Error during Firebase setup:', error);
            }
        },

        async getUnseenNotification() {
            try {
                const response = await axios.get('/lambda/notify/new/' + this.$props.userID);
                this.count = response.data.count;
                this.notifications = response.data.notifications;
            } catch (error) {
                console.error('Error fetching unseen notifications:', error);
            }
        },

        async getAllNotification() {
            try {
                const response = await axios.get('/lambda/notify/all/' + this.$props.userID);
                this.count = 0;
                this.notifications = response.data.notifications;
            } catch (error) {
                console.error('Error fetching all notifications:', error);
            }
        },

        async setSeen(id, link) {

            try {
                let currentNotif = this.notifications.find(item => item.id === id);
                if (currentNotif && currentNotif.seen === 0) {
                    const response = await axios.get('/lambda/notify/seen/' + id);
                    if (response.status === 200) {
                        currentNotif.seen = 1;
                        this.count = Math.max(0, this.count - 1);
                    }
                }
                this.$router.push(link);
            } catch (error) {
                console.error('Error setting notification as seen:', error);
            }
        },

        notify(msg) {
            let nIndex = this.notifications.findIndex(noti => noti.id === msg.data.id);

            if (nIndex === -1) {
                this.notifications.unshift({
                    title: msg.notification.title,
                    body: msg.notification.body,
                    link: msg.data.link,
                    first_name: msg.data.first_name,
                    created_at: msg.data.created_at,
                    id: msg.data.id,
                    seen: 0,
                })
                this.count = this.count + 1
            }

            let notificationAudio = new Audio(msg.data.sound);
            notificationAudio.play().catch(error => {
                console.error('Error playing notification sound:', error);
            });

            new Notification(msg.notification.title, {
                title: msg.notification.title,
                body: msg.notification.body,
                icon: msg.data.icon,
            });
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
}

.notification-container {
    max-height: 50vh;
    overflow-y: auto;
}

.notification-header {
    font-weight: bold;
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 10px;
}

.notification-date {
    font-size: 12px;
    font-style: italic;
}

.notification-date-unseen {
    font-size: 12px;
    font-style: italic;
    color: var(--ant-primary-color);
}

.notification-unseen {
    font-weight: bold;
}

.notification-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: var(--ant-primary-color);
    margin-left: 8px;
}

.notification-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 10px;
    border-top: 1px solid #f5f5f5;
}

.no-notification {
    padding: 20px;
}

.full-modal {
    .ant-modal {
        max-width: 100%;
    }

    .ant-modal-title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .ant-modal-title div {
        margin-left: 8px;
    }

    .ant-modal-content {
        text-align: center;
        color: gray;
    }

    .ant-modal-footer {
        text-align: center;
    }

    .ant-modal-footer button {
        width: 180px;
    }
}
</style>
