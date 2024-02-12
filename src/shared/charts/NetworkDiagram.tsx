import Dagre, { Node } from '@dagrejs/dagre'
import { t } from '@lingui/macro'
import { Box, colors, tooltipClasses, useTheme } from '@mui/material'
import { BaseType, Selection, SimulationLinkDatum, SimulationNodeDatum, select, zoom, zoomIdentity } from 'd3'
import { useCallback, useEffect, useRef } from 'react'
import { getIconFromResource } from 'src/assets/raw-icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import {
  WorkspaceInventoryNodeNeighborhood,
  WorkspaceInventoryNodeNeighborhoodEdgeType,
  WorkspaceInventoryNodeNeighborhoodNodeType,
} from 'src/shared/types/server'
import { iso8601DurationToString, parseCustomDuration } from 'src/shared/utils/parseDuration'

type NodesType = WorkspaceInventoryNodeNeighborhoodNodeType & SimulationNodeDatum & Node
type LinksType = SimulationLinkDatum<NodesType> & { source: NodesType; target: NodesType }

interface NetworkDiagramProps {
  data: WorkspaceInventoryNodeNeighborhood[]
  mainId: string
}

const groupToColor = (defaultColor: string, group?: string) => {
  switch (group) {
    case 'networking':
      return colors.purple[600]
    case 'misc':
      return colors.green[600]
    case 'storage':
      return colors.yellow[800]
    case 'access_control':
      return colors.pink[600]
    case 'control':
      return colors.blue[600]
    case 'compute':
      return colors.orange[600]
    case 'database':
      return colors.cyan[600]
    default:
      return defaultColor
  }
}

const MAX_WIDTH = 110

type ExtendedNodesType = NodesType & {
  bbox?: DOMRect
}
const createLabel = (
  parentNode: Selection<SVGGElement, ExtendedNodesType, BaseType, unknown>,
  yOffset: number,
  bgColor: string | ((d: NodesType) => string),
  textColor: string,
  textAccessor: (d: ExtendedNodesType) => string,
) => {
  return parentNode.each(function (d) {
    const nodeSelection = select<SVGGElement, ExtendedNodesType>(this)
    const labelGroup = nodeSelection.append('g').style('pointer-events', 'none') // Ignore pointer events

    const textElement = labelGroup
      .append('text')
      .text(textAccessor)
      .attr('x', 25) // Position text to the right of the icon
      .attr('y', yOffset)
      .style('fill', textColor)
      .style('dominant-baseline', 'central')
      .style('font-size', '10px')
      .each(function () {
        d.bbox = this.getBBox()
      })

    labelGroup
      .insert('rect', 'text')
      .attr('x', 20) // Position rect to the right of the icon
      .attr('y', yOffset - 7)
      .attr('width', (d) => (d.bbox ? Math.min(d.bbox.width + 10, MAX_WIDTH) : 0)) // Max width plus some padding
      .attr('height', (d) => (d.bbox ? d.bbox.height : 0))
      .attr('fill', bgColor)
      .attr('rx', 4) // Rounded corners

    // Truncate text if it's wider than max width
    textElement.each(function () {
      const self = select(this)
      let textLength = self.node()?.getComputedTextLength() ?? 0
      let text = self.text()
      while (textLength > MAX_WIDTH - 2 * 4 && text.length > 0) {
        // MAX_WIDTH is max width, 4 is padding on both sides
        text = text.slice(0, -1)
        self.text(`${text}...`)
        textLength = self.node()?.getComputedTextLength() ?? 0
      }
    })
  })
}

