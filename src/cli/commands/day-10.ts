import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

interface AnalysisResult {
    key?: number
    missing?: string[]
    expected?: string
    got?: string
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
        partTwo(lines)
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
        const result = findCorrupt(line)
        if (result.key != -1 && result.got) {
            const score = errorScore.get(result.got)
            if (score != undefined) scores.push(score)
        }
    })

    const score = scores.reduce((a, b) => a + b)
    console.log(chalk.blue(chalk.bold('∑ ') + score))
}

const partTwo = (lines: string[][]): void => {
    const errorScore: Map<string, number> = new Map()
    errorScore.set(')', 1)
    errorScore.set(']', 2)
    errorScore.set('}', 3)
    errorScore.set('>', 4)

    const scores: number[] = []
    lines.forEach((line) => {
        const result = findCorrupt(line)
        if (result.missing) {
            let lineScore = 0
            result.missing.forEach((char) => {
                const score = errorScore.get(char)
                if (score) {
                    lineScore = lineScore * 5 + score
                }
            })
            scores.push(lineScore)
        }
    })
    const middle = Math.floor(scores.length / 2)
    const result = scores.sort((a, b) => a - b)
    console.log(chalk.blue(result[middle]))
}

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

const findCorrupt = (line: string[]): AnalysisResult => {
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
            return {
                key: i,
                expected: temp[temp.length - 1],
                got: char,
            }
        }
        if (i == line.length - 1 && temp.length > 0) {
            return {
                missing: temp
                    .map((char) => brackets.get(char))
                    .filter((char) => char != undefined)
                    .reverse() as string[],
            }
        }
    }
    return { key: -1 }
}

export default dayTenCommand
