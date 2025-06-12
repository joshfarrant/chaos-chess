// Sound effects for maximum chaos
export class ChaosSounds {
    constructor() {
        this.audioContext = null
        this.init()
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext ||
                window.webkitAudioContext)()
        } catch (e) {
            console.warn('Audio context not supported')
        }
    }

    // Generate explosion sound
    playExplosion() {
        if (!this.audioContext) return

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        // Create explosion-like sound
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(
            1,
            this.audioContext.currentTime + 0.5
        )

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.5
        )

        oscillator.type = 'sawtooth'
        oscillator.start()
        oscillator.stop(this.audioContext.currentTime + 0.5)
    }

    // Play card draw sound
    playCardDraw() {
        if (!this.audioContext) return

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
        oscillator.frequency.linearRampToValueAtTime(
            1200,
            this.audioContext.currentTime + 0.1
        )

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.1
        )

        oscillator.type = 'sine'
        oscillator.start()
        oscillator.stop(this.audioContext.currentTime + 0.1)
    }

    // Play move sound with pitch based on piece type
    playMove(pieceType) {
        if (!this.audioContext) return

        const frequencies = {
            p: 200, // pawn
            r: 150, // rook
            n: 300, // knight
            b: 250, // bishop
            q: 400, // queen
            k: 100, // king
        }

        const freq = frequencies[pieceType] || 200

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime)

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.2
        )

        oscillator.type = 'triangle'
        oscillator.start()
        oscillator.stop(this.audioContext.currentTime + 0.2)
    }

    // Chaos chord for legendary cards
    playChaosChord() {
        if (!this.audioContext) return

        const frequencies = [130.81, 164.81, 196.0, 246.94] // C3, E3, G3, B3

        frequencies.forEach((freq) => {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.frequency.setValueAtTime(
                freq,
                this.audioContext.currentTime
            )

            gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + 1
            )

            oscillator.type = 'sine'
            oscillator.start()
            oscillator.stop(this.audioContext.currentTime + 1)
        })
    }

    // Victory fanfare
    playVictory() {
        if (!this.audioContext) return

        const melody = [
            { freq: 523.25, time: 0 }, // C5
            { freq: 659.25, time: 0.25 }, // E5
            { freq: 783.99, time: 0.5 }, // G5
            { freq: 1046.5, time: 0.75 }, // C6
        ]

        melody.forEach((note) => {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.frequency.setValueAtTime(
                note.freq,
                this.audioContext.currentTime + note.time
            )

            gainNode.gain.setValueAtTime(
                0.2,
                this.audioContext.currentTime + note.time
            )
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + note.time + 0.2
            )

            oscillator.type = 'sine'
            oscillator.start(this.audioContext.currentTime + note.time)
            oscillator.stop(this.audioContext.currentTime + note.time + 0.2)
        })
    }
}

export default ChaosSounds
