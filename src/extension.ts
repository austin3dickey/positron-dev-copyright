import * as vscode from 'vscode';

// Supported file extensions
const SUPPORTED_EXTENSIONS = new Set([
	'.ts', '.tsx', '.js', '.jsx', '.css',  // Block comment style
	'.py',                                   // Python hash style
	'.R',                                    // R hash style with dashes
	'.sh'                                    // Shell hash style with dashes
]);

// Regex to match Posit copyright header with year capture groups
// Matches: Copyright (C) YEAR or Copyright (C) YEAR-YEAR
// Group 1: Start year, Group 2: End year (optional, includes the dash)
const POSIT_COPYRIGHT_REGEX = /Copyright \(C\) (\d{4})(-(\d{4}))? Posit Software, PBC\./;

export function activate(context: vscode.ExtensionContext): void {
	const disposable = vscode.workspace.onWillSaveTextDocument(event => {
		const document = event.document;
		const fileName = document.fileName;
		const ext = getFileExtension(fileName);

		if (!ext || !SUPPORTED_EXTENSIONS.has(ext)) {
			return;
		}

		const edits = getYearUpdateEdits(document);
		if (edits.length > 0) {
			event.waitUntil(Promise.resolve(edits));
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate(): void {
	// Nothing to clean up
}

/**
 * Extract the file extension from a file path.
 */
function getFileExtension(fileName: string): string | null {
	const lastDot = fileName.lastIndexOf('.');
	if (lastDot === -1) {
		return null;
	}
	return fileName.substring(lastDot);
}

/**
 * Scan the document for a Posit copyright header and return edits to update the year if needed.
 */
function getYearUpdateEdits(document: vscode.TextDocument): vscode.TextEdit[] {
	const currentYear = new Date().getFullYear();
	const text = document.getText();

	// Only check the first 20 lines for the copyright header
	const lines = text.split('\n').slice(0, 20);

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const match = POSIT_COPYRIGHT_REGEX.exec(line);

		if (match) {
			const startYear = parseInt(match[1], 10);
			const endYear = match[3] ? parseInt(match[3], 10) : null;
			const effectiveEndYear = endYear ?? startYear;

			// Check if year needs updating
			if (effectiveEndYear >= currentYear) {
				// Already up to date
				return [];
			}

			// Build the new copyright line
			const newYearPart = startYear === currentYear
				? `${currentYear}`
				: `${startYear}-${currentYear}`;

			const oldYearPart = endYear
				? `${startYear}-${endYear}`
				: `${startYear}`;

			// Remove trailing \r for Windows CRLF line endings since
			// document.lineAt().range excludes line ending characters
			const newLine = line.replace(
				`Copyright (C) ${oldYearPart} Posit Software, PBC.`,
				`Copyright (C) ${newYearPart} Posit Software, PBC.`
			).replace(/\r$/, '');

			if (newLine !== line) {
				const lineRange = document.lineAt(i).range;
				return [vscode.TextEdit.replace(lineRange, newLine)];
			}

			return [];
		}
	}

	// No Posit copyright header found
	return [];
}
