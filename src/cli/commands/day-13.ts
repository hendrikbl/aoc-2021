import { CommandModule } from 'yargs'
import { tick } from 'figures'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

interface Dot {
    x: number
    y: number
}

interface Fold {
    direction: string
    line: number
}

interface Instruction {
    dots: Dot[]
    folds: Fold[]
}

const title = 'Day 13: Transparent Origami'

const dayThirteenCommand: CommandModule = {
    describe: title,
    command: 'day-13 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'folding instructions',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const instruction = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(instruction)

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
        // partTwo(neighbors)
    },
}

const partOne = (instruction: Instruction): void => {
    let dots = instruction.dots
    dots = fold(dots, instruction.folds[0])
    console.log(chalk.blue(chalk.bold(tick) + ' ' + dots.length))
}

// const partTwo = (neighbors: string[][]): void => {}

const readInput = async (fPath: string): Promise<Instruction> => {
    const buffer = await filehandle.readFile(fPath)
    const dots: Dot[] = []
    const folds: Fold[] = []

    const [coords, inst] = buffer.toString().trim().split('\n\n')

    coords.split('\n').forEach((line) => {
        const [x, y] = line
            .trim()
            .split(',')
            .map((n) => parseInt(n, 10))

        dots.push({ x, y })
    })

    inst.split('\n')
        .map((line) => line.split(' ')[2].split('='))
        .forEach((row) =>
            folds.push({ direction: row[0], line: parseInt(row[1], 10) })
        )

    return { dots, folds }
}

const fold = (dots: Dot[], fold: Fold): Dot[] => {
    const newDots: Dot[] = []
    const { direction, line } = fold

    switch (direction) {
        case 'x':
            dots.forEach((dot) => {
                if (dot.x < line) {
                    newDots.push(dot)
                }
                if (dot.x > line) {
                    newDots.push({ x: line - (dot.x - line), y: dot.y })
                }
            })
            break
        case 'y':
            dots.forEach((dot) => {
                if (dot.y < line) {
                    newDots.push(dot)
                }
                if (dot.y > line) {
                    newDots.push({ x: dot.x, y: line - (dot.y - line) })
                }
            })
            break

        default:
            break
    }

    return newDots.filter(
        (dot, i, self) =>
            i == self.findIndex((d) => d.x == dot.x && d.y == dot.y)
    )
}

export default dayThirteenCommand
