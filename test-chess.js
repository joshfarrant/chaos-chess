import { Chess } from 'chess.js'

const chess = new Chess()
console.log('Initial FEN:', chess.fen())
console.log('Initial board:')
const board = chess.board()

// Check piece representation - let's see what's really happening
console.log('Board array structure:')
board.forEach((rank, rankIndex) => {
    console.log(
        `Rank ${rankIndex} (chess rank ${rankIndex + 1}):`,
        rank
            .map((piece) => (piece ? `${piece.color}${piece.type}` : '  '))
            .join(' ')
    )
})

console.log('\nPiece details:')
for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
        const piece = board[rank][file]
        if (piece) {
            const square =
                String.fromCharCode('a'.charCodeAt(0) + file) + (rank + 1)
            console.log(`${square}: type=${piece.type} color=${piece.color}`)
        }
    }
}

// Let's also test a few specific squares
console.log('\nSpecific squares:')
console.log('a1:', chess.get('a1'))
console.log('a2:', chess.get('a2'))
console.log('a7:', chess.get('a7'))
console.log('a8:', chess.get('a8'))

export default {}
