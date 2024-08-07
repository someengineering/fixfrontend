import Dagre, { Node } from '@dagrejs/dagre'
import { t } from '@lingui/macro'
import { Skeleton, tooltipClasses, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { BaseType, Selection, SimulationLinkDatum, SimulationNodeDatum, select, zoom, zoomIdentity } from 'd3'
import { useCallback, useEffect, useRef } from 'react'
import { getIconFromResource } from 'src/assets/raw-icons'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryNodeHistoryNeighborhoodQuery } from 'src/pages/panel/shared/queries'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { FullscreenAbleContainer } from 'src/shared/fullscreen-able-container'
import { useNonce } from 'src/shared/providers'
import { WorkspaceInventoryNodeNeighborhoodNodeType } from 'src/shared/types/server'
import { EdgeType } from 'src/shared/types/server-shared'
import { iso8601DurationToString, parseCustomDuration } from 'src/shared/utils/parseDuration'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { groupToColor } from './groupUtils'

type NodesType = WorkspaceInventoryNodeNeighborhoodNodeType & SimulationNodeDatum & Node
type LinksType = SimulationLinkDatum<NodesType> & { source: NodesType; target: NodesType }

interface NetworkDiagramProps {
  mainId: string
}

const MAX_NODE_WIDTH = 130
const NODE_HEIGHT = 50

type ExtendedNodesType = NodesType & {
  bbox?: DOMRect
}

const createLabel = (
  parentNode: Selection<SVGGElement, ExtendedNodesType, BaseType, unknown>,
  yOffset: number,
  bgColor: string | ((d: NodesType) => string),
  textColor: string,
  textAccessor: (d: ExtendedNodesType) => string,
  nonce: string,
) => {
  parentNode.each(function (d) {
    const nodeSelection = select<SVGGElement, ExtendedNodesType>(this)
    const labelGroup = nodeSelection.append('g').attr('nonce', nonce).style('pointer-events', 'none') // Ignore pointer events

    const textElement = labelGroup
      .append('text')
      .text(textAccessor)
      .attr('x', 25) // Position text to the right of the icon
      .attr('y', yOffset)
      .style('fill', textColor)
      .style('dominant-baseline', 'central')
      .style('font-size', '10px')
      .style('font-family', 'monospace')
      .attr('nonce', nonce)

    // Compute the bounding box once
    d.bbox = textElement.node()?.getBBox()

    const padding = 8 // Total padding (4 on each side)
    const avgCharWidth = (d.bbox?.width ?? 0) / textElement.text().length
    const maxChars = Math.floor((MAX_NODE_WIDTH - padding) / avgCharWidth)

    let text = textAccessor(d)
    if (text.length > maxChars) {
      text = text.slice(0, maxChars - 1) + '…'
      textElement.text(text)
    }

    return labelGroup
      .insert('rect', 'text')
      .attr('x', 20) // Position rect to the right of the icon
      .attr('y', yOffset - 5)
      .attr('width', (d) => (d.bbox ? Math.min(d.bbox.width + 10, MAX_NODE_WIDTH) : 0)) // Max width plus some padding
      .attr('height', (d) => (d.bbox ? d.bbox.height : 0))
      .attr('fill', bgColor)
      .attr('rx', 4) // Rounded corners
  })
}

