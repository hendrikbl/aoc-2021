import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

interface Entry {
    signals: string[]
    output: string[]
}

const DEFAULT_DIGITS = [
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
        poartTwo(entries)
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

const poartTwo = (entries: Entry[]): void => {
    let sum = 0
    entries.forEach((entry) => {
        const map = deduct(entry)
        const signals = entry.signals.map((signal) => map.get(signal))
        const output = entry.output.map((signal) => map.get(signal))
        sum += parseInt(output.join(''), 10)
        console.log(signals.join(' ') + ' | ' + output.join(' '))
    })
    console.log(chalk.blue(chalk.bold('∑ ') + sum))
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
                .map((signal) => [...signal].sort().join(''))
            const output = outputStr
                .trim()
                .split(' ')
                .map((signal) => [...signal].sort().join(''))
            entries.push({ signals, output })
        })

    return entries
}

const commonEdgeCount = (a: string, b: string): number => {
    let commonEdgeCount = 0
    for (const char of a) {
        if (b.includes(char)) commonEdgeCount++
    }
    return commonEdgeCount
}

const getCharValueMap = (signals: string[]): Map<string, number> => {
    const map = new Map<string, number>()
    const oneChars = signals.filter(
        (signal) => signal.length == DEFAULT_DIGITS[1].segments.length
    )
    const fourChars = signals.filter(
        (signal) => signal.length == DEFAULT_DIGITS[4].segments.length
    )
    const sevenChars = signals.filter(
        (signal) => signal.length == DEFAULT_DIGITS[7].segments.length
    )
    const eightChars = signals.filter(
        (signal) => signal.length == DEFAULT_DIGITS[8].segments.length
    )

    map.set(oneChars[0], 1)
    map.set(fourChars[0], 4)
    map.set(sevenChars[0], 7)
    map.set(eightChars[0], 8)

    return map
}

const findDigit = (signal: string, knownChars: Map<string, number>): number => {
    // invert map
    const signalMap = new Map(Array.from(knownChars, (a) => [a[1], a[0]]))
    const one: string = signalMap.get(1) as string
    const four: string = signalMap.get(4) as string
    const seven: string = signalMap.get(7) as string
    const eight: string = signalMap.get(8) as string
    if (signal.length == 5) {
        if (
            commonEdgeCount(signal, one) == 1 &&
            commonEdgeCount(signal, four) == 2 &&
            commonEdgeCount(signal, seven) == 2 &&
            commonEdgeCount(signal, eight) == 5
        )
            return 2
        if (
            commonEdgeCount(signal, one) == 2 &&
            commonEdgeCount(signal, four) == 3 &&
            commonEdgeCount(signal, seven) == 3 &&
            commonEdgeCount(signal, eight) == 5
        )
            return 3
        if (
            commonEdgeCount(signal, one) == 1 &&
            commonEdgeCount(signal, four) == 3 &&
            commonEdgeCount(signal, seven) == 2 &&
            commonEdgeCount(signal, eight) == 5
        )
            return 5
    }
    if (signal.length == 6) {
        if (
            commonEdgeCount(signal, one) == 2 &&
            commonEdgeCount(signal, four) == 3 &&
            commonEdgeCount(signal, seven) == 3 &&
            commonEdgeCount(signal, eight) == 6
        )
            return 0
        if (
            commonEdgeCount(signal, one) == 1 &&
            commonEdgeCount(signal, four) == 3 &&
            commonEdgeCount(signal, seven) == 2 &&
            commonEdgeCount(signal, eight) == 6
        )
            return 6
        if (
            commonEdgeCount(signal, one) == 2 &&
            commonEdgeCount(signal, four) == 4 &&
            commonEdgeCount(signal, seven) == 3 &&
            commonEdgeCount(signal, eight) == 6
        )
            return 9
    }
    throw new Error('No digit found for signal')
}

const deduct = (entry: Entry): Map<string, number> => {
    const charMap = getCharValueMap(entry.signals)
    const knownChars = [...charMap.keys()]

    const unknownSignals = entry.signals.filter(
        (signal) => !knownChars.includes(signal)
    )

    for (const signal of unknownSignals) {
        charMap.set(signal, findDigit(signal, charMap))
    }

    return charMap
}

export default dayEightCommand
