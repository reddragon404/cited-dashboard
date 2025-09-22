# Files That Need to be Updated on GitHub

## 1. src/app/competitors/page.tsx
Line 9: Change `useState<any>(null)` to `useState<{ id: string; email: string } | null>(null)`

## 2. src/app/dashboard/page.tsx  
Line 21: Change `useState<any>(null)` to `useState<{ id: string; email: string } | null>(null)`
Line 23: Change `useState<any>(null)` to `useState<{ score: number; models: any; prompts: any[]; competitors: any[]; highlights: any[] } | null>(null)`

## 3. src/app/prompts/page.tsx
Line 9: Change `useState<any>(null)` to `useState<{ id: string; email: string } | null>(null)`

## 4. src/app/reports/page.tsx
Line 9: Change `useState<any>(null)` to `useState<{ id: string; email: string } | null>(null)`
Line 72: Change `competitor's` to `competitor&apos;s`
Line 164: Change `you're` to `you&apos;re`

## 5. src/components/Highlights.tsx
Line 1: Remove `TrendingUp` from imports
Line 43: Change `Month's` to `Month&apos;s`

## 6. src/components/Layout.tsx
Line 24: Change `useState<any>(null)` to `useState<{ id: string; email: string } | null>(null)`
Line 27: Change `useState('')` to `useState<string>('')`

## 7. src/components/ModelVisibility.tsx
Line 14: Change `you're` to `you&apos;re`

## 8. src/components/PromptList.tsx
Line 25: Change `you're` to `you&apos;re`

## 9. src/lib/aiVisibilityChecker.ts
Line 2: Comment out `import Anthropic from '@anthropic-ai/sdk';`
Line 10-12: Comment out the anthropic client initialization

## 10. src/lib/auth.ts
Line 44 & 61: Change `password: _` to `password: _password`

## 11. src/lib/authClient.ts
Line 10-13: Comment out the AuthResponse interface
Line 32, 51, 70, 93: Change `catch (error)` to `catch (_error)`

## 12. src/lib/supabaseClient.ts
Line 12-17: Change `as any` to proper type definition