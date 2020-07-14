<template>
  <div class="hl-bank-icon"
    :class="{'hl-bank-icon_white': background === 'white'}">
    <i class="hl-bank-icon__inner"
      :class="`hl-bank-icon__inner_${code.toLocaleLowerCase()}`">
    </i>
  </div>
</template>

<script>
export default {
  name: 'HlBankIcon',
  props: {
    code: {
      type: String,
      required: true,
      default: ''
    },
    background: {
      type: String,
      default: 'transparent',
      validator (val) {
        return [
          'transparent',
          'white'
        ].indexOf(val) !== -1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-bank-icon {
  display: inline-block;
  width: 50px;
  height: 50px;

  &.hl-bank-icon_white {
    padding: 5px;
    box-sizing: border-box;
    background-color: $blockColor;
    border-radius: 50%;
  }

  .hl-bank-icon__inner {
    display: block;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;

    &.hl-bank-icon__inner_abc {
      background-image: url(~images/banks/ABC@2x.png);
    }

    &.hl-bank-icon__inner_boc {
      background-image: url(~images/banks/BOC@2x.png);
    }

    &.hl-bank-icon__inner_ccb {
      background-image: url(~images/banks/CCB@2x.png);
    }

    &.hl-bank-icon__inner_ceb {
      background-image: url(~images/banks/CEB@2x.png);
    }

    &.hl-bank-icon__inner_cib {
      background-image: url(~images/banks/CIB@2x.png);
    }

    &.hl-bank-icon__inner_citic {
      background-image: url(~images/banks/CITIC@2x.png);
    }

    &.hl-bank-icon__inner_cmb {
      background-image: url(~images/banks/CMB@2x.png);
    }

    &.hl-bank-icon__inner_cmbc {
      background-image: url(~images/banks/CMBC@2x.png);
    }

    &.hl-bank-icon__inner_hxb {
      background-image: url(~images/banks/HXB@2x.png);
    }

    &.hl-bank-icon__inner_comm,
    &.hl-bank-icon__inner_bcom {
      background-image: url(~images/banks/COMM@2x.png);
    }

    &.hl-bank-icon__inner_gdb,
    &.hl-bank-icon__inner_cgb {
      background-image: url(~images/banks/GDB@2x.png);
    }

    &.hl-bank-icon__inner_icbc {
      background-image: url(~images/banks/ICBC@2x.png);
    }

    &.hl-bank-icon__inner_psbc {
      background-image: url(~images/banks/PSBC@2x.png);
    }

    &.hl-bank-icon__inner_spdb,
    &.hl-bank-icon__inner_spd {
      background-image: url(~images/banks/SPDB@2x.png);
    }

    &.hl-bank-icon__inner_szpab,
    &.hl-bank-icon__inner_pab,
    &.hl-bank-icon__inner_pingan {
      background-image: url(~images/banks/SZPAB@2x.png);
    }

    &.hl-bank-icon__inner_bob,
    &.hl-bank-icon__inner_beijing {
      background-image: url(~images/banks/BOB@2x.png);
    }

    &.hl-bank-icon__inner_bos,
    &.hl-bank-icon__inner_shanghai {
      background-image: url(~images/banks/BOS@2x.png);
    }

    &.hl-bank-icon__inner_hangzhou {
      background-image: url(~images/banks/HZB@2x.png);
    }

    &.hl-bank-icon__inner_jiangsu {
      background-image: url(~images/banks/JSB@2x.png);
    }

    &.hl-bank-icon__inner_gzns {
      background-image: url(~images/banks/GZNS@2x.png);
    }
  }
}
</style>
