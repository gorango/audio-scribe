<template lang="pug">
  div
    #remic
    //- button(
    //-   @click='toggleState'
    //- ) start
    button.bg-blue.text-white.rounded-lg.px-3.py-2.mr-2(
      @click='startRecord'
    ) start
    button.bg-blue.text-white.rounded-lg.px-3.py-2.mr-2(
      @click='stopRecord'
    ) stop
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import uuidv4 from 'uuid/v4'

import MicrophonePlugin from '@/utils/wavesurfer.microphone'

export default {
  data: () => ({
    wavesurfer: null,
    stream: null,
    mediaRecorder: null,
    chunks: []
  }),

  async mounted () {
    // console.log(WaveSurfer.microphone.create())
    // const mic = await MicrophonePlugin.create()

    this.wavesurfer = new WaveSurfer({
      container: '#remic',
      // backend: 'MediaElement',
      waveColor: '#2196F3',
      progressColor: '#607D8B',
      barWidth: 4,
      // cursorColor: '#607D8B',
      // scrollParent: true,
      interact: false,
      cursorWidth: 0,
      height: 64,
      plugins: [
        MicrophonePlugin.create()
      ]
    })
    this.wavesurfer.init()
    this.wavesurfer.microphone.on('deviceReady', (stream) => {
      this.stream = stream
    })
    this.wavesurfer.microphone.on('deviceError', console.warn)

    this.wavesurfer.microphone.start()
  },

  beforeDestroy () {
    this.wavesurfer.microphone.destroy()
  },

  watch: {
    async stream (stream) {
      if (stream) {
        this.chunks = []
        this.mediaRecorder = new MediaRecorder(stream)

        this.mediaRecorder.ondataavailable = ({ data }) => {
          this.chunks.push(data)
        }

        this.mediaRecorder.onstop = () => {
          const uuid = `re-${uuidv4()}`
          const blob = new Blob(this.chunks, { type: 'audio/webm;codecs=opus' })
          const fr = new FileReader()

          fr.onload = async ({ target: { result } }) => localStorage.setItem(uuid, result)
          fr.readAsDataURL(blob)

          setTimeout(() => {
            this.$emit('file', uuid)
          }, 1000)
        }
      }
    }
  },

  methods: {
    toggleState () {
      this.wavesurfer.microphone.togglePlay()
    },

    startRecord () {
      this.mediaRecorder.start()
    },

    stopRecord () {
      this.mediaRecorder.stop()
    }
  }
}
</script>
