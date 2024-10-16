import dayjs from 'dayjs/esm/index'
import advancedFormat from 'dayjs/esm/plugin/advancedFormat/index'
import customParseFormat from 'dayjs/esm/plugin/customParseFormat/index'
import localeData from 'dayjs/esm/plugin/localeData/index'
import weekday from 'dayjs/esm/plugin/weekday/index'
import weekOfYear from 'dayjs/esm/plugin/weekOfYear/index'
import weekYear from 'dayjs/esm/plugin/weekYear/index'
import isoWeek from 'dayjs/esm/plugin/isoWeek'
import updateLocale from 'dayjs/esm/plugin/updateLocale'
import relativeTime from 'dayjs/esm/plugin/relativeTime'

import  'dayjs/esm/locale/mn';
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(relativeTime)
dayjs.extend(isoWeek)
dayjs.extend(updateLocale)


dayjs.locale('mn');
dayjs.updateLocale("mn_MN", {
    weekStart: 1
})
dayjs.updateLocale("mn", {
    weekStart: 1
})
// export default dayjs
export default dayjs
