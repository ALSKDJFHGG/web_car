<template>
  <div class="bg-white rounded-xl shadow p-4">
    <h3 class="text-lg font-medium mb-3">用户地理分布</h3>
    <div id="user-map" style="height:380px; border-radius:8px;"></div>
  </div>
</template>

<script>
export default {
  name: 'UserMap',
  props: { users: { type: Array, default: () => [] } },
  mounted() {
    // 初始化 Leaflet 地图
    if (!window.L) return
    this.map = L.map('user-map').setView([31.2304, 121.4737], 8)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map)
    this.layer = L.layerGroup().addTo(this.map)
    this.renderMarkers()
  },
  watch: {
    users: {
      handler() { this.renderMarkers() },
      deep: true
    }
  },
  methods: {
    renderMarkers() {
      if (!this.layer) return
      this.layer.clearLayers()
      this.users.forEach(u => {
        if (!u.lat || !u.lng) return
        const marker = L.marker([u.lat, u.lng])
        marker.bindPopup(`<strong>${u.name}</strong><br/>${u.role}<br/>${u.phone}`)
        this.layer.addLayer(marker)
      })
      // 适配视野
      const points = this.users.filter(u => u.lat && u.lng).map(u => [u.lat, u.lng])
      if (points.length === 1) this.map.setView(points[0], 12)
      else if (points.length > 1) this.map.fitBounds(points, { padding: [40,40] })
    }
  }
}
</script>

<style scoped>
#user-map { width: 100%; border-radius: 8px; }
</style>