export const NetworkDiagram = ({ data, mainId }: NetworkDiagramProps) => {
  const {
    palette: {
      primary: { main: primaryColor, dark: primaryDarkColor, light: primaryLightColor },
      background: { paper: paperBgColor },
    },
    zIndex: { tooltip: tooltipZIndex },
    shadows: { '24': shadow24 },
  } = useTheme()
  const navigate = useAbsoluteNavigate()
  const containerRef = useRef<HTMLDivElement | undefined>()

  const getSimulation = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth: width, offsetHeight: height } = containerRef.current

      // Set up SVG
      const svg = select(containerRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;')

      const svgG = svg.append('g')

      // Prepare nodes and links for Dagre
      const nodes = data.filter((d) => d.type === 'node') as NodesType[]
      const links = (data.filter((d) => d.type === 'edge' && d) as WorkspaceInventoryNodeNeighborhoodEdgeType[])
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
        dagre.setNode(node.id, { width: 50, height: 50 })
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
        node.x = nodeInfo.x * 1.5
        node.y = nodeInfo.y
      })

      // tooltip

      const tooltip = select(containerRef.current)
        .append('div')
        .style('opacity', 0)
        .attr('class', tooltipClasses.tooltip)
        .style('position', 'fixed')
        .style('box-shadow', shadow24)
        .style('background-color', paperBgColor)
        .style('border-width', '2px')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('z-index', tooltipZIndex)

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
        .attr('opacity', 0.8)
        .attr('fill', primaryColor) as Selection<SVGCircleElement, NodesType, SVGGElement, unknown>

      node.append('title').text((d) => d.reported.name)

      // set label
      const labels = svgG.append('g').selectAll('g').data(nodes).join('g') as Selection<SVGGElement, NodesType, SVGGElement, unknown>
      const topLabel = createLabel(
        labels,
        -8,
        (d: NodesType) => groupToColor(primaryColor, d.metadata?.group),
        'white',
        (d) => d.reported.kind,
      ) // For the top label
      const bellowLabel = createLabel(labels, 8, 'black', 'white', (d) => d.reported.name) // For the bottom label

      // New code to append the SVG icon to each node
      const icon = svgG
        .append('g')
        .selectAll('image')
        .data(nodes)
        .join('image')
        .style('pointer-events', 'none')
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
        linkPath.attr('d', generateLinkPath).attr('stroke', (d) => groupToColor(primaryColor, d.source.metadata?.group))
        node
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)
          .attr('fill', (d) => groupToColor(primaryColor, d.metadata?.group))
        icon
          .attr('x', (d) => d.x - 10)
          .attr('y', (d) => d.y - 10)
          .attr('xlink:href', (d) => getIconFromResource(d.metadata?.icon))
        labels.attr('transform', (d) => `translate(${d.x},${d.y})`)
      }

      // Apply the tick function
      ticked()

      const mainNode = nodes.find((n) => n.id === mainId)

      return { svgG, svg, node, tooltip, mainNode, linkPath, icon, topLabel, bellowLabel, labels }
    }
  }, [data, mainId, paperBgColor, primaryColor, primaryDarkColor, primaryLightColor, shadow24, tooltipZIndex])

  useEffect(() => {
    const result = getSimulation()
    if (result) {
      const { tooltip, svgG, svg, node, mainNode, linkPath, icon, topLabel, bellowLabel, labels } = result

      const handleMouseOver = function (this: BaseType) {
        tooltip.style('opacity', 1)
        select(this).style('opacity', 1)
      }

      const createTooltipHtml = (d: NodesType) => {
        const container =
          '<div style="padding: 8px 16px 16px;box-sizing: border-box;-webkit-flex-direction: row;-ms-flex-direction: row;flex-direction: row;gap: 16px;grid-template-columns: 50px 1fr;width: 100%;display: grid;margin-top: 8px;color: inherit;">'
        const leftDiv =
          '<div style="box-sizing: border-box;-webkit-flex-direction: row;-ms-flex-direction: row;flex-direction: row;overflow: hidden;width: 100%;-webkit-align-items: center;-webkit-box-align: center;-ms-flex-align: center;align-items: center;height: 100%;display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;">'
        const rightDiv =
          '<div style="box-sizing: border-box;-webkit-flex-direction: row;-ms-flex-direction: row;flex-direction: row;overflow: hidden;width: 100%;">'
        const p =
          "<p style=\"margin: 0;font-size: 16px;font-weight: 400;line-height: 1.15;font-family: Nunito Sans Variable,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        return `${container}
          ${leftDiv}${p}color:${primaryColor};">${t`Kind`}</p></div>
          ${rightDiv}${p}">${d.reported.kind}</p></div>
          ${leftDiv}${p}color:${primaryColor};">${t`ID`}</p></div>
          ${rightDiv}${p}">${d.reported.id}</p></div>
          ${leftDiv}${p}color:${primaryColor};">${t`Name`}</p></div>
          ${rightDiv}${p}">${d.reported.name}</p></div>
          ${leftDiv}${p}color:${primaryColor};">${t`Age`}</p></div>
          ${rightDiv}${p}">${d.age ? iso8601DurationToString(parseCustomDuration(d.age), 2) : '-'}</p></div>
        </div>`
      }

      const handleMouseMove = function (this: BaseType, event: MouseEvent, d: NodesType) {
        tooltip
          .html(createTooltipHtml(d))
          .style('right', window.innerWidth - event.clientX + 'px')
          .style('top', event.clientY + 20 + 'px')
      }

      const handleMouseLeave = function (this: BaseType) {
        tooltip.style('opacity', 0)
        select(this).style('opacity', 0.8)
      }

      const handleZoom = (event: { transform: string; sourceEvent: MouseEvent }) => {
        svgG.attr('transform', event.transform)
      }

      const handleClick = (_: MouseEvent, d: NodesType) => {
        navigate({ pathname: `../${d.id}`, hash: window.location.hash, search: window.location.search })
      }

      icon.on('click', handleClick)

      node.on('click', handleClick)

      const zoomFn = zoom<SVGSVGElement, unknown>().on('zoom', handleZoom)
      svg.call(zoomFn.on('zoom', handleZoom))

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
          // eslint-disable-next-line @typescript-eslint/unbound-method
          .call(zoomFn.transform, zoomIdentity.translate(translate[0], translate[1]).scale(scale))
      }

      node.on('mouseover', handleMouseOver).on('mousemove', handleMouseMove).on('mouseleave', handleMouseLeave)

      return () => {
        topLabel.remove()
        bellowLabel.remove()
        labels.remove()
        linkPath.remove()
        node.on('click', null).on('mouseover', null).on('mousemove', null).on('mouseleave', null).remove()
        svg.remove()
        tooltip.remove()
      }
    }
  }, [data, getSimulation, navigate, primaryColor])

  return <Box width="100%" height="100%" ref={containerRef} />
}
