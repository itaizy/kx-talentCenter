<template>
  <div class="page-wrapper" v-title data-title="选题观点分析">
    <dl class="dl-group others">
      <dt><strong>分析对象：</strong></dt>
      <ul class="list-ul">
        <li class="list-btn" v-for="(name, source) in sources"
                            :key="source"
                            :class="{ active: selectedSource === source }"
                            @click="selectedSource = source">
          {{ name }}
        </li>
      </ul>
    </dl>
    <!-- <b-modal id="modal-addwords" size="lg" title="添加关键词组"
             ok-title="确认"
             cancel-title="取消"
             @ok="submitNewKeywords">
      <div class="input-box">
        <label>关键词组：</label>
        <b-form-input v-model="newwords"
                      type="text"
                      placeholder="输入关键词组，多个词用空格分隔"></b-form-input>
      </div>
    </b-modal> -->
    <v-filter-box :search-input.sync="searchInput"></v-filter-box>
    <!-- <v-source-list :disp-datas="dispDatas"
                   :loading="loading"
                   :start-idx="(pageno - 1) * 64 + 1"
                   :fetch-simitems-cb="fetchSimForeignsById"></v-source-list> -->
    <v-viewpoint-list :disp-datas="dispDatas"
                      :loading="loading"
                      :start-idx="(pageno - 1) * 64 + 1"
                      :isevent='isevent'></v-viewpoint-list>

    <b-pagination align="center" size="md" :limit="16"
                 :per-page="40"
                 :total-rows="10000"
                 :hide-goto-end-buttons="true"
                 :value="pageno"
                 @change="toPage">
    </b-pagination>
  </div>
</template>

<script type="text/ecmascript-6">

import Vue from 'vue'
import VBModal from 'bootstrap-vue/es/directives/modal/modal'
Vue.directive('b-model', VBModal);

import ViewpointList from 'components/list/ViewpointList'
import FilterBox from 'components/search/FilterBox'

