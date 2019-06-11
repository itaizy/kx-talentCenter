<template>
  <div class="row main-row" v-title data-title="Ring 事件概览">
    <div class="col-md-12">
      <div class="r-panel hotnews-panel">
        <div class="panel-title-wrapper">
          <div class="panel-title">
            <span>事件概览</span>
            <div class="switch">
              <span class="fa"
                :class="{
                  'fa-toggle-on': translated,
                  'fa-toggle-off': !translated
                }"
                @click="translated = !translated"></span>
              <label class="toggle-label">翻译</label>
            </div>
          </div>
        </div>
        <div class="events-wrapper">
          <!-- <ul class="event-panel-detail">
            <li >
              <label for="">描&nbsp;&nbsp;&nbsp;述：</label><span class="title">{{ event.description && event.description.trim() }}</span>
            </li>
            <li>
              <label for="">参与者：</label><span>{{ event.participant }}</span><br class="event-br">
              <label for="">关键词：</label><span>{{ event.corewords }}</span>
            </li>
            <li>
              <label for="">类&nbsp;&nbsp;&nbsp;型：</label><span>{{ event.e_type | toLegacyType }}</span><br class="event-br">
              <label for="">标&nbsp;&nbsp;&nbsp;签：</label><span>{{ event.eventType2 | toManyType }}</span><br class="event-br">
              <label for="">情&nbsp;&nbsp;&nbsp;绪：</label><span>{{ event.emotion | toEmotion }}</span>
            </li>
            <li>
              <label for="">时&nbsp;&nbsp;&nbsp;间：</label><span>{{ event.eventSpanDateString }}</span><br class="event-br">
              <label for="">地&nbsp;&nbsp;&nbsp;点：</label><span>{{ event.eventLoc }}</span><br class="event-br">
              <label for="">来&nbsp;&nbsp;&nbsp;源：</label><span>{{ event | eventFrom }}</span>
            </li>
          </ul> -->
          <v-desc-view :event="event"></v-desc-view>
          <div class="event-panel event-panel-source">
            <div id="source-timeline" class="event-chart"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6" scoped>

import Echarts from 'vue-echarts-v3/src/lite'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts-wordcloud'

import DescView from 'components/event/DescView'

// css for timeline.
require('components/event/TimelineJS/timeline.css')

