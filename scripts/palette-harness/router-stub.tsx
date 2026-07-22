import React from 'react'

// Minimal stand-in for @tanstack/react-router so route components render to static
// markup without a RouterProvider. Renders <Link> as a plain <a>; className + data
// attrs (all the palette harness asserts on) pass straight through. createFileRoute
// returns { options } so a route file's `Route.options.component` is reachable.
//
// Only used by scripts/check-standalone-palette.mjs — NOT part of the app bundle.
export function Link({
  to,
  params,
  search,
  hash,
  activeOptions,
  activeProps,
  inactiveProps,
  preload,
  preloadDelay,
  replace,
  resetScroll,
  children,
  ...rest
}: any) {
  const href = typeof to === 'string' ? to : '#'
  return <a href={href} {...rest}>{children}</a>
}

export function createFileRoute(_path?: string) {
  return (options: any) => ({ options })
}
export function createRootRoute(options: any) {
  return { options }
}
export function createRoute(options: any) {
  return { options }
}
export const Outlet = () => null
export function useLoaderData() {
  return {}
}
export function useParams() {
  return {}
}
export function notFound() {
  return new Error('notFound')
}
export function redirect(opts: any) {
  return opts
}

export default { Link, createFileRoute }
