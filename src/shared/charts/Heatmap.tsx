import { BaseType, axisBottom, axisLeft, interpolateRdYlGn, scaleBand, scaleSequential, select } from 'd3'
import { useCallback, useEffect, useMemo, useRef } from 'react'

interface HeatmapProps<ColumnsKeys extends string, RowsKeys extends string> {
  data: {
    [ColumnKey in ColumnsKeys]: {
      [RowKey in RowsKeys]: {
        value: number
        title: string
      }
    }
  }
  minData: number
  minWidth: number
  minHeight: number
  maxData: number
  interpolate?: (t: number) => string
}

export function Heatmap<ColumnsKeys extends string, RowsKeys extends string>({
  data,
  maxData,
  minData,
  minHeight,
  minWidth,
  interpolate = interpolateRdYlGn,
}: HeatmapProps<ColumnsKeys, RowsKeys>) {
  const ref = useRef<HTMLDivElement>(null)

  const processedData = useMemo(() => {
    const columns = Object.keys(data) as ColumnsKeys[]
    const rows = Object.keys(data[columns[0]]) as RowsKeys[]

    const values = columns.reduce(
      (prev, column) => [...prev, ...rows.map((row) => ({ column, row, data: data[column][row] }))],
      [] as { column: ColumnsKeys; row: RowsKeys; data: { value: number; title: string } }[],
    )

    return { columns, rows, values }
  }, [data])

  const createHeatmap = useCallback(
    (el: HTMLDivElement) => {
      const margin = { top: 10, right: 35, bottom: 30, left: 100 }
      const width =
        (el.offsetWidth / processedData.rows.length < minWidth ? minWidth * processedData.rows.length : el.offsetWidth) -
        margin.left -
        margin.right -
        20
      const height =
        (el.offsetHeight / processedData.columns.length < minHeight ? minHeight * processedData.columns.length : el.offsetHeight) -
        margin.top -
        margin.bottom -
        25

      // create a tooltip
      const tooltip = select(el)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('position', 'fixed')
        .style('box-shadow', '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)')
        .style('background-color', 'white')
        .style('border-width', '2px')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('white-space', 'nowrap')

      const svg = select(el)
        .style('height', `${el.offsetWidth / 2}px`)
        .style('overflow', 'auto')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      const container = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

      // Build X scales and axis:
      const x = scaleBand().range([0, width]).domain(processedData.columns).padding(0.05)
      const xBandwidth = x.bandwidth()
      container
        .append('g')
        .style('font-size', 15)
        .attr('transform', `translate(0, ${height})`)
        .call(axisBottom(x).tickSize(0))
        .select('.domain')
        .remove()

      // Build Y scales and axis:
      const y = scaleBand().range([height, 0]).domain(processedData.rows).padding(0.05)
      const yBandwidth = y.bandwidth()
      container.append('g').style('font-size', 15).call(axisLeft(y).tickSize(0)).select('.domain').remove()

      // Build color scale
      const myColor = scaleSequential().interpolator(interpolate).domain([minData, maxData])

      const mouseover = function (this: BaseType) {
        tooltip.style('opacity', 1)
        select(this).style('opacity', 1)
      }
      const mousemove = function (this: BaseType, event: MouseEvent, d: (typeof processedData.values)[number]) {
        tooltip
          .html(`${d.data.title}`)
          .style('left', event.clientX + 20 + 'px')
          .style('top', event.clientY + 20 + 'px')
      }
      const mouseleave = function (this: BaseType) {
        tooltip.style('opacity', 0)
        select(this).style('opacity', 0.8)
      }
      const textWrap = function (this: SVGTextElement | null) {
        const self = select(this)
        let textLength = self.node()?.getComputedTextLength() ?? 0,
          text = self.text()
        while (textLength > xBandwidth - 2 * 10 && text.length > 0) {
          text = text.slice(0, -1)
          self.text(text + '...')
          textLength = self.node()?.getComputedTextLength() ?? 0
        }
      }

      const svgWithData = container.selectAll().data(processedData.values, (d) => `${d?.column}:${d?.row}`)

      const text = svgWithData
        .join('text')
        .html((d) => d.data.title)
        .attr('x', (d) => (x(d.column) ?? 0) + xBandwidth / 2)
        .attr('y', (d) => (y(d.row) ?? 0) + yBandwidth / 2)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('width', xBandwidth)
        .attr('height', yBandwidth)
        .attr('fill', 'blue')
        .attr('font-size', 15)
        .each(textWrap)

      const rect = svgWithData
        .join('rect')
        .attr('x', (d) => x(d.column) ?? 0)
        .attr('y', (d) => y(d.row) ?? 0)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('width', xBandwidth)
        .attr('height', yBandwidth)
        .style('fill', (d) => myColor(d.data.value))
        .style('stroke-width', 4)
        .style('stroke', 'none')
        .style('opacity', 0.8)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)

      return () => {
        text.remove()
        rect.remove()
        svgWithData.remove()
        tooltip.remove()
        container.remove()
        svg.remove()
      }
    },
    [processedData, minWidth, minHeight, interpolate, minData, maxData],
  )

  useEffect(() => {
    if (ref.current) {
      const observedElemenet = ref.current
      let cleanup = createHeatmap(observedElemenet)
      const resizeObserver = new ResizeObserver((entries) => {
        window.requestAnimationFrame((): void | undefined => {
          if (!Array.isArray(entries) || !entries.length) {
            return
          }
          cleanup()
          cleanup = createHeatmap(entries[0].target as HTMLDivElement)
        })
      })
      resizeObserver.observe(observedElemenet)
      return () => {
        cleanup()
        resizeObserver.disconnect()
        resizeObserver.unobserve(observedElemenet)
      }
    }
  }, [createHeatmap])

  return <div ref={ref} />
}
