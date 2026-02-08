// California HSR — Data Visualizations
// D3.js v7, high-end style

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (id === 'cost-chart' && !entry.target.dataset.rendered) { entry.target.dataset.rendered = '1'; createCostChart(); }
                if (id === 'global-chart' && !entry.target.dataset.rendered) { entry.target.dataset.rendered = '1'; createGlobalChart(); }
                if (id === 'timeline-chart' && !entry.target.dataset.rendered) { entry.target.dataset.rendered = '1'; createTimelineChart(); }
                if (id === 'route-map' && !entry.target.dataset.rendered) { entry.target.dataset.rendered = '1'; createRouteMap(); }
                if (id === 'contractor-chart' && !entry.target.dataset.rendered) { entry.target.dataset.rendered = '1'; createContractorChart(); }
                if (id === 'spending-chart' && !entry.target.dataset.rendered) { entry.target.dataset.rendered = '1'; createSpendingChart(); }
                if (id === 'funding-chart' && !entry.target.dataset.rendered) { entry.target.dataset.rendered = '1'; createFundingChart(); }
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('#cost-chart, #global-chart, #timeline-chart, #route-map, #contractor-chart, #spending-chart, #funding-chart').forEach(el => observer.observe(el));
});

const C = {
    red: '#e03131', redLight: 'rgba(224,49,49,0.15)', amber: '#f59f00', green: '#37b24d',
    blue: '#228be6', ink: '#0a0a0a', ink60: '#666', ink40: '#999', ink20: '#ccc', ink10: '#e5e5e5',
    white: '#fff', whiteA: 'rgba(255,255,255,'
};
const F = "'DM Sans', system-ui, sans-serif";
const FM = "'JetBrains Mono', monospace";

function dims(container, m) {
    const w = container.node().getBoundingClientRect().width;
    return {
        W: w, w: w - m.l - m.r,
        h: m.h - m.t - m.b,
        ...m
    };
}

// ===== COST CHART =====
function createCostChart() {
    const el = d3.select('#cost-chart');
    if (el.empty()) return;
    el.selectAll('*').remove();
    
    const d = dims(el, { t: 40, r: 70, b: 40, l: 50, h: 400 });
    const svg = el.append('svg').attr('width', d.W).attr('height', d.h + d.t + d.b)
        .append('g').attr('transform', `translate(${d.l},${d.t})`);

    const data = [
        { year: 2008, low: 33, high: 33 }, { year: 2009, low: 42.6, high: 42.6 },
        { year: 2011, low: 65.4, high: 65.4 }, { year: 2012, low: 68.4, high: 68.4 },
        { year: 2014, low: 67.6, high: 67.6 }, { year: 2016, low: 64.2, high: 64.2 },
        { year: 2018, low: 77.3, high: 77.3 }, { year: 2020, low: 80.3, high: 80.3 },
        { year: 2022, low: 88.5, high: 105 }, { year: 2024, low: 89, high: 128 }
    ];

    const x = d3.scaleLinear().domain([2007, 2025.5]).range([0, d.w]);
    const y = d3.scaleLinear().domain([0, 145]).range([d.h, 0]);

    // Grid
    [25, 50, 75, 100, 125].forEach(v => {
        svg.append('line').attr('x1', 0).attr('x2', d.w).attr('y1', y(v)).attr('y2', y(v))
            .attr('stroke', C.ink10).attr('stroke-width', 1);
        svg.append('text').attr('x', -8).attr('y', y(v)).attr('dy', '.35em').attr('text-anchor', 'end')
            .attr('font-family', FM).attr('font-size', '10px').attr('fill', C.ink40).text('$' + v + 'B');
    });

    // X axis
    [2008, 2012, 2016, 2020, 2024].forEach(yr => {
        svg.append('text').attr('x', x(yr)).attr('y', d.h + 24).attr('text-anchor', 'middle')
            .attr('font-family', FM).attr('font-size', '10px').attr('fill', C.ink40).text(yr);
    });

    // Original estimate line
    svg.append('line').attr('x1', 0).attr('x2', d.w).attr('y1', y(33)).attr('y2', y(33))
        .attr('stroke', C.green).attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4').attr('opacity', 0.6);
    svg.append('text').attr('x', d.w + 6).attr('y', y(33)).attr('dy', '.35em')
        .attr('font-family', F).attr('font-size', '11px').attr('font-weight', '600').attr('fill', C.green).text('$33B');

    // Range area
    const rangeData = data.filter(p => p.high !== p.low);
    svg.append('path').datum(rangeData)
        .attr('fill', C.redLight)
        .attr('d', d3.area().x(p => x(p.year)).y0(p => y(p.low)).y1(p => y(p.high)).curve(d3.curveMonotoneX));

    // Low line dashed
    svg.append('path').datum(data.filter(p => p.year >= 2022))
        .attr('fill', 'none').attr('stroke', C.red).attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4').attr('opacity', 0.4)
        .attr('d', d3.line().x(p => x(p.year)).y(p => y(p.low)).curve(d3.curveMonotoneX));

    // Main line
    const line = d3.line().x(p => x(p.year)).y(p => y(p.high)).curve(d3.curveMonotoneX);
    const path = svg.append('path').datum(data)
        .attr('fill', 'none').attr('stroke', C.red).attr('stroke-width', 2.5).attr('d', line);
    const len = path.node().getTotalLength();
    path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
        .transition().duration(1400).ease(d3.easeQuadOut).attr('stroke-dashoffset', 0);

    // Key points
    [0, 3, 6, 9].forEach((i, idx) => {
        const p = data[i];
        svg.append('circle').attr('cx', x(p.year)).attr('cy', y(p.high)).attr('r', 0)
            .attr('fill', C.red).attr('stroke', C.white).attr('stroke-width', 2)
            .transition().delay(1400 + idx * 80).duration(250).attr('r', 4);
    });

    // End label
    svg.append('text').attr('x', x(2024)).attr('y', y(128) - 14).attr('text-anchor', 'middle')
        .attr('font-family', FM).attr('font-size', '18px').attr('font-weight', '700').attr('fill', C.red)
        .text('$128B').attr('opacity', 0).transition().delay(1600).duration(300).attr('opacity', 1);

    el.append('div').attr('class', 'chart-source').text('Source: CHSRA Business Plans 2008–2024');
}

