import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

interface Result {
    inc: number
    dec: number
    equal: number
}

const title = 'Day 1: Sonar Sweep'

const dayOneCommand: CommandModule = {
    describe: title,
    command: 'day-1 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'the sonar sweep report, one measurement per line',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const measurements = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        printResult(partOne(measurements))
        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
        printResult(partTwo(measurements))
    },
}

const readInput = async (fPath: string): Promise<number[]> => {
    const buffer = await filehandle.readFile(fPath)
    return buffer
        .toString()
        .split('\n')
        .map((n) => parseInt(n))
}

const printResult = (res: Result): void => {
    console.log(chalk.red(`${res.dec}x decreased`))
    console.log(chalk.green(`${res.inc}x increased`))
    console.log(chalk.blue(`${res.equal}x equal`))
}

const partOne = (measurements: number[]): Result => {
    const res = {
        inc: 0,
        dec: 0,
        equal: 0,
    }

    for (let index = 0; index < measurements.length; index++) {
        const prev = measurements[index - 1]
        const curr = measurements[index]
        if (curr > prev) {
            res.inc += 1
        } else if (curr < prev) {
            res.dec += 1
        } else if (curr == prev) {
            res.equal += 1
        }
    }

    return res
}

const partTwo = (measurements: number[]): Result => {
    const windows: number[] = []

    for (let index = 0; index < measurements.length - 2; index++) {
        windows.push(
            measurements[index] +
                measurements[index + 1] +
                measurements[index + 2]
        )
    }

    return partOne(windows)
}

export default dayOneCommand
