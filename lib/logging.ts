import chalk from "chalk";

export function info(msg: string) {
    console.log(`${chalk.greenBright.bgGray(`[${chalk.blueBright`info `}]`)} ${chalk.bold(msg)}`);
}

export function error(msg: string) {
    console.log(`${chalk.yellowBright.bgGray(`[${chalk.redBright`error`}]`)} ${chalk.bold(msg)}`);
}
