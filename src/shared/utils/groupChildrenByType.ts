import { Children, ComponentType, isValidElement, ReactNode } from 'react'

export function groupChildrenByType(
  children: ReactNode,
  components: Array<string | ComponentType>,
  map?: Map<string | ComponentType, ReactNode>,
): Map<string | ComponentType, ReactNode> {
  const componentsSet = new Set(components)
  if (!map) {
    map = new Map()
  }
  Children.forEach(children, (child) => {
    if (isValidElement<{ children?: ReactNode }>(child)) {
      if (componentsSet.has(child.type)) {
        map?.set(child.type, child.props.children)
      }
      groupChildrenByType(child.props.children, components, map)
    }
  })
  return map
}
