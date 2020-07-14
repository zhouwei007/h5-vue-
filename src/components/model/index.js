import Vue from 'vue'
import router from '@/router'
import HlModel from './src/model'

class Model {
  show (options) {
    if (!options) {
      return
    }
    if (typeof options.render === 'function') {
      options = {
        component: options
      }
    }
    const instance = this._modelFactory(options)
    document.body.appendChild(instance.$mount().$el)
    return instance
  }

  _innerFactory (options) {
    return typeof options.component === 'string'
      ? {
        name: 'HlModelInner',
        data () {
          return {
            src: options.component
          }
        },
        template: `<iframe :src="src" width="100%" height="100%" />`
      }
      : options.component
  }

  _modelFactory (options) {
    const ModelConstructor = Vue.extend({
      name: 'HlModelWrapper',
      router,
      components: {
        HlModel,
        'hl-component': this._innerFactory(options)
      },
      data () {
        return {
          show: false,
          title: options.title,
          data: options.data,
          submit: options.handleSubmit,
          cancel: options.handleCancel,
          closeFixed: options.closeFixed
        }
      },
      watch: {
        show (val) {
          val ? document.body.appendChild(this.$el) : this.destory()
        }
      },
      mounted () {
        this.show = true
      },
      methods: {
        handleSubmit (data) {
          this.submit && this.submit(data)
          this.show = false
        },
        handleCancel (data) {
          this.cancel && this.cancel(data)
          this.show = false
        },
        destory () {
          this.$nextTick(() => {
            this.$destroy(true)
          })
        }
      },
      template: `
        <hl-model
          :show.sync="show"
          :title="title"
          :close-fixed="closeFixed"
          @close="handleCancel"
        >
          <hl-component
            :data="data"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </hl-model>
      `
    })
    return new ModelConstructor()
  }
}

export default new Model()
