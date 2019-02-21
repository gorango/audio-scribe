<template lang="pug">
  div
    .flex.items-center.my-4
      div
        button.bg-blue.text-white.rounded-lg.px-3.py-2.mr-2(
          @click='playPause'
        ) Play/Pause
      div
        button.bg-blue.text-white.rounded-lg.px-3.py-2.mr-2(
          @click='removeFile'
        ) x
      .mx-3
      .waveform.w-full.relative(:id='`waveform-${i}`')
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import getBlobDuration from 'get-blob-duration'

import CursorPlugin from '@/utils/wavesurfer.cursor'

export default {
  props: {
    file: {
      required: true
    },
    i: {
      type: Number,
      default: 0
    }
  },

  data: () => ({
    wavesurfer: null,
    playing: false
  }),

  async mounted () {
    const containerId = `#waveform-${this.i}`

    this.wavesurfer = WaveSurfer.create({
      container: containerId,
      backend: 'MediaElement',
      waveColor: '#2196F3',
      progressColor: '#607D8B',
      cursorColor: '#607D8B',
      barWidth: 4,
      scrollParent: false,
      hideScrollbar: true,
      height: 64,
      plugins: [
        CursorPlugin.create({
          showTime: true,
          // hideOnBlur: false,
          // width: '2px',
          customShowTimeStyle: {
            top: 0,
            marginLeft: '8px',
            marginTop: '4px',
            fontSize: '14px'
          }
        })
      ]
    })
    // this.wavesurfer.init()
    this.wavesurfer.on('ready', () => this.wavesurfer.play())
    // this.wavesurfer.load(require('@/assets/an-invitation-to-dance.mp3'))
    // console.log(this.file)
    const b64Data = localStorage[this.file].split(',').slice(1).join()
    if (!b64Data) return
    // console.log(b64Data)
    const contentType = 'audio/webm;codecs=opus'
    const blob = b64toBlob(b64Data, contentType)
    const duration = await getBlobDuration(blob)
    console.log(duration)
    // const blob = await fetch(url).then(async res => res.blob())
    // blob.type = 'audio/webm;codecs=opus'
    const src = URL.createObjectURL(blob)
    let el = document.createElement('audio')
    el.setAttribute('id', containerId)
    el.src = src
    this.wavesurfer.load(el, null, true, duration)
    el = null
  },

  methods: {
    playPause () {
      this.playing
        ? this.wavesurfer.pause()
        : this.wavesurfer.play()
      this.playing = !this.playing
    },

    removeFile () {
      localStorage.removeItem(this.file)
      this.$emit('removed', this.file)
    }
  }
}

function b64toBlob (b64Data, contentType, sliceSize) {
  contentType = contentType || ''
  sliceSize = sliceSize || 512

  let byteCharacters = atob(b64Data)
  let byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize)

    let byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    let byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  let blob = new Blob(byteArrays, { type: contentType })
  return blob
}
</script>
