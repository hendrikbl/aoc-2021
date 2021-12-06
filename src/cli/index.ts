#!/usr/bin/env node

import * as yargs from 'yargs'
import dayFiveCommand from './commands/day-5'
import dayFourCommand from './commands/day-4'
import dayOneCommand from './commands/day-1'
import dayThreeCommand from './commands/day-3'
import dayTwoCommand from './commands/day-2'

export default yargs
    .scriptName('aoc')
    .parserConfiguration({
        'camel-case-expansion': true,
    })
    // version
    .version()
    .alias('v', 'version')
    // help
    .help(true)
    .alias('h', 'help')
    .strict()
    .wrap(yargs.terminalWidth())
    .command(dayOneCommand)
    .command(dayTwoCommand)
    .command(dayThreeCommand)
    .command(dayFourCommand)
    .command(dayFiveCommand)
    .demandCommand(1).argv
