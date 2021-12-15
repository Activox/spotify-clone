import {getToken} from "next-auth/jwt"
import {NextResponse} from "next/server"

export async function middleware(req){
    // Token will exist if the user is logged in
    const token = await getToken({req, secret: process.env.JWT_SECRET})
    
    const {pathname} = req.nextUrl
    
    // allow the requests if the following is true...
    // 1. its a request for next-auth session & provider fetching
    // 2. if the token exist
    if (pathname.includes('/api/auth') || token){
        return NextResponse.next();
    }

    // redirect them to login if they dont have token and are requeting a protected route
    if (!token  && pathname !== '/login'){
        return NextResponse.redirect('/login')
    }
}