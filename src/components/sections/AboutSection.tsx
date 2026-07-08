import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShaderAnimation } from '../common/ShaderAnimation'
import { GlowCard } from '../common/GlowCard'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const STATS = [
  { value: '6+', label: 'Años de experiencia' },
  { value: '20+', label: 'Proyectos entregados' },
  { value: '10+', label: 'Clientes activos' },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const oRef = useRef<HTMLSpanElement>(null)
  const [logoWidth, setLogoWidth] = useState<number | null>(null)

  useEffect(() => {
    const heading = headingRef.current
    if (!heading) return

    const update = () => setLogoWidth(heading.offsetWidth)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(heading)
    window.addEventListener('resize', update)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    const bg = bgRef.current
    const content = contentRef.current
    const logo = logoRef.current
    const heading = headingRef.current
    if (!el || !bg || !content || !logo || !heading || logoWidth === null) return

    let tl: gsap.core.Timeline | null = null
    let cancelled = false

    const setup = () => {
      if (cancelled) return

      const oEl = oRef.current
      if (oEl) {
        const contentRect = content.getBoundingClientRect()
        const oRect = oEl.getBoundingClientRect()
        const originX = oRect.left + oRect.width / 2 - contentRect.left
        const originY = oRect.top + oRect.height / 2 - contentRect.top
        content.style.transformOrigin = `${originX}px ${originY}px`
      }

      gsap.set(bg, { opacity: 0 })
      gsap.set(content, { opacity: 0, scale: 1.7, filter: 'blur(10px)' })
      gsap.set(logo, { y: -420, opacity: 0 })
      gsap.set(heading, { rotate: 0, y: 0 })

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(bg, { opacity: 1, duration: 0.6, ease: 'power1.out' })
        .to(
          content,
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.inOut' },
          '-=0.45',
        )
        .set(logo, { opacity: 1 }, '-=0.3')
        .to(logo, { y: 0, duration: 0.45, ease: 'power2.in' }, '-=0.3')
        .to(heading, { rotate: 4, y: 10, duration: 0.1, ease: 'power1.out' }, '>-0.02')
        .to(logo, { y: -18, duration: 0.14, ease: 'power1.out' }, '<')
        .to(logo, { y: 0, duration: 0.4, ease: 'bounce.out' })
        .to(heading, { rotate: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, '<')
    }

    document.fonts.ready.then(setup)

    return () => {
      cancelled = true
      tl?.scrollTrigger?.kill()
      tl?.kill()
    }
  }, [logoWidth])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black flex items-center justify-center px-6 py-24 sm:py-32 overflow-hidden snap-start"
    >
      <div ref={bgRef} className="absolute inset-0 z-0">
        <ShaderAnimation />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-[700px] w-full">
        <svg
          ref={logoRef}
          viewBox="34.7 69.3 273.2 141.7"
          style={{ width: logoWidth ?? undefined, height: logoWidth ? logoWidth * (141.7 / 273.2) : undefined }}
          className="mb-2 block"
        >
          <path
            fill="#FFFFFF"
            d="M304.4,128.4l-79.2,11.5v0.4l79.2,12.7v55.5H175v-36.7h94.2v-0.4L175,154.2v-28.1l94.2-17.2v-0.4H175V71.8h129.3V128.4z"
          />
          <path
            fill="#FFFFFF"
            d="M37.2,151.9l79.2-11.5V140l-79.2-12.7V71.8l129.3,0v36.7H72.4v0.4l94.2,17.2v28.1l-94.2,17.2v0.4h94.2v36.7H37.2V151.9z"
          />
        </svg>
        <h2
          ref={headingRef}
          id="about-heading"
          className="w-fit text-white leading-[0.95] mb-8 font-normal text-4xl sm:text-5xl md:text-6xl origin-left"
          style={{ letterSpacing: '-0.08em' }}
        >
          S<span ref={oRef}>o</span>bre mí
        </h2>
        <p className="text-white/80 text-base sm:text-lg leading-relaxed">
          Diseñador gráfico y desarrollador full-stack con 5+ años de experiencia. Mi
          capacidad para unir el diseño visual y el desarrollo técnico me permite
          gestionar proyectos end-to-end, desde el concepto hasta el despliegue.
          Especializado en soluciones NFC, automatización de procesos y diseño de
          experiencias digitales de alto impacto. He trabajado con startups y agencias,
          siempre aportando un valor diferencial donde la estética y la funcionalidad
          van de la mano.
        </p>

        <div className="flex flex-wrap gap-4 sm:gap-6 mt-10">
          {STATS.map((stat) => (
            <GlowCard
              key={stat.label}
              glowColor="orange"
              customSize
              className="w-[calc(50%-0.5rem)] sm:w-[190px] h-auto"
            >
              <div className="flex flex-col justify-center h-full">
                <span className="text-3xl sm:text-4xl font-semibold text-white mb-1">
                  {stat.value}
                </span>
                <span className="text-sm text-white/70 leading-snug">{stat.label}</span>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}
