import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

class SimulatedSchool {
    fishes: Fish[]

    constructor(fishes: Fish[]) {
        this.fishes = fishes
    }

    public passDays(days: number): void {
        for (let day = 0; day < days; day++) {
            this.fishes.forEach((fish) => {
                if (fish.daysToMultiply != 0) {
                    fish.daysToMultiply -= 1
                } else {
                    this.fishes.push(fish.giveBirth())
                }
            })
        }
    }

    public countFishes(): number {
        return this.fishes.length
    }
}
class FastSchool {
    0 = 0
    1 = 0
    2 = 0
    3 = 0
    4 = 0
    5 = 0
    6 = 0
    7 = 0
    8 = 0

    constructor(fishes: Fish[]) {
        fishes.forEach((fish) => {
            this[fish.daysToMultiply] += 1
        })
    }

    public passDays(days: number): void {
        for (let day = 0; day < days; day++) {
            const numBirths = this[0]
            for (let i = 0; i < 8; i++) {
                this[i] = this[i + 1]
            }
            this[8] = numBirths
            this[6] += numBirths
        }
    }

    public countFishes(): number {
        return Object.values(this).reduce((a, b) => a + b)
    }
}

class Fish {
    daysToMultiply = 8

    constructor(daysToMultiply: number) {
        this.daysToMultiply = daysToMultiply
    }

    public giveBirth(): Fish {
        this.daysToMultiply = 6
        return new Fish(8)
    }
}

const title = 'Day 6: Lanternfish'

const daySixCommand: CommandModule = {
    describe: title,
    command: 'day-6 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'list of ages, seperated by comma',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const simulatedFishes = await readInput(input)
        const fastFishes = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(new SimulatedSchool(simulatedFishes), 80)

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
        partTwo(new FastSchool(fastFishes), 256)
    },
}

const partOne = (school: SimulatedSchool, days: number): void => {
    school.passDays(days)
    printResult(school, days)
}

const partTwo = (school: FastSchool, days: number): void => {
    school.passDays(days)
    printResult(school, days)
}

const readInput = async (fPath: string): Promise<Fish[]> => {
    const buffer = await filehandle.readFile(fPath)
    const ages = buffer.toString().split(',')
    const fishes: Fish[] = []
    ages.forEach((age) => fishes.push(new Fish(parseInt(age, 10))))
    return fishes
}

const printResult = (
    school: SimulatedSchool | FastSchool,
    days: number
): void => {
    const fishIcon = chalk.bold('🐟')
    const fishText = chalk.blue(school.countFishes())
    console.log(`After ${days} days there are ${fishIcon} ${fishText} fishes`)
}

export default daySixCommand
