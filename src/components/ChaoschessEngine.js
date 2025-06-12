import { Chess } from 'chess.js'

// Advanced chaos effects that completely break chess
export const ULTIMATE_CHAOS_CARDS = [
    {
        id: 'reality_glitch',
        name: 'Reality Glitch',
        description: 'Randomly teleport 3 pieces to different squares',
        rarity: 'legendary',
        cost: 6,
        effect: 'teleport_pieces',
        emoji: '🌌',
    },
    {
        id: 'piece_evolution',
        name: 'Piece Evolution',
        description: 'All pawns become random pieces',
        rarity: 'rare',
        cost: 4,
        effect: 'evolve_pawns',
        emoji: '🧬',
    },
    {
        id: 'mirror_dimension',
        name: 'Mirror Dimension',
        description: 'Flip the board horizontally',
        rarity: 'uncommon',
        cost: 3,
        effect: 'mirror_board',
        emoji: '🪞',
    },
    {
        id: 'zombie_pieces',
        name: 'Zombie Pieces',
        description: 'Captured pieces come back as zombies (move randomly)',
        rarity: 'legendary',
        cost: 5,
        effect: 'zombie_resurrect',
        emoji: '🧟',
    },
    {
        id: 'size_matters',
        name: 'Size Matters',
        description: 'Board becomes 10x10 for 3 turns',
        rarity: 'legendary',
        cost: 7,
        effect: 'expand_board',
        emoji: '📏',
    },
    {
        id: 'time_loop',
        name: 'Time Loop',
        description:
            'Repeat last 3 moves infinitely until someone breaks pattern',
        rarity: 'legendary',
        cost: 6,
        effect: 'time_loop',
        emoji: '🔄',
    },
    {
        id: 'piece_possession',
        name: 'Piece Possession',
        description: "Control opponent's next move",
        rarity: 'rare',
        cost: 4,
        effect: 'mind_control',
        emoji: '👁️',
    },
    {
        id: 'quantum_entanglement',
        name: 'Quantum Entanglement',
        description: 'Two pieces move together for rest of game',
        rarity: 'rare',
        cost: 3,
        effect: 'entangle_pieces',
        emoji: '🔗',
    },
    {
        id: 'chaos_storm',
        name: 'Chaos Storm',
        description: 'Every piece moves randomly once',
        rarity: 'legendary',
        cost: 8,
        effect: 'random_storm',
        emoji: '🌩️',
    },
    {
        id: 'inception',
        name: 'Inception',
        description: 'Place a mini chess board on current board',
        rarity: 'legendary',
        cost: 9,
        effect: 'board_inception',
        emoji: '♟️',
    },
    {
        id: 'piece_fusion',
        name: 'Piece Fusion',
        description: 'Combine two pieces into one super piece',
        rarity: 'rare',
        cost: 4,
        effect: 'fuse_pieces',
        emoji: '💥',
    },
    {
        id: 'fourth_dimension',
        name: 'Fourth Dimension',
        description: 'Pieces can move through other pieces',
        rarity: 'legendary',
        cost: 5,
        effect: 'phase_movement',
        emoji: '👻',
    },
]

// Combo system - play cards in sequence for bonus effects
export const COMBO_SYSTEM = {
    knight_combo: {
        cards: ['knights_roulette', 'piece_evolution'],
        name: 'Knight Kingdom',
        effect: 'All pieces become knights',
        bonus: 'Extra turn',
    },
    chaos_trinity: {
        cards: ['chaos_field', 'gravity_flip', 'reality_glitch'],
        name: 'Chaos Trinity',
        effect: 'Board becomes a kaleidoscope',
        bonus: 'Opponent skips next turn',
    },
    time_master: {
        cards: ['time_warp', 'time_loop'],
        name: 'Time Master',
        effect: 'Control time for 5 turns',
        bonus: 'Undo any move',
    },
    quantum_lord: {
        cards: ['quantum_split', 'quantum_entanglement'],
        name: 'Quantum Lord',
        effect: 'Exist in multiple realities',
        bonus: 'Make two moves per turn',
    },
}

// Special game modes that can be triggered
export const CHAOS_MODES = {
    battle_royale: {
        name: 'Battle Royale',
        description: 'Board shrinks every 10 moves',
        trigger: 'random',
        effects: ['shrinking_board', 'rapid_energy'],
    },
    king_of_the_hill: {
        name: 'King of the Hill',
        description: 'Control center 4 squares to win',
        trigger: 'card_combo',
        effects: ['territory_control'],
    },
    piece_draft: {
        name: 'Piece Draft',
        description: 'Draft new pieces every 5 turns',
        trigger: 'turn_based',
        effects: ['piece_selection', 'army_building'],
    },
    apocalypse: {
        name: 'Apocalypse Mode',
        description: 'Board is on fire, pieces take damage',
        trigger: 'legendary_card',
        effects: ['burning_squares', 'piece_health'],
    },
}

export class ChaoschessEngine {
    constructor() {
        this.game = new Chess()
        this.activeEffects = new Map()
        this.boardSize = 8
        this.zombiePieces = []
        this.entangledPairs = []
        this.phasedPieces = []
        this.fusedPieces = []
        this.currentMode = null
    }

