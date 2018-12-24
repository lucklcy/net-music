import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Recommander from '~/business/home/recommander.vue'
import Broadcaster from '~/business/home/broadcaster.vue'
import SongList from '~/business/list/songlist.vue'
import SongTableIndex from '~/business/songTable/index.vue'
import SongTableHighQuality from '~/business/songTable/highQuality.vue'
import TopList from '~/business/topList/index.vue'
import TableCatChoose from '~/business/songTable/catChoose.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'r_home',
      component: Home,
      children: [
        {
          path: 'recommand',
          name: 'r_home_recommand',
          component: Recommander
        },
        {
          path: 'broadcast',
          name: 'r_home_broadcast',
          component: Broadcaster
        }
      ]
    },
    {
      path: '/',
      name: 'r_index',
      redirect: { name: 'r_home_recommand' }
    },
    {
      path: '/song-list/:id',
      name: 'r_song_list',
      component: SongList
    },
    {
      path: '/table',
      name: 'r_song_table_index',
      component: SongTableIndex
    },
    {
      path: '/table/cat-choose',
      name: 'r_table_cat_choose',
      component: TableCatChoose
    },
    {
      path: '/table/high-quality',
      name: 'r_song_table_high_quality',
      component: SongTableHighQuality
    },
    {
      path: '/top-list',
      name: 'r_top_list',
      component: TopList
    }
  ]
})
