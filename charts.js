// California High-Speed Rail Data Visualization Charts
// FiveThirtyEight-style D3.js visualizations

document.addEventListener('DOMContentLoaded', function() {
    // Smooth load animations
    setTimeout(() => {
        createCostChart();
        createTimelineChart();
        createContractorChart();
        createRouteMap();
    }, 100);
});

// 538-style color palette
const colors = {
    red: '#ED1C24',
    orange: '#F26522',
    redLight: 'rgba(237, 28, 36, 0.12)',
    success: '#2ECC71',
    warning: '#F39C12',
    blue: '#3498DB',
    textPrimary: '#222222',
    textSecondary: '#555555',
    textMuted: '#888888',
    gridline: '#ECECEC',
    border: '#E8E8E8'
};

// Font styling - 538 uses clean sans-serif
const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

// Cost Evolution Chart
function createCostChart() {
    const container = d3.select('#cost-chart');
    if (container.empty()) return;
    
    const containerWidth = container.node().getBoundingClientRect().width;
    
    const margin = {top: 50, right: 120, bottom: 50, left: 60};
    const width = Math.min(containerWidth, 740) - margin.left - margin.right;
    const height = 380 - margin.top - margin.bottom;
    
    container.selectAll('*').remove();
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Data: Cost estimates over time (Phase 1)
    const data = [
        {year: 2008, low: 33, high: 33, label: 'Prop 1A'},
        {year: 2009, low: 42.6, high: 42.6, label: '2009 Plan'},
        {year: 2011, low: 65.4, high: 65.4, label: '2011 Plan'},
        {year: 2012, low: 68.4, high: 68.4, label: '2012 Plan'},
        {year: 2014, low: 67.6, high: 67.6, label: '2014 Plan'},
        {year: 2016, low: 64.2, high: 64.2, label: '2016 Plan'},
        {year: 2018, low: 77.3, high: 77.3, label: '2018 Plan'},
        {year: 2020, low: 80.3, high: 80.3, label: '2020 Plan'},
        {year: 2022, low: 88.5, high: 105, label: '2022 Plan'},
        {year: 2024, low: 89, high: 128, label: '2024 Plan'}
    ];

    // Scales
    const x = d3.scaleLinear()
        .domain([2007, 2026])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, 145])
        .range([height, 0]);

    // Very subtle gridlines - 538 style
    svg.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data([0, 25, 50, 75, 100, 125])
        .join('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => y(d))
        .attr('y2', d => y(d))
        .attr('stroke', colors.gridline)
        .attr('stroke-width', 1);

    // Y-axis labels (minimal)
    svg.selectAll('.y-label')
        .data([0, 50, 100])
        .join('text')
        .attr('x', -8)
        .attr('y', d => y(d))
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('font-family', fontFamily)
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', colors.textMuted)
        .text(d => '$' + d + 'B');

    // Original estimate annotation line
    svg.append('line')
        .attr('x1', x(2008))
        .attr('x2', width + 20)
        .attr('y1', y(33))
        .attr('y2', y(33))
        .attr('stroke', colors.success)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6,4')
        .attr('opacity', 0.7);

    // Direct annotation on chart - 538 style
    svg.append('text')
        .attr('x', width + 25)
        .attr('y', y(33))
        .attr('dy', '0.35em')
        .attr('font-family', fontFamily)
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', colors.success)
        .text('$33B original');

    // Area for range (2022+)
    const areaData = data.filter(d => d.high !== d.low);
    const area = d3.area()
        .x(d => x(d.year))
        .y0(d => y(d.low))
        .y1(d => y(d.high))
        .curve(d3.curveMonotoneX);

    svg.append('path')
        .datum(areaData)
        .attr('fill', colors.redLight)
        .attr('d', area);

    // Main line
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.high))
        .curve(d3.curveMonotoneX);

    // Animate the line
    const path = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colors.red)
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .attr('d', line);
    
    const pathLength = path.node().getTotalLength();
    path
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1500)
        .ease(d3.easeQuadOut)
        .attr('stroke-dashoffset', 0);

    // Low estimate line (dashed, only where different)
    const lineLow = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.low))
        .curve(d3.curveMonotoneX);

    svg.append('path')
        .datum(data.filter(d => d.year >= 2022))
        .attr('fill', 'none')
        .attr('stroke', colors.red)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.5)
        .attr('d', lineLow);

    // Key data points only - less cluttered
    const keyPoints = data.filter(d => [2008, 2012, 2018, 2024].includes(d.year));
    
    svg.selectAll('.data-point')
        .data(keyPoints)
        .join('circle')
        .attr('class', 'data-point')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.high))
        .attr('r', 0)
        .attr('fill', colors.red)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .transition()
        .delay((d, i) => 1500 + i * 100)
        .duration(300)
        .attr('r', 5);

    // Direct value annotations on chart - 538 signature style
    // Starting point
    svg.append('text')
        .attr('x', x(2008))
        .attr('y', y(33) + 20)
        .attr('text-anchor', 'middle')
        .attr('font-family', fontFamily)
        .attr('font-size', '13px')
        .attr('font-weight', '700')
        .attr('fill', colors.textPrimary)
        .text('$33B')
        .attr('opacity', 0)
        .transition()
        .delay(1600)
        .duration(300)
        .attr('opacity', 1);

    // End point - the big number
    svg.append('text')
        .attr('x', x(2024))
        .attr('y', y(128) - 15)
        .attr('text-anchor', 'middle')
        .attr('font-family', fontFamily)
        .attr('font-size', '18px')
        .attr('font-weight', '800')
        .attr('fill', colors.red)
        .text('$128B')
        .attr('opacity', 0)
        .transition()
        .delay(1900)
        .duration(400)
        .attr('opacity', 1);

    // Growth annotation
    svg.append('text')
        .attr('x', x(2024))
        .attr('y', y(128) - 35)
        .attr('text-anchor', 'middle')
        .attr('font-family', fontFamily)
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', colors.textMuted)
        .text('+287%')
        .attr('opacity', 0)
        .transition()
        .delay(2100)
        .duration(300)
        .attr('opacity', 1);

    // Year axis (minimal)
    svg.append('g')
        .attr('transform', `translate(0,${height + 15})`)
        .selectAll('text')
        .data([2008, 2012, 2016, 2020, 2024])
        .join('text')
        .attr('x', d => x(d))
        .attr('text-anchor', 'middle')
        .attr('font-family', fontFamily)
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', colors.textMuted)
        .text(d => d);

    // Tooltips for all points
    svg.selectAll('.hover-area')
        .data(data)
        .join('circle')
        .attr('class', 'hover-area')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.high))
        .attr('r', 15)
        .attr('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            const value = d.low === d.high ? `$${d.high}B` : `$${d.low}B – $${d.high}B`;
            showTooltip(event, `<strong>${d.year}</strong><br>${value}`);
        })
        .on('mouseout', hideTooltip);

    // Source citation - small, gray, below chart
    container.append('div')
        .attr('class', 'chart-source')
        .html('Source: CHSRA Business Plans 2008-2024');
}

