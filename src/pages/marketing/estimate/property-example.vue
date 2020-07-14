<template>
  <div class="hl-content">
    <h4>房产证分为“ I 类房产证”与“ II 类房产证”，请提前确认您的房产证类型，并确保图片清晰端正，以进一步提高图片识别准确率。</h4>
    <p>I 类房产证：标题为“____不动产权第_____号”，主要包含权利人、坐落、使用期限、权限其他状况等信息，如下图所示：</p>
    <img :src="image1">
    <span><i class="hl-icon hl-icon-triangle-up" />I 类房产证</span>
    <p>II 类房产证：标题为“房地证____字第____号”，主要包含权利人、坐落、地号、土地状况等信息，如下图所示：</p>
    <img :src="image2">
    <span><i class="hl-icon hl-icon-triangle-up" />II 类房产证</span>
  </div>
</template>

<script>
export default {
  name: 'HlPropertyExample',
  data () {
    return {
      image1: require('images/property-1.jpg'),
      image2: require('images/property-2.jpg')
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  padding: 40px;

  h4 {
    margin-bottom: 60px;
    font-size: $textSize;
    line-height: 44px;
    color: $textColor;
  }

  p {
    margin-bottom: 30px;
    font-size: $descriptionSize;
    line-height: 44px;
    color: $subTitleColor;
  }

  img {
    width: 100%;
  }

  span {
    display: block;
    margin-top: 20px;
    margin-bottom: 60px;
    font-size: $quoteSize;
    line-height: 33px;
    text-align: center;
    color: $descriptionColor;

    .hl-icon {
      margin-right: 15px;
      font-size: 24px;
    }
  }
}
</style>
