# Environment Variables with Vite

This project uses Vite, which handles environment variables differently than Create React App.

## Setup

1. Create a `.env` file in the root directory
2. Prefix your environment variables with `VITE_`
3. Access them using `import.meta.env.VITE_VARIABLE_NAME`

## Example

Create `.env` file:
```
VITE_API_BASE_URL=https://your-api-url.com/api
```

Use in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Important Notes

- **Only variables prefixed with `VITE_` are exposed to the client-side code**
- Use `import.meta.env` instead of `process.env`
- Restart the dev server after changing `.env` files
- Add `.env` to `.gitignore` (don't commit sensitive data)

## API Configuration

The API base URL can be configured by setting:
```
VITE_API_BASE_URL=https://your-backend-api-url.com
```

If not set, it defaults to `https://api.example.com`

