import sensors from 'sa-sdk-javascript'
import SETTING from '@/setting'

sensors.init({
  server_url: `https://logtrace.souyidai.com/sa?project=${SETTING.SENSORS_PROJECT}`,
  web_url: `http://shence.soydai.cn/sa?project=${SETTING.SENSORS_PROJECT}`,
  heatmap: {
    clickmap: 'default',
    scroll_notice_map: 'default'
  },
  is_track_single_page: true,
  show_log: false
})

sensors.quick('autoTrack', {
  platForm: 'h5'
})

export default sensors
