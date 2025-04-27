// Remove the Mapbox CSS import from head.tsx since we're importing it directly in the components
export default function Head() {
  return <>{/* Mapbox CSS is now imported directly in the components */}</>
}
