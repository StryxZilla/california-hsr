// California High-Speed Rail Data Visualization Charts
// Using D3.js v7

document.addEventListener('DOMContentLoaded', function() {
    createCostChart();
    createTimelineChart();
    createContractorChart();
    createRouteMap();
});

// Color palette
const colors = {
    primary: '#ED1C24',
    secondary: '#0066CC',
    success: '#28A745',
    warning: '#FFC107',
    danger: '#DC3545',
    gray: '#666666',
    lightGray: '#E5E5E5'
};

// Cost Evolution Chart
function createCostChart() {
    const container = d3.select('#cost-chart');
    const containerWidth = container.node().getBoundingClientRect().width;
    
    const margin = {top: 40, right: 40, bottom: 60, left: 80};
    const width = containerWidth - margin.left - margin.right - 40;
    const height = 400 - margin.top - margin.bottom;
    
    // Clear previous
    container.selectAll('svg').remove();
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Data: Cost estimates over time (Phase 1)
    const data = [
        {year: 2008, low: 33, high: 33, label: 'Prop 1A Estimate', source: 'Proposition 1A ballot'},
        {year: 2009, low: 42.6, high: 42.6, label: '2009 Business Plan', source: '2009 CHSRA Business Plan'},
        {year: 2011, low: 65.4, high: 65.4, label: '2011 Business Plan', source: '2011 CHSRA Business Plan'},
        {year: 2012, low: 68.4, high: 68.4, label: '2012 Business Plan', source: '2012 CHSRA Business Plan'},
        {year: 2014, low: 67.6, high: 67.6, label: '2014 Business Plan', source: '2014 CHSRA Business Plan'},
        {year: 2016, low: 64.2, high: 64.2, label: '2016 Business Plan', source: '2016 CHSRA Business Plan'},
        {year: 2018, low: 77.3, high: 77.3, label: '2018 Business Plan', source: '2018 CHSRA Business Plan'},
        {year: 2020, low: 80.3, high: 80.3, label: '2020 Business Plan', source: '2020 CHSRA Business Plan'},
        {year: 2022, low: 88.5, high: 105, label: '2022 Business Plan', source: '2022 CHSRA Business Plan'},
        {year: 2024, low: 89, high: 128, label: '2024 Business Plan', source: '2024 CHSRA Business Plan'}
    ];

    // Scales
    const x = d3.scaleLinear()
        .domain([2007, 2025])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, 140])
        .range([height, 0]);

    // Grid lines
    svg.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(y.ticks(7))
        .join('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => y(d))
        .attr('y2', d => y(d))
        .attr('stroke', colors.lightGray)
        .attr('stroke-dasharray', '3,3');

    // Original estimate line
    svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(33))
        .attr('y2', y(33))
        .attr('stroke', colors.success)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8,4');

    svg.append('text')
        .attr('x', width - 5)
        .attr('y', y(33) - 8)
        .attr('text-anchor', 'end')
        .attr('font-size', '12px')
        .attr('fill', colors.success)
        .attr('font-family', 'Roboto Mono')
        .text('Original Voter-Approved: $33B');

    // Area for range (2022+)
    const areaData = data.filter(d => d.high !== d.low);
    const area = d3.area()
        .x(d => x(d.year))
        .y0(d => y(d.low))
        .y1(d => y(d.high))
        .curve(d3.curveMonotoneX);

    svg.append('path')
        .datum(areaData)
        .attr('fill', colors.primary)
        .attr('fill-opacity', 0.2)
        .attr('d', area);

    // Line - high
    const lineHigh = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.high))
        .curve(d3.curveMonotoneX);

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colors.primary)
        .attr('stroke-width', 3)
        .attr('d', lineHigh);

    // Line - low (only where different)
    const lineLow = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.low))
        .curve(d3.curveMonotoneX);

    svg.append('path')
        .datum(data.filter(d => d.year >= 2022))
        .attr('fill', 'none')
        .attr('stroke', colors.primary)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,3')
        .attr('d', lineLow);

    // Data points
    svg.selectAll('.data-point')
        .data(data)
        .join('circle')
        .attr('class', 'data-point')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.high))
        .attr('r', 6)
        .attr('fill', colors.primary)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            showTooltip(event, `${d.year}: $${d.low === d.high ? d.high + 'B' : d.low + 'B - $' + d.high + 'B'}<br>${d.label}`);
        })
        .on('mouseout', hideTooltip);

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(9))
        .call(g => g.select('.domain').attr('stroke', colors.lightGray));

    svg.append('g')
        .call(d3.axisLeft(y).tickFormat(d => '$' + d + 'B'))
        .call(g => g.select('.domain').attr('stroke', colors.lightGray));

    // Annotations
    svg.append('text')
        .attr('x', x(2024))
        .attr('y', y(128) - 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', colors.primary)
        .text('$128B');

    svg.append('text')
        .attr('x', x(2008))
        .attr('y', y(33) + 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', colors.gray)
        .text('$33B');
}

// Timeline Chart
function createTimelineChart() {
    const container = d3.select('#timeline-chart');
    const containerWidth = container.node().getBoundingClientRect().width;
    
    const margin = {top: 40, right: 40, bottom: 60, left: 120};
    const width = containerWidth - margin.left - margin.right - 40;
    const height = 350 - margin.top - margin.bottom;
    
    container.selectAll('svg').remove();
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Data: When each business plan said completion would happen
    const data = [
        {plan: '2008 Plan', projected: 2020, label: 'Original Promise'},
        {plan: '2012 Plan', projected: 2029, label: 'SF-LA Service'},
        {plan: '2016 Plan', projected: 2029, label: 'Phase 1 Blended'},
        {plan: '2018 Plan', projected: 2033, label: 'SF-LA Service'},
        {plan: '2020 Plan', projected: 2033, label: 'SF-LA Service'},
        {plan: '2024 Plan', projected: 2033, label: 'IOS Only (Merced-Bakersfield)'},
    ];

    // Scales
    const y = d3.scaleBand()
        .domain(data.map(d => d.plan))
        .range([0, height])
        .padding(0.3);

    const x = d3.scaleLinear()
        .domain([2008, 2040])
        .range([0, width]);

    // Grid
    svg.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(x.ticks(8))
        .join('line')
        .attr('x1', d => x(d))
        .attr('x2', d => x(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', colors.lightGray)
        .attr('stroke-dasharray', '3,3');

    // Original deadline line
    svg.append('line')
        .attr('x1', x(2020))
        .attr('x2', x(2020))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', colors.success)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8,4');

    svg.append('text')
        .attr('x', x(2020))
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', colors.success)
        .attr('font-family', 'Roboto Mono')
        .text('Original 2020 Target');

    // Today line
    svg.append('line')
        .attr('x1', x(2026))
        .attr('x2', x(2026))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', colors.secondary)
        .attr('stroke-width', 2);

    svg.append('text')
        .attr('x', x(2026))
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', colors.secondary)
        .attr('font-family', 'Roboto Mono')
        .text('TODAY');

    // Bars
    svg.selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar chart-bar')
        .attr('y', d => y(d.plan))
        .attr('x', d => x(2008))
        .attr('width', d => x(d.projected) - x(2008))
        .attr('height', y.bandwidth())
        .attr('fill', (d, i) => i === 0 ? colors.success : colors.primary)
        .attr('rx', 4)
        .on('mouseover', function(event, d) {
            showTooltip(event, `${d.plan}: Projected ${d.projected}<br>${d.label}`);
        })
        .on('mouseout', hideTooltip);

    // Year labels on bars
    svg.selectAll('.year-label')
        .data(data)
        .join('text')
        .attr('x', d => x(d.projected) - 5)
        .attr('y', d => y(d.plan) + y.bandwidth()/2 + 5)
        .attr('text-anchor', 'end')
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'Roboto Mono')
        .attr('fill', 'white')
        .text(d => d.projected);

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(8))
        .call(g => g.select('.domain').attr('stroke', colors.lightGray));

    svg.append('g')
        .call(d3.axisLeft(y))
        .call(g => g.select('.domain').remove())
        .selectAll('text')
        .attr('font-size', '12px');
}