export default {
  props: {
    event: {
      type: Object,
    },
  },
  data () {
    return {
      // 源数据 id 和数据的映射
      unique_id: -1,
      sourceMap: {},
      // for timeline
      timeline: {},
      loading: {
        timeline: true,
        source: true,
        words: true,
      },
      translated: false,
      event_source_option: {
        title: {
          name: '数据来源'
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['微博', '微信', '网页', '贴吧'],
        },
        series: [{
          type: 'pie',
          radius: ['50%', '75%'],
          data: [
            {name: '微信', value: 0},
            {name: '网页', value: 0},
            {name: '贴吧', value: 0},
            {name: '微博', value: 0},
          ],
        }, {
          type: 'pie',
          radius: [0, '30%'],
          data: [],
          label: {
            normal: {
              color: ['#250303', '#255025'],
              fontWeight: 'bold',
            },
          },
        }],
      },
      word_cloud_option: {
        title: {
          name: '关键词云'
        },
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          width: '150%',
          height: '150%',
          sizeRange: [16, 36],
          gridSize: 8,
          data: [],
        }],
      },
    };
  },
  watch: {
    translated: function (nendtrans) {
      // 首先判断该Id的源数据存在且可以翻译。
      if (this.sourceMap[this.unique_id] && this.sourceMap[this.unique_id].origin_title) {
        let title = '';
        let content = '';
        if (nendtrans) {
          title = this.sourceMap[this.unique_id].title;
          content = this.sourceMap[this.unique_id].content;
        } else {
          title = this.sourceMap[this.unique_id].origin_title;
          content = this.sourceMap[this.unique_id].origin_content;
          this.translated = false;
        }
        const dom = _.find(this.$el.getElementsByClassName('tl-slide-text-only'), x => x.id === this.unique_id);
        const titleWrapper = dom.getElementsByClassName('tl-headline');
        if (titleWrapper.length > 0) {
          titleWrapper[0].getElementsByTagName('a')[0].innerText = title;
        }
        const contentWrapper = dom.getElementsByClassName('tl-text-content');
        if (contentWrapper.length > 0) {
          contentWrapper[0].getElementsByTagName('p')[0].innerText = content;
        }
      }
    },
    unique_id: id => {
      console.log(id);
    },
  },
  created () {
    this.fetchEventSource();
    this.fetchWorldCloud();
  },
  mounted () {
    require(['components/event/TimelineJS/timeline.js'], this.makeTimeLine);
  },
  methods: {
    fetchEventSource () {
      axios.get('/api/legacy/getEventSourceCount', {params: {
        eventId: this.$route.params.eventId,
      }}).then(response => {
        let data = [
          {name: '微信', value: response.data.wechat},
          {name: '网页', value: response.data.news},
          {name: '贴吧', value: response.data.tieba},
        ];
        if (response.data.weibo) {
          data.push({name: '微博', value: response.data.weibo});
        }
        this.event_source_option.series[0].data = _.orderBy(data, 'value', 'desc');
        this.loading.source = false;
      });
    },
    makeTimeLine (TL) {
      TL = TL.default;
      axios.get('/api/legacy/getEventSourceById',{params: {
        eventId: this.$route.params.eventId,
        similarity: true,
      }}).then(response => {
        let sources = {
          events: [],
        };
        response.data = _.orderBy(response.data, 'releaseDate');

        let maxSim = 0.0;
        let maxSimIndex = -1;

        if (_.isEmpty(response.data)) { // 如果返回的源数据为空，显示事件本身。
          let date = new Date(this.event.time);
          sources.events = [{
            start_date: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
              hour: date.getHours(),
              minute: date.getMinutes(),
              second: date.getSeconds(),
              display_date: date.format('yyyy-MM-dd hh:mm:ss'),
            },
            text: {
              headline: '<a href="#/event/detail/' + this.event.eventId + '" target="_blank">' + this.event.description + '</a>',
              text: '',
            },
            unique_id: this.event.eventId,
          }];
        } else {
          sources.events = _.map(response.data, item => {
            let date = new Date(item.releaseDate);

            let text = item.content;
            if (item.foreign && item.content) {
              text = '<div class="text-content-wrapper">' +
                     '<div class="text-content-inner text-content-left">' + item.origin_content + '</div>' +
                     '<div class="text-content-sep"></div>' +
                     '<div class="text-content-inner text-content-right">' + item.content + '</div>' +
                     '</div>';
            }

            let source = {
              start_date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds(),
                display_date: date.format('yyyy-MM-dd hh:mm:ss'),
              },
              text: {
                headline: '<a href="' + item.url + '" target="_blank">' + (item.origin_title || item.title) + '</a>',
                text: text,
              },
              unique_id: item.id,
            };
            // TODO
            // if (item.url) {
            //   let media = {
            //     caption: item.username,
            //     url: item.url,
            //   };
            //   if (item.headPic) {
            //     media.thumbnail = item.headPic;
            //   }
            //   source.media = media;
            // }
            return source;
          });
          this.unique_id = _.last(response.data).id;

          // calculate max similarity index.
          for (var i = 0; i < response.data.length; ++i) {
            if (response.data[i].similarity > maxSim) {
              maxSimIndex = i;
              maxSim = response.data[i].similarity;
            }
          }
        }
        let options = { language: 'zh_CN', start_at_end: true };
        this.timeline = new TL.Timeline('source-timeline', sources, options);
        // event binding
        this.timeline.on('change', value => {
          this.unique_id = value.unique_id;
        });
        if (maxSimIndex >= 0) {
          this.timeline.goTo(maxSimIndex);
        }
        // Store source data in map.
        _.each(response.data, item => {
          this.sourceMap[item.id] = item;
        });

        // 外文数据构成比例图
        if (this.event.foreign) {
          let foreignNews = 0;
          let nonforeignNews = 0;
          _.each(response.data, item => {
            if (item.datatag === 'webnews') {
              if (item.foreign) {
                foreignNews += 1;
              } else {
                nonforeignNews += 1;
              }
            }
          });
          this.event_source_option.series[1].data = [
            {name: '外文新闻', value: foreignNews, selected: true},
            {name: '中文新闻', value: nonforeignNews},
          ];
        }
      });
    },
    fetchWorldCloud () {
      this.loading.words = true;
      axios.get('/api/legacy/getCorewordsByEventId',{params: {
        eventId: this.$route.params.eventId,
      }}).then(response => {
        let words = _.map(response.data.slice(0, 30), item => {
          return {name: item.text, value: item.weight * 2};
        });
        this.word_cloud_option.series[0].data = words;
        this.loading.words = false;
      });
    },
  },
  components: {
    'Echarts': Echarts,
    'v-desc-view': DescView,
  },
};
</script>

<style lang="sass" scoped>
@import "~assets/sass/mixin"

.r-panel
  height: 100%

.events-wrapper
  display: flex
  flex-direction: column
  flex: 1

.event-panel
  display: flex
  flex: 1 1 auto
  overflow-y: auto

.event-panel.event-panel-source
  flex: 1 1 0
  height: auto
  overflow-y: hidden
  padding: 0 1.5rem 1rem
  .event-chart
    height: inherit
    display: flex
    flex: 1 1 0

.r-panel
  .event-chart
    display: flex
    flex: 1 1 0
</style>

<style lang="sass">

/*css for timeline.*/
.tl-storyslider
    /*padding: 25px 0 35px*/
.tl-slide
  overflow-y: hidden!important
  .tl-slide-content-container
    .tl-slide-content
      .tl-text
        overflow: hidden
        .tl-headline-date
          font-size: 14px
          margin-bottom: 4px
          color: #999
        h2.tl-headline
          font-size: 24px
          line-height: 28px
          max-height: 56px
          overflow: hidden
          font-weight: bold
          margin-bottom: 8px
          a
            /*color: #414b54*/
            transition: .3s
            &:focus, &:hover
              color: #256bcc
        .tl-text-content
          max-height: 140px
          overflow: hidden
          p
            font-size: 14px
            line-height: 20px
            margin-top: 0
            color: #454545
.tl-storyslider
  .tl-slidenav-title
    display: none!important
  .tl-slidenav-description
    display: none!important
.tl-slidenav-icon
  color: #999!important
  transition: .3s
  &:hover
    color: #454545!important

/* Timeline里面外文/中文内容并排显示 */
.text-content-wrapper
  display: flex
  justify-content: space-between
  .text-content-inner
    width: 46%
    display: inline-block
  .text-content-sep
    width: 1px
    border-left: 2px solid
    display: inline-block

</style>
