import { CommandModule } from 'yargs'
import chalk from 'chalk'
import filehandle from 'fs/promises'

type validDirection = 'up' | 'down' | 'forward'

interface CommandOptions {
    input: string
}

interface Movement {
    direction: validDirection
    distance: number
}

class Submarine {
    horizontal = 0
    depth = 0

    public move(movement: Movement): void {
        switch (movement.direction) {
            case 'up':
                this.depth -= movement.distance
                break
            case 'down':
                this.depth += movement.distance
                break
            case 'forward':
                this.horizontal += movement.distance
                break
            default:
                break
        }
    }

    public print(): void {
        const horizontal = chalk.blue(chalk.bold('↔') + ' ' + this.horizontal)
        const depth = chalk.cyan(chalk.bold('↕') + ' ' + this.depth)
        const sum = chalk.magenta(
            chalk.bold('Σ') + ' ' + this.depth * this.horizontal
        )
        console.log(horizontal + ' ' + depth + ' ' + sum)
    }
}

class SubmarineWithAim extends Submarine {
    aim = 0

    public move(movement: Movement): void {
        switch (movement.direction) {
            case 'up':
                this.aim -= movement.distance
                break
            case 'down':
                this.aim += movement.distance
                break
            case 'forward':
                this.horizontal += movement.distance
                this.depth += this.aim * movement.distance
                break
            default:
                break
        }
    }
}

const title = 'Day 2: Dive!'

const dayTwoCommand: CommandModule = {
    describe: title,
    command: 'day-2 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'the sonar sweep report, one measurement per line',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const movements = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(movements).print()
        console.log('\n')
        console.log(chalk.bold('-- Part One --'))
        partTwo(movements).print()
    },
}

const readInput = async (fPath: string): Promise<Movement[]> => {
    const buffer = await filehandle.readFile(fPath)
    return buffer
        .toString()
        .split('\n')
        .map((n) => {
            const [direction, distance] = n.split(' ')
            return {
                distance: parseInt(distance),
                direction: direction as validDirection,
            }
        })
}

const partOne = (movements: Movement[]): Submarine => {
    const submarine = new Submarine()
    movements.forEach((movement) => {
        submarine.move(movement)
    })
    return submarine
}

const partTwo = (movements: Movement[]): SubmarineWithAim => {
    const submarine = new SubmarineWithAim()
    movements.forEach((movement) => {
        submarine.move(movement)
    })
    return submarine
}

export default dayTwoCommand
