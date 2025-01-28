import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { envSchema } from '~/Validations/AuthValidation'

export async function loader({ request }: LoaderFunctionArgs) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/'
    const headers = new Headers()
    const validatedenv = envSchema.parse({
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    })

    if (validatedenv) {
        if (code) {
            const supabase = createServerClient(validatedenv.SUPABASE_URL, validatedenv.SUPABASE_ANON_KEY, {
                cookies: {
                    getAll() {
                        return parseCookieHeader(request.headers.get('Cookie') ?? '')
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
                        )
                    },
                },
            })
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (!error) {
                return redirect(next, { headers })
            }
        }
    }
    else {
        console.error('Environment variables are invalid');
        return redirect('/auth/auth-code-error', { headers })
    }
    return redirect('/auth/auth-code-error', { headers })
}