// Timeline Chart
function createTimelineChart() {
    const container = d3.select('#timeline-chart');
    if (container.empty()) return;
    
    const containerWidth = container.node().getBoundingClientRect().width;
    
    const margin = {top: 40, right: 80, bottom: 40, left: 90};
    const width = Math.min(containerWidth, 740) - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;
    
    container.selectAll('*').remove();
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [
        {plan: '2008', projected: 2020, label: 'Original promise'},
        {plan: '2012', projected: 2029, label: 'Revised'},
        {plan: '2018', projected: 2033, label: 'Delayed again'},
        {plan: '2024', projected: 2033, label: 'Central Valley only'}
    ];

    // Scales
    const y = d3.scaleBand()
        .domain(data.map(d => d.plan))
        .range([0, height])
        .padding(0.35);

    const x = d3.scaleLinear()
        .domain([2005, 2038])
        .range([0, width]);

    // Subtle gridlines
    svg.append('g')
        .selectAll('line')
        .data([2010, 2020, 2030])
        .join('line')
        .attr('x1', d => x(d))
        .attr('x2', d => x(d))
        .attr('y1', -10)
        .attr('y2', height)
        .attr('stroke', colors.gridline)
        .attr('stroke-width', 1);

    // Original deadline annotation
    svg.append('line')
        .attr('x1', x(2020))
        .attr('x2', x(2020))
        .attr('y1', -25)
        .attr('y2', height + 10)
        .attr('stroke', colors.success)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,4');

    svg.append('text')
        .attr('x', x(2020))
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .attr('font-family', fontFamily)
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', colors.success)
        .text('2020 TARGET');

    // Today marker
    svg.append('line')
        .attr('x1', x(2026))
        .attr('x2', x(2026))
        .attr('y1', -10)
        .attr('y2', height + 10)
        .attr('stroke', colors.red)
        .attr('stroke-width', 2);

    svg.append('text')
        .attr('x', x(2026))
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .attr('font-family', fontFamily)
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .attr('fill', colors.red)
        .text('TODAY');

    // Bars with animation
    svg.selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar chart-bar')
        .attr('y', d => y(d.plan))
        .attr('x', x(2008))
        .attr('width', 0)
        .attr('height', y.bandwidth())
        .attr('fill', (d, i) => i === 0 ? colors.success : colors.red)
        .attr('rx', 3)
        .attr('opacity', (d, i) => i === 0 ? 0.8 : 0.85)
        .transition()
        .duration(800)
        .delay((d, i) => i * 150)
        .ease(d3.easeQuadOut)
        .attr('width', d => x(d.projected) - x(2008));

    // Year labels on bars
    svg.selectAll('.year-label')
        .data(data)
        .join('text')
        .attr('x', d => x(d.projected) - 8)
        .attr('y', d => y(d.plan) + y.bandwidth()/2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('font-family', fontFamily)
        .attr('font-size', '13px')
        .attr('font-weight', '700')
        .attr('fill', 'white')
        .text(d => d.projected)
        .attr('opacity', 0)
        .transition()
        .delay((d, i) => 800 + i * 150)
        .duration(300)
        .attr('opacity', 1);

    // Plan labels (left axis)
    svg.selectAll('.plan-label')
        .data(data)
        .join('text')
        .attr('x', -8)
        .attr('y', d => y(d.plan) + y.bandwidth()/2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('font-family', fontFamily)
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('fill', colors.textSecondary)
        .text(d => d.plan + ' Plan');

    // Direct annotations - 538 style
    svg.selectAll('.plan-note')
        .data(data)
        .join('text')
        .attr('x', d => x(d.projected) + 8)
        .attr('y', d => y(d.plan) + y.bandwidth()/2)
        .attr('dy', '0.35em')
        .attr('font-family', fontFamily)
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('fill', colors.textMuted)
        .text(d => d.label)
        .attr('opacity', 0)
        .transition()
        .delay((d, i) => 1000 + i * 150)
        .duration(300)
        .attr('opacity', 1);

    // Source
    container.append('div')
        .attr('class', 'chart-source')
        .html('Source: CHSRA Business Plans');
}

// Contractor Chart
function createContractorChart() {
    const container = d3.select('#contractor-chart');
    if (container.empty()) return;
    
    const containerWidth = container.node().getBoundingClientRect().width;
    
    const margin = {top: 30, right: 120, bottom: 40, left: 140};
    const width = Math.min(containerWidth, 740) - margin.left - margin.right;
    const height = 220 - margin.top - margin.bottom;
    
    container.selectAll('*').remove();
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [
        {name: 'CP 1 (Tutor Perini)', original: 985, current: 3550, miles: '32 mi'},
        {name: 'CP 2-3 (Dragados)', original: 1365, current: 1800, miles: '65 mi'},
        {name: 'CP 4 (Ferrovial)', original: 455, current: 500, miles: '22 mi'}
    ];

    const y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, height])
        .padding(0.4);

    const x = d3.scaleLinear()
        .domain([0, 4000])
        .range([0, width]);

    // Subtle gridlines
    svg.append('g')
        .selectAll('line')
        .data([1000, 2000, 3000])
        .join('line')
        .attr('x1', d => x(d))
        .attr('x2', d => x(d))
        .attr('y1', -5)
        .attr('y2', height + 5)
        .attr('stroke', colors.gridline)
        .attr('stroke-width', 1);

    // Original bid bars (subtle)
    svg.selectAll('.bar-original')
        .data(data)
        .join('rect')
        .attr('class', 'bar-original')
        .attr('y', d => y(d.name) + y.bandwidth() * 0.1)
        .attr('x', 0)
        .attr('width', 0)
        .attr('height', y.bandwidth() * 0.35)
        .attr('fill', colors.border)
        .attr('rx', 2)
        .transition()
        .duration(600)
        .delay((d, i) => i * 100)
        .attr('width', d => x(d.original));

    // Current value bars
    svg.selectAll('.bar-current')
        .data(data)
        .join('rect')
        .attr('class', 'bar-current chart-bar')
        .attr('y', d => y(d.name) + y.bandwidth() * 0.55)
        .attr('x', 0)
        .attr('width', 0)
        .attr('height', y.bandwidth() * 0.35)
        .attr('fill', colors.red)
        .attr('rx', 2)
        .transition()
        .duration(800)
        .delay((d, i) => 200 + i * 100)
        .attr('width', d => x(d.current));

    // Contract labels
    svg.selectAll('.contract-label')
        .data(data)
        .join('text')
        .attr('x', -8)
        .attr('y', d => y(d.name) + y.bandwidth()/2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('font-family', fontFamily)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('fill', colors.textSecondary)
        .text(d => d.name);

    // Value annotations - 538 style direct labels
    svg.selectAll('.value-current')
        .data(data)
        .join('text')
        .attr('x', d => x(d.current) + 8)
        .attr('y', d => y(d.name) + y.bandwidth() * 0.72)
        .attr('dy', '0.35em')
        .attr('font-family', fontFamily)
        .attr('font-size', '12px')
        .attr('font-weight', '700')
        .attr('fill', colors.red)
        .text(d => '$' + (d.current/1000).toFixed(1) + 'B')
        .attr('opacity', 0)
        .transition()
        .delay((d, i) => 900 + i * 100)
        .duration(300)
        .attr('opacity', 1);

    // Growth percentages
    svg.selectAll('.growth-label')
        .data(data)
        .join('text')
        .attr('x', d => x(d.current) + 55)
        .attr('y', d => y(d.name) + y.bandwidth() * 0.72)
        .attr('dy', '0.35em')
        .attr('font-family', fontFamily)
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', colors.textMuted)
        .text(d => {
            const growth = Math.round((d.current - d.original) / d.original * 100);
            return '+' + growth + '%';
        })
        .attr('opacity', 0)
        .transition()
        .delay((d, i) => 1100 + i * 100)
        .duration(300)
        .attr('opacity', 1);

    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(0, ${height + 25})`);

    legend.append('rect')
        .attr('width', 16)
        .attr('height', 8)
        .attr('fill', colors.border)
        .attr('rx', 2);

    legend.append('text')
        .attr('x', 22)
        .attr('y', 7)
        .attr('font-family', fontFamily)
        .attr('font-size', '10px')
        .attr('fill', colors.textMuted)
        .text('Original bid');

    legend.append('rect')
        .attr('x', 100)
        .attr('width', 16)
        .attr('height', 8)
        .attr('fill', colors.red)
        .attr('rx', 2);

    legend.append('text')
        .attr('x', 122)
        .attr('y', 7)
        .attr('font-family', fontFamily)
        .attr('font-size', '10px')
        .attr('fill', colors.textMuted)
        .text('Current value');

    // Source
    container.append('div')
        .attr('class', 'chart-source')
        .html('Source: CHSRA contract data, LA Times');
}

// Route Map
function createRouteMap() {
    const container = d3.select('#route-map');
    if (container.empty()) return;
    
    const containerWidth = container.node().getBoundingClientRect().width;
    const height = 500;
    
    container.selectAll('svg').remove();
    
    const svg = container.append('svg')
        .attr('width', containerWidth)
        .attr('height', height);

    // Simplified route visualization
    const segments = [
        {name: 'San Francisco', y: 60, status: 'planned'},
        {name: 'San Jose', y: 100, status: 'planned'},
        {name: 'Gilroy', y: 140, status: 'design'},
        {name: 'Merced', y: 190, status: 'design'},
        {name: 'Madera', y: 230, status: 'progress'},
        {name: 'Fresno', y: 280, status: 'complete'},
        {name: 'Kings/Tulare', y: 330, status: 'complete'},
        {name: 'Bakersfield', y: 380, status: 'progress'},
        {name: 'Palmdale', y: 430, status: 'planned'},
        {name: 'Los Angeles', y: 475, status: 'planned'}
    ];

    const routeX = containerWidth / 2;

    const statusColors = {
        complete: colors.success,
        progress: colors.warning,
        design: colors.blue,
        planned: '#CCCCCC'
    };

    // Draw route segments with animation
    for (let i = 0; i < segments.length - 1; i++) {
        const current = segments[i];
        const next = segments[i + 1];
        
        svg.append('line')
            .attr('x1', routeX)
            .attr('y1', current.y)
            .attr('x2', routeX)
            .attr('y2', current.y)
            .attr('stroke', statusColors[next.status])
            .attr('stroke-width', 5)
            .attr('stroke-linecap', 'round')
            .transition()
            .duration(400)
            .delay(i * 80)
            .attr('y2', next.y);
    }

    // Station dots
    segments.forEach((segment, i) => {
        const g = svg.append('g')
            .attr('transform', `translate(${routeX}, ${segment.y})`)
            .attr('opacity', 0);

        g.append('circle')
            .attr('r', 8)
            .attr('fill', statusColors[segment.status])
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        g.append('text')
            .attr('x', 20)
            .attr('dy', '0.35em')
            .attr('font-family', fontFamily)
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .attr('fill', colors.textSecondary)
            .text(segment.name);

        g.transition()
            .duration(300)
            .delay(i * 80 + 200)
            .attr('opacity', 1);
    });

    // IOS bracket annotation
    const iosGroup = svg.append('g')
        .attr('opacity', 0);

    iosGroup.append('rect')
        .attr('x', routeX - 45)
        .attr('y', 185)
        .attr('width', 4)
        .attr('height', 200)
        .attr('fill', colors.red)
        .attr('rx', 2);

    iosGroup.append('text')
        .attr('x', routeX - 55)
        .attr('y', 285)
        .attr('font-family', fontFamily)
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', colors.red)
        .attr('text-anchor', 'end')
        .attr('transform', `rotate(-90, ${routeX - 55}, 285)`)
        .text('FUNDED: 171 miles');

    iosGroup.transition()
        .duration(400)
        .delay(1200)
        .attr('opacity', 1);
}

// Tooltip functions
function showTooltip(event, html) {
    let tooltip = d3.select('.tooltip');
    
    if (tooltip.empty()) {
        tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
    }
    
    tooltip.html(html)
        .style('left', (event.pageX + 12) + 'px')
        .style('top', (event.pageY - 8) + 'px')
        .transition()
        .duration(150)
        .style('opacity', 1);
}

function hideTooltip() {
    d3.select('.tooltip')
        .transition()
        .duration(200)
        .style('opacity', 0);
}

// Responsive resize with debounce
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        createCostChart();
        createTimelineChart();
        createContractorChart();
        createRouteMap();
    }, 250);
});
