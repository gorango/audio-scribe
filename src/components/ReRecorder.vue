<template lang='pug'>
  .flex
    button.outline-none.bg-red-dark.text-white.rounded-full.w-8.h-8(
      v-if='!recording'
      @click='startRecord'
    ) ·
    button.outline-none.bg-red.animate-recording.text-white.rounded-full.w-8.h-8(
      v-if='recording'
      @click='stopRecord'
    ) ·
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
@keyframes recordingFade {
  0% { opacity: 1 }
  50% { opacity: 0.25 }
  100% { opacity: 1 }
}

.animate-recording {
  animation: recordingFade 2.5s infinite;
}
</style>
