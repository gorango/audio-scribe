<template lang='pug'>
  .flex
    button.outline-none.bg-red-dark.white.p-1.px-3.rounded-full(
      v-if='!recording'
      @click='startRecord'
    ) .
    button.outline-none.bg-red-darker.white.p-1.px-3.rounded-full(
      v-if='recording'
      @click='stopRecord'
    ) .
</template>

<script>
import uuidv4 from 'uuid/v4'

import timeout from '@/utils/timeout'

export default {
  components: {},

  data: () => ({
    stream: null,
    mediaRecorder: null,
    chunks: [],

    recording: false
  }),

  async mounted () {
    this.stream = await navigator.mediaDevices
      .getUserMedia({ audio: true })

    this.mediaRecorder = new MediaRecorder(this.stream)

    this.mediaRecorder.ondataavailable = ({ data }) => {
      this.chunks.push(data)
    }

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'audio/webm;codecs=opus' })

      this.chunks = []

      const uuid = `re-trk-${uuidv4()}`
      const fr = new FileReader()

      fr.onload = async ({ target: { result } }) => {
        localStorage.setItem(uuid, result)
        await timeout(500)
        this.$emit('newTrack', uuid)
      }
      fr.readAsDataURL(blob)
    }
  },

  methods: {
    startRecord () {
      this.mediaRecorder.start()
      this.recording = true
    },

    stopRecord () {
      this.mediaRecorder.stop()
      this.recording = false
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>
