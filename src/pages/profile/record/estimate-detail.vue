<template>
  <div class="hl-content">
    <div v-if="data.assessResultCode === 1" class="hl-banner">
      <span>经评估该客户可贷款</span>
      <p class="hl-banner__amount">{{ data.assessAmount | money(0) }}</p>
    </div>
    <div v-else class="hl-banner">
      <span>该客户的评估结果为</span>
      <p class="hl-banner__info">您好，您的相关资质暂不符合审核标准</p>
    </div>
    <hl-form label="个人基本信息">
      <hl-form-item label="姓名">
        <hl-input v-model="data.name" type="label" />
      </hl-form-item>
      <hl-form-item label="身份证号">
        <hl-input v-model="data.cardId" type="label" />
      </hl-form-item>
      <hl-form-item label="手机号">
        <hl-input v-model="data.mobile" type="label" />
      </hl-form-item>
      <hl-form-item label="婚姻状况">
        <hl-select v-model="data.marriage" :options="marriageOptions" type="label" />
      </hl-form-item>
      <hl-form-item v-if="data.spouseName" label="配偶姓名">
        <hl-input v-model="data.spouseName" type="label" />
      </hl-form-item>
      <hl-form-item v-if="data.spouseCardId" label="配偶身份证号">
        <hl-input v-model="data.spouseCardId" type="label" />
      </hl-form-item>
    </hl-form>
    <hl-form label="房产证信息">
      <hl-form-item label="城市">
        <hl-input v-model="data.cityName" type="label" />
      </hl-form-item>
      <hl-form-item label="区县">
        <hl-input v-model="data.countyName" type="label" />
      </hl-form-item>
      <hl-form-item label="楼盘名称">
        <hl-input v-model="data.villageName" type="label" />
      </hl-form-item>
      <hl-form-item label="所属楼栋">
        <hl-input v-model="data.buildingName" type="label" />
      </hl-form-item>
      <hl-form-item label="房号">
        <hl-input v-model="data.houseName" type="label" />
      </hl-form-item>
      <hl-form-item label="建筑面积">
        <hl-input v-model="data.area" type="label" />
      </hl-form-item>
      <hl-form-item label="所在层数">
        <hl-input v-model="data.houseFloor" type="label" />
      </hl-form-item>
      <hl-form-item label="房屋总层数">
        <hl-input v-model="data.floors" type="label" />
      </hl-form-item>
      <hl-form-item label="建成年限">
        <hl-input v-model="data.buildDate" type="label" />
      </hl-form-item>
      <hl-form-item label="购买形式">
        <hl-select v-model="data.payType" :options="payTypeOptions" type="label" />
      </hl-form-item>
      <hl-form-item v-if="data.mortgageBalance" label="待还本金">
        <hl-input v-model="data.mortgageBalanceStr" type="label" />
      </hl-form-item>
    </hl-form>
    <hl-form label="个人征信报告">
      <hl-form-item label="未结清贷款余额">
        <hl-input v-model="data.creditBalance" type="label" />
      </hl-form-item>
      <hl-form-item label="授信总额">
        <hl-input v-model="data.creditLines" type="label" />
      </hl-form-item>
      <hl-form-item label="已用额度">
        <hl-input v-model="data.creditUsedQuota" type="label" />
      </hl-form-item>
      <hl-form-item label="近六个月平均使用额度">
        <hl-input v-model="data.creditSixAvgQuota" type="label" />
      </hl-form-item>
    </hl-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BS from 'common/bs'
import Utils from 'common/utils'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlInput from '@/components/input'
import HlSelect from '@/components/select'
import SETTING from '@/setting'
export default {
  name: 'HlEstimateDetail',
  components: {
    HlForm,
    HlFormItem,
    HlInput,
    HlSelect
  },
  data () {
    return {
      marriageOptions: [],
      payTypeOptions: []
    }
  },
  computed: {
    ...mapState([
      'estimateRecord'
    ]),
    data () {
      const item = this.estimateRecord
      return item ? {
        ...item,
        area: `${item.area}平米`,
        buildDate: `${item.buildDate}年`,
        mortgageBalanceStr: `${Utils.formatMoney(item.mortgageBalance)}元`,
        creditBalance: `${Utils.formatMoney(item.creditBalance)}元`,
        creditLines: `${Utils.formatMoney(item.creditLines)}元`,
        creditUsedQuota: `${Utils.formatMoney(item.creditUsedQuota)}元`,
        creditSixAvgQuota: `${Utils.formatMoney(item.creditSixAvgQuota)}元`
      } : {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      !this.estimateRecord && this.$router.back()
      this.marriageOptions = await BS.getOptions(SETTING.BS_MARRIAGE_KEY)
      this.payTypeOptions = await BS.getOptions(SETTING.BS_HOUSE_PAY_TYPE_KEY)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-banner {
    padding: 50px;
    text-align: center;
    color: $blockColor;
    background-color: $subThemeColor;

    span {
      display: block;
      margin-bottom: 10px;
      font-size: $descriptionSize;
      line-height: 37px;
    }

    .hl-banner__amount {
      line-height: 93px;
      @include number(80px);
    }

    .hl-banner__info {
      font-size: $subTitleSize;
      line-height: 93px;
    }
  }

  .hl-form-item::v-deep {
    .hl-form-item__label {
      width: 290px;
    }
  }
}
</style>
