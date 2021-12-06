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

interface LifeSupportRating {
    oxygen: number
    carbon: number
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

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
        printLifeSupportRating(partTwo(diagnostics))
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

const partTwo = (diagnostcs: string[]): LifeSupportRating => {
    const oxygen = getOxygenRating(diagnostcs)
    const carbon = getCarbonRating(diagnostcs)
    return { oxygen, carbon }
}

const rotateBins = (binaries: string[]): Bit[][] => {
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

    return rotated
}

const invertBits = (input: number): number => {
    return ~input & (Math.pow(2, input.toString(2).length) - 1)
}

const getGammaRate = (binaries: string[]): number => {
    const rotated = rotateBins(binaries)

    return parseInt(
        rotated.map((element) => getMostCommon(element)).join(''),
        2
    )
}

const getEpsilonRate = (gammaRate: number): number => {
    return invertBits(gammaRate)
}

const getMostCommon = (chars: Bit[], equal: Bit = '0'): Bit => {
    const counts = {}
    chars.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1
    })

    if (counts['1'] > counts['0']) {
        return '1'
    } else if (counts['1'] < counts['0']) {
        return '0'
    } else return equal
}

const getOxygenRating = (binaries: string[]): number => {
    let temp: string[] = binaries
    const length = rotateBins(temp).length

    for (let i = 0; i < length; i++) {
        const rotated = rotateBins(temp)
        const mostCommon = getMostCommon(rotated[i], '1')
        temp = temp.filter((bin) => bin[i] == mostCommon)
        if (temp.length == 1) return parseInt(temp[0], 2)
    }

    throw Error('no oxygen rating found')
}

const getCarbonRating = (binaries: string[]): number => {
    let temp: string[] = binaries
    const length = rotateBins(temp).length

    for (let i = 0; i < length; i++) {
        const rotated = rotateBins(temp)
        const leastCommon = (
            1 - parseInt(getMostCommon(rotated[i], '1'))
        ).toString()
        temp = temp.filter((bin) => bin[i] == leastCommon)
        if (temp.length == 1) return parseInt(temp[0], 2)
    }

    throw Error('no oxygen rating found')
}

const printPowerConsumption = (consumption: PowerConsumption): void => {
    const gamma = chalk.blue(chalk.bold('γ ') + consumption.gamma)
    const epsilon = chalk.cyan(chalk.bold('ε ') + consumption.epsilon)
    const product = chalk.magenta(
        chalk.bold('∏ ') + consumption.gamma * consumption.epsilon
    )
    console.log(`${gamma} ${epsilon} ${product}`)
}

const printLifeSupportRating = (rating: LifeSupportRating): void => {
    const gamma = chalk.blue(chalk.bold('O2 ') + rating.oxygen)
    const epsilon = chalk.cyan(chalk.bold('CO2 ') + rating.carbon)
    const product = chalk.magenta(
        chalk.bold('∏ ') + rating.oxygen * rating.carbon
    )
    console.log(`${gamma} ${epsilon} ${product}`)
}

export default dayThreeCommand
