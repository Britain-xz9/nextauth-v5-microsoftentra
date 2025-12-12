/**
 * array of routes that are accessible to public
 * these routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/", "/error"];

/**
 * an array of routes used for authentication
 * these routes will get users to authenticate
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/login"];

/**
 * prefix for api authentication routes
 * these route use for api authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * route for admin
 * @type {string}
 */
export const adminRoute: string = "/admin";

/**
 * route for student
 * @type {string}
 */
export const studentRoute: string = "/student";

/**
 * route for dev
 * @type {string}
 */
export const devRoute: string = "/dev";