    // Apply a chaos effect to the game
    applyEffect(effectId, parameters = {}) {
        switch (effectId) {
            case 'teleport_pieces':
                return this.teleportRandomPieces(3)

            case 'evolve_pawns':
                return this.evolvePawns()

            case 'mirror_board':
                return this.mirrorBoard()

            case 'zombie_resurrect':
                return this.resurrectZombies()

            case 'expand_board':
                return this.expandBoard()

            case 'random_storm':
                return this.chaosStorm()

            case 'fuse_pieces':
                return this.fusePieces(parameters.piece1, parameters.piece2)

            case 'phase_movement':
                return this.enablePhasing()

            case 'entangle_pieces':
                return this.entanglePieces(parameters.piece1, parameters.piece2)

            default:
                console.log(`Unknown effect: ${effectId}`)
                return false
        }
    }

    teleportRandomPieces(count) {
        const board = this.game
            .board()
            .flat()
            .filter((piece) => piece !== null)
        const emptySquares = []

        // Find empty squares
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const square =
                    String.fromCharCode('a'.charCodeAt(0) + file) + (rank + 1)
                if (!this.game.get(square)) {
                    emptySquares.push(square)
                }
            }
        }

        // Teleport random pieces
        for (
            let i = 0;
            i < Math.min(count, board.length, emptySquares.length);
            i++
        ) {
            const randomPieceIndex = Math.floor(Math.random() * board.length)
            const randomSquareIndex = Math.floor(
                Math.random() * emptySquares.length
            )

            // This would need proper FEN manipulation in a real implementation
            console.log(
                `Teleporting piece to ${emptySquares[randomSquareIndex]}`
            )
        }

        return true
    }

    evolvePawns() {
        const pieceTypes = ['q', 'r', 'b', 'n']
        const board = this.game.board()

        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const piece = board[rank][file]
                if (piece && piece.type === 'p') {
                    const newType =
                        pieceTypes[
                            Math.floor(Math.random() * pieceTypes.length)
                        ]
                    console.log(`Evolving pawn to ${newType}`)
                    // Would need FEN manipulation to actually change pieces
                }
            }
        }

        return true
    }

    mirrorBoard() {
        // Flip board horizontally
        console.log('Mirroring board horizontally')
        // Would need to reconstruct FEN with mirrored positions
        return true
    }

    resurrectZombies() {
        // Bring back captured pieces as AI-controlled zombies
        console.log('Resurrecting zombie pieces')
        this.zombiePieces.push(...this.getCapturedPieces())
        return true
    }

    expandBoard() {
        console.log('Expanding board to 10x10')
        this.boardSize = 10
        // Would need completely new board representation
        return true
    }

    chaosStorm() {
        console.log('Chaos storm! All pieces move randomly')
        // Each piece moves to a random valid square
        const board = this.game
            .board()
            .flat()
            .filter((piece) => piece !== null)

        board.forEach((piece) => {
            // Generate random valid move for each piece
            const validMoves = this.getRandomValidMoves(piece)
            if (validMoves.length > 0) {
                const randomMove =
                    validMoves[Math.floor(Math.random() * validMoves.length)]
                console.log(`Random move: ${randomMove}`)
            }
        })

        return true
    }

    fusePieces(square1, square2) {
        const piece1 = this.game.get(square1)
        const piece2 = this.game.get(square2)

        if (piece1 && piece2) {
            console.log(`Fusing ${piece1.type} and ${piece2.type}`)
            this.fusedPieces.push({
                square: square1,
                abilities: [piece1.type, piece2.type],
                power: this.calculateFusedPower(piece1.type, piece2.type),
            })
        }

        return true
    }

    enablePhasing() {
        console.log('Enabling phase movement - pieces can pass through others')
        this.activeEffects.set('phasing', { duration: 5 })
        return true
    }

    entanglePieces(square1, square2) {
        console.log(`Entangling pieces at ${square1} and ${square2}`)
        this.entangledPairs.push([square1, square2])
        return true
    }

    // Helper methods
    getCapturedPieces() {
        // Return list of captured pieces (would need game history tracking)
        return [
            { type: 'p', color: 'w' },
            { type: 'n', color: 'b' },
        ]
    }

    getRandomValidMoves(piece) {
        // Return random valid moves for a piece
        return ['e4', 'e5', 'd4', 'd5'] // Simplified
    }

    calculateFusedPower(type1, type2) {
        const powers = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 }
        return powers[type1] + powers[type2]
    }

    // Check for combos
    checkForCombos(playedCards) {
        for (const [comboId, combo] of Object.entries(COMBO_SYSTEM)) {
            if (combo.cards.every((card) => playedCards.includes(card))) {
                console.log(`COMBO ACTIVATED: ${combo.name}!`)
                return combo
            }
        }
        return null
    }

    // Random chaos events
    triggerRandomChaos() {
        const randomEvents = [
            () => this.teleportRandomPieces(1),
            () => this.applyEffect('mirror_board'),
            () => console.log('Lightning strikes! Random piece promoted'),
            () => console.log('Meteor shower! Board shakes violently'),
            () => console.log('Time hiccup! Last move replayed'),
        ]

        const randomEvent =
            randomEvents[Math.floor(Math.random() * randomEvents.length)]
        randomEvent()
    }
}

export default ChaoschessEngine