// ===== GLOBAL COMPARISON =====
function createGlobalChart() {
    const el = d3.select('#global-chart');
    if (el.empty()) return;
    el.selectAll('*').remove();

    const data = [
        { name: 'California HSR', cost: 257, color: C.red },
        { name: 'UK HS2 (Phase 1)', cost: 170, color: C.ink40 },
        { name: 'France TGV Med', cost: 29, color: C.ink40 },
        { name: 'Spain AVE', cost: 32, color: C.ink40 },
        { name: 'Japan Shinkansen ext.', cost: 25, color: C.ink40 },
        { name: 'China HSR (avg)', cost: 17, color: C.ink40 },
        { name: 'Morocco Al Boraq', cost: 14, color: C.ink40 }
    ];

    const d = dims(el, { t: 10, r: 100, b: 20, l: 160, h: 300 });
    const svg = el.append('svg').attr('width', d.W).attr('height', d.h + d.t + d.b)
        .append('g').attr('transform', `translate(${d.l},${d.t})`);

    const y = d3.scaleBand().domain(data.map(p => p.name)).range([0, d.h]).padding(0.35);
    const x = d3.scaleLinear().domain([0, 280]).range([0, d.w]);

    data.forEach((p, i) => {
        svg.append('rect').attr('y', y(p.name)).attr('x', 0).attr('width', 0).attr('height', y.bandwidth())
            .attr('fill', p.color).attr('rx', 3).attr('opacity', p.name === 'California HSR' ? 1 : 0.35)
            .transition().duration(700).delay(i * 60).ease(d3.easeQuadOut).attr('width', x(p.cost));

        svg.append('text').attr('x', -8).attr('y', y(p.name) + y.bandwidth() / 2).attr('dy', '.35em')
            .attr('text-anchor', 'end').attr('font-family', F).attr('font-size', '12px')
            .attr('font-weight', p.name === 'California HSR' ? '600' : '400')
            .attr('fill', C.whiteA + '0.7)').text(p.name);

        svg.append('text').attr('x', x(p.cost) + 8).attr('y', y(p.name) + y.bandwidth() / 2).attr('dy', '.35em')
            .attr('font-family', FM).attr('font-size', '12px').attr('font-weight', '600')
            .attr('fill', p.name === 'California HSR' ? C.red : C.whiteA + '0.5)')
            .text('$' + p.cost + 'M/mi')
            .attr('opacity', 0).transition().delay(700 + i * 60).duration(200).attr('opacity', 1);
    });

    el.append('div').attr('class', 'chart-source').text('Sources: Various; inflation-adjusted estimates. Comparisons are approximate.');
}

