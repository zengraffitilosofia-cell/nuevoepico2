import { useEffect } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4( position, 1.0 );
  }
`

export function useShaderScene(
  containerRef: RefObject<HTMLDivElement | null>,
  fragmentShader: string,
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Full-screen procedural fragment shaders gain nothing visually from MSAA,
    // so antialiasing is disabled unconditionally to save GPU work.
    const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5))
    container.appendChild(renderer.domElement)

    const renderFrame = () => {
      uniforms.time.value += 0.05
      renderer.render(scene, camera)
    }

    const onResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height

      // With reduced motion there's no rAF loop to naturally pick up the new
      // size, so re-draw the single static frame whenever it changes.
      if (prefersReducedMotion) renderFrame()
    }

    onResize()
    window.addEventListener('resize', onResize)

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)

    let animationId: number | null = null
    let frameCount = 0

    // Halve the effective frame rate on mobile to cut GPU/battery load while
    // keeping the same easing/visual motion.
    const tick = () => {
      animationId = requestAnimationFrame(tick)
      if (isMobile) {
        frameCount++
        if (frameCount % 2 !== 0) return
      }
      renderFrame()
    }

    const start = () => {
      if (animationId === null) tick()
    }
    const stop = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    }

    let intersectionObserver: IntersectionObserver | null = null

    // Respect reduced-motion: the static frame is drawn by onResize() above
    // instead of a continuous loop, keeping the same visual without motion.
    if (!prefersReducedMotion) {
      // Only spend GPU time while the canvas is actually visible on screen.
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) start()
          else stop()
        },
        { rootMargin: '200px' },
      )
      intersectionObserver.observe(container)
    }

    return () => {
      stop()
      intersectionObserver?.disconnect()
      window.removeEventListener('resize', onResize)
      resizeObserver.disconnect()

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }

      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [containerRef, fragmentShader])
}
