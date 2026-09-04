import React, { useEffect, useRef, useState } from 'react'

export const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  duration = 750,
  yOffset = 24,
  threshold = 0.15,
  direction = 'up',
  scale = false,
  as: Component = 'div',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)'
    let translate = ''
    if (direction === 'up') translate = `translate3d(0, ${yOffset}px, 0)`
    if (direction === 'down') translate = `translate3d(0, -${yOffset}px, 0)`
    if (direction === 'left') translate = `translate3d(${yOffset}px, 0, 0)`
    if (direction === 'right') translate = `translate3d(-${yOffset}px, 0, 0)`
    if (direction === 'none') translate = 'translate3d(0, 0, 0)'

    return scale ? `${translate} scale(0.97)` : translate
  }

  return (
    <Component
      ref={ref}
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}

export default ScrollReveal

