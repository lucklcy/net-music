<template>
  <div class="recommend-song-list-container">
    <TopBar back-route-name='r_song_table_mine' title='今日推荐歌歌曲'></TopBar>
    <div class="play-all border-bottom-1px" @click="playAllRecommendSong">
      <span>播放全部</span>
    </div>
    <div class="song-list-container">
      <ul class="program-list">
        <li v-for="(item,index) in RecommendSongList" :key="index" @click="onSongPlay(item)">
          <div class="program-item">
            <div class="pic" :data-background-img='item.album.picUrl' v-change-back-img>
              <SvgIcon iconClass="program-play" className="program-play"></SvgIcon>
            </div>
            <div class="content">
              <span class="name">{{item.name}}</span>
              <span class="count">
                <SvgIcon :iconClass="'earpod'" :className="'earpod'"></SvgIcon>
                <i>{{item.artistes}}</i>
              </span>
              <span class="desc">{{item.reason | limitIn(46)}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import { IPlaySong, IFmPlayItm } from '@/common/interface/base.ts'
import CommonMixin from '@/mixins/comMix'
import ChangeBackImg from '@/directives/changeBackImg.ts'
import { isIos } from '@/utils/index.ts'
import TopBar from '~/foundation/com/topBar.vue'

@Component({
  components: { TopBar },
  directives: {
    'change-back-img': ChangeBackImg
  }
})
export default class RecommendSongList extends mixins(CommonMixin) {
  private RecommendSongList: IFmPlayItm[] = []
  private title: string = ''
  @State
  iosAudioTrigger: boolean

  @Mutation
  addIntoPlayList: (song: IPlaySong) => void
  @Mutation
  setCurrentSong: (id: number) => void
  @Mutation
  changeFullScreen: (fullScreenFlag: boolean) => void
  @Mutation
  changePlayingStatus: (playingFlag: boolean) => void
  @Mutation
  changeIosAudioTrigger: (flag: boolean) => void
  @Mutation
  changeFmPlayStatus: (flag: boolean) => void
  private onSongPlay(item: IFmPlayItm) {
    this.changeFmPlayStatus(false)
    if (isIos && !this.iosAudioTrigger) {
      const audio = document.querySelector('#song_audio') as HTMLAudioElement
      try {
        audio.play()
        audio.pause()
        this.changeIosAudioTrigger(true)
      } catch (error) {}
    }
    const songItem: IPlaySong = {
      id: item['id'],
      name: item['name'],
      picUrl: item['album']['picUrl'],
      songer: item['artistes'],
      duration: item['duration'] / 1000,
      liked: false
    }
    this.changePlayingStatus(false)
    this.addIntoPlayList(songItem)
    this.changeFullScreen(true)
    this.setCurrentSong(item['id'])
  }

  private playAllRecommendSong() {
    let RecommendSongList = this.RecommendSongList
    if (RecommendSongList && RecommendSongList.length > 0) {
      RecommendSongList.forEach((item, index) => {
        const songItem: IPlaySong = {
          id: item['id'],
          name: item['name'],
          picUrl: item['album']['picUrl'],
          songer: item['artistes'],
          duration: item['duration'] / 1000,
          liked: false
        }
        this.addIntoPlayList(songItem)
        if (index === 0) {
          this.onSongPlay(item)
        }
      })
    }
  }

  created() {
    this.service
      .getRecommandSongs({})
      .then((resultRecommendSongList: { recommend: IFmPlayItm[] }) => {
        let recommend = resultRecommendSongList && resultRecommendSongList['recommend']
        if (recommend && recommend.length > 0) {
          recommend.forEach(item => {
            let artists = item['artists']
            let artistes = artists
              .map(innerItem => {
                return innerItem['name']
              })
              .join('/')
            item['artistes'] = artistes
          })
        }
        this.RecommendSongList = recommend
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }
}
</script>
<style lang="scss">
$baseAssets: '../../../assets';
.recommend-song-list-container {
  position: relative;
  -webkit-overflow-scrolling: touch;
  $baseAssets: '../../../assets';
  @include setSize(100%, 100%);
  @include setFlexPos(column, flex-start, flex-start);
  .play-all {
    @include setSize(100%, 120px);
    @include setFlexPos(row, center, center);
    &.border-bottom-1px {
      @include border-set(bottom, $border-color);
    }
    color: #999;
    font-size: 0.42rem;
  }
  .song-list-container {
    flex: 1;
    @include setSize(100%, '');
    padding: 20px 0 0 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .program-list {
      padding: 0 50px;
      li {
        margin-bottom: 20px;
      }
      .program-item {
        @include setFlexPos(row, flex-start, center);
        .pic {
          border-radius: 12px;
          position: relative;
          @include setSize(240px, 240px);
          @include setBgImg('#{$baseAssets}/img/cd-default.png', center, center, cover, no-repeat);
          @include setFlexPos(row, center, center);
          .program-play {
            font-size: 0.9rem;
            color: #ffffffd2;
          }
        }
        .content {
          margin-left: 20px;
          @include setFlexPos(column, space-around, flex-start);
          @include setSize(74%, 240px);
          font-size: 0.222222rem;
          .name {
            display: inline-block;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 0.351852rem;
            color: #555;
          }
          .count {
            font-size: 0.3rem;
            color: #666;
            i {
              position: relative;
              top: 1px;
              font-style: normal;
              margin-left: 16px;
            }
            .earpod {
              font-size: 0.28rem;
            }
          }
          .desc {
            color: #999;
          }
        }
      }
    }
  }
}
</style>