// ===== TIMELINE CHART =====
function createTimelineChart() {
    const el = d3.select('#timeline-chart');
    if (el.empty()) return;
    el.selectAll('*').remove();

    const data = [
        { plan: '2008', projected: 2020, label: 'Original promise' },
        { plan: '2012', projected: 2029, label: 'Revised' },
        { plan: '2018', projected: 2033, label: 'Delayed again' },
        { plan: '2024', projected: 2033, label: 'Central Valley only' }
    ];

    const d = dims(el, { t: 35, r: 80, b: 30, l: 80, h: 280 });
    const svg = el.append('svg').attr('width', d.W).attr('height', d.h + d.t + d.b)
        .append('g').attr('transform', `translate(${d.l},${d.t})`);

    const y = d3.scaleBand().domain(data.map(p => p.plan)).range([0, d.h]).padding(0.35);
    const x = d3.scaleLinear().domain([2006, 2037]).range([0, d.w]);

    // 2020 target
    svg.append('line').attr('x1', x(2020)).attr('x2', x(2020)).attr('y1', -20).attr('y2', d.h + 5)
        .attr('stroke', C.green).attr('stroke-width', 1.5).attr('stroke-dasharray', '5,3');
    svg.append('text').attr('x', x(2020)).attr('y', -25).attr('text-anchor', 'middle')
        .attr('font-family', FM).attr('font-size', '9px').attr('font-weight', '600').attr('fill', C.green).text('TARGET');

    // Today
    svg.append('line').attr('x1', x(2026)).attr('x2', x(2026)).attr('y1', -20).attr('y2', d.h + 5)
        .attr('stroke', C.red).attr('stroke-width', 2);
    svg.append('text').attr('x', x(2026)).attr('y', -25).attr('text-anchor', 'middle')
        .attr('font-family', FM).attr('font-size', '9px').attr('font-weight', '700').attr('fill', C.red).text('TODAY');

    data.forEach((p, i) => {
        const clr = i === 0 ? C.green : C.red;
        svg.append('rect').attr('y', y(p.plan)).attr('x', x(2008)).attr('width', 0).attr('height', y.bandwidth())
            .attr('fill', clr).attr('rx', 3).attr('opacity', 0.85)
            .transition().duration(700).delay(i * 120).ease(d3.easeQuadOut).attr('width', x(p.projected) - x(2008));

        svg.append('text').attr('x', -8).attr('y', y(p.plan) + y.bandwidth() / 2).attr('dy', '.35em')
            .attr('text-anchor', 'end').attr('font-family', FM).attr('font-size', '12px')
            .attr('font-weight', '500').attr('fill', C.ink60).text(p.plan + ' Plan');

        svg.append('text').attr('x', x(p.projected) - 6).attr('y', y(p.plan) + y.bandwidth() / 2).attr('dy', '.35em')
            .attr('text-anchor', 'end').attr('font-family', FM).attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', C.white).text(p.projected)
            .attr('opacity', 0).transition().delay(700 + i * 120).duration(200).attr('opacity', 1);

        svg.append('text').attr('x', x(p.projected) + 8).attr('y', y(p.plan) + y.bandwidth() / 2).attr('dy', '.35em')
            .attr('font-family', F).attr('font-size', '10px').attr('fill', C.ink40).text(p.label)
            .attr('opacity', 0).transition().delay(800 + i * 120).duration(200).attr('opacity', 1);
    });

    el.append('div').attr('class', 'chart-source').text('Source: CHSRA Business Plans');
}

