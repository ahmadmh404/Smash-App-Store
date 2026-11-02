import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAUTL_LOGIN_REDIRECT,
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  privateRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

// in here for short we will prevent the loggedin users form accessing the login or register apge and the opposite for loggedout users.
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    publicRoutes.some((route) => nextUrl.pathname.startsWith(route));

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      // the nextUrl 2nd param is to create absolute URL like: http://localhost:3000/settings for example instead of /settings
      return Response.redirect(new URL(DEFAUTL_LOGIN_REDIRECT, nextUrl));
    }

    return;
  }

  if (!isLoggedIn) {
    if (isPrivateRoute) {
      return Response.redirect(new URL(DEFAUTL_LOGIN_REDIRECT, nextUrl));
    }
  }

  if (!isLoggedIn && !isPublicRoute) {
    // in here we would like to show the last place the user was in inside the url.
    let callbackUrl = nextUrl.pathname;

    // search means the search typed in the search bar
    if (nextUrl.search) callbackUrl += nextUrl.search;

    // encode the callback url
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return;
});

// the places where the middleware or sp the func auth will be activated
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
