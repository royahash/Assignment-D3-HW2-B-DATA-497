// Credit Card Applications Multi-Line Chart
// This project uses D3.js to create a multi-line SVG chart using external CSV data.

// SVG dimensions
const width = 900;
const height = 500;

const margin = {
  top: 60,
  right: 120,
  bottom: 60,
  left: 70
};

// Create SVG
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Chart area
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse dates
const parseDate = d3.timeParse("%Y-%m");

// Load external CSV file
d3.csv("credit_card_applications.csv").then(data => {

  // Convert data types
  data.forEach(d => {
    d.month = parseDate(d.month);
    d.accepted = +d.accepted;
    d.rejected = +d.rejected;
  });

  // X scale
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.month))
    .range([0, chartWidth]);

  // Y scale
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.accepted, d.rejected)) + 20])
    .range([chartHeight, 0]);

  // Axes
  const xAxis = d3.axisBottom(xScale)
    .ticks(data.length)
    .tickFormat(d3.timeFormat("%b"));

  const yAxis = d3.axisLeft(yScale);

  // Draw X axis
  chart.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  // Draw Y axis
  chart.append("g")
    .attr("class", "axis")
    .call(yAxis);

  // Grid lines
  chart.append("g")
    .attr("class", "grid")
    .call(
      d3.axisLeft(yScale)
        .tickSize(-chartWidth)
        .tickFormat("")
    );

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.month))
    .y(d => yScale(d.value));

  // Accepted data
  const acceptedData = data.map(d => ({
    month: d.month,
    value: d.accepted
  }));

  // Rejected data
  const rejectedData = data.map(d => ({
    month: d.month,
    value: d.rejected
  }));

  // Accepted line
  chart.append("path")
    .datum(acceptedData)
    .attr("class", "line accepted-line")
    .attr("d", line);

  // Rejected line
  chart.append("path")
    .datum(rejectedData)
    .attr("class", "line rejected-line")
    .attr("d", line);

  // Accepted dots
  chart.selectAll(".accepted-dot")
    .data(acceptedData)
    .enter()
    .append("circle")
    .attr("class", "accepted-dot")
    .attr("cx", d => xScale(d.month))
    .attr("cy", d => yScale(d.value))
    .attr("r", 5);

  // Rejected dots
  chart.selectAll(".rejected-dot")
    .data(rejectedData)
    .enter()
    .append("circle")
    .attr("class", "rejected-dot")
    .attr("cx", d => xScale(d.month))
    .attr("cy", d => yScale(d.value))
    .attr("r", 5);

  // Chart title
  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text("Accepted vs Rejected Credit Card Applications");

  // X axis label
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("Month");

  // Y axis label
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Applications");

  // Legend
  svg.append("circle")
    .attr("cx", width - 140)
    .attr("cy", 70)
    .attr("r", 6)
    .attr("fill", "#2563eb");

  svg.append("text")
    .attr("x", width - 125)
    .attr("y", 75)
    .text("Accepted");

  svg.append("circle")
    .attr("cx", width - 140)
    .attr("cy", 100)
    .attr("r", 6)
    .attr("fill", "#dc2626");

  svg.append("text")
    .attr("x", width - 125)
    .attr("y", 105)
    .text("Rejected");

});
