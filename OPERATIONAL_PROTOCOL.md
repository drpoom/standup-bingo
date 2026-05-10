# Operational Protocol: Memory & Session Management

## 1. Automatic Session Reset
- **Trigger**: Whenever the user shifts context from one project (e.g., Elango Surfers) to another (e.g., OpenClaw Agent Config), or when a major task is completed.
- **Action**: Suggest or perform a session reset to clear the token-heavy conversation history and prevent context bleed/bloat.

## 2. Deployment Standard
- **Trigger**: Any commit to a GitHub project.
- **Process**: 
  - Bump Version $\rightarrow$ Commit $\rightarrow$ Push $\rightarrow$ Verify GH Action $\rightarrow$ Verify Live URL.
- **Memory**: Store these specific workflow steps in a `PROJECT.md` file within the project root. 
- **Loading**: Read the `PROJECT.md` file only at the start of a session or when a project change is detected, rather than including it in every prompt.

## 3. Token Optimization
- Use `grep` and targeted `read` (offset/limit) for large files.
- Avoid reading entire files unless necessary for a total rewrite.
