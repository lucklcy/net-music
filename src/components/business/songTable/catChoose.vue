<template>
  <div class="cat-choose">
    <div class="top">
      <span class="cancel">取消</span>
      <span class="content">筛选歌单</span>
    </div>
    <section class="container">
      <div class="all">
        <div class="title border-1px active">
          <span> 全部歌单</span>
        </div>
      </div>
      <div class="space">&nbsp;</div>
      <template v-for="(item,index) in categoryList">
        <div class="t-head">
          <div class="c-type border-1px">
            {{item.key}}
          </div>
          <div class="t-head-container">
            <span :class="{'border-1px':true,'active':innterItem.hot,'hot':innterItem.hot}" v-for="(innterItem,innnerIndex) in item.val"
              v-if="innnerIndex < 6">
              {{innterItem.name}}
              <SvgIcon v-if="innterItem.hot" :iconClass="'hot-triangle'" :className="'hot-triangle'"></SvgIcon>
              <SvgIcon v-if="innterItem.hot" :iconClass="'right-triangle'" :className="'right-triangle'"></SvgIcon>
            </span>
          </div>
        </div>
        <div class="t-foot" v-if="item.val.length > 6">
          <span :class="{'border-1px':true,'active':innterItem.hot,'hot':innterItem.hot}" v-for="(innterItem,innnerIndex) in item.val"
            v-if="innnerIndex >=6">
            {{innterItem.name}}
            <SvgIcon v-if="innterItem.hot" :iconClass="'hot-triangle'" :className="'hot-triangle'"></SvgIcon>
            <SvgIcon v-if="innterItem.hot" :iconClass="'right-triangle'" :className="'right-triangle'"></SvgIcon>
          </span>
        </div>
        <div class="space">&nbsp;</div>
      </template>
    </section>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { Mutation, State } from 'vuex-class'
import { ICategory } from '@/common/interface/base.ts'

@Component({
  components: {}
})
export default class CatChooser extends mixins(CommonMixin) {
  @State tableCat: string
  private categoryList: { key: string; val: ICategory[] }[] = []

  @Mutation changeTableCat: (payload: { type: number; cat: string }) => void

  private changeCat(name: string) {
    this.changeTableCat({ type: 0, cat: name })
  }

  private getCategoryList() {
    this.service
      .getCategoryList({})
      .then(
        (categoryListResult: { sub: ICategory[]; categories: { [propName: number]: string } }) => {
          let { sub, categories } = categoryListResult
          let tempCategoryList: { key: string; val: ICategory[] }[] = []
          if (categories && Object.keys(categories).length > 0) {
            console.log({ categories })
            for (let item in categories) {
              let categoryType = categories[item]
              let innerCategoryList: ICategory[] = []
              sub.forEach((innerItem, innerIndex) => {
                let { category, name } = innerItem
                if (item === category + '') {
                  innerCategoryList.push(innerItem)
                }
              })
              tempCategoryList.push({ key: categoryType, val: innerCategoryList })
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
    overflow: auto;
    .all {
      @include setSize(100%, 162px);
      padding: 16px 12px;
      .title {
        @include setFlexPos(row, center, center);
        @include setSize(100%, 100%);
        &.border-1px {
          @include border-1px(all, #efefef);
        }
        span {
          font-size: 0.44rem;
          color: #222;
        }
      }
    }
    .space {
      @include setSize(100%, 14px);
      background-color: #efefef;
    }
    .t-head {
      @include setSize(100%, 200px);
      @include setFlexPos(row, flex-start, flex-start);
      .c-type {
        @include setSize(25vw, 200px);
        text-align: center;
        font-size: 0.38rem;
        line-height: 200px;
        &.border-1px {
          @include border-1px(all, #efefef);
        }
      }
      .t-head-container {
        flex: 1;
        @include setFlexPos(row, flex-start, flex-start);
        flex-wrap: wrap;
        span {
          @include setSize(25vw, 100px);
          text-align: center;
          line-height: 100px;
          font-size: 0.38rem;
          &.border-1px {
            @include border-1px(all, #efefef);
          }
          &.hot {
            .hot-triangle {
              position: absolute;
              left: 0;
              top: 0;
              font-size: 0.48rem;
            }
          }
          &.hot {
            .right-triangle {
              position: absolute;
              right: 0;
              bottom: 0;
              font-size: 0.68rem;
              color: $color-highlight-background;
            }
          }
        }
      }
    }
    .t-foot {
      width: 100%;
      span {
        display: inline-block;
        @include setSize(25vw, 100px);
        text-align: center;
        line-height: 100px;
        font-size: 0.38rem;
        &.border-1px {
          @include border-1px(all, #efefef);
        }
        &.border-1px.active {
          @include border-1px(all, $color-highlight-background, 2px);
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
      }
    }
  }
}
</style>


