# CI/CD Pipeline Documentation

## Overview

AI Code Assistant Pro uses a comprehensive CI/CD pipeline built with GitHub Actions to ensure code quality, security, and reliable releases.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
**Triggers**: Push to main/develop, Pull Requests
**Purpose**: Comprehensive quality assurance and automated releases

**Jobs**:
- **Lint & Type Check**: TypeScript compilation and ESLint validation
- **Test Suite**: Jest unit tests with coverage reporting
- **Security Audit**: npm audit and CodeQL static analysis
- **Build Extension**: Package extension to VSIX format
- **Compatibility Test**: Multi-platform VS Code compatibility testing
- **Quality Gate**: Ensures all quality checks pass
- **Release**: Automated marketplace publishing (main branch only)

### 2. Status Checks (`status-checks.yml`)
**Triggers**: Push to main/develop, Pull Requests
**Purpose**: Quick quality validation for faster feedback

**Features**:
- Fast TypeScript compilation check
- ESLint validation
- Unit test execution
- Package build verification
- Security vulnerability scanning

### 3. Dependency Updates (`dependency-updates.yml`)
**Triggers**: Weekly schedule (Mondays), Manual dispatch
**Purpose**: Automated dependency maintenance

**Features**:
- Checks for outdated packages
- Updates compatible versions
- Runs full test suite
- Creates automated pull requests
- Security vulnerability scanning

### 4. Release Management (`release.yml`)
**Triggers**: Manual dispatch, GitHub releases
**Purpose**: Controlled release process

**Features**:
- Version bumping (patch/minor/major)
- Changelog generation
- GitHub release creation
- VS Code Marketplace publishing
- Quality gate enforcement

## Quality Gates

All workflows enforce strict quality gates:

✅ **Code Quality**
- TypeScript compilation without errors
- ESLint validation (20 warnings max)
- Consistent code formatting

✅ **Testing**
- All Jest unit tests pass
- Minimum test coverage maintained
- VS Code compatibility verified

✅ **Security**
- Zero high/critical vulnerabilities
- Regular dependency updates
- Static code analysis (CodeQL)

✅ **Build**
- Successful VSIX package creation
- Multi-platform compatibility
- Extension manifest validation

## Branch Protection

- **Main Branch**: Protected with required status checks
- **Pull Requests**: Must pass all quality gates
- **Reviews**: Required for external contributions
- **Merge Strategy**: Squash and merge for clean history

## Secrets Configuration

Required repository secrets:

- `VSCE_PAT`: Visual Studio Code Marketplace Personal Access Token
- `CODECOV_TOKEN`: Code coverage reporting (optional)

## Monitoring

- **GitHub Actions**: Workflow execution monitoring
- **Codecov**: Test coverage tracking
- **GitHub Security**: Vulnerability alerts and CodeQL
- **Dependabot**: Automated dependency updates

## Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Develop & Test**: Write code and tests locally
3. **Status Check**: Automatic validation on push
4. **Create PR**: All quality gates must pass
5. **Review**: Code review and approval
6. **Merge**: Squash merge to main
7. **Release**: Automatic or manual release process

## Local Development

```bash
# Install dependencies
npm install

# Run type checking
npm run compile

# Run linting
npm run lint

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build extension
npm run package
```

## Troubleshooting

### Common Issues

**TypeScript Errors**: Run `npm run compile` to see detailed errors
**Test Failures**: Run `npm test` locally to debug
**Package Issues**: Check VS Code engine compatibility in package.json
**Security Vulnerabilities**: Run `npm audit` and update dependencies

### Status Badge

Add to your PR or documentation:

```markdown
![CI/CD Status](https://github.com/HOME-OFFICE-IMPROVEMENTS-LTD/ai-code-assistant-pro/workflows/CI/CD%20Pipeline/badge.svg)
```

## Performance

- **Status Checks**: ~2-3 minutes
- **Full CI/CD**: ~8-12 minutes
- **Dependency Updates**: ~5-10 minutes
- **Release Process**: ~10-15 minutes

## Best Practices

1. **Keep PRs Small**: Easier to review and validate
2. **Write Tests**: Maintain coverage for new features
3. **Update Dependencies**: Regular maintenance prevents security issues
4. **Follow Conventions**: Use conventional commit messages
5. **Monitor Workflows**: Address failures promptly