// ===== ROUTE MAP =====
function createRouteMap() {
    const el = d3.select('#route-map');
    if (el.empty()) return;
    el.selectAll('*').remove();

    const w = el.node().getBoundingClientRect().width;
    const h = 480;
    const svg = el.append('svg').attr('width', w).attr('height', h);

    const stations = [
        { name: 'San Francisco', y: 40, status: 'planned' },
        { name: 'San Jose', y: 80, status: 'planned' },
        { name: 'Gilroy', y: 120, status: 'design' },
        { name: 'Merced', y: 170, status: 'design' },
        { name: 'Madera', y: 210, status: 'progress' },
        { name: 'Fresno', y: 260, status: 'complete' },
        { name: 'Kings/Tulare', y: 310, status: 'complete' },
        { name: 'Bakersfield', y: 360, status: 'progress' },
        { name: 'Palmdale', y: 410, status: 'planned' },
        { name: 'Los Angeles', y: 450, status: 'planned' }
    ];

    const cx = w / 2;
    const sCol = { complete: C.green, progress: C.amber, design: C.blue, planned: 'rgba(255,255,255,0.15)' };

    // Segments
    for (let i = 0; i < stations.length - 1; i++) {
        const s = stations[i], n = stations[i + 1];
        svg.append('line').attr('x1', cx).attr('y1', s.y).attr('x2', cx).attr('y2', s.y)
            .attr('stroke', sCol[n.status]).attr('stroke-width', 4).attr('stroke-linecap', 'round')
            .transition().duration(350).delay(i * 60).attr('y2', n.y);
    }

    // Stations
    stations.forEach((s, i) => {
        const g = svg.append('g').attr('transform', `translate(${cx},${s.y})`).attr('opacity', 0);
        g.append('circle').attr('r', 6).attr('fill', sCol[s.status]).attr('stroke', C.whiteA + '0.3)').attr('stroke-width', 2);
        g.append('text').attr('x', 16).attr('dy', '.35em')
            .attr('font-family', F).attr('font-size', '12px').attr('font-weight', '500')
            .attr('fill', C.whiteA + '0.7)').text(s.name);
        g.transition().delay(i * 60 + 150).duration(250).attr('opacity', 1);
    });

    // IOS bracket
    const br = svg.append('g').attr('opacity', 0);
    br.append('rect').attr('x', cx - 35).attr('y', 165).attr('width', 3).attr('height', 200).attr('fill', C.red).attr('rx', 1.5);
    br.append('text').attr('x', cx - 45).attr('y', 265).attr('font-family', FM).attr('font-size', '10px')
        .attr('font-weight', '600').attr('fill', C.red).attr('text-anchor', 'end')
        .attr('transform', `rotate(-90, ${cx - 45}, 265)`).text('FUNDED SEGMENT · 171 mi');
    br.transition().delay(800).duration(300).attr('opacity', 1);

    // Legend
    const leg = svg.append('g').attr('transform', `translate(${cx + 80}, 40)`);
    [['Complete', C.green], ['Under construction', C.amber], ['In design', C.blue], ['Not funded', 'rgba(255,255,255,0.15)']].forEach(([label, color], i) => {
        const g = leg.append('g').attr('transform', `translate(0, ${i * 22})`);
        g.append('rect').attr('width', 16).attr('height', 3).attr('y', 4).attr('fill', color).attr('rx', 1.5);
        g.append('text').attr('x', 22).attr('dy', '.7em').attr('font-family', F).attr('font-size', '10px').attr('fill', C.whiteA + '0.4)').text(label);
    });
}

