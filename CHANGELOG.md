# Changelog

## 2.0 - 2020-06-14

### Fixed

- Corrected name of event fired in `init` method.
- Fixed display issue if the `animate` option was true, but the element did not have a CSS height transition.

### Added

- Added `headerButtonClass` option.
- Added `prefix` option.
- Added `id` property to the Accordion instance.
- Added `root` property to the Accordion instance.
- Added `items` property to the Accordion instance.
- Added `getItem` method to the Accordion instance.

### Removed

- Removed `moveTriggerClass` option. This behaviour can be implemented via events if required.

### Changed

- Improved type information.
- Data attributes such as `data-for` now require the `accordion` prefix.
- `initialisedClass`, `activePanelClass` and `activeHeaderClass` are no longer added by default.
- Event names passed to the `on` and `off` methods are no longer prefixed with `accordion:`.
