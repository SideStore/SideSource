import { App, News } from "sidestore-source-types";
import { createIs } from "typia";

import { Config, CustomInput, GitHubInput, RawInput, SourceInput } from "#/types";

import { Mandatory } from "./mandatory";

export const isConfig = createIs<Mandatory<Config>>();
export const isGitHubInput = createIs<Mandatory<GitHubInput>>();
export const isSourceInput = createIs<Mandatory<SourceInput>>();
export const isRawInput = createIs<Mandatory<RawInput>>();
export const isCustomInput = createIs<Mandatory<CustomInput>>();

export const isApp = createIs<App>();
export const isNews = createIs<News>();
