import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

const title = 'Day 7: The Treachery of Whales'

const daySevenCommand: CommandModule = {
    describe: title,
    command: 'day-7 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'list of positions, seperated by comma',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const positions = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(positions)

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
    },
}

const partOne = (positions: number[]): void => {
    const results = getAllCosts(positions)
    const minFuelCost = Math.min(...results)
    const optimalPosition = results.findIndex((pos) => pos == minFuelCost)
    console.log(
        'The optimal position is ' +
            chalk.blue.bold(optimalPosition) +
            ' with a cost of ' +
            chalk.blue.bold(minFuelCost) +
            ' fuel'
    )
}

const readInput = async (fPath: string): Promise<number[]> => {
    const buffer = await filehandle.readFile(fPath)
    return buffer
        .toString()
        .split(',')
        .map((p) => parseInt(p, 10))
}

const getFuelToPosition = (positions: number[], target: number): number => {
    return positions
        .map((pos) => Math.abs(target - pos))
        .reduce((a, b) => a + b)
}

const getAllCosts = (positions: number[]): number[] => {
    const max = Math.max(...positions)
    const min = Math.min(...positions)
    const results: number[] = []
    while (results.length < max) {
        results.push(getFuelToPosition(positions, min + results.length))
    }
    return results
}
export default daySevenCommand