// ===== CONTRACTOR CHART =====
function createContractorChart() {
    const el = d3.select('#contractor-chart');
    if (el.empty()) return;
    el.selectAll('*').remove();

    const data = [
        { name: 'CP 1 · Tutor Perini', bid: 985, current: 3550, miles: 32 },
        { name: 'CP 2-3 · Dragados', bid: 1365, current: 1800, miles: 65 },
        { name: 'CP 4 · Ferrovial', bid: 455, current: 500, miles: 22 }
    ];

    const d = dims(el, { t: 20, r: 110, b: 30, l: 150, h: 240 });
    const svg = el.append('svg').attr('width', d.W).attr('height', d.h + d.t + d.b)
        .append('g').attr('transform', `translate(${d.l},${d.t})`);

    const y = d3.scaleBand().domain(data.map(p => p.name)).range([0, d.h]).padding(0.3);
    const x = d3.scaleLinear().domain([0, 4000]).range([0, d.w]);

    data.forEach((p, i) => {
        // Bid bar
        svg.append('rect').attr('y', y(p.name)).attr('x', 0).attr('width', 0)
            .attr('height', y.bandwidth() * 0.4).attr('fill', C.ink20).attr('rx', 2)
            .transition().duration(500).delay(i * 80).attr('width', x(p.bid));

        // Current bar
        svg.append('rect').attr('y', y(p.name) + y.bandwidth() * 0.5).attr('x', 0).attr('width', 0)
            .attr('height', y.bandwidth() * 0.4).attr('fill', C.red).attr('rx', 2)
            .transition().duration(700).delay(i * 80 + 100).attr('width', x(p.current));

        // Label
        svg.append('text').attr('x', -8).attr('y', y(p.name) + y.bandwidth() / 2).attr('dy', '.35em')
            .attr('text-anchor', 'end').attr('font-family', F).attr('font-size', '12px')
            .attr('font-weight', '500').attr('fill', C.ink60).text(p.name);

        // Value + growth
        const growth = Math.round((p.current - p.bid) / p.bid * 100);
        svg.append('text').attr('x', x(p.current) + 8).attr('y', y(p.name) + y.bandwidth() * 0.7).attr('dy', '.35em')
            .attr('font-family', FM).attr('font-size', '12px').attr('font-weight', '600').attr('fill', C.red)
            .text('$' + (p.current / 1000).toFixed(1) + 'B')
            .attr('opacity', 0).transition().delay(800 + i * 80).duration(200).attr('opacity', 1);

        svg.append('text').attr('x', x(p.current) + 60).attr('y', y(p.name) + y.bandwidth() * 0.7).attr('dy', '.35em')
            .attr('font-family', FM).attr('font-size', '10px').attr('fill', C.ink40)
            .text('+' + growth + '%')
            .attr('opacity', 0).transition().delay(900 + i * 80).duration(200).attr('opacity', 1);
    });

    // Legend
    const lg = svg.append('g').attr('transform', `translate(0, ${d.h + 16})`);
    lg.append('rect').attr('width', 14).attr('height', 6).attr('fill', C.ink20).attr('rx', 1);
    lg.append('text').attr('x', 20).attr('y', 5).attr('font-family', F).attr('font-size', '10px').attr('fill', C.ink40).text('Original bid');
    lg.append('rect').attr('x', 100).attr('width', 14).attr('height', 6).attr('fill', C.red).attr('rx', 1);
    lg.append('text').attr('x', 120).attr('y', 5).attr('font-family', F).attr('font-size', '10px').attr('fill', C.ink40).text('Current value');

    el.append('div').attr('class', 'chart-source').text('Source: CHSRA contract data, LA Times');
}

// ===== SPENDING BREAKDOWN =====
function createSpendingChart() {
    const el = d3.select('#spending-chart');
    if (el.empty()) return;
    el.selectAll('*').remove();

    const data = [
        { name: 'CP 1 Construction', value: 3550 },
        { name: 'Bookend Investments', value: 2000 },
        { name: 'CP 2-3 Construction', value: 1800 },
        { name: 'Program Mgmt (Parsons)', value: 700 },
        { name: 'CP 4 Construction', value: 500 },
        { name: 'Other / Environmental', value: 3250 }
    ];

    const total = data.reduce((s, p) => s + p.value, 0);
    const d = dims(el, { t: 10, r: 20, b: 10, l: 20, h: 300 });
    const svg = el.append('svg').attr('width', d.W).attr('height', d.h + d.t + d.b)
        .append('g').attr('transform', `translate(${d.W / 2}, ${d.h / 2 + d.t})`);

    const radius = Math.min(d.W, d.h) / 2 - 20;
    const arc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius);
    const pie = d3.pie().value(p => p.value).sort(null).padAngle(0.02);
    const colors = [C.red, C.blue, '#e8590c', C.amber, C.green, C.ink40];

    svg.selectAll('path').data(pie(data)).join('path')
        .attr('fill', (_, i) => colors[i]).attr('opacity', 0.85)
        .transition().duration(800).delay((_, i) => i * 60)
        .attrTween('d', function(dd) {
            const interp = d3.interpolate({ startAngle: dd.startAngle, endAngle: dd.startAngle }, dd);
            return t => arc(interp(t));
        });

    // Center label
    svg.append('text').attr('text-anchor', 'middle').attr('dy', '-0.2em')
        .attr('font-family', FM).attr('font-size', '24px').attr('font-weight', '700').attr('fill', C.ink).text('$13.8B');
    svg.append('text').attr('text-anchor', 'middle').attr('dy', '1.2em')
        .attr('font-family', F).attr('font-size', '11px').attr('fill', C.ink40).text('Total Spent');

    // Legend below
    const legG = el.append('div').style('display', 'flex').style('flex-wrap', 'wrap').style('gap', '8px 20px')
        .style('justify-content', 'center').style('margin-top', '16px');

    data.forEach((p, i) => {
        const item = legG.append('div').style('display', 'flex').style('align-items', 'center').style('gap', '6px');
        item.append('div').style('width', '10px').style('height', '10px').style('border-radius', '2px')
            .style('background', colors[i]).style('flex-shrink', '0');
        item.append('span').style('font-size', '11px').style('color', C.ink60)
            .text(p.name + ' · $' + (p.value / 1000).toFixed(1) + 'B');
    });
}

