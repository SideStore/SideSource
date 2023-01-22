import { App, News, Source } from "sidestore-source-types";
import { createIs } from "typia";

import { Config, CustomInput, GitHubInput, RawInput, SourceInput } from "#/struct/typedoc";

import { Mandatory } from ".";

export const isConfig = createIs<Mandatory<Config>>();
export const isGitHubInput = createIs<Mandatory<GitHubInput>>();
export const isSourceInput = createIs<Mandatory<SourceInput>>();
export const isRawInput = createIs<Mandatory<RawInput>>();
export const isCustomInput = createIs<Mandatory<CustomInput>>();

export const isSource = createIs<Source>();
export const isApp = createIs<App>();
export const isNews = createIs<News>();
