# Pythia Shell

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.0.

This project derives from the original Pythia frontend demo app, migrating it to ELF (replacing Akita) and Angular 15.

## Docker

🐳 Quick Docker image build:

1. ensure that you have the target locale set. This is specified in `angular.json` under `projects/pythia-shell/architect/build/options/localize`. Set it to false to use the default (English) language, or to `[it]` for Italian.
2. `npm run build-lib`;
3. if you changed anything, run `npm run xi18n` to extract the messages and merge them with the existing translations if any;
4. update version in `env.js` (and in Docker compose scripts);
5. `ng build --configuration production`;
6. if you want to create the image for the non-localized version, update [Dockerfile](Dockerfile) accordingly;
7. `docker build . -t vedph2020/pythia-shell:3.1.1-it -t vedph2020/pythia-shell:latest` (replace with the current version; remove `-it` for the English version).

>To update the localizable messages run `ng extract-i18n`. Then move the generated XLF file into locale and add new entries into the corresponding translated files in the same directory.

## Breakpoints

These are the media query breakpoints defined for responsive layouts according to the [Angular Material specs](https://github.com/angular/flex-layout/blob/master/docs/documentation/Responsive-API.md) implemented by Angular Flex Layout. As this library has been obsoleted, I use them as reference for building media queries in CSS.

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

### 3.1.1

- 2024-06-06:
  - updated Angular and packages.
  - added auto confirm to registration page.
- 2024-05-27:
  - refactored homepage.
  - bumped library versions to 3.1.0 updating their peer dependencies for Angular 18.
  - applied new control flow syntax.
- 2024-05-24: updated packages and Angular.
- 2024-05-15: updated packages and Angular.
- 2024-05-08: ⚠️ updated packages including [bricks V2](https://github.com/vedph/cadmus-bricks-shell-v2)
- 2023-11-11: ⚠️ upgraded to Angular 17.
- 2023-10-02: ⚠️ refactored all the ELF-dependent libraries to drop ELF and use `@myrmidon/paged-data-browsers`, thus removing any ELF dependencies. All the affected libraries have been bumped to version 2.0.0.
- 2023-09-26: updated Angular and packages.
- 2023-09-07: updated Angular.
- 2023-06-28: updated Angular and packages.
- 2023-05-11: updated to Angular 16.
- 2023-04-18: added peek to query builder and to-text to search. This allows building the query visually and send it to the query text editor, rather than directly executing it.
- 2023-04-13:
  - added total results count in search view.
  - updated Angular CLI.

### 1.0.11-it

- 2023-04-11: updated Angular and packages.
- 2023-04-06: fixed wrong property names in terms filter.
- 2023-03-29:
  - added empty filter check in add/remove docs to/from corpus.
  - added `lp`/`rp` attribute definitions to `attr-defs.ts`.
- 2023-03-27:
  - updated packages.
  - fixed progress bar location in search.

### 1.0.9-it

- 2023-03-25:
  - updated Angular.
  - error message in search.
- 2023-03-11:
  - updated Angular.
  - added query builder tests.
  - fixes to local operator syntax in query builder.

### 1.0.8-it

- 2023-03-10: fixes to query builder and missing localizations.

### 1.0.7-it

- 2023-03-06: added Italian localization. Note: if you get some TS2034 Cannot find name `$localize` try adding `import '@angular/localize/init'` (see [this post](https://stackoverflow.com/questions/65914525/angular-library-cannot-find-name-localize)).

### 1.0.6

- 2023-03-06: added query builder.
- 2023-03-03: updated Angular.

### 1.0.5

- 2023-02-27:
  - updated Angular and packages.
  - once user registered, force repository page reload and redirect to user manager page.
  - better UI for corpus filter in document.
  - reload corpus list on corpus added/removed.
  - fixes to CSS grid areas.
- 2023-02-21:
  - updated Angular and packages.
  - fixed wrong cached page when query changed.
- 2023-02-15:
  - clear user list cache after registering a new user.
  - style improvements.

### 1.0.4

- 2023-02-11: fixes to search paging.
- 2023-02-09: updated Angular and packages.
- 2023-02-04:
  - UI for corpora.
  - updated Angular.

### 1.0.3

- 2023-01-26:
  - updated Angular.
  - load details when selecting document in list.
  - fix to reader (missing node parent setup after loading data).
- 2023-01-17: adding reader to document list.

### 1.0.2

- 2023-01-09: fix `disabled` term filter error (expression was changed after it was checked, because having a `disabled` property bound from the parent list component would trigger this error in the binding into the filter component; the `disabled` property has been replaced by a direct subscription to `loading$` from the repository).
- 2022-12-27: added value length filters.
- 2022-12-26: additions to term filters.
- 2022-12-22: added term distribution API.

### 1.0.1

- 2022-12-17:
  - updated Angular.
  - fixed search page not refreshed on new query.
  - fix to search pagination.
  - use new `SearchResult` with `id` from server.

### 1.0.0

- 2022-11-26: refactored for Angular 15+ and ELF. Image version will start from 1.0.0 for frontend.
