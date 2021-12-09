import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'

interface Digit {
    value: number
    segments: Segment[]
}

interface Entry {
    signals: Segment[][]
    output: Segment[][]
}

const DEFAULT_DIGITS: Digit[] = [
    { value: 0, segments: ['a', 'b', 'c', 'e', 'f', 'g'] },
    { value: 1, segments: ['c', 'f'] },
    { value: 2, segments: ['a', 'c', 'd', 'e', 'g'] },
    { value: 3, segments: ['a', 'c', 'd', 'f', 'g'] },
    { value: 4, segments: ['b', 'c', 'd', 'f'] },
    { value: 5, segments: ['a', 'b', 'd', 'f', 'g'] },
    { value: 6, segments: ['a', 'b', 'd', 'e', 'f', 'g'] },
    { value: 7, segments: ['a', 'c', 'f'] },
    { value: 8, segments: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] },
    { value: 8, segments: ['a', 'b', 'c', 'd', 'f', 'g'] },
]

const title = 'Day 8: Seven Segment Search'

const dayEightCommand: CommandModule = {
    describe: title,
    command: 'day-8 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'list of entries, one entry per row',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const entries = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(entries)

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
    },
}

const partOne = (entries: Entry[]): void => {
    let [ones, fours, sevens, eights] = [0, 0, 0, 0]

    entries.forEach((entry) => {
        entry.output.forEach((signal) => {
            switch (signal.length) {
                case DEFAULT_DIGITS[1].segments.length:
                    ones++
                    break
                case DEFAULT_DIGITS[4].segments.length:
                    fours++
                    break
                case DEFAULT_DIGITS[7].segments.length:
                    sevens++
                    break
                case DEFAULT_DIGITS[8].segments.length:
                    eights++
                    break
                default:
                    break
            }
        })
    })

    console.log(
        chalk.blue(chalk.bold('1: ') + ones) +
            chalk.cyan(chalk.bold(' 4: ') + fours) +
            chalk.magenta(chalk.bold(' 7: ') + sevens) +
            chalk.red(chalk.bold(' 8: ') + eights) +
            chalk.green(chalk.bold(' ∑: ') + (ones + fours + sevens + eights))
    )
}

const readInput = async (fPath: string): Promise<Entry[]> => {
    const buffer = await filehandle.readFile(fPath)
    const entries: Entry[] = []

    buffer
        .toString()
        .split('\n')
        .forEach((line) => {
            const [signalStr, outputStr] = line.split('|')
            const signals = signalStr
                .trim()
                .split(' ')
                .map((sig) => sig.split('') as Segment[])
            const output = outputStr
                .trim()
                .split(' ')
                .map((out) => out.split('') as Segment[])
            entries.push({ signals, output })
        })

    return entries
}

export default dayEightCommand
