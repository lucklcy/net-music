<template>
  <div
    class="song-list"
    v-if="playlist"
  >
    <section
      class="header"
      :style="{backgroundImage:'url('+playlist.coverImgUrl+')'}"
    >
      <div class="title-bar">
        <span class="backup" @click="goBack"></span>
        <span class="title">歌单</span>
        <MiniPlayer></MiniPlayer>
      </div>
      <div class="content">
        <div
          class="pic"
          :style="{backgroundImage:'url('+playlist.coverImgUrl+')'}"
        ></div>
        <div class="label">
          <span class="title">{{playlist.name | limitIn(14)}}</span>
          <span class="author">
            <i class="author-pic" :style="{backgroundImage:'url('+playlist.creator.avatarUrl+')'}"></i>
            {{playlist.creator.nickname}}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { mixins } from "vue-class-component";
import { Component, Vue, Prop } from "vue-property-decorator";
import CommonMixin from "@/mixins/comMix";
import { State } from "vuex-class";
import MiniPlayer from "~/business/player/mini.vue";

export interface ICreator {
  avatarUrl: string;
  birthday: number;
  nickname: string;
  userId: number;
  city: number;
  province: number;
  [propName: string]: any;
}

interface IAl {
  id: number;
  name: string;
  pic: number;
  picUrl: string;
  [propName: string]: any;
}

export interface ITrack {
  id: number;
  al: IAl;
  name: string;
}
export interface IPlaylist {
  creator: ICreator;
  tracks: ITrack[];
  coverImgUrl: string;
  createTime: number;
  description: string;
  name: string;
  [propName: string]: any;
}

@Component({
  components: {
    MiniPlayer
  }
})
export default class SongList extends mixins(CommonMixin) {
  private playlist: IPlaylist | null = null;

  private goBack() {
    this.$router.push({ name: "r_home_recommand" });
  }
  created() {
    let songListId = this.$route.query && this.$route.query.id;
    this.service
      .getPlayListDetail({ id: songListId })
      .then((playListDetail: { playlist: IPlaylist }) => {
        this.playlist = playListDetail && playListDetail["playlist"];
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }
}
</script>
<style lang="scss" scoped src='./songlist.scss'></style>

