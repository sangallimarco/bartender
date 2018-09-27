import { select, Selection } from 'd3-selection';
import { path } from 'd3-path';
import { hsl } from 'd3-color';

interface PartColor { part: number; color: string };

export function buildPart(svg: Selection<SVGSVGElement, {}, null, undefined>, x: number, y: number, ml: number, radius: number, color: string) {
    const h = ml;
    const Xa = x - radius;
    const Xb = x + radius;
    const pRadius = radius / 6; // fake perspective
    const topRadius = radius + (ml / 4); // Ndeg diagonal
    const XTa = x - topRadius;
    const XTb = x + topRadius;
    const YTb = y - h;
    // const pTRadius = topRadius / 6;

    const ellipse = path();
    ellipse.moveTo(Xa, y)
    ellipse.bezierCurveTo(Xa, y + pRadius, Xb, y + pRadius, Xb, y)
    ellipse.lineTo(XTb, YTb)
    ellipse.bezierCurveTo(XTb, YTb - pRadius, XTa, YTb - pRadius, XTa, YTb)
    ellipse.closePath();

    const ellipsePath = svg.append('path');
    ellipsePath.attr('d', ellipse.toString())
        .attr('stroke', color)
        .attr('stroke-width', 1)
        .attr('fill', color)
        .attr('opacity', 0.8);

    const arc = path();
    arc.moveTo(XTa, YTb)
    arc.bezierCurveTo(XTa, YTb + pRadius, XTb, YTb + pRadius, XTb, YTb)
    const arcPath = svg.append('path');
    const arcColor = hsl(color);
    arcColor.l = arcColor.l - 0.2;
    arcPath.attr('d', arc.toString())
        .attr('stroke', arcColor.toString())
        .attr('stroke-width', 1)
        .attr('fill', 'none');

    return [YTb, topRadius];
}

export function buildGlass(parts: number[], colors: string[], element: SVGSVGElement) {
    if (!element) {
        return;
    }

    const {
        width: vw,
        height: vh
    } = element.getBoundingClientRect();

    const struct: PartColor[] = parts.map((part: number, i: number) => {
        const color: string = colors[i] || '#ffffff';
        return { part, color };
    })

    const svg = select(element);
    const padding = 10;
    const vk = vh - (padding * 2); // padding
    const total = struct.reduce((c, { part }) => c + part, 0);
    const k = (vk / total);

    let y = vh - padding;
    let r = vw / 6;
    struct.forEach(({ part, color }) => {
        const ml = part * k;
        const [yy, rr] = buildPart(svg, vw / 2, y, ml, r, color);
        y = yy;
        r = rr;
    });
}