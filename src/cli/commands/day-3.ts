import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

type Bit = '1' | '0'

interface CommandOptions {
    input: string
}

interface PowerConsumption {
    gamma: number
    epsilon: number
}

const title = 'Day 3: Binary Diagnostic'

const dayThreeCommand: CommandModule = {
    describe: title,
    command: 'day-3 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'the diagnostic report, one binary number per line',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const diagnostics = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        printPowerConsumption(partOne(diagnostics))

        // console.log('\n')
        // console.log(chalk.bold('-- Part Two --'))
    },
}

const readInput = async (fPath: string): Promise<string[]> => {
    const buffer = await filehandle.readFile(fPath)
    return buffer.toString().split('\n')
}

const partOne = (diagnostcs: string[]): PowerConsumption => {
    const gamma = getGammaRate(diagnostcs)
    const epsilon = getEpsilonRate(gamma)
    return { gamma, epsilon }
}

const getGammaRate = (binaries: string[]): number => {
    const rotated: Bit[][] = []
    binaries.forEach((element) => {
        const chars = [...element]
        chars.forEach((char, i) => {
            if (rotated[i]) {
                rotated[i].push(char as Bit)
            } else {
                rotated[i] = [char as Bit]
            }
        })
    })

    return parseInt(
        rotated.map((element) => getMostCommon(element)).join(''),
        2
    )
}

const getEpsilonRate = (gammaRate: number): number => {
    const result = ~gammaRate & (Math.pow(2, gammaRate.toString(2).length) - 1)
    return result
}

const getMostCommon = (chars: Bit[]): Bit => {
    const counts = {}
    chars.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1
    })

    if (counts['1'] > counts['0']) {
        return '1'
    } else {
        return '0'
    }
}

const printPowerConsumption = (powerConsumption: PowerConsumption): void => {
    const gamma = chalk.blue(chalk.bold('γ ') + powerConsumption.gamma)
    const epsilon = chalk.cyan(chalk.bold('ε ') + powerConsumption.epsilon)
    const product = chalk.magenta(
        chalk.bold('∏ ') + powerConsumption.gamma * powerConsumption.epsilon
    )
    console.log(`${gamma} ${epsilon} ${product}`)
}

export default dayThreeCommand
