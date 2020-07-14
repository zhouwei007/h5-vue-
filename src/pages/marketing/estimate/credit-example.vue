<template>
  <div class="hl-content">
    <h4>征信报告需上传信息概要中的“授信及负债信息概要”，确保图片清晰端正，且包含“未结清贷款信息汇总”表及“未销户贷记卡信息汇总”表，以提高图片识别准确率。如下图所示：</h4>
    <img :src="image">
    <span><i class="hl-icon hl-icon-triangle-up" />征信报告样例</span>
  </div>
</template>

<script>
export default {
  name: 'HlCreditExample',
  data () {
    return {
      image: require('images/credit.jpg')
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
