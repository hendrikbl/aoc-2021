import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

const title = 'Day 10: Syntax Scoring'

const dayTenCommand: CommandModule = {
    describe: title,
    command: 'day-10 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'navigation subsystem',
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
        // partTwo(lines)
    },
}

const partOne = (lines: string[][]): void => {
    const errorScore: Map<string, number> = new Map()
    errorScore.set(')', 3)
    errorScore.set(']', 57)
    errorScore.set('}', 1197)
    errorScore.set('>', 25137)

    const scores: number[] = []

    lines.forEach((line) => {
        const corruptIndex = findCorrupt(line)
        const score = errorScore.get(line[corruptIndex])
        if (corruptIndex != -1 && score != undefined) scores.push(score)
    })

    const score = scores.reduce((a, b) => a + b)
    console.log(chalk.blue(chalk.bold('∑ ') + score))
}

// const partTwo = (input: string[][]): void => {}

const readInput = async (fPath: string): Promise<string[][]> => {
    const buffer = await filehandle.readFile(fPath)
    const lines: string[][] = []

    buffer
        .toString()
        .split('\n')
        .forEach((line) => {
            lines.push(Array.from(line.trim()))
        })

    return lines
}

const findCorrupt = (line: string[]): number => {
    const brackets: Map<string, string> = new Map()

    brackets.set('(', ')')
    brackets.set('[', ']')
    brackets.set('{', '}')
    brackets.set('<', '>')

    const temp: string[] = []

    for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (brackets.get(char) != undefined) {
            temp.push(char)
        } else if (char == brackets.get(temp[temp.length - 1])) {
            temp.splice(temp.length - 1, 1)
        } else if (char != brackets.get(temp[temp.length - 1])) {
            return i
        }
    }
    return -1
}

export default dayTenCommand
