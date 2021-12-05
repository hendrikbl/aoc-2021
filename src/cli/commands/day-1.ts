import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

const dayOneCommand: CommandModule = {
    describe: 'Day 1: Sonar Sweep',
    command: 'day-1 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'the sonar sweep report, one measurement per line',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const data = await readInput(input)

        let inc = 0
        let dec = 0
        let equal = 0

        for (let index = 0; index < data.length; index++) {
            const prev = data[index - 1]
            const curr = data[index]
            if (curr > prev) {
                inc += 1
            } else if (curr < prev) {
                dec += 1
            } else if (curr == prev) {
                equal += 1
            }
        }

        console.log(chalk.red(`${dec}x decreased`))
        console.log(chalk.green(`${inc}x increased`))
        console.log(chalk.blue(`${equal}x equal`))
    },
}

const readInput = async (fPath: string): Promise<number[]> => {
    const buffer = await filehandle.readFile(fPath)
    return buffer
        .toString()
        .split('\n')
        .map((n) => parseInt(n))
}

export default dayOneCommand
