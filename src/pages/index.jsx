import { MarkGithubIcon } from '@primer/octicons-react'

import ChaoschessGame from '../components/ChaoschessGame'

import styles from './index.module.css'

function Playground() {
    return (
        <div className={styles.page}>
            <header>
                <MarkGithubIcon size={24} />
            </header>
            <main>
                <ChaoschessGame />
            </main>
        </div>
    )
}

export default Playground
