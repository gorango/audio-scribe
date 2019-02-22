<template lang='pug'>
  div.w-full.flex.border.border-grey.rounded
    div.flex-auto.border-r.border-grey
      template(v-if='data')
        button.block(
          v-if='i > 0'
          @click='moveUp(data.id, i)'
        ) Up
        button.block(
          v-if='i < l - 1'
          @click='moveDn(data.id, i)'
        ) Dn
    div(class='w-2/5').border-r.border-grey.relative
      textarea.w-full.h-full.bg-grey-lightest.resize-none.outline-none.p-2(
        placholder='Placeholder',
        v-model='section.meta',
        @blur='saveSection'
      )
    div(class='w-2/5')
      //- TRACKS
      template(v-if='section.tracks && section.tracks.length')
        template(v-for='track in section.tracks')
          .flex.p-1.m-1.bg-grey-lightest
            re-track(
              :key='track.id',
              :data='track'
            )
            button.mx-2(@click='removeTrack(track.id)') x
      //- RECORDER
    div.flex-auto.border-l.border-grey.relative
      template(v-if='data')
        button(
          @click='$emit("remove")'
        ) Drop
      re-recorder.absolute.pin-r.pin-t.-mr-4(
        style='top:50%; transform: translateY(-50%)'
        @newTrack='addTrack'
      )
</template>

<script>
import uuidv4 from 'uuid/v4'

import ReTrack from '@/components/ReTrack'
import ReRecorder from '@/components/ReRecorder'

import timeout from '@/utils/timeout'

const defaults = {
  meta: null,
  tracks: [],
  createdAt: null,
  updatedAt: null
}

export default {
  props: {
    data: Object,
    i: Number,
    l: Number,
    moveUp: Function,
    moveDn: Function
  },

  components: {
    ReTrack,
    ReRecorder
  },

  data: () => ({
    section: {}
  }),

  computed: {
    localSection () {
      return this.data ? JSON.parse(localStorage[this.data.id]) : null
    }
  },

  watch: {
    data: function () {
      this.initSection()
    }
  },

  mounted () {
    this.initSection()
  },

  methods: {
    initSection () {
      if (!this.data) {
        let createdAt, updatedAt
        createdAt = updatedAt = new Date()
        const payload = { ...defaults, createdAt, updatedAt }
        this.section = payload
      } else {
        this.section = this.data
      }
    },

    async addToSections (uuid) {
      const sections = JSON.parse(localStorage.getItem('re-sections') || '  []')
      sections.push(uuid)
      localStorage.setItem('re-sections', JSON.stringify(sections))
      await this.refreshSections()
    },

    async refreshSections () {
      this.initSection()
      await timeout(1500)
      this.$emit('refresh')
    },

    createSection () {
      const uuid = `re-sct-${uuidv4()}`
      localStorage.setItem(uuid, JSON.stringify({ ...this.section, id: uuid }))
      this.addToSections(uuid)
    },

    async saveSection () {
      let { localSection } = this
      if (!localSection) {
        this.createSection()
      } else {
        localStorage.setItem(localSection.id, JSON.stringify({
          ...localSection,
          meta: this.section.meta
        }))
      }
      await this.refreshSections()
    },

    async addTrack (uuid) {
      this.localSection.tracks = this.localSection.tracks.concat(uuid)
      await this.saveSection()
    },

    async removeTrack (uuid) {
      this.localSection.tracks = this.localSection.tracks.filter(_uuid => _uuid !== uuid)
      await this.saveSection()
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>
