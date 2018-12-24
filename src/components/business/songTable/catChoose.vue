<template>
  <div class="cat-choose">
    <div class="top">
      <span class="cancel" @click="onCancel">取消</span>
      <span class="content">筛选歌单</span>
    </div>
    <Scroll class="container" ref="categoryContaioner" :data-list="[]" v-if="categoryList && categoryList.length>0">
      <section>
        <div class="all">
          <div :class="['title','border-1px',{'active':tableCat===''}]" @click="onCategoryItemClick('')">
            <span>全部歌单</span>
            <SvgIcon v-if="tableCat===''" :iconClass="'right-triangle'" :className="'right-triangle'"></SvgIcon>
          </div>
        </div>
        <div class="space">&nbsp;</div>
        <template v-for="(item,index) in categoryList">
          <div class="t-head">
            <div :class="{'c-type':true, 'border-bottom-1px':item.val.length > 6}">
              <div class="inner-container border-right-1px">
                <span :class="['icon','code-'+item.code]">
                  <SvgIcon v-if="item.code==='0'" :iconClass="'category-language'" :className="'category-language'"></SvgIcon>
                  <SvgIcon v-if="item.code==='1'" :iconClass="'category-style'" :className="'category-style'"></SvgIcon>
                  <SvgIcon v-if="item.code==='2'" :iconClass="'category-scene'" :className="'category-scene'"></SvgIcon>
                  <SvgIcon v-if="item.code==='3'" :iconClass="'category-emotion'" :className="'category-emotion'"></SvgIcon>
                  <SvgIcon v-if="item.code==='4'" :iconClass="'category-theme'" :className="'category-theme'"></SvgIcon>
                </span>
                <span class="name">
                  {{item.key}}
                </span>
              </div>
            </div>
            <div class="t-head-container">
              <div :class="{'category-item':true, 'border-bottom-1px':innterItem.hasBottom}" v-for="(innterItem,innnerIndex) in item.val"
                v-if="innnerIndex < 6" @click="onCategoryItemClick(innterItem.name)">
                <span :class="{'border-right-1px':true,'active':tableCat===innterItem.name,'hot':innterItem.hot}">
                  {{innterItem.name}}
                  <SvgIcon v-if="innterItem.hot" :iconClass="'hot-triangle'" :className="'hot-triangle'"></SvgIcon>
                  <SvgIcon v-if="tableCat===innterItem.name" :iconClass="'right-triangle'"
                    :className="'right-triangle'"></SvgIcon>
                </span>
              </div>
            </div>
          </div>
          <div class="t-foot" v-if="item.val.length > 6">
            <div :class="{'category-item':true, 'border-bottom-1px':innterItem.hasBottom}" v-for="(innterItem,innnerIndex) in item.val"
              v-if="innnerIndex >=6" @click="onCategoryItemClick(innterItem.name)">
              <span :class="{'border-right-1px':true,'active':tableCat===innterItem.name,'hot':innterItem.hot}">
                {{innterItem.name}}
                <SvgIcon v-if="innterItem.hot" :iconClass="'hot-triangle'" :className="'hot-triangle'"></SvgIcon>
                <SvgIcon v-if="tableCat===innterItem.name" :iconClass="'right-triangle'" :className="'right-triangle'"></SvgIcon>
              </span>
            </div>
          </div>
          <div class="space">&nbsp;</div>
        </template>
      </section>
    </Scroll>
    <div class="spinner-container" v-else>
      <div class="loadding">
        <SvgIcon :iconClass="'spinnner-bars'" :className="'spinnner-bars'"></SvgIcon>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { Mutation, State } from 'vuex-class'
import { ICategory } from '@/common/interface/base.ts'
import Scroll from '~/foundation/base/scroll.vue'

@Component({
  components: { Scroll }
})
export default class CatChooser extends mixins(CommonMixin) {
  @State tableCat: string
  private categoryList: { key: string; val: ICategory[]; code: string }[] = []

  @Mutation changeTableCat: (payload: { type: number; cat: string }) => void

  private changeCat(name: string) {
    this.changeTableCat({ type: 0, cat: name })
  }

  private onCategoryItemClick(name: string) {
    this.changeTableCat({ type: 0, cat: name })
    this.$router.push({ name: 'r_song_table_index' })
  }

  private onCancel() {
    this.$router.push({ name: 'r_song_table_index' })
  }