export default {
  data () {
    return {
      dispDatas: [],
      currentPage: 2,
      totalRows: 160,
      searchInput: {
        dateStart: new Date(), // TODO truncate date to day unit.
        dateEnd: new Date(),
        includeText: false,
      },
      sources: {
        // 'all': '全部',
        // 'weibo': '微博',
        // 'wechat': '微信',
        // 'webnews': '网页',
        // 'tieba': '贴吧',
        // 'foreign': '外文',
        'event': '台海事件',
        'opinion': '台海专家观点'
      },
      isevent: true,
      pageno: 1,
      loading: true,
      keywords: [],
      selectedSource: 'event',
      newwords: '',
      sourceCancel: undefined, // axios.CancelToken.source(),
    };
  },
  watch: {
    searchInput: function (input) {
      this.fetchWarnings();
    },
    selectedSource: function () {
      this.pageno = 1;
      // this.fetchWarnings();
      this.fetchEvent();
      this.isevent = this.selectedSource === 'event';
    },
    pageno: function () {
      this.fetchWarnings();
    },
  },
  created () {
    this.fetchKeywords();
    // this.fetchWarnings();
    this.fetchEvent();
  },
  methods: {
    fetchEvent: function () {
      this.loading = true;
      this.dispDatas = [];

      if (this.sourceCancel) {
        this.sourceCancel.cancel('request out-of-date');
      }
      this.sourceCancel = axios.CancelToken.source(); // NOTICE: renew a cancel token for new request.
      if (this.selectedSource === 'event') {
        axios.get('/api/cache1/taihai/getTaihaiNews', {
          params: {
            size: 64,
            offset: (this.pageno - 1) * 64,
            source: this.selectedSource,
            // from: this.searchInput.dateStart.format('yyyy-MM-dd'),
            // to: this.searchInput.dateEnd.format('yyyy-MM-dd'),
            // secu: 55,
            // sorting: 'secu',
          },
          cancelToken: this.sourceCancel.token,
        }).then(response => {
          _.each(response.data, item => {
            item.username = item.user;
          });
          this.loading = false;
          this.dispDatas = response.data;
        })
      }
      if (this.selectedSource === 'opinion') {
        axios.get('/api/cache1/topic/getOpinion', {
          params: {
            datatag: 0,
            size: 64,
            offset: (this.pageno - 1) * 64,
            source: this.selectedSource,
            // from: this.searchInput.dateStart.format('yyyy-MM-dd'),
            // to: this.searchInput.dateEnd.format('yyyy-MM-dd'),
            // secu: 55,
            // sorting: 'secu',
          },
          cancelToken: this.sourceCancel.token,
        }).then(response => {
          _.each(response.data, item => {
            item.username = item.user;
          });
          this.loading = false;
          this.dispDatas = response.data;
        })
      }
    },
    fetchWarnings: function () {
      this.loading = true;
      this.dispDatas = [];

      if (this.sourceCancel) {
        this.sourceCancel.cancel('request out-of-date');
      }
      this.sourceCancel = axios.CancelToken.source(); // NOTICE: renew a cancel token for new request.

      if (this.selectedSource === 'foreign') {
        axios.get('/api/cache1/source/findDatasWith', {
          params: {
            size: 64,
            offset: (this.pageno - 1) * 64,
            source: this.selectedSource,
            from: this.searchInput.dateStart.format('yyyy-MM-dd'),
            to: this.searchInput.dateEnd.format('yyyy-MM-dd'),
            secu: 55,
            sorting: 'secu',
          },
          cancelToken: this.sourceCancel.token,
        }).then(response => {
          _.each(response.data, item => {
            item.username = item.user;
          });
          this.loading = false;
          this.dispDatas = response.data;
        });
      } else {
        axios.get('/api/legacy/getDataWithSecuFast', {
          params: {
            size: 64,
            offset: (this.pageno - 1) * 64,
            source: this.selectedSource,
            from: this.searchInput.dateStart.format('yyyy-MM-dd'),
            to: this.searchInput.dateEnd.format('yyyy-MM-dd'),
            secu: 55,
            sorting: 'secu',
          },
          cancelToken: this.sourceCancel.token,
        }).then(response => {
          this.loading = false;
          this.dispDatas = response.data;
        }).catch(r => { console.log(r); });
      }
    },
    fetchSimForeignsById: function (id, callback) {
      axios.get('/api/cache3/source/fetchSimForeignsById', {params: {
        id: id,
      }}).then(response => {
        callback(response.data);
      });
    },
    toPage: function (pageno) {
      this.pageno = pageno;
    },
    getTimeMargin (from, to) {
      let diff = (to.getTime() - from.getTime()) / 1000 / 3600 / 24;
      if (diff <= 1) {
        return '2';
      } else if (diff <= 7) {
        return '3';
      } else if (diff <= 30) {
        return '4';
      } else {
        return '5';
      }
    },
    fetchKeywords () {
      axios.get('/api/setting/getForeignWords', {params: {
        userid: 0,
      }}).then(response => {
        this.keywords = response.data.split(',');
      });
    },
    submitNewKeywords () {
      const params = new URLSearchParams();
      params.append('userid', 0);
      params.append('words', this.newwords);
      axios.post('/api/setting/addForeignWords', params.toString()).then(response => {
        this.keywords = response.data.words.split(',');
        this.fetchWarnings();
      });
    },
  },
  components: {
    'v-viewpoint-list': ViewpointList,
    'v-filter-box': FilterBox,
  }
}
</script>

<style lang="sass" scoped>
@import "~assets/sass/base"
@import "~assets/sass/mixin"
@import "~assets/sass/selectors"

.page-wrapper
  overflow: inherit
  height: auto
.modal-content
  top: 100px
  height: 275px
  line-height: 1.6rem
  font-size: 1.6rem
  .modal-body
    .input-box
      height: 100%
      margin-top: 50px
      input
        width: calc(100% - 100px)
        display: inline-block
        line-height: 1.6rem
        font-size: 1.6rem
  .modal-footer
    button
      width: 100px
      line-height: 1.6rem
      font-size: 1.6rem
</style>