// ===== FUNDING CHART =====
function createFundingChart() {
    const el = d3.select('#funding-chart');
    if (el.empty()) return;
    el.selectAll('*').remove();

    const events = [
        { year: '2009–10', label: 'Obama grants', amount: 3500, type: '+' },
        { year: '2010–11', label: 'Reallocated from other states', amount: 916, type: '+' },
        { year: '2019', label: 'Trump clawback', amount: -929, type: '-' },
        { year: '2021', label: 'Biden restores', amount: 929, type: '+' },
        { year: '2023–24', label: 'Infrastructure bill', amount: 3100, type: '+' },
        { year: '2025', label: 'Trump 2.0 pulls funding', amount: -4000, type: '-' }
    ];

    const d = dims(el, { t: 10, r: 40, b: 20, l: 160, h: 300 });
    const svg = el.append('svg').attr('width', d.W).attr('height', d.h + d.t + d.b)
        .append('g').attr('transform', `translate(${d.l},${d.t})`);

    const maxAbs = 4000;
    const x = d3.scaleLinear().domain([-maxAbs, maxAbs]).range([0, d.w]);
    const y = d3.scaleBand().domain(events.map(p => p.year)).range([0, d.h]).padding(0.3);

    // Center line
    svg.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', -5).attr('y2', d.h + 5)
        .attr('stroke', C.whiteA + '0.15)').attr('stroke-width', 1);

    events.forEach((ev, i) => {
        const barX = ev.amount > 0 ? x(0) : x(ev.amount);
        const barW = Math.abs(x(ev.amount) - x(0));
        const clr = ev.amount > 0 ? C.green : C.red;

        svg.append('rect').attr('y', y(ev.year)).attr('x', barX).attr('width', 0).attr('height', y.bandwidth())
            .attr('fill', clr).attr('rx', 3).attr('opacity', 0.85)
            .transition().duration(600).delay(i * 80).attr('width', barW);

        // Left label
        svg.append('text').attr('x', -8).attr('y', y(ev.year) + y.bandwidth() / 2).attr('dy', '.35em')
            .attr('text-anchor', 'end').attr('font-family', F).attr('font-size', '11px').attr('fill', C.whiteA + '0.6)')
            .text(ev.year + ' · ' + ev.label);

        // Value
        const valX = ev.amount > 0 ? x(ev.amount) + 8 : x(ev.amount) - 8;
        const valAnchor = ev.amount > 0 ? 'start' : 'end';
        const sign = ev.amount > 0 ? '+' : '';
        svg.append('text').attr('x', valX).attr('y', y(ev.year) + y.bandwidth() / 2).attr('dy', '.35em')
            .attr('text-anchor', valAnchor).attr('font-family', FM).attr('font-size', '11px')
            .attr('font-weight', '600').attr('fill', clr)
            .text(sign + '$' + (Math.abs(ev.amount) / 1000).toFixed(1) + 'B')
            .attr('opacity', 0).transition().delay(600 + i * 80).duration(200).attr('opacity', 1);
    });

    // Net
    const net = events.reduce((s, e) => s + e.amount, 0);
    svg.append('text').attr('x', d.w).attr('y', d.h + 15).attr('text-anchor', 'end')
        .attr('font-family', FM).attr('font-size', '11px').attr('fill', C.whiteA + '0.4)')
        .text('Net federal: $' + (net / 1000).toFixed(1) + 'B');

    el.append('div').attr('class', 'chart-source').text('Source: FRA, CHSRA, DOT');
}

// Responsive
let resizeT;
window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
        document.querySelectorAll('[data-rendered]').forEach(el => { el.dataset.rendered = ''; });
        // Re-trigger observer
        document.querySelectorAll('#cost-chart, #global-chart, #timeline-chart, #route-map, #contractor-chart, #spending-chart, #funding-chart').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.dataset.rendered = '1';
                const id = el.id;
                if (id === 'cost-chart') createCostChart();
                if (id === 'global-chart') createGlobalChart();
                if (id === 'timeline-chart') createTimelineChart();
                if (id === 'route-map') createRouteMap();
                if (id === 'contractor-chart') createContractorChart();
                if (id === 'spending-chart') createSpendingChart();
                if (id === 'funding-chart') createFundingChart();
            }
        });
    }, 300);
});
