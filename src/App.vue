<template lang="pug">
  #app.my-24
    .max-w-lg.mx-auto.w-full
      template(v-if='sections.length')
        template(v-for='section, i in sections')
          re-section.my-3(
            :key='section.id',
            :i='i',
            :l='sections.length'
            :data='section',
            @refresh='refreshSections',
            @remove='removeSection(section)',
            :moveUp='moveUp',
            :moveDn='moveDn'
          )
      button.mx-auto.mt-16.h-16.w-16.bg-white.rounded-full.flex.items-center.justify-center.shadow(
        @click='createSection'
      )
        span.text-3x1 +
</template>

<script>
import uuidv4 from 'uuid/v4'
import ReSection from '@/components/ReSection'

export default {
  components: {
    ReSection
  },

  data: () => ({
    sections: []
  }),

  async mounted () {
    this.$nextTick(async () => this.refreshSections())
  },

  methods: {
    async refreshSections () {
      const localSections = JSON.parse(localStorage['re-sections'] || '[]')
      this.sections = localSections.map(sectionUuid => {
        const section = JSON.parse(localStorage[sectionUuid])
        const tracks = section.tracks
          ? section.tracks.map(trackUuid =>
            ({ id: trackUuid, src: localStorage[trackUuid] }))
          : []
        return {
          id: sectionUuid,
          ...section,
          tracks
        }
      })
    },

    async createSection () {
      const uuid = `re-sct-${uuidv4()}`
      const section = {
        id: uuid,
        meta: null,
        tracks: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      localStorage.setItem(uuid, JSON.stringify(section))
      const sections = JSON.parse(localStorage.getItem('re-sections') || '  []')
      sections.push(uuid)
      localStorage.setItem('re-sections', JSON.stringify(sections))
      await this.refreshSections()
    },

    removeSection (section) {
      let localSections = JSON.parse(localStorage['re-sections'] || '[]')
      let targetSection = JSON.parse(localStorage[section.id])
      const { tracks } = targetSection
      if (tracks && tracks.length) {
        tracks.forEach(trackUuid => {
          localStorage.removeItem(trackUuid)
        })
      }
      localStorage.removeItem(section.id)
      localStorage.setItem(
        're-sections',
        JSON.stringify(localSections.filter(id => id !== section.id))
      )
      setTimeout(() => this.refreshSections(), 1500)
    },

    moveUp (uuid, i) {
      let sections = JSON.parse(localStorage['re-sections'] || '[]')
      sections[i] = sections[i - 1]
      sections[i - 1] = uuid
      localStorage.setItem('re-sections', JSON.stringify(sections))
      this.refreshSections()
    },

    moveDn (uuid, i) {
      let sections = JSON.parse(localStorage['re-sections'] || '[]')
      sections[i] = sections[i + 1]
      sections[i + 1] = uuid
      localStorage.setItem('re-sections', JSON.stringify(sections))
      this.refreshSections()
    }
  }
}
</script>
