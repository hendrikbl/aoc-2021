import { CommandModule } from 'yargs'
import { arrowRight } from 'figures'
import chalk from 'chalk'
import filehandle from 'fs/promises'

interface CommandOptions {
    input: string
}

const title = 'Day 12: Passage Pathing'

const dayTwelveCommand: CommandModule = {
    describe: title,
    command: 'day-12 <input>',
    builder: (yargs) =>
        yargs.strict().positional('input', {
            description: 'cave tunnels, one per line',
            type: 'string',
        }),

    handler: async (args) => {
        const { input } = (args as unknown) as CommandOptions
        const neighbors = await readInput(input)

        console.log(chalk.bold(`-- ${title} --\n`))
        console.log(chalk.bold('-- Part One --'))
        partOne(neighbors)

        console.log('\n')
        console.log(chalk.bold('-- Part Two --'))
        partTwo(neighbors)
    },
}

const partOne = (neighbors: string[][]): void => {
    const paths = getPaths(neighbors)
    console.log(chalk.blue(chalk.bold(arrowRight) + ' ' + paths.length))
}

const partTwo = (neighbors: string[][]): void => {
    // very slow but whatever
    const paths = getPaths(neighbors, true)
    console.log(chalk.blue(chalk.bold(arrowRight) + ' ' + paths.length))
}

const readInput = async (fPath: string): Promise<string[][]> => {
    const buffer = await filehandle.readFile(fPath)
    const neighbors: string[][] = []

    buffer
        .toString()
        .split('\n')
        .forEach((line) => {
            const caves = line.trim().split('-')
            if (neighbors[caves[0]]) {
                neighbors[caves[0]].push(caves[1])
            } else {
                neighbors[caves[0]] = [caves[1]]
            }

            if (neighbors[caves[1]]) {
                neighbors[caves[1]].push(caves[0])
            } else {
                neighbors[caves[1]] = [caves[0]]
            }
        })

    return neighbors
}

const validNeighbors = (path: string[], neighbors: string[]): string[] => {
    const result: string[] = []
    neighbors.forEach((neighbor) => {
        if (
            (path.indexOf(neighbor) != -1 &&
                neighbor == neighbor.toUpperCase()) ||
            path.indexOf(neighbor) == -1
        ) {
            result.push(neighbor)
        }
    })

    return result
}

const validNeighborsExtended = (
    path: string[],
    neighbors: string[],
    start = 'start',
    end = 'end'
): string[] => {
    const result: string[] = []
    let foundTwoLower = false
    const duplicates = path.filter(
        (cave, i) =>
            path.indexOf(cave) != i &&
            cave == cave.toLowerCase() &&
            cave != start &&
            cave != end
    )

    if (duplicates.length > 0) foundTwoLower = true

    neighbors.forEach((neighbor) => {
        if (
            (path.indexOf(neighbor) != -1 &&
                neighbor == neighbor.toUpperCase()) ||
            path.indexOf(neighbor) == -1 ||
            (!foundTwoLower &&
                path.filter((cave) => cave == neighbor).length == 1 &&
                neighbor != start &&
                neighbor != end)
        ) {
            result.push(neighbor)
        }
    })

    return result
}

const getPaths = (neighbors: string[][], extended = false): string[][] => {
    const start = 'start'
    const end = 'end'
    let paths: string[][] = [[start]]

    let foundAll = false

    while (!foundAll) {
        let finishedPaths = 0
        paths.forEach((path, i) => {
            if (path[path.length - 1] != end) {
                let possibleNeighbors: string[] = []
                if (extended) {
                    possibleNeighbors = validNeighborsExtended(
                        path,
                        neighbors[path[path.length - 1]]
                    )
                } else {
                    possibleNeighbors = validNeighbors(
                        path,
                        neighbors[path[path.length - 1]]
                    )
                }
                possibleNeighbors.forEach((neighbor) => {
                    paths.push([...path, neighbor])
                })
                paths.splice(i, 1)
            } else {
                finishedPaths += 1
            }
        })
        paths = paths.filter((path) => path.length != 0)
        if (paths.length == finishedPaths) foundAll = true
    }

    return paths
}

export default dayTwelveCommand
