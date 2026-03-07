<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Props {
  latitude: number
  longitude: number
  title?: string
  address?: string
  zoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 15
})

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

// Fix for default marker icon in Leaflet with Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = defaultIcon

function initMap() {
  if (!mapContainer.value || map) return

  map = L.map(mapContainer.value).setView([props.latitude, props.longitude], props.zoom)

  // Use OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // Add marker
  marker = L.marker([props.latitude, props.longitude])
    .addTo(map)
  
  // Add popup with title/address
  const popupContent = props.title 
    ? `<strong>${props.title}</strong>${props.address ? `<br>${props.address}` : ''}`
    : props.address || ''
  
  if (popupContent) {
    marker.bindPopup(popupContent)
  }
}

function updateMap() {
  if (map && marker) {
    map.setView([props.latitude, props.longitude], props.zoom)
    marker.setLatLng([props.latitude, props.longitude])
    
    const popupContent = props.title 
      ? `<strong>${props.title}</strong>${props.address ? `<br>${props.address}` : ''}`
      : props.address || ''
    
    if (popupContent) {
      marker.setPopupContent(popupContent)
    }
  }
}

// Watch for prop changes
watch(() => [props.latitude, props.longitude, props.title, props.address, props.zoom], updateMap, { deep: true })

onMounted(() => {
  // Small delay to ensure DOM is ready
  setTimeout(initMap, 100)
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
    marker = null
  }
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full min-h-[300px] rounded-lg overflow-hidden" />
</template>

<style scoped>
/* Leaflet styles are imported globally */
</style>