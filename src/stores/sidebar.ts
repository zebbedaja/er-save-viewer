import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  console.log(matchMedia('(max-width: 768px)').matches)
  const isSidebarOpen = ref(!matchMedia('(max-width: 768px)').matches)
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }
  const openSidebar = () => {
    isSidebarOpen.value = true
  }
  const closeSidebar = () => {
    isSidebarOpen.value = false
  }
  return { isSidebarOpen, toggleSidebar, openSidebar, closeSidebar }
})
