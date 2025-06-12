import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Chess } from 'chess.js'
import { motion, AnimatePresence } from 'framer-motion'
import ChaosSounds from './ChaosSounds'
import ChaoschessEngine, {
    ULTIMATE_CHAOS_CARDS,
    COMBO_SYSTEM,
} from './ChaoschessEngine'
import './ChaoschessGame.css'

// CHAOS CARDS - The heart of the madness
const CHAOS_CARDS = [
    {
        id: 'knights_roulette',
        name: "Knight's Roulette",
        description: 'Any piece can move like a knight this turn',
        rarity: 'common',
        cost: 1,
        effect: 'knight_moves',
        emoji: '🐴',
    },
    {
        id: 'quantum_split',
        name: 'Quantum Split',
        description: 'Duplicate any non-king piece on the board',
        rarity: 'rare',
        cost: 3,
        effect: 'duplicate_piece',
        emoji: '🌀',
    },
    {
        id: 'chaos_field',
        name: 'Chaos Field',
        description: 'Rotate the entire board 90 degrees',
        rarity: 'legendary',
        cost: 4,
        effect: 'rotate_board',
        emoji: '🌪️',
    },
    {
        id: 'time_warp',
        name: 'Time Warp',
        description: 'Undo the last 2 moves',
        rarity: 'rare',
        cost: 2,
        effect: 'undo_moves',
        emoji: '⏰',
    },
    {
        id: 'pawn_storm',
        name: 'Pawn Storm',
        description: 'All your pawns can move 2 squares forward',
        rarity: 'common',
        cost: 1,
        effect: 'pawn_boost',
        emoji: '⚡',
    },
    {
        id: 'piece_swap',
        name: 'Piece Swap',
        description: 'Swap positions of any two pieces',
        rarity: 'uncommon',
        cost: 2,
        effect: 'swap_pieces',
        emoji: '🔄',
    },
    {
        id: 'bishop_madness',
        name: 'Bishop Madness',
        description: 'Bishops can move like queens this turn',
        rarity: 'uncommon',
        cost: 2,
        effect: 'bishop_queen',
        emoji: '👑',
    },
    {
        id: 'gravity_flip',
        name: 'Gravity Flip',
        description: 'All pieces fall to the bottom of the board',
        rarity: 'legendary',
        cost: 5,
        effect: 'gravity_flip',
        emoji: '⬇️',
    },
    {
        id: 'wild_promotion',
        name: 'Wild Promotion',
        description: 'Any piece can promote to any other piece',
        rarity: 'rare',
        cost: 3,
        effect: 'wild_promotion',
        emoji: '🎭',
    },
    {
        id: 'kings_gambit',
        name: "King's Gambit",
        description: 'Your king can move like a queen for one move',
        rarity: 'legendary',
        cost: 4,
        effect: 'super_king',
        emoji: '👑',
    },
]

