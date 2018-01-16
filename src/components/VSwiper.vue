<template>
  <div class="v-swiper" ref="swiper">
    <el-button type="primary" icon="arrow-left" class="swiper-arrow-btn left-btn" @click="prevHandle"></el-button>
    <el-button type="primary" icon="arrow-right" class="swiper-arrow-btn right-btn" @click="nextHandle"></el-button>
    <div class="swiper-scroll">
      <div class="swiper-box clearfix" :style="`width: ${(width + 2 * gutter) * data.length}px; margin-left: -${gutter}px; margin-right: -${gutter}px; transform: translateX(-${offset}px)`">
        <div class="swiper-item fl" :style="`width: ${width}px; height: ${height}px; margin-left: ${gutter}px; margin-right: ${gutter}px`" v-for="item,idx in data" :key="idx">
          <div class="item-title">{{item.attribute}}</div>
          <div class="item-index">{{idx + 1}}</div>
          <div class="item-sub-title">{{$t('index.averageField')}}</div>
          <div class="item-sub-text">{{item.averageValue}}</div>
          <div class="item-sub-title">{{$t('index.totalField')}}</div>
          <div class="item-sub-text">{{item.totalValue}}</div>
          <div class="item-btn">
            <el-button @click="rankFn(idx, item.averageValue)">{{$t('index.rankBtn')}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-swiper',
  props: {
    data: Array,
    width: {
      type: Number,
      default: 240
    },
    height: {
      type: Number,
      default: 300
    },
    gutter: {
      type: Number,
      default: 15
    },
    index: {
      type: Number,
      default: 0
    },
    rankFn: Function
  },
  data () {
    let elWidth = this.width + 2 * this.gutter
    let offset = elWidth * this.index || 0
    return {
      elWidth,
      offset,
      swiperWidth: 0,
      boxWidth: 0
    }
  },
  watch: {
    data (arr) {
      this.swiperWidth = this.elWidth * arr.length - 2 * this.gutter
    }
  },
  methods: {
    prevHandle () {
      if (this.offset > this.elWidth) {
        this.offset -= this.elWidth
      } else {
        this.offset = 0
      }
    },
    nextHandle () {
      if (this.offset < this.swiperWidth - (this.boxWidth + this.elWidth)) {
        this.offset += this.elWidth
      } else {
        this.offset = this.swiperWidth - this.boxWidth
      }
    }
  },
  mounted () {
    this.boxWidth = this.$refs['swiper'].offsetWidth
  }
}
</script>

<style lang="less">
.v-swiper {
  position: relative;
  width: 100%;
  .swiper-arrow-btn {
    position: absolute;
    top: 50%;
    width: 48px;
    height: 48px;
    border: 0;
    background: #7c8898;
    border-radius: 50%;
    transform: translateY(-50%);
    z-index: 999;
    &.left-btn {
      left: -24px;
    }
    &.right-btn {
      right: -24px;
    }
  }
  .swiper-scroll {
    overflow-x: hidden;
  }
  .swiper-box {
    transition: transform .3s;
  }
  .swiper-item {
    background: #353b47;
  }
  .item-title {
    display: flex;
    align-items: center;
    height: 96px;
    padding: 0 20px;
    font-size: 18px;
    color: #6f7b91;
    text-align: center;
    word-wrap: break-word;
    word-break: normal;
    background: #393f4b;
    box-sizing: border-box;
  }
  .item-index {
    width: 32px;
    height: 32px;
    line-height: 32px;
    margin: -18px auto 0;
    font-size: 16px;
    color: #fff;
    text-align: center;
    border: 2px solid #fff;
    background: #8595a5;
    border-radius: 18px;
  }
  .item-sub-title {
    line-height: 20px;
    padding-left: 32px;
    padding-top: 20px;
    font-size: 14px;
    color: #adb1b5;
  }
  .item-sub-text {
    line-height: 24px;
    padding-left: 32px;
    font-size: 20px;
    color: #dce3ed;
  }
  .item-btn {
    text-align: right;
    padding-top: 8px;
    padding-right: 10px;
    .el-button {
      color: #f48834;
      background: rgba(0, 0, 0, 0);
      border: 0;
    }
  }
}
</style>
