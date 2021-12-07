import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

type FuelType = 1 | 2

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
        partTwo(positions)
    },
}

const partOne = (positions: number[]): void => {
    const results = getAllCosts(positions, 1)
    printResult(results)
}

const partTwo = (positions: number[]): void => {
    const results = getAllCosts(positions, 2)
    printResult(results)
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

const getExpensiveFuelToPosition = (
    positions: number[],
    target: number
): number => {
    // VERY SLOW!
    // return positions
    //     .map((pos) =>
    //         [...Array(Math.abs(target - pos) + 1).keys()].reduce(
    //             (a, b) => a + b
    //         )
    //     )
    //     .reduce((a, b) => a + b)

    // Also slow, but better
    return positions
        .map((pos) => {
            let res = 0
            for (let i = 0; i <= Math.abs(target - pos); i++) {
                res += i
            }
            return res
        })
        .reduce((a, b) => a + b)
}

const getAllCosts = (positions: number[], type: FuelType): number[] => {
    const max = Math.max(...positions)
    const min = Math.min(...positions)
    const results: number[] = []
    while (results.length < max) {
        if (type == 1) {
            results.push(getFuelToPosition(positions, min + results.length))
        } else if (type == 2) {
            results.push(
                getExpensiveFuelToPosition(positions, min + results.length)
            )
        }
    }
    return results
}

const printResult = (results: number[]) => {
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
export default daySevenCommand