  private getCategoryList() {
    this.service
      .getCategoryList({})
      .then(
        (categoryListResult: { sub: ICategory[]; categories: { [propName: number]: string } }) => {
          let { sub, categories } = categoryListResult
          let tempCategoryList: { key: string; val: ICategory[]; code: string }[] = []
          if (categories && Object.keys(categories).length > 0) {
            for (let item in categories) {
              let categoryType = categories[item]
              let innerCategoryList: ICategory[] = []
              sub.forEach((innerItem, innerIndex) => {
                let { category, name } = innerItem
                if (item === category + '') {
                  innerCategoryList.push(innerItem)
                }
              })
              let innerCategoryListLen = innerCategoryList.length
              if (innerCategoryListLen > 0) {
                innerCategoryList.forEach((innerItem, innerIndex) => {
                  innerItem['hasBottom'] = true
                  if (innerCategoryListLen > 3 && innerCategoryListLen <= 6) {
                    if (innerIndex > 2) {
                      innerItem['hasBottom'] = false
                    }
                  } else if (innerCategoryListLen > 6) {
                    let indexBegin = Math.floor((innerCategoryListLen - 6) / 4) * 4 + 6 - 1
                    if (innerIndex > indexBegin) {
                      innerItem['hasBottom'] = false
                    }
                  }
                })
              }
              tempCategoryList.push({ key: categoryType, val: innerCategoryList, code: item })
            }
            this.categoryList = tempCategoryList
          }
        }
      )
  }

  created() {
    this.getCategoryList()
  }
}
</script>
<style lang="scss" scoped>
$baseAsset: '../../../assets';
$category-border-color: #efefef;
.cat-choose {
  @include setSize(100%, 100%);
  @include setFlexPos(column, flex-start, flex-start);
  .top {
    background-color: $color-highlight-background;
    @include setSize(100%, 138px);
    @include setFlexPos(row, flex-start, center);
    .cancel {
      font-size: 0.42rem;
      color: #fff;
      margin-left: 40px;
    }
    .content {
      font-size: 0.44rem;
      color: #fff;
      text-align: center;
      margin-left: 320px;
    }
  }
  .container {
    width: 100%;
    flex: 1;
    overflow: hidden;
    .all {
      position: relative;
      @include setSize(100%, 162px);
      padding: 16px 12px;
      .title {
        @include setFlexPos(row, center, center);
        @include setSize(100%, 100%);
        &.border-1px {
          @include border-set(all, $category-border-color);
        }
        span {
          font-size: 0.44rem;
          color: #222;
        }
        &.active {
          span {
            color: $color-highlight-background;
          }
          .right-triangle {
            position: absolute;
            bottom: 1px;
            right: 1px;
            font-size: 0.56rem;
            color: $color-highlight-background;
          }
        }
      }
    }
    .space {
      @include setSize(100%, 26px);
      background-color: $category-border-color;
      line-height: 0;
    }
    .t-head {
      @include setSize(100%, 240px);
      @include setFlexPos(row, flex-start, flex-start);
      .c-type {
        @include setSize(25vw, 100%);
        &.border-bottom-1px {
          @include border-set(bottom, $category-border-color);
        }
        .inner-container {
          position: relative;
          @include setSize(100%, 100%);
          @include setFlexPos(column, center, center);
          &.border-right-1px {
            @include border-set(right, $category-border-color);
          }
          .name {
            font-size: 0.4rem;
            color: #888;
          }
          .icon {
            margin-bottom: 24px;
            &.code-4 {
              margin-bottom: 14px;
            }
            color: #888;
            .category-language {
              font-size: 0.68rem;
            }
            .category-style {
              font-size: 0.62rem;
            }
            .category-scene {
              font-size: 0.68rem;
            }
            .category-emotion {
              font-size: 0.64rem;
            }
            .category-theme {
              font-size: 0.8rem;
            }
          }
        }
      }
      .t-head-container {
        flex: 1;
        @include setFlexPos(row, flex-start, flex-start);
        flex-wrap: wrap;
      }
    }
    .t-foot {
      width: 100%;
      @include setFlexPos(row, flex-start, flex-start);
      flex-wrap: wrap;
    }
    .t-head .t-head-container .category-item,
    .t-foot .category-item {
      @include setSize(25vw, 120px);
      &.border-bottom-1px {
        @include border-set(bottom, $category-border-color);
      }
      span {
        display: inline-block;
        @include setSize(100%, 100%);
        text-align: center;
        line-height: 120px;
        font-size: 0.38rem;
        &.border-right-1px {
          @include border-set(right, $category-border-color);
        }
        &.hot {
          .hot-triangle {
            position: absolute;
            left: 0;
            top: 0;
            font-size: 0.48rem;
            color: $color-highlight-background;
          }
        }
        &.active {
          color: $color-highlight-background;
          .right-triangle {
            position: absolute;
            bottom: 1px;
            right: 1px;
            font-size: 0.56rem;
            color: $color-highlight-background;
          }
        }
      }
    }
  }
  .spinner-container {
    flex: 1;
    width: 100%;
    overflow: hidden;
    .loadding {
      @include setSize(100%, 100%);
      @include setFlexPos(row, center, center);
      background-color: #fff;
      .spinnner-bars {
        font-size: 0.86rem;
        color: $color-highlight-background;
      }
    }
  }
}
</style>


