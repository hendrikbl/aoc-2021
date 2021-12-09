import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

const title = 'Day 9: Smoke Basin'

const dayNineCommand: CommandModule = {
    describe: title,
    command: 'day-9 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'heightmap',
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
    },
}

const partOne = (lines: string[]): void => {
    const risks: number[] = []

    lines.forEach((line, i) => {
        for (let x = 0; x < line.length; x++) {
            let isLow = true
            if (i != 0 && isLow) isLow = line[x] < lines[i - 1][x]
            if (x != 0 && isLow) isLow = line[x] < line[x - 1]
            if (i != lines.length - 1 && isLow)
                isLow = line[x] < lines[i + 1][x]
            if (x != line.length - 1 && isLow) isLow = line[x] < line[x + 1]
            if (isLow) risks.push(parseInt(line[x], 10))
        }
    })

    const sum = risks.length + risks.reduce((a, b) => a + b)
    console.log(chalk.blue(chalk.bold('∑ ') + sum))
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

export default dayNineCommand
