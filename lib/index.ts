import chalk from "chalk";

// In a cloudflare worker environment, chalk will think colors aren't supported, so we must force it to allow for basic formatting
// If you know a way to detect cloudflare workers so we don't enable colors in terminals that don't support them, please open a issue/PR.
if (chalk.level <= 0) chalk.level = 1;

export * from "#/worker";
export * from "#/source";
