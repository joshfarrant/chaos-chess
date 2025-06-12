// AI Opponent that embraces the chaos
export class ChaoschessAI {
    constructor(difficulty = 'chaotic') {
        this.difficulty = difficulty
        this.personality = this.generatePersonality()
        this.cardPlayHistory = []
        this.favoriteCards = []
    }

    generatePersonality() {
        const personalities = [
            {
                name: 'Chaos Gremlin',
                description:
                    'Loves maximum chaos, plays legendary cards whenever possible',
                cardPreference: (card) =>
                    card.rarity === 'legendary' ? 10 : 1,
                moveStyle: 'aggressive',
                taunts: [
                    'Reality is just a suggestion! 🌪️',
                    "Let's break some rules! 💥",
                    'Chaos is my middle name! 🎭',
                ],
            },
            {
                name: 'Quantum Professor',
                description:
                    'Prefers scientific chaos, loves quantum and time effects',
                cardPreference: (card) =>
                    card.name.includes('Quantum') || card.name.includes('Time')
                        ? 8
                        : 2,
                moveStyle: 'calculated',
                taunts: [
                    'According to my calculations... CHAOS! 🧬',
                    'Observe this quantum phenomenon! ⚛️',
                    'Time is relative, my friend! ⏰',
                ],
            },
            {
                name: 'Mischief Maker',
                description:
                    'Loves pranks and reversals, enjoys opponent confusion',
                cardPreference: (card) =>
                    card.effect.includes('swap') ||
                    card.effect.includes('reverse')
                        ? 9
                        : 3,
                moveStyle: 'tricky',
                taunts: [
                    'Expect the unexpected! 🎪',
                    'Oops, did I do that? 😈',
                    'Surprise! 🎉',
                ],
            },
            {
                name: 'Zen Chaos Master',
                description: 'Finds peace in chaos, balanced approach',
                cardPreference: (card) => Math.random() * 5 + 3,
                moveStyle: 'balanced',
                taunts: [
                    'In chaos, we find harmony 🧘',
                    'The universe decides 🌌',
                    'All is as it should be ☯️',
                ],
            },
        ]

        return personalities[Math.floor(Math.random() * personalities.length)]
    }

    // Decide which card to play
    chooseCard(hand, energy, gameState) {
        const playableCards = hand.filter((card) => energy >= card.cost)

        if (playableCards.length === 0) {
            return null
        }

        // Score cards based on personality and game state
        const scoredCards = playableCards.map((card) => ({
            card,
            score: this.scoreCard(card, gameState),
        }))

        // Sort by score and add some randomness
        scoredCards.sort((a, b) => {
            const scoreA = a.score + (Math.random() - 0.5) * 2
            const scoreB = b.score + (Math.random() - 0.5) * 2
            return scoreB - scoreA
        })

        const chosenCard = scoredCards[0].card
        this.cardPlayHistory.push(chosenCard.id)

        return chosenCard
    }

    scoreCard(card, gameState) {
        let score = this.personality.cardPreference(card)

        // Situational bonuses
        if (gameState.isLosing && card.rarity === 'legendary') {
            score += 5 // Desperation plays
        }

        if (gameState.turnNumber < 5 && card.cost <= 2) {
            score += 3 // Early game efficiency
        }

        if (this.cardPlayHistory.includes(card.id)) {
            score -= 2 // Avoid repeating same cards
        }

        // Combo detection
        const recentCards = this.cardPlayHistory.slice(-2)
        for (const combo of Object.values(COMBO_SYSTEM)) {
            if (
                combo.cards.some((comboCard) =>
                    recentCards.includes(comboCard)
                ) &&
                combo.cards.includes(card.id)
            ) {
                score += 8 // Major combo bonus
            }
        }

        return score
    }

    // Choose chess move (simplified)
    chooseMove(game, activeEffects) {
        const moves = game.moves({ verbose: true })

        if (moves.length === 0) return null

        // Apply some basic strategy with chaos
        const scoredMoves = moves.map((move) => ({
            move,
            score: this.scoreMove(move, game, activeEffects),
        }))

        scoredMoves.sort((a, b) => b.score - a.score)

        // Add randomness based on personality
        const randomIndex = Math.floor(
            Math.random() * Math.min(5, scoredMoves.length)
        )
        return scoredMoves[randomIndex]?.move
    }

    scoreMove(move, game, activeEffects) {
        let score = Math.random() * 10 // Base chaos

        // Basic chess scoring
        if (move.captured) score += 15
        if (move.promotion) score += 20
        if (game.inCheck()) score += 10

        // Chaos-specific scoring
        if (activeEffects.includes('knight_moves') && move.piece === 'p') {
            score += 5 // Use knight movement for pawns
        }

        if (this.personality.moveStyle === 'aggressive') {
            if (move.to[1] > '5') score += 3 // Advance forward
        }

        return score
    }

    // Get a random taunt
    getTaunt() {
        const taunts = this.personality.taunts
        return taunts[Math.floor(Math.random() * taunts.length)]
    }

    // React to opponent's moves
    reactToMove(move, wasCardPlayed) {
        const reactions = [
            'Interesting choice! 🤔',
            "I see what you're doing... 👀",
            'Bold move! 💪',
            'Chaos approves! ✨',
            'The plot thickens! 📖',
        ]

        if (wasCardPlayed) {
            return 'Two can play at that game! 😏'
        }

        return reactions[Math.floor(Math.random() * reactions.length)]
    }

    // Celebrate chaos events
    celebrateChaos(effectName) {
        const celebrations = {
            teleport_pieces: 'Teleportation successful! 🌟',
            chaos_field: 'The board spins! Wheee! 🌪️',
            gravity_flip: 'Gravity is overrated anyway! ⬇️',
            quantum_split: "Schrödinger's pieces! 🐱",
            time_warp: 'Time travel is so cool! ⏰',
        }

        return celebrations[effectName] || 'Chaos reigns supreme! 🎭'
    }
}

// Import COMBO_SYSTEM for the AI
const COMBO_SYSTEM = {
    knight_combo: {
        cards: ['knights_roulette', 'piece_evolution'],
        name: 'Knight Kingdom',
    },
    chaos_trinity: {
        cards: ['chaos_field', 'gravity_flip', 'reality_glitch'],
        name: 'Chaos Trinity',
    },
}

export default ChaoschessAI
