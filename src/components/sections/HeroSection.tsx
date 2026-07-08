import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RevealLayer from '../common/RevealLayer'
import { RollingText } from '@/components/animate-ui/primitives/texts/rolling'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'
const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'

export default function HeroSection() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number | null>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const keepScrollRef = useRef<HTMLParagraphElement>(null)
  const logoWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Touch devices have no persistent cursor, so the spotlight never follows
    // a pointer there. Instead of the mousemove/rAF loop, give it a very
    // subtle automatic drift so the section still feels alive.
    if (window.matchMedia('(pointer: coarse)').matches) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const section = sectionRef.current
      if (!section) return

      let driftId: number | null = null
      let lastTick = 0
      let angle = 0

      // Low-frequency rAF (~1 tick every 200ms) instead of a full 60fps loop —
      // the position delta per tick is tiny, so the motion still reads as a
      // smooth slow drift rather than a jump.
      const tick = (now: number) => {
        driftId = requestAnimationFrame(tick)
        if (now - lastTick < 200) return
        lastTick = now

        angle += 0.015
        const cx = window.innerWidth / 2
        const cy = window.innerHeight * 0.35
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.22
        setCursorPos({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        })
      }

      const start = () => {
        if (driftId === null) driftId = requestAnimationFrame(tick)
      }
      const stop = () => {
        if (driftId !== null) {
          cancelAnimationFrame(driftId)
          driftId = null
        }
      }

      // Only spend cycles while the hero is actually on screen.
      const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { rootMargin: '200px' },
      )
      observer.observe(section)

      return () => {
        stop()
        observer.disconnect()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const tl = gsap.timeline({ paused: true })
    tl.to(logoWrapperRef.current, { scale: 18, ease: 'none' }, 0)
      .to(navRef.current, { opacity: 0, ease: 'none' }, 0)
      .to(headingRef.current, { opacity: 0, ease: 'none' }, 0)
      .to(keepScrollRef.current, { opacity: 0, ease: 'none' }, 0)

    // Pinning is expensive on mobile (constant reflow from the address-bar
    // show/hide cycle causes the scroll jank). Below 768px we keep the exact
    // same scrub-driven zoom/fade animation but let the section scroll away
    // naturally instead of pinning it in place.
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${sectionRef.current?.offsetHeight ?? window.innerHeight}`,
      scrub: true,
      pin: !isMobile,
      animation: tl,
    })

    return () => {
      st.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden h-screen bg-black"
      style={{ height: '100dvh' }}
    >
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5"
      >
        <div className="flex items-center gap-2">
          <img src="/logo_blanco-01.svg" alt="Logo" className="h-12 w-auto" />
        </div>

      
      </nav>

      <div
        className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat hero-zoom"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />

      <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

      <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
        <h1 ref={headingRef} className="text-white leading-[0.95]">
          <span
            className="hero-anim hero-reveal block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl"
            style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
          >
            Hola soy
          </span>
          <span
            className="hero-anim hero-reveal block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1"
            style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
          >
            Enrique Malvar
          </span>
          <RollingText
            text="Diseñador web"
            delay={0.5}
            className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1"
            style={{ letterSpacing: '-0.08em', color: '#F54927' }}
          />
        </h1>

        <div ref={logoWrapperRef} className="mt-6 sm:mt-8">
          <svg
            width="440"
            height="364"
            viewBox="0 0 341.6 283.5"
            style={{ overflow: 'visible' }}
          >
            <motion.path
              fill="#FFFFFF"
              d="M304.4,128.4l-79.2,11.5v0.4l79.2,12.7v55.5H175v-36.7h94.2v-0.4L175,154.2v-28.1l94.2-17.2v-0.4H175V71.8h129.3V128.4z"
              initial={{ x: 260 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            />
            <motion.path
              fill="#FFFFFF"
              d="M37.2,151.9l79.2-11.5V140l-79.2-12.7V71.8l129.3,0v36.7H72.4v0.4l94.2,17.2v28.1l-94.2,17.2v0.4h94.2v36.7H37.2V151.9z"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            />
          </svg>
        </div>

        <motion.p
          ref={keepScrollRef}
          className="mt-4 text-white/80 text-xs sm:text-sm tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 1.2 }}
        >
          keep scrolling
        </motion.p>
      </div>

      <div
        className="hero-anim hero-fade hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50"
        style={{ animationDelay: '0.7s' }}
      >
     
      </div>

      <div
        className="hero-anim hero-fade absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50"
        style={{ animationDelay: '0.85s' }}
      >
     
       
      </div>
    </section>
  )
}
