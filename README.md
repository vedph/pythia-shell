# Pythia Shell

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.0.

This project derives from the original Pythia frontend demo app, migrating it to ELF (replacing Akita) and Angular 15.

## Docker

Quick Docker image build:

1. `npm run build-lib`
2. update version in `env.js` and `ng build --configuration production`
3. `docker build . -t vedph2020/pythia-app:1.0.0 -t vedph2020/pythia-app:latest` (replace with the current version).

## Breakpoints

These are the media query breakpoints defined for responsive layouts according to the [Angular Material specs](https://github.com/angular/flex-layout/blob/master/docs/documentation/Responsive-API.md) implemented by Angular Flex Layout.

| name  | media query                                              |
|-------|----------------------------------------------------------|
| xs    | 'screen and (max-width: 599px)'                          |
| sm    | 'screen and (min-width: 600px) and (max-width: 959px)'   |
| md    | 'screen and (min-width: 960px) and (max-width: 1279px)'  |
| lg    | 'screen and (min-width: 1280px) and (max-width: 1919px)' |
| xl    | 'screen and (min-width: 1920px) and (max-width: 5000px)' |
| lt-sm | 'screen and (max-width: 599px)'                          |
| lt-md | 'screen and (max-width: 959px)'                          |
| lt-lg | 'screen and (max-width: 1279px)'                         |
| lt-xl | 'screen and (max-width: 1919px)'                         |
| gt-xs | 'screen and (min-width: 600px)'                          |
| gt-sm | 'screen and (min-width: 960px)'                          |
| gt-md | 'screen and (min-width: 1280px)'                         |
| gt-lg | 'screen and (min-width: 1920px)'                         |

## History

### [Unreleased]

- 2022-11-26: refactored for Angular 15+ and ELF. Image version will start from 1.0.0 for frontend.