// Contractor Chart
function createContractorChart() {
    const container = d3.select('#contractor-chart');
    const containerWidth = container.node().getBoundingClientRect().width;
    
    const margin = {top: 40, right: 40, bottom: 60, left: 100};
    const width = containerWidth - margin.left - margin.right - 40;
    const height = 300 - margin.top - margin.bottom;
    
    container.selectAll('svg').remove();
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [
        {name: 'CP 1 (Tutor Perini)', original: 985, current: 3550, miles: 32},
        {name: 'CP 2-3 (Dragados)', original: 1365, current: 1800, miles: 65},  // Estimated current
        {name: 'CP 4 (Ferrovial)', original: 455, current: 500, miles: 22}  // Including utilities
    ];

    const y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, height])
        .padding(0.4);

    const x = d3.scaleLinear()
        .domain([0, 4000])
        .range([0, width]);

    // Grid
    svg.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(x.ticks(8))
        .join('line')
        .attr('x1', d => x(d))
        .attr('x2', d => x(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', colors.lightGray)
        .attr('stroke-dasharray', '3,3');

    // Original bars
    svg.selectAll('.bar-original')
        .data(data)
        .join('rect')
        .attr('class', 'bar-original')
        .attr('y', d => y(d.name))
        .attr('x', 0)
        .attr('width', d => x(d.original))
        .attr('height', y.bandwidth() / 2)
        .attr('fill', colors.secondary)
        .attr('rx', 3);

    // Current bars
    svg.selectAll('.bar-current')
        .data(data)
        .join('rect')
        .attr('class', 'bar-current chart-bar')
        .attr('y', d => y(d.name) + y.bandwidth() / 2)
        .attr('x', 0)
        .attr('width', d => x(d.current))
        .attr('height', y.bandwidth() / 2)
        .attr('fill', colors.primary)
        .attr('rx', 3)
        .on('mouseover', function(event, d) {
            const growth = ((d.current - d.original) / d.original * 100).toFixed(0);
            showTooltip(event, `${d.name}<br>Original: $${d.original}M<br>Current: $${d.current}M<br>Growth: +${growth}%`);
        })
        .on('mouseout', hideTooltip);

    // Value labels
    svg.selectAll('.value-original')
        .data(data)
        .join('text')
        .attr('x', d => x(d.original) + 5)
        .attr('y', d => y(d.name) + y.bandwidth() / 4 + 4)
        .attr('font-size', '11px')
        .attr('font-family', 'Roboto Mono')
        .attr('fill', colors.secondary)
        .text(d => '$' + d.original + 'M');

    svg.selectAll('.value-current')
        .data(data)
        .join('text')
        .attr('x', d => x(d.current) + 5)
        .attr('y', d => y(d.name) + y.bandwidth() * 0.75 + 4)
        .attr('font-size', '11px')
        .attr('font-family', 'Roboto Mono')
        .attr('font-weight', 'bold')
        .attr('fill', colors.primary)
        .text(d => '$' + d.current + 'M');

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => '$' + d/1000 + 'B').ticks(8))
        .call(g => g.select('.domain').attr('stroke', colors.lightGray));

    svg.append('g')
        .call(d3.axisLeft(y))
        .call(g => g.select('.domain').remove())
        .selectAll('text')
        .attr('font-size', '11px');

    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 150}, -25)`);

    legend.append('rect')
        .attr('width', 15)
        .attr('height', 10)
        .attr('fill', colors.secondary);
    legend.append('text')
        .attr('x', 20)
        .attr('y', 9)
        .attr('font-size', '11px')
        .text('Original Bid');

    legend.append('rect')
        .attr('x', 90)
        .attr('width', 15)
        .attr('height', 10)
        .attr('fill', colors.primary);
    legend.append('text')
        .attr('x', 110)
        .attr('y', 9)
        .attr('font-size', '11px')
        .text('Current');
}

// Route Map (Simplified visualization)
function createRouteMap() {
    const container = d3.select('#route-map');
    const containerWidth = container.node().getBoundingClientRect().width;
    const height = 500;
    
    container.selectAll('svg').remove();
    
    const svg = container.append('svg')
        .attr('width', containerWidth)
        .attr('height', height);

    // Simplified California outline path
    const californiaPath = "M50,50 L120,30 L180,60 L200,150 L220,200 L200,280 L180,350 L150,420 L100,450 L80,400 L60,300 L50,200 Z";

    // Draw simplified state outline
    svg.append('path')
        .attr('d', californiaPath)
        .attr('fill', '#f0f0f0')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2)
        .attr('transform', `translate(${containerWidth/2 - 250}, 0) scale(2.5)`);

    // Route segments (approximate positions)
    const segments = [
        {name: 'San Francisco', y: 120, status: 'planned', label: 'SF'},
        {name: 'San Jose', y: 180, status: 'planned', label: 'San Jose'},
        {name: 'Gilroy', y: 220, status: 'design', label: 'Gilroy'},
        {name: 'Merced', y: 260, status: 'design', label: 'Merced'},
        {name: 'Madera', y: 290, status: 'progress', label: 'Madera'},
        {name: 'Fresno', y: 320, status: 'complete', label: 'Fresno'},
        {name: 'Kings/Tulare', y: 360, status: 'complete', label: 'Hanford'},
        {name: 'Bakersfield', y: 410, status: 'design', label: 'Bakersfield'},
        {name: 'Palmdale', y: 460, status: 'planned', label: 'Palmdale'},
        {name: 'Los Angeles', y: 500, status: 'planned', label: 'LA'}
    ];

    const routeX = containerWidth / 2 + 50;

    // Draw route line segments
    const statusColors = {
        complete: colors.success,
        progress: colors.warning,
        design: colors.secondary,
        planned: colors.lightGray
    };

    for (let i = 0; i < segments.length - 1; i++) {
        const current = segments[i];
        const next = segments[i + 1];
        
        svg.append('line')
            .attr('x1', routeX)
            .attr('y1', current.y)
            .attr('x2', routeX)
            .attr('y2', next.y)
            .attr('stroke', statusColors[next.status])
            .attr('stroke-width', 6)
            .attr('stroke-linecap', 'round');
    }

    // Draw station dots
    segments.forEach(segment => {
        svg.append('circle')
            .attr('cx', routeX)
            .attr('cy', segment.y)
            .attr('r', 10)
            .attr('fill', statusColors[segment.status])
            .attr('stroke', 'white')
            .attr('stroke-width', 3);

        svg.append('text')
            .attr('x', routeX + 25)
            .attr('y', segment.y + 5)
            .attr('font-size', '13px')
            .attr('font-family', 'Source Sans Pro')
            .attr('fill', '#333')
            .text(segment.label);
    });

    // IOS bracket
    svg.append('rect')
        .attr('x', routeX - 50)
        .attr('y', 255)
        .attr('width', 5)
        .attr('height', 160)
        .attr('fill', colors.primary)
        .attr('rx', 2);

    svg.append('text')
        .attr('x', routeX - 70)
        .attr('y', 335)
        .attr('font-size', '12px')
        .attr('font-family', 'Roboto Mono')
        .attr('fill', colors.primary)
        .attr('text-anchor', 'end')
        .attr('transform', `rotate(-90, ${routeX - 70}, 335)`)
        .text('Initial Operating Segment (171 mi)');
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
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
}

function hideTooltip() {
    d3.select('.tooltip')
        .transition()
        .duration(300)
        .style('opacity', 0);
}

// Responsive resize
window.addEventListener('resize', function() {
    createCostChart();
    createTimelineChart();
    createContractorChart();
    createRouteMap();
});
