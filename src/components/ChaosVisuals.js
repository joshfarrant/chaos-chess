// Screen shake and other visual chaos effects
export class ChaosVisuals {
    constructor() {
        this.isShaking = false
        this.particles = []
        this.screenFilters = []
    }

    // Shake the entire screen
    screenShake(intensity = 1, duration = 500) {
        if (this.isShaking) return

        this.isShaking = true
        const element = document.body
        const originalTransform = element.style.transform

        const shakeInterval = setInterval(() => {
            const x = (Math.random() - 0.5) * 20 * intensity
            const y = (Math.random() - 0.5) * 20 * intensity
            element.style.transform = `translate(${x}px, ${y}px)`
        }, 50)

        setTimeout(() => {
            clearInterval(shakeInterval)
            element.style.transform = originalTransform
            this.isShaking = false
        }, duration)
    }

    // Create particle explosion at coordinates
    createExplosion(x, y, particleCount = 20) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
        const container = document.createElement('div')
        container.style.position = 'fixed'
        container.style.top = '0'
        container.style.left = '0'
        container.style.pointerEvents = 'none'
        container.style.zIndex = '9999'
        document.body.appendChild(container)

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div')
            particle.style.position = 'absolute'
            particle.style.left = x + 'px'
            particle.style.top = y + 'px'
            particle.style.width = '8px'
            particle.style.height = '8px'
            particle.style.borderRadius = '50%'
            particle.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)]
            particle.style.pointerEvents = 'none'

            const angle = (Math.PI * 2 * i) / particleCount
            const velocity = 100 + Math.random() * 100
            const vx = Math.cos(angle) * velocity
            const vy = Math.sin(angle) * velocity

            container.appendChild(particle)
            this.animateParticle(particle, vx, vy)
        }

        setTimeout(() => {
            document.body.removeChild(container)
        }, 2000)
    }

    animateParticle(particle, vx, vy) {
        let px = parseFloat(particle.style.left)
        let py = parseFloat(particle.style.top)
        let opacity = 1

        const animate = () => {
            px += vx * 0.016 // 60fps
            py += vy * 0.016
            vy += 200 * 0.016 // gravity
            opacity -= 0.02

            particle.style.left = px + 'px'
            particle.style.top = py + 'px'
            particle.style.opacity = opacity

            if (opacity > 0) {
                requestAnimationFrame(animate)
            }
        }

        animate()
    }

    // Apply screen filter effects
    applyScreenFilter(filterType, duration = 3000) {
        const body = document.body

        switch (filterType) {
            case 'glitch':
                body.style.filter =
                    'hue-rotate(90deg) saturate(2) contrast(1.5)'
                this.glitchEffect()
                break
            case 'invert':
                body.style.filter = 'invert(1) hue-rotate(180deg)'
                break
            case 'sepia':
                body.style.filter = 'sepia(1) contrast(1.2) brightness(1.1)'
                break
            case 'blur':
                body.style.filter = 'blur(2px) contrast(1.1)'
                break
            case 'rainbow':
                this.rainbowFilter()
                break
        }

        setTimeout(() => {
            body.style.filter = ''
        }, duration)
    }

    glitchEffect() {
        let glitchCount = 0
        const maxGlitches = 10

        const glitch = () => {
            if (glitchCount >= maxGlitches) return

            const filters = [
                'hue-rotate(90deg) saturate(3)',
                'hue-rotate(180deg) contrast(2)',
                'hue-rotate(270deg) brightness(1.5)',
                'invert(1) hue-rotate(45deg)',
            ]

            document.body.style.filter =
                filters[Math.floor(Math.random() * filters.length)]

            setTimeout(() => {
                glitchCount++
                if (glitchCount < maxGlitches) {
                    setTimeout(glitch, Math.random() * 200)
                }
            }, 50 + Math.random() * 100)
        }

        glitch()
    }

    rainbowFilter() {
        let hue = 0
        const rainbowInterval = setInterval(() => {
            hue = (hue + 10) % 360
            document.body.style.filter = `hue-rotate(${hue}deg) saturate(1.5)`
        }, 100)

        setTimeout(() => {
            clearInterval(rainbowInterval)
            document.body.style.filter = ''
        }, 3000)
    }

    // Flash the screen white
    flashScreen(color = 'white', duration = 200) {
        const flash = document.createElement('div')
        flash.style.position = 'fixed'
        flash.style.top = '0'
        flash.style.left = '0'
        flash.style.width = '100vw'
        flash.style.height = '100vh'
        flash.style.backgroundColor = color
        flash.style.opacity = '0.8'
        flash.style.zIndex = '10000'
        flash.style.pointerEvents = 'none'
        flash.style.transition = `opacity ${duration}ms ease-out`

        document.body.appendChild(flash)

        setTimeout(() => {
            flash.style.opacity = '0'
            setTimeout(() => {
                document.body.removeChild(flash)
            }, duration)
        }, 50)
    }

    // Distort text randomly
    glitchText(element, duration = 2000) {
        const originalText = element.textContent
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?`~'

        const glitchInterval = setInterval(() => {
            let glitchedText = ''
            for (let char of originalText) {
                if (Math.random() < 0.1) {
                    glitchedText +=
                        glitchChars[
                            Math.floor(Math.random() * glitchChars.length)
                        ]
                } else {
                    glitchedText += char
                }
            }
            element.textContent = glitchedText
        }, 100)

        setTimeout(() => {
            clearInterval(glitchInterval)
            element.textContent = originalText
        }, duration)
    }
}

// Create a global instance
export const chaosVisuals = new ChaosVisuals()

export default ChaosVisuals
