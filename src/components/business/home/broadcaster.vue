<template>
  <div class="main-content">
    <p class="title">{{title}}</p>
    <div class="program-container">
      <ul class="program-list">
        <li v-for="(item,index) in ProgramList" :key="index" @click="onProgramPlay(item)">
          <div class="program-item">
            <div class="pic" :data-background-img='item.coverUrl' v-change-back-img>
              <SvgIcon :iconClass="'program-play'" :className="'program-play'"></SvgIcon>
            </div>
            <div class="content">
              <span class="name">{{item.name | limitIn(16)}}</span>
              <span class="count">
                <SvgIcon :iconClass="'earpod'" :className="'earpod'"></SvgIcon>
                <i>{{item.listenerCount|dealWithPlayCount}}</i>
              </span>
              <span class="desc">{{item.description | limitIn(46)}}</span>
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
import { IDJPrograms, IPrograms, IPlaySong } from '@/common/interface/base.ts'
import CommonMixin from '@/mixins/comMix'
import ChangeBackImg from '@/directives/changeBackImg.ts'
import { isIos } from '@/utils/index.ts'

interface IBannerDataList {
  imageUrl: string
  url: string | null
  [propName: string]: any
}

@Component({
  components: {},
  directives: {
    'change-back-img': ChangeBackImg
  }
})
export default class Broadcaster extends mixins(CommonMixin) {
  private ProgramList: IPrograms[] = []
  private title: string = ''
  @State iosAudioTrigger: boolean

  @Mutation addIntoPlayList: (song: IPlaySong) => void
  @Mutation setCurrentSong: (id: number) => void
  @Mutation changeFullScreen: (fullScreenFlag: boolean) => void
  @Mutation changePlayingStatus: (playingFlag: boolean) => void
  @Mutation changeIosAudioTrigger: (flag: boolean) => void
  private onProgramPlay(item: IPrograms) {
    const songItem: IPlaySong = {
      id: item['mainSong']['id'],
      name: item['name'],
      picUrl: item['coverUrl'],
      songer: item['dj']['brand'],
      duration: item['duration'] / 1000
    }
    this.changePlayingStatus(false)
    this.addIntoPlayList(songItem)
    this.changeFullScreen(true)
    this.setCurrentSong(item['mainSong']['id'])
    if (isIos && !this.iosAudioTrigger) {
      const audio = document.querySelector('#song_audio') as HTMLAudioElement
      try {
        audio.play()
        audio.pause()
        this.changeIosAudioTrigger(true)
      } catch (error) {
        console.log({ error })
      }
    }
  }

  created() {
    this.service
      .getProgramRecommend({})
      .then((resultProgramsList: { programs: IPrograms[]; name: string }) => {
        this.title = resultProgramsList && resultProgramsList['name']
        this.ProgramList = resultProgramsList && resultProgramsList['programs']
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }
}
</script>
<style lang="scss">
$baseAssets: '../../../assets';
.main-content {
  position: relative;
  -webkit-overflow-scrolling: touch;
  $baseAssets: '../../../assets';
  .title {
    padding: 28px 0 28px 50px;
    font-size: 0.42rem;
    font-weight: bold;
    color: #444;
  }
  .program-container {
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