export const NetworkDiagram = ({ mainId }: NetworkDiagramProps) => {
  const nonce = useNonce() ?? ''
  const { selectedWorkspace } = useUserProfile()
  const { isLoading, data } = useQuery({
    queryKey: ['workspace-inventory-node-neighborhood', selectedWorkspace?.id ?? '', mainId],
    queryFn: getWorkspaceInventoryNodeHistoryNeighborhoodQuery,
  })
  const {
    palette: {
      primary: { main: primaryColor, dark: primaryDarkColor, light: primaryLightColor },
      error: { light: errorColor },
      background: { paper: paperBgColor },
    },
    zIndex: { tooltip: tooltipZIndex },
    shadows: { '24': shadow24 },
  } = useTheme()
  const navigate = useAbsoluteNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)

  const getSimulation = useCallback(
    (nonce: string) => {
      if (!data) {
        return
      }
      if (containerRef.current) {
        const { offsetWidth: width, offsetHeight: height } = containerRef.current

        // Set up SVG
        const svg = select(containerRef.current)
          .append('svg')
          .attr('nonce', nonce)
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', [0, 0, width, height])
          .style('max-width', '100%')
          .style('height', 'auto')
          .attr('cursor', 'grab')

        const svgG = svg.append('g')

        // Prepare nodes and links for Dagre
        const nodes = data.filter((d) => d.type === 'node') as NodesType[]
        const links = (data.filter((d) => d.type === 'edge' && d) as EdgeType[])
          .map((link) => {
            return {
              ...link,
              source: nodes.find((n) => n.id === link.from),
              target: nodes.find((n) => n.id === link.to),
            }
          })
          .filter((link) => link.source && link.target) as LinksType[]

        // Create a new directed graph
        const dagre = new Dagre.graphlib.Graph()
        dagre.setGraph({ rankdir: 'LR' })
        dagre.setDefaultEdgeLabel(() => ({}))

        // Add nodes to the graph
        nodes.forEach((node) => {
          dagre.setNode(node.id, { width: MAX_NODE_WIDTH, height: NODE_HEIGHT })
        })

        // Add links to the graph
        links.forEach((link) => {
          dagre.setEdge(link.source.id, link.target.id)
        })

        // Compute the layout
        Dagre.layout(dagre)
        // Update nodes with computed positions
        nodes.forEach((node) => {
          const nodeInfo = dagre.node(node.id)
          node.x = nodeInfo.x
          node.y = nodeInfo.y
        })

        // tooltip

        const tooltip = select(containerRef.current)
          .append('div')
          .style('opacity', 0)
          .attr('class', tooltipClasses.tooltip)
          .style('pointer-events', 'none')
          .style('position', 'fixed')
          .style('box-shadow', shadow24)
          .style('background-color', paperBgColor)
          .style('border-width', '2px')
          .style('border-radius', '5px')
          .style('padding', '5px')
          .style('z-index', tooltipZIndex)
          .attr('nonce', nonce)

        // Render links
        // const link = svgG
        //   .append('g')
        //   .attr('stroke', primaryDarkColor)
        //   .attr('stroke-opacity', 0.6)
        //   .selectAll('line')
        //   .data(links)
        //   .join('line')
        //   .attr('stroke-width', 1.5)

        // Update link rendering to use paths for curved lines
        const linkPath = svgG
          .append('g')
          .attr('stroke', primaryDarkColor)
          .attr('stroke-opacity', 0.6)
          .selectAll('path')
          .data(links)
          .join('path')
          .style('pointer-events', 'none')
          .attr('nonce', nonce)
          .attr('stroke-width', 1.5)
          .attr('fill', 'none') // This ensures the path is not filled
          .attr('id', (_, i) => `linkPath${i}`)
          .attr('marker-end', 'url(#end)')

        // Render nodes
        const node = svgG
          .append('g')
          .attr('stroke', primaryLightColor)
          .attr('stroke-width', 1.5)
          .selectAll('circle')
          .data(nodes)
          .join('circle')
          .attr('r', 15)
          .attr('cursor', 'pointer')
          .attr('fill', primaryColor) as Selection<SVGCircleElement, NodesType, SVGGElement, unknown>

        node.append('title').text((d) => d.reported.name)

        // set label
        const labels = svgG.append('g').selectAll('g').data(nodes).join('g') as Selection<SVGGElement, NodesType, SVGGElement, unknown>
        createLabel(
          labels,
          -8,
          (d: NodesType) => groupToColor(primaryColor, d.metadata?.group, d.metadata?.['state-icon'] === 'instance_terminated'),
          'white',
          (d) => d.reported.kind,
          nonce,
        ) // For the top label
        createLabel(labels, 8, 'black', 'white', (d) => d.reported.name, nonce) // For the bottom label

        // New code to append the SVG icon to each node
        const icon = svgG
          .append('g')
          .selectAll('image')
          .data(nodes)
          .join('image')
          .style('pointer-events', 'none')
          .attr('nonce', nonce)
          .attr('cursor', 'pointer')
          .attr('width', 20) // Set the width of the icon
          .attr('height', 20) // Set the height of the icon
          .attr('fill', '#fff') as Selection<SVGImageElement, NodesType, SVGGElement, unknown>

        // Function to generate the path for each link
        const generateLinkPath = (d: LinksType) => {
          const dx = d.target.x - d.source.x
          const dy = d.target.y - d.source.y
          const dr = Math.sqrt(dx * dx + dy * dy) // Distance between nodes

          // Use dr to influence the curve strength
          const curveStrength = Math.log1p(dr) * 5 // Example formula to determine curve based on distance

          // If the nodes are horizontally or vertically aligned, make the line straight
          const isStraight = Math.abs(dx) < 50 || Math.abs(dy) < 50

          if (isStraight) {
            // Straight line
            return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
          } else {
            // Curved path using a quadratic Bezier curve with a control point
            // Control point is at the midpoint, shifted by the curve strength
            const controlX = (d.source.x + d.target.x) / 2 + curveStrength * (dy / dr)
            const controlY = (d.source.y + d.target.y) / 2 - curveStrength * (dx / dr)
            return `M${d.source.x},${d.source.y} Q${controlX},${controlY} ${d.target.x},${d.target.y}`
          }
        }

        // Apply the animated path generator to the links
        // const animateLinks = () => {
        //   linkPath
        //     .attr('d', generateLinkPath)
        //     .attr('stroke-dasharray', '10 5')
        //     .attr('stroke-dashoffset', 0)
        //     .transition()
        //     .duration(2000)
        //     .ease(easeLinear)
        //     .attr('stroke-dashoffset', -30)
        //     .on('end', () => window.setTimeout(animateLinks, 50))
        // }

        // animateLinks()

        // Update positions on tick
        const ticked = () => {
          linkPath
            .attr('d', generateLinkPath)
            .attr('stroke', (d) =>
              groupToColor(primaryColor, d.source.metadata?.group, d.source.metadata?.['state-icon'] === 'instance_terminated'),
            )
          node
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr('fill', (d) => groupToColor(primaryColor, d.metadata?.group, d.metadata?.['state-icon'] === 'instance_terminated'))
          icon
            .attr('x', (d) => d.x - 10)
            .attr('y', (d) => d.y - 10)
            .attr('xlink:href', (d) => getIconFromResource(d.metadata?.icon))
          labels.attr('transform', (d) => `translate(${d.x},${d.y})`)
        }

        // Apply the tick function
        ticked()

        const mainNode = nodes.find((n) => n.id === mainId)

        return { svgG, svg, node, tooltip, mainNode, linkPath, icon, labels }
      }
    },
    [data, mainId, paperBgColor, primaryColor, primaryDarkColor, primaryLightColor, shadow24, tooltipZIndex],
  )

  useEffect(() => {
    const result = getSimulation(nonce)
    if (result) {
      const { tooltip, svgG, svg, node, mainNode, linkPath, icon, labels } = result
      const tooltipContainer = select(window.document.createElement('div'))
        .attr('nonce', nonce)
        .style('padding', '8px 16px 16px')
        .style('box-sizing', 'border-box')
        .style('-webkit-flex-direction', 'row')
        .style('-ms-flex-direction', 'row')
        .style('flex-direction', 'row')
        .style('gap', '16px')
        .style('grid-template-columns', '50px 1fr')
        .style('width', '100%')
        .style('display', 'grid')
        .style('margin-top', '8px')
        .style('color', 'inherit')

      const tooltipRightDiv = select(window.document.createElement('div'))
        .attr('nonce', nonce)
        .style('box-sizing', 'border-box')
        .style('-webkit-flex-direction', 'row')
        .style('-ms-flex-direction', 'row')
        .style('flex-direction', 'row')
        .style('overflow', 'hidden')
        .style('width', '100%')

      const tooltipLeftDiv = tooltipRightDiv
        .clone()
        .style('-webkit-align-items', 'center')
        .style('-webkit-box-align', 'center')
        .style('-ms-flex-align', 'center')
        .style('align-items', 'center')
        .style('height', '100%')
        .style('display', '-webkit-box')
        .style('display', '-webkit-flex')
        .style('display', '-ms-flexbox')
        .style('display', 'flex')

      const tooltipContent = select(window.document.createElement('p'))
        .attr('nonce', nonce)
        .style('margin', '0')
        .style('font-size', '16px')
        .style('font-weight', '400')
        .style('line-height', '1.15')
        .style(
          'font-family',
          "'Plus Jakarta Sans Variable',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
        )
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .style('white-space', 'nowrap')

      const createTooltipContentRow = (clonedContainer: HTMLDivElement | null, left: string, right: string) => {
        clonedContainer?.appendChild(
          tooltipLeftDiv
            .clone()
            .node()
            ?.appendChild(tooltipContent.clone().text(left).style('color', primaryColor).node() as HTMLParagraphElement) as HTMLDivElement,
        )
        clonedContainer?.appendChild(
          tooltipRightDiv
            .clone()
            .node()
            ?.appendChild(tooltipContent.clone().text(right).node() as HTMLParagraphElement) as HTMLDivElement,
        )
      }

      const createTooltipHtml = (d: NodesType, tooltip: Selection<HTMLDivElement, unknown, null, undefined>) => {
        tooltip.selectAll('*').remove()
        const clonedContainer = tooltipContainer.clone().node()
        createTooltipContentRow(clonedContainer, t`Kind`, d.reported.kind)
        createTooltipContentRow(clonedContainer, t`ID`, d.reported.id)
        createTooltipContentRow(clonedContainer, t`Name`, d.reported.name)
        createTooltipContentRow(clonedContainer, t`Age`, d.age ? iso8601DurationToString(parseCustomDuration(d.age), 2) : '-')

        if (d.metadata?.['state-icon'] === 'instance_terminated') {
          clonedContainer?.appendChild(tooltipLeftDiv.clone().node() as HTMLDivElement)
          clonedContainer?.appendChild(
            tooltipRightDiv
              .clone()
              .node()
              ?.appendChild(
                tooltipContent
                  .clone()
                  .style('color', errorColor)
                  .text(t`Instance is terminated`)
                  .node() as HTMLParagraphElement,
              ) as HTMLDivElement,
          )
        }

        tooltip.node()?.appendChild(clonedContainer as HTMLDivElement)
      }

      const handleMouseOver = function (this: BaseType) {
        tooltip.style('opacity', 1)
      }

      const handleMouseMove = function (this: BaseType, event: MouseEvent, d: NodesType) {
        const right = window.innerWidth - event.clientX
        const { height, width } = tooltip.node()?.getBoundingClientRect() ?? { height: 0, width: 0 }
        const left = event.clientX - width
        const top = event.clientY + 20
        const bottom = top + height
        tooltip
          .style('right', (left < 0 ? null : `${right}px`) as string)
          .style('left', (left < 0 ? '0px' : null) as string)
          .style('top', `${bottom > window.innerHeight ? window.innerHeight - height : top}px`)
        createTooltipHtml(d, tooltip)
      }

      const handleMouseLeave = function (this: BaseType) {
        tooltip.style('opacity', 0)
      }

      const handleZoom = (event: { transform: { k: number; x: number; y: number } }) => {
        const { k, x, y } = event.transform

        svgG.attr('transform', `translate(${x},${y}) scale(${k})`)
      }

      const handleClick = (_: MouseEvent, d: NodesType) => {
        navigate({
          pathname: `../${d.id}`,
          hash: window.location.hash,
          search: mergeLocationSearchValues({
            ...getLocationSearchValues(window.location.search),
            name: window.encodeURIComponent(d.reported.name ?? ''),
          }),
        })
      }

      icon.on('click', handleClick)

      node.on('click', handleClick)

      const handleStartZoom = function (this: BaseType) {
        select(this).attr('cursor', 'grabbing')
      }

      const handleEndZoom = function (this: BaseType) {
        select(this).attr('cursor', 'grab')
      }
      let x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity
      svgG.selectAll('*').each(function () {
        const svgElement = select(this).node() as SVGGElement
        if ('getBBox' in svgElement) {
          const bbox = svgElement.getBBox()
          x0 = Math.min(x0, bbox.x)
          y0 = Math.min(y0, bbox.y)
          x1 = Math.max(x1, bbox.x + bbox.width)
          y1 = Math.max(y1, bbox.y + bbox.height)
        }
      })

      const zoomInit = zoom<SVGSVGElement, unknown>()
        .translateExtent([
          [x0 - 50, y0 - 50],
          [x1 + 50, y1 + 50],
        ])
        .scaleExtent([0.33, 3])
      const zoomStartFn = zoomInit.on('start', handleStartZoom)
      const zoomEndFn = zoomInit.on('end', handleEndZoom)
      const zoomFn = zoomInit.on('zoom', handleZoom)
      svg.call(zoomFn)
      svg.call(zoomStartFn)
      svg.call(zoomEndFn)

      if (mainNode) {
        // Calculate the scale and translate to center the main node
        const scale = 1 // Set the scale (zoom level) as needed
        const translate = [
          (containerRef.current?.offsetWidth ?? 0) / 2 - mainNode.x * scale,
          (containerRef.current?.offsetHeight ?? 0) / 2 - mainNode.y * scale,
        ]
        svg
          .transition()
          .duration(750) // Adjust duration for the zoom transition
          .call(zoomFn.transform, zoomIdentity.translate(translate[0], translate[1]).scale(scale))
      }

      node.on('mouseover', handleMouseOver).on('mousemove', handleMouseMove).on('mouseleave', handleMouseLeave)

      return () => {
        zoomInit.on('start', null)
        zoomInit.on('end', null)
        zoomInit.on('zoom', null)
        labels.remove()
        linkPath.remove()
        node.on('click', null).on('mouseover', null).on('mousemove', null).on('mouseleave', null).remove()
        svg.remove()
        tooltip.remove()
      }
    }
  }, [data, getSimulation, navigate, primaryColor, errorColor, nonce])

  const handleFullscreenChange = (_: boolean, container: HTMLDivElement) => {
    const { height, width } = container.getBoundingClientRect()
    select(container).selectChildren('svg').attr('width', width).attr('height', height)
  }

  return isLoading ? (
    <Skeleton height={400} width="100%" variant="rounded" />
  ) : data ? (
    <FullscreenAbleContainer ref={containerRef} onChange={handleFullscreenChange} />
  ) : null
}
