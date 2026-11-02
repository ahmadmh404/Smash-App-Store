/**
 * This routes are used only for authenticated users.
 * When unauthenticated usres visit this route they will be re-directed to home page
 * @type (string[])
 */

export const privateRoutes = ["/dashboard"];

/**
 *  An array of routes that are accessible in the public
 *  These routes don't require authentication
 *  @type (string[])
 */

export const publicRoutes = ["/", "/s"];

/**
 *  An array of routes that are used for authentication
 *  These routes will redirect logged users to /settings
 *  @type (string[])
 */

export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/**
 *  The perfix for API authentication routes.
 *  Routes that start with this perfix are used for API authentication purposes
 *  @type (string):
 */

export const apiAuthPrefix = "/api/auth";

/**
 *  The default route into whcih the loggedin users will be redirect
 *  @type (string)
 */

export const DEFAUTL_LOGIN_REDIRECT: string = "/";
