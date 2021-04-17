# Changelog

## Unreleased

### Fixed

- Corrected name of event fired in `init` method.
- Fixed display issue if the `animate` option was true, but the element did not have a CSS height transition.

### Added

- Added `headerButtonClass` option.
- Added `dataAttributePrefix` option.
- Added `id` property to the Accordion instance.
- Added `root` property to the Accordion instance.
- Added `items` property to the Accordion instance.
- Added `getItem` method to the Accordion instance.

### Changed

- Data attributes are now prefixed with `accordion`.
- Improved type information.
- `initialisedClass`, `activePanelClass` and `activeHeaderClass` are no longer added by default.
- Event names passed to the `on` and `off` methods are no longer prefixed with `accordion:`.

### Removed

- Removed `moveTriggerClass` option. This behaviour can be implemented via events if required.
