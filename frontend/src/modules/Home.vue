<template>
  <div class="page-wrapper" v-title data-title="综合推荐">
    <!-- <v-filter-tab @update:filter="updateFilter"></v-filter-tab> -->
    <!-- <v-search-box :search-input.sync="searchInput"></v-search-box> -->
    <v-list :disp-datas="dispDatas"
            :fetch-simitems-cb="fetchSimNewsById"></v-list>

    <!-- <b-pagination align="center" size="md" :limit="8"
                 :per-page="40"
                 :total-rows="totalRows"
                 @change="toPage">
    </b-pagination> -->
  </div>
</template>

<script type="text/ecmascript-6">

import Colors from 'components/Colors'
import List from 'components/list/kxList'
// import SearchBox from 'components/search/SearchBox'
// import FilterTab from 'components/filtertab/FilterTab'

export default {
  data () {
    return {
      Colors: Colors,
      dispDatas: [],
      currentPage: 2,
      totalRows: 160,
      // searchInput: {
      //   kws: '',
      //   dateStart: new Date(), // TODO truncate date to day unit.
      //   dateEnd: new Date(),
      //   includeText: false,
      // },
      // filter: {},
    };
  },
  watch: {
    // searchInput: function (input) {
    //   this.findNews(this.filter);
    // },
  },
  created () {
    this.findNews();
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    findNews: function (filter = {
      selectedTypes: [],
      selectedLanguge: '全部',
      selectedLocation: '全部',
      selectedSecu: false,
      selectedWords: [],
    }) {
      axios.get('/serverapi/fetchNews', {params: {
        // from: this.searchInput.dateStart.format('yyyy-MM-dd'),
        // to: this.searchInput.dateEnd.format('yyyy-MM-dd'),
        // kws: _.join(_.reject(_.concat(this.searchInput.kws.split(' '), filter.selectedWords), _.isEmpty), ' '),
        // include_text: this.searchInput.includeText,
        // size: 64,
        // sort: filter.selectedSecu ? 'risk' : '', // 如果选中“突发敏感”，搜索时按secu排序，否则按时间排序
        // types0: _.join(filter.selectedLegacyTypes, ' '),
        // types2: _.join(filter.selectedTypes, ' '),
        // language: filter.selectedLanguge,
        // location: filter.selectedLocation,
      }}).then(response => {
        this.dispDatas = response.data.data;
        console.log(response.data.data)
      });
    },
    fetchSimNewsById: function (id, callback) {
      // axios.get('/api/cache3/source/fetchSimNewsById', {params: {
      //   id: id,
      // }}).then(response => {
      //   callback(response.data);
      // });
    },
    // fetchSimNewsById: function (id, callback) {
    //   axios.get('/api/cache3/source/fetchSimNewsById', {params: {
    //     id: id,
    //   }}).then(response => {
    //     callback(response.data);
    //   });
    // },
    toPage: function (pageno) {
      console.log('TODO: to page ' + pageno);
    },
    updateFilter: function (filter) {
      this.filter = filter;
      this.findNews(filter);
    },
  },
  components: {
    'v-list': List,
    // 'v-search-box': SearchBox,
    // 'v-filter-tab': FilterTab,
  }
}
</script>

<style lang="sass" >
@import "../assets/sass/mixin"

.real-body
  min-height: 100%
  height: 100%
  display: flex
  flex-direction: column
  .r-header
    flex: 0 0 auto
  .page-wrapper
    flex: 1 0 auto
  .r-footer
    flex: 0 0 auto
</style>

<style lang="sass" scoped>
.page-wrapper
  overflow: inherit
  height: auto
.pagination
  margin-bottom: 1.5rem
  justify-content: center
@media (min-width: 1200px)
  .container
    width: 1200px
.page-wrapper
  width: 100%
  margin: 20px auto 0
  overflow: auto
  background-color: #fff
  padding: 20px 15px
  position: relative
  flex-direction: column
@media (min-width: 1200px)
  .page-wrapper
    width: 1200px
    min-height: 525px
@media (max-width: 768px)
  .page-wrapper
    margin-top: 0
.roll-warning-list-move
  transition: transform 1s
</style>