const ChaoschessGame = () => {
    const [game, setGame] = useState(new Chess())
    const [playerHand, setPlayerHand] = useState([])
    const [opponentHand, setOpponentHand] = useState([])
    const [activeEffects, setActiveEffects] = useState([])
    const [currentPlayer, setCurrentPlayer] = useState('w')
    const [energy, setEnergy] = useState({ w: 3, b: 3 })
    const [gameHistory, setGameHistory] = useState([])
    const [boardRotation, setBoardRotation] = useState(0)
    const [showExplosion, setShowExplosion] = useState(false)
    const [selectedSquare, setSelectedSquare] = useState(null)
    const [possibleMoves, setPossibleMoves] = useState([])

    // Initialize hands
    useEffect(() => {
        drawInitialHands()
    }, [])

    const drawInitialHands = () => {
        const shuffledCards = [...CHAOS_CARDS].sort(() => Math.random() - 0.5)
        setPlayerHand(shuffledCards.slice(0, 5))
        setOpponentHand(shuffledCards.slice(5, 10))
    }

    const drawCard = (player) => {
        const availableCards = CHAOS_CARDS.filter(
            (card) => !playerHand.includes(card) && !opponentHand.includes(card)
        )
        if (availableCards.length === 0) return

        const newCard =
            availableCards[Math.floor(Math.random() * availableCards.length)]
        if (player === 'w') {
            setPlayerHand((prev) => [...prev, newCard])
        } else {
            setOpponentHand((prev) => [...prev, newCard])
        }
    }

    const playCard = (card, player) => {
        const currentEnergy = energy[player]
        if (currentEnergy < card.cost) return false

        // Deduct energy
        setEnergy((prev) => ({
            ...prev,
            [player]: prev[player] - card.cost,
        }))

        // Apply card effect
        applyCardEffect(card)

        // Remove card from hand
        if (player === 'w') {
            setPlayerHand((prev) => prev.filter((c) => c.id !== card.id))
        } else {
            setOpponentHand((prev) => prev.filter((c) => c.id !== card.id))
        }

        // Trigger explosion effect
        triggerExplosion()

        return true
    }

    const applyCardEffect = (card) => {
        setActiveEffects((prev) => [...prev, card.effect])

        switch (card.effect) {
            case 'rotate_board':
                setBoardRotation((prev) => (prev + 90) % 360)
                break
            case 'gravity_flip':
                // Apply gravity - pieces fall down
                applyGravity()
                break
            case 'undo_moves':
                undoLastMoves(2)
                break
            // Other effects will be handled during move validation
        }
    }

    const applyGravity = () => {
        const newGame = new Chess(game.fen())
        const board = newGame.board()

        // Create a new board with pieces fallen down
        const newBoard = Array(8)
            .fill(null)
            .map(() => Array(8).fill(null))

        for (let file = 0; file < 8; file++) {
            const column = []
            for (let rank = 0; rank < 8; rank++) {
                if (board[rank][file]) {
                    column.push(board[rank][file])
                }
            }

            // Fill from bottom up
            for (let i = 0; i < column.length; i++) {
                newBoard[7 - i][file] = column[column.length - 1 - i]
            }
        }

        // This is a simplified gravity - in a real implementation,
        // we'd need to reconstruct the FEN from the new board
        triggerExplosion()
    }

    const undoLastMoves = (count) => {
        const newGame = new Chess(game.fen())
        for (let i = 0; i < count && newGame.history().length > 0; i++) {
            newGame.undo()
        }
        setGame(newGame)
    }

    const triggerExplosion = () => {
        setShowExplosion(true)
        setTimeout(() => setShowExplosion(false), 1000)

        // Vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100])
        }
    }

    const onSquareClick = (square) => {
        if (selectedSquare === square) {
            setSelectedSquare(null)
            setPossibleMoves([])
            return
        }

        if (selectedSquare && possibleMoves.includes(square)) {
            // Make the move
            const move = makeMove(selectedSquare, square)
            if (move) {
                setSelectedSquare(null)
                setPossibleMoves([])
                endTurn()
            }
        } else {
            // Select new square
            const piece = game.get(square)
            if (piece && piece.color === currentPlayer) {
                setSelectedSquare(square)
                const moves = getValidMoves(square)
                setPossibleMoves(moves)
            }
        }
    }

    const getValidMoves = (square) => {
        let moves = game.moves({ square, verbose: true }).map((move) => move.to)

        // Apply active effects to modify possible moves
        activeEffects.forEach((effect) => {
            switch (effect) {
                case 'knight_moves':
                    moves = [...moves, ...getKnightMoves(square)]
                    break
                case 'bishop_queen':
                    if (game.get(square)?.type === 'b') {
                        moves = [...moves, ...getQueenMoves(square)]
                    }
                    break
                case 'super_king':
                    if (game.get(square)?.type === 'k') {
                        moves = [...moves, ...getQueenMoves(square)]
                    }
                    break
            }
        })

        return [...new Set(moves)] // Remove duplicates
    }

    const getKnightMoves = (square) => {
        const file = square.charCodeAt(0) - 'a'.charCodeAt(0)
        const rank = parseInt(square[1]) - 1
        const knightMoves = [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1],
        ]

        return knightMoves
            .map(([df, dr]) => [file + df, rank + dr])
            .filter(([f, r]) => f >= 0 && f < 8 && r >= 0 && r < 8)
            .map(
                ([f, r]) => String.fromCharCode('a'.charCodeAt(0) + f) + (r + 1)
            )
    }

    const getQueenMoves = (square) => {
        // Simplified queen moves - in real implementation would check for obstructions
        const file = square.charCodeAt(0) - 'a'.charCodeAt(0)
        const rank = parseInt(square[1]) - 1
        const moves = []

        // Add all possible queen moves (simplified)
        for (let f = 0; f < 8; f++) {
            for (let r = 0; r < 8; r++) {
                if (
                    f === file ||
                    r === rank ||
                    Math.abs(f - file) === Math.abs(r - rank)
                ) {
                    if (f !== file || r !== rank) {
                        moves.push(
                            String.fromCharCode('a'.charCodeAt(0) + f) + (r + 1)
                        )
                    }
                }
            }
        }

        return moves
    }

    const makeMove = (from, to) => {
        const newGame = new Chess(game.fen())

        // First try the normal chess move
        try {
            const move = newGame.move({ from, to })
            if (move) {
                setGame(newGame)
                setGameHistory((prev) => [...prev, move])
                return move
            }
        } catch (error) {
            // If normal move fails, check if it's a chaos move
            if (isChaosMove(from, to)) {
                return makeChaosMove(newGame, from, to)
            }
            console.log('Invalid move:', error)
        }
        return null
    }

    const isChaosMove = (from, to) => {
        // Check if this move is enabled by active effects
        const piece = game.get(from)
        if (!piece) return false

        // Check each active effect
        for (const effect of activeEffects) {
            switch (effect) {
                case 'knight_moves':
                    if (isKnightMove(from, to)) return true
                    break
                case 'bishop_queen':
                    if (piece.type === 'b' && isQueenMove(from, to)) return true
                    break
                case 'super_king':
                    if (piece.type === 'k' && isQueenMove(from, to)) return true
                    break
                case 'phase_movement':
                    return true // Phase movement allows any move
                default:
                    break
            }
        }
        return false
    }

    const makeChaosMove = (newGame, from, to) => {
        // Manually execute the chaos move by manipulating the board
        const piece = game.get(from)

        // This is a simplified implementation - in a full version we'd need
        // to properly manipulate the FEN string to move pieces
        console.log(`🌪️ CHAOS MOVE: ${piece.type} from ${from} to ${to}`)

        // Trigger chaos visual effect
        triggerExplosion()

        // For now, let's try to force the move by clearing the destination and placing the piece
        try {
            // Remove piece from source
            newGame.remove(from)
            // Place piece at destination
            newGame.put(piece, to)

            setGame(newGame)
            setGameHistory((prev) => [
                ...prev,
                { from, to, piece: piece.type, chaos: true },
            ])
            return { from, to, piece: piece.type, chaos: true }
        } catch (error) {
            console.log('Chaos move failed:', error)
            return null
        }
    }

    const isKnightMove = (from, to) => {
        const fromFile = from.charCodeAt(0) - 'a'.charCodeAt(0)
        const fromRank = parseInt(from[1]) - 1
        const toFile = to.charCodeAt(0) - 'a'.charCodeAt(0)
        const toRank = parseInt(to[1]) - 1

        const df = Math.abs(toFile - fromFile)
        const dr = Math.abs(toRank - fromRank)

        return (df === 2 && dr === 1) || (df === 1 && dr === 2)
    }

    const isQueenMove = (from, to) => {
        const fromFile = from.charCodeAt(0) - 'a'.charCodeAt(0)
        const fromRank = parseInt(from[1]) - 1
        const toFile = to.charCodeAt(0) - 'a'.charCodeAt(0)
        const toRank = parseInt(to[1]) - 1

        const df = Math.abs(toFile - fromFile)
        const dr = Math.abs(toRank - fromRank)

        // Queen moves: horizontal, vertical, or diagonal
        return fromFile === toFile || fromRank === toRank || df === dr
    }

    const endTurn = () => {
        // Clear active effects (they last one turn)
        setActiveEffects([])

        // Switch players
        const nextPlayer = currentPlayer === 'w' ? 'b' : 'w'
        setCurrentPlayer(nextPlayer)

        // Restore energy and draw card
        setEnergy((prev) => ({
            ...prev,
            [nextPlayer]: Math.min(prev[nextPlayer] + 2, 5),
        }))

        drawCard(nextPlayer)

        // If it's now the opponent's turn (black), make an AI move after a short delay
        if (nextPlayer === 'b') {
            setTimeout(() => {
                makeAIMove()
            }, 1000) // 1 second delay for dramatic effect
        }
    }

    const makeAIMove = () => {
        // Simple AI: try to play a random card first, then make a random move

        // 50% chance to play a card if AI has energy
        if (Math.random() < 0.5 && energy.b >= 1) {
            const playableCards = opponentHand.filter(
                (card) => energy.b >= card.cost
            )
            if (playableCards.length > 0) {
                const randomCard =
                    playableCards[
                        Math.floor(Math.random() * playableCards.length)
                    ]
                console.log(`🤖 AI plays card: ${randomCard.name}`)
                playCard(randomCard, 'b')
            }
        }

        // Make a random move
        setTimeout(() => {
            const possibleMoves = game.moves({ verbose: true })
            if (possibleMoves.length > 0) {
                const randomMove =
                    possibleMoves[
                        Math.floor(Math.random() * possibleMoves.length)
                    ]
                console.log(
                    `🤖 AI moves: ${randomMove.from} -> ${randomMove.to}`
                )

                const move = makeMove(randomMove.from, randomMove.to)
                if (move) {
                    endTurn() // End AI's turn, back to human player
                }
            }
        }, 500) // Short delay after card play
    }

    const renderBoard = () => {
        const squares = []

        for (let rank = 7; rank >= 0; rank--) {
            for (let file = 0; file < 8; file++) {
                const square =
                    String.fromCharCode('a'.charCodeAt(0) + file) + (rank + 1)
                const piece = game.get(square) // Use get() method instead of board array
                const isLight = (rank + file) % 2 === 1
                const isSelected = selectedSquare === square
                const isPossibleMove = possibleMoves.includes(square)

                squares.push(
                    <motion.div
                        key={square}
                        className={`square ${isLight ? 'light' : 'dark'} ${
                            isSelected ? 'selected' : ''
                        } ${isPossibleMove ? 'possible-move' : ''}`}
                        onClick={() => onSquareClick(square)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {piece && (
                            <motion.div
                                className={`piece ${
                                    piece.color === 'w'
                                        ? 'white-piece'
                                        : 'black-piece'
                                }`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                title={`${square}: ${piece.color}${piece.type}`}
                            >
                                {getPieceSymbol(piece)}
                            </motion.div>
                        )}
                    </motion.div>
                )
            }
        }

        return (
            <motion.div
                className="board"
                style={{ transform: `rotate(${boardRotation}deg)` }}
                animate={{ rotate: boardRotation }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            >
                {squares}
            </motion.div>
        )
    }

    const getPieceSymbol = (piece) => {
        const symbols = {
            p: piece.color === 'w' ? '♙' : '♟',
            r: piece.color === 'w' ? '♖' : '♜',
            n: piece.color === 'w' ? '♘' : '♞',
            b: piece.color === 'w' ? '♗' : '♝',
            q: piece.color === 'w' ? '♕' : '♛',
            k: piece.color === 'w' ? '♔' : '♚',
        }
        return symbols[piece.type]
    }

    const renderCard = (card, canPlay, onPlay) => (
        <motion.div
            key={card.id}
            className={`card ${card.rarity} ${
                canPlay ? 'playable' : 'disabled'
            }`}
            whileHover={canPlay ? { scale: 1.05, y: -5 } : {}}
            whileTap={canPlay ? { scale: 0.95 } : {}}
            onClick={() => canPlay && onPlay(card)}
        >
            <div className="card-emoji">{card.emoji}</div>
            <div className="card-name">{card.name}</div>
            <div className="card-cost">⚡{card.cost}</div>
            <div className="card-description">{card.description}</div>
        </motion.div>
    )

    return (
        <div className="chaosChess-game">
            <AnimatePresence>
                {showExplosion && (
                    <motion.div
                        className="explosion"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        💥
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="game-info">
                <h1>🌪️ CHAOS CHESS 🌪️</h1>
                <div className="turn-info">
                    <span>
                        Turn: {currentPlayer === 'w' ? 'White' : 'Black'}
                    </span>
                    <span>Energy: ⚡{energy[currentPlayer]}</span>
                </div>
            </div>

            {renderBoard()}

            <div className="player-hand">
                <h3>Your Cards:</h3>
                <div className="cards">
                    {playerHand.map((card) =>
                        renderCard(
                            card,
                            energy[currentPlayer] >= card.cost &&
                                currentPlayer === 'w',
                            (card) => playCard(card, 'w')
                        )
                    )}
                </div>
            </div>

            <div className="opponent-hand">
                <h3>Opponent Cards: {opponentHand.length}</h3>
                <div className="cards">
                    {opponentHand.map((card, index) => (
                        <motion.div key={index} className="card-back">
                            🎴
                        </motion.div>
                    ))}
                </div>
            </div>

            {activeEffects.length > 0 && (
                <div className="active-effects">
                    <h4>Active Effects:</h4>
                    {activeEffects.map((effect, index) => (
                        <span key={index} className="effect-badge">
                            {effect.replace('_', ' ')}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ChaoschessGame
