import { Box, tooltipClasses, useTheme } from '@mui/material'
import {
  BaseType,
  Selection,
  SimulationLinkDatum,
  SimulationNodeDatum,
  drag,
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  zoom,
} from 'd3'
import { useCallback, useEffect, useRef } from 'react'
import { WorkspaceInventoryNodeNeighborhood, WorkspaceInventoryNodeNeighborhoodNodeType } from 'src/shared/types/server'

type NodesType = WorkspaceInventoryNodeNeighborhoodNodeType & SimulationNodeDatum
type LinksType = SimulationLinkDatum<NodesType>

interface NetworkDiagramProps {
  data: WorkspaceInventoryNodeNeighborhood[]
}

export const NetworkDiagram = ({ data }: NetworkDiagramProps) => {
  const {
    palette: {
      primary: { main: primaryColor, dark: primaryDarkColor, light: primaryLightColor },
      background: { paper: paperBgColor },
    },
    zIndex: { tooltip: tooltipZIndex },
    shadows: { '24': shadow24 },
  } = useTheme()
  const containerRef = useRef<HTMLDivElement | undefined>()

  const getSimulation = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth: width, offsetHeight: height } = containerRef.current
      const svg = select(containerRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;')

      const svgG = svg.append('g')
      const nodes: NodesType[] = []
      const links: LinksType[] = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item.type === 'node') {
          nodes.push({ ...item, index: i })
        } else {
          links.push({ source: item.from, target: item.to, index: i })
        }
      }

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

      const link = svgG
        .append('g')
        .attr('stroke', primaryDarkColor)
        .attr('stroke-opacity', 0.6)
        .selectAll()
        .data(links)
        .join('line')
        .attr('stroke-width', 1.5)

      const node = svgG
        .append('g')
        .attr('stroke', primaryLightColor)
        .attr('stroke-width', 1.5)
        .selectAll()
        .data(nodes)
        .join('circle')
        .attr('r', 8)
        .attr('fill', primaryColor) as Selection<SVGCircleElement, NodesType, SVGGElement, unknown>

      node.append('title').text((d) => d.reported.name)
      const simulation = forceSimulation(nodes)
        .force(
          'link',
          forceLink<NodesType, LinksType>(links).id((d) => d.id),
        )
        .force('charge', forceManyBody())
        .force('center', forceCenter(width / 2, height / 2))
      return { tooltip, svgG, svg, link, node, simulation }
    }
  }, [data, paperBgColor, primaryColor, primaryDarkColor, primaryLightColor, shadow24, tooltipZIndex])

  useEffect(() => {
    const result = getSimulation()
    if (result) {
      const { tooltip, svgG, svg, link, node, simulation } = result
      const handleTick = () => {
        link
          .attr('x1', (d) => (d.source as SimulationNodeDatum).x ?? 0)
          .attr('y1', (d) => (d.source as SimulationNodeDatum).y ?? 0)
          .attr('x2', (d) => (d.target as SimulationNodeDatum).x ?? 0)
          .attr('y2', (d) => (d.target as SimulationNodeDatum).y ?? 0)

        node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0)
      }

      // Reheat the simulation when drag starts, and fix the subject position.
      const handleDragStart = (event: DragEvent & { active?: boolean; subject: NodesType }) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      // Update the subject (dragged node) position during drag.
      const handleDrag = (event: DragEvent & { subject: NodesType }) => {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      // Restore the target alpha so the simulation cools after dragging ends.
      // Unfix the subject position now that it’s no longer being dragged.
      const handleDragEnd = (event: DragEvent & { active?: boolean; subject: NodesType }) => {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      const handleMouseOver = function (this: BaseType) {
        tooltip.style('opacity', 1)
        select(this).style('opacity', 1)
      }

      const handleMouseMove = function (this: BaseType, event: MouseEvent, d: NodesType) {
        tooltip
          .html(`<pre>${JSON.stringify(d, null, '  ')}</pre>`)
          .style('left', event.clientX + 20 + 'px')
          .style('top', event.clientY + 20 + 'px')
      }

      const handleMouseLeave = function (this: BaseType) {
        tooltip.style('opacity', 0)
        select(this).style('opacity', 0.8)
      }

      const handleZoom = (event: { transform: string; sourceEvent: MouseEvent }) => {
        event.sourceEvent.preventDefault()
        event.sourceEvent.stopPropagation()
        svgG.attr('transform', event.transform)
      }

      simulation.on('tick', handleTick)
      node
        .call(drag<SVGCircleElement, NodesType>().on('start', handleDragStart).on('drag', handleDrag).on('end', handleDragEnd))
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseleave', handleMouseLeave)

      svg.call(zoom<SVGSVGElement, unknown>().on('zoom', handleZoom))

      return () => {
        simulation.on('tick', null)
        simulation.stop()
        node
          .call(drag<SVGCircleElement, NodesType>().on('start', null).on('drag', null).on('end', null))
          .on('mouseover', null)
          .on('mousemove', null)
          .on('mouseleave', null)
          .remove()
        link.remove()
        svg.remove()
        tooltip.remove()
      }
    }
  }, [data, getSimulation])

  return <Box width="100%" height="100%" ref={containerRef} />
}
