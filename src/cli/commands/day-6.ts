import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
    days: number
}

class Swarm {
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
        yargs
            .strict()
            .positional('input', {
                description: 'list of ages, seperated by comma',
                type: 'string',
            })
            .option('days', {
                alias: 'd',
                describe: 'days to pass',
                default: 80,
            }),

    handler: async (args) => {
        const { input, days } = (args as unknown) as CommandOptions
        const fishes = await readInput(input)
        const swarm = new Swarm(fishes)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(swarm, days)

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
    },
}

const partOne = (swarm: Swarm, days: number): void => {
    swarm.passDays(days)
    const fishIcon = chalk.bold('🐟')
    const fishText = chalk.blue(swarm.fishes.length)
    console.log(`After ${days} days there are ${fishIcon} ${fishText} fishes`)
}

const readInput = async (fPath: string): Promise<Fish[]> => {
    const buffer = await filehandle.readFile(fPath)
    const ages = buffer.toString().split(',')
    const fishes: Fish[] = []
    ages.forEach((age) => fishes.push(new Fish(parseInt(age, 10))))
    return fishes
}

export default daySixCommand
