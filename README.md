# Positron Copyright Header Formatter

A VS Code extension that automatically updates Posit copyright header year ranges when you save files.

## Features

- Automatically updates Posit copyright headers on file save
- Expands single years to ranges (e.g., `2024` becomes `2024-2026`)
- Updates year ranges to current year (e.g., `2023-2024` becomes `2023-2026`)
- Supports multiple file types: TypeScript, JavaScript, CSS, Python, R, Shell scripts

## Installation

1. Download the `.vsix` file from the GitHub Releases page or Actions artifacts
2. Install in VS Code/Positron:
   - Via command line: `code --install-extension positron-dev-copyright-x.x.x.vsix`
   - Via UI: Extensions view > "..." menu > "Install from VSIX..."

## Supported File Types

| Extension | Comment Style |
|-----------|--------------|
| `.ts`, `.tsx` | Block comment (`/* */`) |
| `.js`, `.jsx` | Block comment (`/* */`) |
| `.css` | Block comment (`/* */`) |
| `.py` | Hash comment (`#`) |
| `.R` | Hash comment (`#`) |
| `.sh` | Hash comment (`#`) |

## Behavior

The extension only updates **existing** Posit copyright headers. It will:

- **Update** headers with outdated year ranges
- **Skip** files without Posit headers
- **Skip** files with other copyright headers (e.g., Microsoft)

### Example

Before save (file created in 2024, saved in 2026):
```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2024 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/
```

After save:
```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2024-2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/
```

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package VSIX
npm run package
```

## License

MIT
