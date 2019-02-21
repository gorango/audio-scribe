<template lang="pug">
  #app.my-24
    .max-w-md.mx-auto
      re-mic(@file='addTrack')
      template(v-for='track, i in tracks')
        div
          re-track(
            :file='track',
            :i='i',
            @removed='tracks.splice(i, 1)'
          )
</template>

<script>
import ReMic from '@/components/ReMic'
import ReTrack from '@/components/ReTrack'

export default {
  components: {
    ReMic,
    ReTrack
  },

  data: () => ({
    tracks: []
  }),

  mounted () {
    const ls = Object.keys(localStorage)
      .filter(name => /^re-.+/.test(name))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: localStorage[key]
        }
      }, {})
    this.tracks = Object.keys(ls)
  },

  methods: {
    addTrack (objectUrl) {
      this.tracks.push(objectUrl)
    }
  }
}
</script>
