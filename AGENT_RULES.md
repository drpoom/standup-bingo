# Agent Rules

## Project Conventions

- **Tech Stack**: Vue 3 + Vite + Tailwind CSS 4
- **Build System**: Vite with Vue plugin
- **Styling**: Tailwind CSS 4 (utility-first CSS framework)
- **Package Manager**: npm

## Code Style Rules

1. **Template Literals**: Use backtick template literals for multi-line strings
2. **No Smart Quotes**: Never use curly/smart quotes in code - only straight quotes
3. **Array Reset**: Use `.length = 0` to clear arrays (not reassignment)
4. **Naming**: camelCase for variables/functions, PascalCase for components
5. **Imports**: Group imports by source (external, internal, relative)

## Testing Requirements

- **Framework**: Playwright for E2E testing
- **Critical Tests**: All spawn tests must pass before deployment
- **Test Location**: Tests in dedicated test directory
- **Pre-commit**: Run tests before committing significant changes

## Git Workflow

1. **Commit Before Deploy**: Always commit changes before deployment
2. **Version Bump**: Update VERSION constant when releasing
3. **Descriptive Messages**: Use clear, descriptive commit messages
4. **Atomic Commits**: Keep commits focused on single concerns

## Agent Coordination Rules

- **Byte** (coder): Implements code changes, runs tests/lint
- **Scout** (qa): Verifies tests pass, performs quality assurance
- **Mickey** (main): Orchestrates workflow, handles user communication

## Rapid Iteration Protocol

1. For small changes, use surgical edit calls — don't re-read entire files
2. After any code change, run tests/lint immediately
3. Batch multiple edits in single turn when possible
4. Read AGENT_RULES.md and PROJECT_CONTEXT.md at session start
5. When debugging, take browser snapshots to verify visual changes
