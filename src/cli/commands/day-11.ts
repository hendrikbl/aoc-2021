import { CommandModule } from 'yargs'
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
        partOne(lines, 100)

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
    },
}

const partOne = (input: string[], steps: number): void => {
    let flashes = 0
    let lines = input.map((line) => Array.from(line).map(Number))

    for (let i = 0; i < steps; i++) {
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
        flashes += lines.flat().filter((digit) => digit <= 0).length
        lines = lines.map((line) =>
            line.map((digit) => (digit <= 0 ? 0 : digit))
        )
    }

    console.log(chalk.blue(chalk.bold('∑ ') + flashes))
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

export default dayElevenCommand
