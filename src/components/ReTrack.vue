<template lang="pug">
  .w-full
    template(v-if='data')
      .w-full.flex
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
    playing: false
  }),

  computed: {
    ref () { return `audio-${this.sectionId}` }
  },

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
      await timeout(duration)
      this.stop()
    },

    pause (id, i) {
      this.playing = false
      const el = this.$refs[this.data.id]
      el.pause()
    },

    stop () {
      if (this.playing) {
        this.pause()
        this.$refs[this.data.id].currentTime = 0
      }
    }
  }
}
</script>
