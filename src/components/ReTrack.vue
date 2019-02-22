<template lang="pug">
  .w-full
    template(v-if='data')
      .w-full.flex.relative.rounded.overflow-hidden.px-2
        .progress.absolute.pin.bg-red.z-0.opacity-25(
          :style='{width: `${progress}%`}'
        )
        .z-10.flex.w-full.items-center
          audio(
            :src='src',
            :ref='data.id'
          )
          .w-6.flex.items-center.justify-center
            button.pb-1(
              v-if='!playing',
              @click='play'
            ) ▷
            button.pb-1(
              v-if='playing',
              @click='pause'
            ) ▯▯
          .flex-auto
          span {{timestamp}}
</template>

<script>
import getDuration from 'get-blob-duration'

import baseToBlob from '@/utils/base-to-blob'
import timeout from '@/utils/timeout'
import minsToStamp from '@/utils/mins-to-timestamp'
// import getDuration from '@/utils/get-duration'

export default {
  props: {
    data: Object
  },

  data: () => ({
    src: null,
    duration: null,
    timestamp: null,
    playing: false,
    progress: 0
  }),

  async mounted () {
    const baseData = this.data.src.split(',').slice(1).join()
    const contentType = 'audio/webm;codecs=opus'
    const blob = baseToBlob(baseData, contentType)
    this.duration = await getDuration(blob)
    this.timestamp = minsToStamp(this.duration / 60)
    this.src = URL.createObjectURL(blob)
  },

  methods: {
    async play (id, i) {
      this.playing = true
      const el = this.$refs[this.data.id]
      el.play()
      const duration = (this.duration - el.currentTime) * 1000
      el.addEventListener('timeupdate', this.handleProgress)
      await timeout(duration)
      this.stop()
    },

    handleProgress ({ timeStamp }) {
      const el = this.$refs[this.data.id]
      this.progress = Math.round(el.currentTime / this.duration * 100)
    },

    pause (id, i) {
      this.playing = false
      const el = this.$refs[this.data.id]
      el.pause()
    },

    stop () {
      const el = this.$refs[this.data.id]
      el.removeEventListener('timeupdate', this.handleProgress)
      if (this.progress > 90) {
        this.progress = 100
      }
      if (this.playing) {
        this.pause()
        this.$refs[this.data.id].currentTime = 0
      }
    }
  }
}
</script>
