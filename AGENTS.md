# ChatVRM Agent Guidelines

This document provides essential information for AI agents working on the ChatVRM project, including build commands, testing procedures, and code style conventions.

## Build and Test Commands

### Development Server
```bash
cd ChatVRM
npm run dev
```
Access the application at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```

### Export Static Site
```bash
npm run export
```

### Linting
```bash
npm run lint
```

### Running Tests
The project does not contain a dedicated test suite or automated tests. Manual testing should be performed by:
- Starting the development server (`npm run dev`)
- Interacting with the application in the browser
- Testing all major features (voice input/output, character animation, settings)

## Code Style Guidelines

### Imports
- Use absolute imports with `@/` alias for src directory
  - Example: `import { Viewer } from "@/features/vrmViewer/viewer"`
- Group imports in the following order:
  1. External packages
  2. Absolute imports from @/
  3. Relative imports
- Use named imports rather than default imports when possible

### Formatting
- Use Prettier with Tailwind CSS configuration
- Configure in tailwind.config.js
- Follow existing formatting patterns in the codebase
- Use consistent indentation (4 spaces)
- Max line length: 80 characters

### TypeScript
- Strict mode enabled (tsconfig.json)
- All variables must be typed
- Use interfaces over types when defining object shapes
- Use type aliases for unions and primitives
- Type imports are not used (e.g., `import type {}` is never used)

### Naming Conventions
- Variables and functions: camelCase
- Components: PascalCase
- Constants: UPPER_CASE_SNAKE_CASE
- Types and Interfaces: PascalCase
- Classes: PascalCase
- File names: kebab-case.ts or kebab-case.tsx

### React Components
- Functional components only
- Use PascalCase for component names
- JSX files use .tsx extension
- Keep components focused and small
- Use hooks instead of class lifecycle methods
- Extract custom hooks for reusable logic

### Error Handling
- Use try/catch blocks for async operations
- Handle promise rejections explicitly
- Throw descriptive error messages
- Validate API responses before using
- Check for null/undefined values before accessing properties
- Never suppress TypeScript errors

### Project Structure
```
src/
├── components/        # Reusable UI components
├── features/           # Feature-specific components and logic
├── lib/               # Third-party library wrappers
└── utils/             # Pure utility functions
```

### Environment Variables
Store API keys in environment variables:
- OPEN_AI_KEY for OpenAI access
- KOEIRO_MAP_KEY for Koeiromap access

### Security Considerations
- Never expose API keys in client-side code
- Validate and sanitize all user inputs
- Be cautious with dynamic imports and eval()
- Sanitize any data coming from external APIs
- Avoid storing sensitive data in localStorage

### Performance
- Optimize 3D rendering performance
- Minimize unnecessary re-renders with React.memo
- Use requestAnimationFrame for animations
- Implement loading states for API calls
- Optimize asset loading (VRM models, textures)

### Accessibility
- Provide appropriate ARIA labels
- Ensure keyboard navigation works
- Use semantic HTML elements
- Maintain sufficient color contrast
- Support screen readers
- Make interactive elements accessible

---

Last updated: 2026-02-07