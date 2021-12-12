import { CommandModule } from 'yargs'
import { tick } from 'figures'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

const title = 'Day 11: Dumbo Octopus'

const dayElevenCommand: CommandModule = {
    describe: title,
    command: 'day-11 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'octopuses, arranged in a square grid',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const lines = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(lines)

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
        partTwo(lines)
    },
}

const partOne = (input: string[]): void => {
    const flashes = getFlashes(input, 100)
        .flat()
        .reduce((a, b) => a + b)
    console.log(chalk.blue(chalk.bold('∑ ') + flashes))
}

const partTwo = (input: string[]): void => {
    const flashes = getFlashes(input, -1)
    console.log(chalk.blue(chalk.bold(tick) + ' ' + flashes.length))
}

const readInput = async (fPath: string): Promise<string[]> => {
    const buffer = await filehandle.readFile(fPath)
    const entries: string[] = []

    buffer
        .toString()
        .split('\n')
        .forEach((line) => {
            entries.push(line.trim())
        })

    return entries
}

const getFlashes = (input: string[], steps: number): number[] => {
    let actualSteps = steps
    if (steps == -1) actualSteps = 1

    const flashes: number[] = []
    let lines = input.map((line) => Array.from(line).map(Number))

    for (let i = 0; i < actualSteps; i++) {
        lines = lines.map((line) => line.map((digit) => digit + 1))
        let containsTenOrBigger = lines.flat().some((digit) => digit >= 10)
        while (containsTenOrBigger) {
            lines.forEach((line, y) => {
                line.forEach((digit, x) => {
                    if (digit >= 10) {
                        line.splice(x, 1, -100000)

                        if (y > 0) {
                            lines[y - 1][x] += 1
                            if (x > 0) lines[y - 1][x - 1] += 1
                            if (x < line.length - 1) lines[y - 1][x + 1] += 1
                        }
                        if (x > 0) lines[y][x - 1] += 1
                        if (x < line.length - 1) lines[y][x + 1] += 1
                        if (y < lines.length - 1) {
                            lines[y + 1][x] += 1
                            if (x > 0) lines[y + 1][x - 1] += 1
                            if (x < line.length - 1) lines[y + 1][x + 1] += 1
                        }
                    }
                })
            })
            containsTenOrBigger = lines.flat().some((digit) => digit >= 10)
        }
        flashes.push(lines.flat().filter((digit) => digit <= 0).length)
        lines = lines.map((line) =>
            line.map((digit) => (digit <= 0 ? 0 : digit))
        )
        if (!(flashes[i] == 100) && steps == -1) actualSteps += 1
    }

    return flashes
}

export default dayElevenCommand
