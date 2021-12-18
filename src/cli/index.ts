#!/usr/bin/env node

import * as yargs from 'yargs'
import dayEightCommand from './commands/day-8'
import dayElevenCommand from './commands/day-11'
import dayFiveCommand from './commands/day-5'
import dayFourCommand from './commands/day-4'
import dayNineCommand from './commands/day-9'
import dayOneCommand from './commands/day-1'
import daySevenCommand from './commands/day-7'
import daySixCommand from './commands/day-6'
import dayTenCommand from './commands/day-10'
import dayThirteenCommand from './commands/day-13'
import dayThreeCommand from './commands/day-3'
import dayTwelveCommand from './commands/day-12'
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
    .command(daySixCommand)
    .command(daySevenCommand)
    .command(dayEightCommand)
    .command(dayNineCommand)
    .command(dayTenCommand)
    .command(dayElevenCommand)
    .command(dayTwelveCommand)
    .command(dayThirteenCommand)
    .demandCommand(1).argv
