# AGENTS.md — WEB-LAW Project

## Agent Roles

### Security Agent
- Scan for hardcoded secrets in all files
- Verify .gitignore covers all sensitive files
- Check innerHTML usage for XSS vulnerabilities
- Audit Firebase Security Rules
- Verify CORS, CSP, and rate limiting configuration

### Frontend Agent
- Ensure all HTML files have viewport meta tag
- Verify no broken links (href to nonexistent pages)
- Check for valid HTML structure (no stray tags)
- Verify responsive design at 320px, 768px, 1200px
- Ensure all images have alt attributes
- Check accessibility (ARIA, keyboard navigation)

### Backend Agent
- Validate all API routes have proper error handling
- Ensure input validation on all POST/PUT routes
- Verify authentication middleware is applied correctly
- Check for proper HTTP status codes
- Ensure no sensitive data in error responses

### Code Quality Agent
- Identify and report code duplication
- Check for unused files and dead code
- Verify consistent naming conventions
- Ensure no implicit globals
- Check for proper async/await error handling
- Report functions longer than 50 lines

### Performance Agent
- Check for lazy loading on images
- Verify no synchronous blocking scripts
- Check for innerHTML += in loops (O(n²))
- Verify caching headers configuration
- Check bundle sizes and suggest tree-shaking

## Agent Boundaries
- Security Agent has READ-ONLY access to all files
- Frontend Agent can modify files in frontend/ only
- Backend Agent can modify files in backend/ only
- Code Quality Agent can modify any source file
- Performance Agent can modify any source file

## Agent Communication
- All agents report findings to architecture_analysis.md
- Security findings are BLOCKING — must be resolved before deployment
- Performance findings are ADVISORY — prioritize based on impact
- All agents must preserve Thai comments and text
