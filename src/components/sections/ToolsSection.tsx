import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PenTool, Layers } from 'lucide-react'
import {
  SiFigma,
  SiHtml5,
  SiWordpress,
  SiPython,
  SiOdoo,
  SiGithub,
  SiAnthropic,
} from 'react-icons/si'
import type { IconType } from 'react-icons'
import { ShaderAnimationMosaic } from '../common/ShaderAnimationMosaic'
import { GlowCard } from '../common/GlowCard'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const TOOLS: { label: string; Icon: IconType | typeof PenTool }[] = [
  { label: 'Figma', Icon: SiFigma },
  { label: 'Full Adobe Suite', Icon: Layers },
  { label: 'HTML / CSS / JS', Icon: SiHtml5 },
  { label: 'WordPress / Divi / Elementor', Icon: SiWordpress },
  { label: 'Python / Node.js', Icon: SiPython },
  { label: 'Odoo', Icon: SiOdoo },
  { label: 'UI/UX', Icon: PenTool },
  { label: 'Git / GitHub', Icon: SiGithub },
  { label: 'Anthropic certificate designer', Icon: SiAnthropic },
]

export default function ToolsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const [logoWidth, setLogoWidth] = useState<number | null>(null)
  const [line1FontSize, setLine1FontSize] = useState<number | null>(null)
  const [line2FontSize, setLine2FontSize] = useState<number | null>(null)

  useEffect(() => {
    const line1 = line1Ref.current
    const line2 = line2Ref.current
    if (!line1 || !line2) return

    let cancelled = false

    const update = () => {
      if (cancelled) return

      const targetWidth =
        document.getElementById('about-heading')?.offsetWidth ?? line1.offsetWidth

      line1.style.fontSize = ''
      line2.style.fontSize = ''
      const line1Width = line1.offsetWidth
      const line2Width = line2.offsetWidth
      const line1Base = Number.parseFloat(getComputedStyle(line1).fontSize)
      const line2Base = Number.parseFloat(getComputedStyle(line2).fontSize)

      setLogoWidth(targetWidth)
      if (line1Width > 0) setLine1FontSize(line1Base * (targetWidth / line1Width))
      if (line2Width > 0) setLine2FontSize(line2Base * (targetWidth / line2Width))
    }

    document.fonts.ready.then(update)

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    const bg = bgRef.current
    const content = contentRef.current
    const logo = logoRef.current
    const heading = headingRef.current
    if (!el || !bg || !content || !logo || !heading || logoWidth === null) return

    gsap.set(bg, { opacity: 0 })
    gsap.set(content, { opacity: 0, scale: 1.3 })
    gsap.set(logo, { y: -420, opacity: 0 })
    gsap.set(heading, { rotate: 0, y: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.to(bg, { opacity: 1, duration: 0.6, ease: 'power1.out' })
      .to(content, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, '-=0.45')
      .set(logo, { opacity: 1 }, '-=0.3')
      .to(logo, { y: 0, duration: 0.45, ease: 'power2.in' }, '-=0.3')
      .to(heading, { rotate: -4, y: 10, duration: 0.1, ease: 'power1.out' }, '>-0.02')
      .to(logo, { y: -18, duration: 0.14, ease: 'power1.out' }, '<')
      .to(logo, { y: 0, duration: 0.4, ease: 'bounce.out' })
      .to(heading, { rotate: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, '<')

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [logoWidth])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#0d0705] flex items-center justify-center px-6 py-24 sm:py-32 overflow-hidden snap-start border-t border-[#F54927]/20"
    >
      <div ref={bgRef} className="absolute inset-0 z-0">
        <ShaderAnimationMosaic />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-[700px] w-full">
        <svg
          ref={logoRef}
          viewBox="34.7 69.3 273.2 141.7"
          style={{
            width: logoWidth ?? undefined,
            height: logoWidth ? logoWidth * (141.7 / 273.2) : undefined,
          }}
          className="mb-2 ml-auto block"
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
          className="text-white leading-[0.95] mb-8 font-normal"
          style={{ letterSpacing: '-0.08em' }}
        >
          <span
            ref={line1Ref}
            className="block w-fit ml-auto text-4xl sm:text-5xl md:text-6xl"
            style={{ fontSize: line1FontSize ?? undefined }}
          >
            Herramientas &amp;
          </span>
          <span
            ref={line2Ref}
            className="block w-fit ml-auto text-4xl sm:text-5xl md:text-6xl"
            style={{ fontSize: line2FontSize ?? undefined }}
          >
            habilidades
          </span>
        </h2>

        <div className="flex flex-wrap gap-4 sm:gap-6">
          {TOOLS.map(({ label, Icon }) => (
            <GlowCard
              key={label}
              glowColor="orange"
              customSize
              className="w-[calc(50%-0.5rem)] sm:w-[200px] h-auto"
            >
              <div className="flex flex-col items-center justify-center h-full min-h-[90px] text-center gap-2">
                <Icon size={28} className="text-white" />
                <span className="text-sm sm:text-base font-medium text-white">{label}</span>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}
