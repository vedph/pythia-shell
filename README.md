# Pythia Shell

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.0.

This project derives from the original Pythia frontend demo app, migrating it to ELF (replacing Akita) and Angular 15.

## Docker

🐳 Quick **Docker image build**:

1. ensure that you have the target locale set. This is specified in `angular.json` under `projects/pythia-shell/architect/build/options/localize`. Set it to false to use the default (English) language, or to `[it]` for Italian.
2. `npm run build-lib`;
3. if you changed anything, run `npm run xi18n` to extract the messages and merge them with the existing translations if any;
4. update version in `env.js` (and in Docker compose scripts);
5. `ng build --configuration production`;
6. if you want to create the image for the non-localized version, update [Dockerfile](Dockerfile) accordingly;
7. `docker build . -t vedph2020/pythia-shell:5.0.0-it -t vedph2020/pythia-shell:latest` (replace with the current version; remove `-it` for the English version).

🌐 To **update localizable messages**:

1. run `ng extract-i18n --output-path src/locale` to generate the XLF file under `src/locale`.
2. use `npx xliffmerge --profile xliffmerge.json` to merge new entries into the corresponding translated file(s) (the profile is in `xliffmerge.json`).
3. use [Poedit](https://poedit.net/download) or similar to edit the localized messages file and add the corresponding translations.

>Note that the language(s) built are defined in [angular.json](angular.json) under `configurations`. Currently, in production we build both English and Italian; in development we just build Italian. You can change the development language at will, but be sure to include the desired language(s) for production build before creating Docker images.

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

### 5.0.0

- 2024-12-10: updated Angular and packages.
- 2024-12-03:
  - ⚠️ updated core dependencies.
  - fix to duplicate node IDs in tree view (words index): lemmata and words come from different tables, so they may often have the same ID. Now for lemmata we simply negate the ID, so that all lemmata nodes have negative IDs, and all word nodes their original positive ID.
  - refactored document reader replacing Material tree obsolete components with a paged tree. This has also the advantage of avoiding a too tall list in the map, and provide filtering for it.
  - search lemma/word from index.
  - result styles.
- 2024-12-01:
  - M3 theme.
  - updated Angular and packages except for `echarts` which must be kept at `5.4.3` with TS at `~5.5.2` until [this issue](https://github.com/xieziyu/ngx-echarts/issues/437) is fixed.
- 2024-11-22: ⚠️ Upgraded to Angular 19.
- 2024-11-19: updated packages.
- 2024-11-05: fixes to `search.repository.clear()`.
- 2024-10-24:
  - changed paged word tree filter sort order (`@myrmidon/pythia-word-index` 4.1.1).
  - added `hideLoc` and `hideFilter` to `PagedWordTreeBrowserComponent`.
- 2024-10-23:
  - updated Angular and packages.
  - updated peer dependencies.
  - more translations.
- 2024-10-22: added `hideCorpora` and `hideDocuments` to query builder.
- 2024-10-19: added `hideLanguage` to word index component.

### 4.0.3

- 2024-10-16:
  - updated Angular and packages.
  - added `clear` to search repository.
  - added `attributes` input property to word index component.
- 2024-10-24: added `disabled` input property to query exporter component.
- 2024-10-10: localizable search export and export search repository.
- 2024-10-05: locale configuration.
- 2024-10-04:
  - updated Angular.
  - added `hideLanguage` option to word index.
  - auto expand root node when opening word index.
  - fixes to document filter in list.
- 2024-10-02:
  - updated Angular and packages (with fixes in tree browser).
  - auto expand words index root node on filter reset.
- 2024-10-01: added missing "descending" checkbox in word filters.

### 4.0.1

- 2024-09-25: updated Angular and packages.
- 2024-09-13:
  - updated Angular and packages.
  - fixed missing handler for search in word index.

### 4.0.0

- 2024-08-30: updated Angular and packages.
- 2024-08-05: updated localized messages.
- 2024-08-04:
  - ⚠️ breaking change in progress: refactoring for new backend store (4.x.x; last release with old model is 3.1.2). All versions were bumped to 4.0.0.
  - removed terms list, replaced by new word index.
- 2024-07-15: updated Angular and packages.
- 2024-06-09:
  - updated packages.
  - added `class="mat-X"` for each `color="X"` (e.g. `class="mat-primary"` wherever there is a `color="primary"`) to allow transitioning to Angular Material M3 from M2. This also implies adding it directly to the target element, so in the case of `mat-icon` inside a `button` with `color` the class is added to `mat-icon` directly (unless the button too has the same color). This allows to keep the old M2 clients while using the new M3, because it seems that the compatibility mixin is not effective in some cases like inheritance of `color`, and in the future `color` will be replaced by `class` altogether.
  - applied [M3 theme](https://material.angular.io/guide/theming).

### 3.1.2

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
