# Develop Usage


## Dependencies Import

```bash
# add an global project package
pnpm add <pkgname> -w
# Example: add package into spec package
pnpm --filter math-lib add -D typescript @types/lodash

# Support glob pattern
pnpm --filter pkg* run test
```

## Pnpm run sub library scripts

> It is recommended to use the pnpm method to execute sub-package commands, because the Pnpm workspace mode can well support commands such as compile, run, and publish.[see more Pnpm](https://pnpm.io/workspaces)

```bash
# pnpm -F <sub-package-path> <command>
# `build` command in core package.json script will excuting.
# 1. pnpm-workspace.yaml configuration packages 
# 2. .npmrc config in root
pnpm -F core build 

# add workspace lib to other lib
pnpm -F ucenter add  @tsai-platform/common -D --save-peer
```
