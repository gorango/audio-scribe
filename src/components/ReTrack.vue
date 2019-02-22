<template lang="pug">
  .w-full
    template(v-if='data')
      .w-full.flex.relative.rounded.overflow-hidden
        .progress.absolute.pin.bg-red.z-0.opacity-25(
          :style='{width: `${progress}%`}'
        )
        .z-10.flex.w-full
          audio(
            :src='src',
            :ref='data.id'
          )
          button(
            v-if='!playing',
            @click='play'
          ) Play
          button(
            v-if='playing',
            @click='pause'
          ) Pause
          .flex-auto
          span {{duration}}
</template>

<script>
import getDuration from 'get-blob-duration'

import baseToBlob from '@/utils/base-to-blob'
import timeout from '@/utils/timeout'
// import getDuration from '@/utils/get-duration'

export default {
  props: {
    data: Object
  },

  data: () => ({
    src: null,
    duration: null,
    playing: false,
    progress: 0
  }),

  async mounted () {
    const baseData = this.data.src.split(',').slice(1).join()
    const contentType = 'audio/webm;codecs=opus'
    const blob = baseToBlob(baseData, contentType)
    this.duration = await getDuration(blob)
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
      this.progress = 100
      if (this.playing) {
        this.pause()
        this.$refs[this.data.id].currentTime = 0
      }
    }
  }
}
</script>
