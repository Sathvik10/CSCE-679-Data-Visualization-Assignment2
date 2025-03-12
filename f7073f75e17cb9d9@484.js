function _1(md){return(
md`# LEVEL 1`
)}

function _processedData(d3,data){return(
Array.from(
  d3.rollup(
    data, 
    v => ({
      avgTemp: d3.mean(v, d => d.average_temperature), 
      maxTemp: d3.max(v, d => d.max_temperature), 
      minTemp: d3.min(v, d => d.min_temperature)
    }),
    d => d.year,  
    d => d.month  
  ),
  ([year, months]) => 
    Array.from(months, ([month, temps]) => ({
      year, month, 
      avg_temperature: temps.avgTemp,
      max_temperature: temps.maxTemp,
      min_temperature: temps.minTemp
    }))
).flat()
)}

function _data(FileAttachment){return(
FileAttachment("temperature_daily.csv").csv({ typed: true }).then(d =>
  d.map(row => ({
    ...row,  
    year: new Date(row.date).getFullYear(),  // Extract Year  
    month: new Date(row.date).getMonth() + 1,  // Extract Month (0-based index)  
    average_temperature: (row.max_temperature + row.min_temperature) / 2  // Calculate Average  
  }))
)
)}

function _radio(Inputs){return(
Inputs.radio(["max_temperature", "min_temperature"], { label: "Choose Temperature Type" , value : 'min_temperature'})
)}

function _5(radio){return(
radio
)}

function _6(radio,Plot,d3,processedData)
{
  const colorScheme = radio == 'max_temperature' ? "Reds" : "Blues"
  const value = radio == 'min_temperature' ? 'min_temperature' : 'max_temperature'
  return Plot.plot({
  width: 1000,
  height: 500,
  color: { scheme: colorScheme }, 
  marginLeft: 100,  
  x: { label: "Year" },
  y: { label: "Month", tickFormat: d => d3.timeFormat("%B")(new Date(2000, d - 1, 1)) },  
  marks: [
    Plot.rect(processedData, { 
      x: "year", 
      y: "month", 
      fill: radio,
      title: (d) => `Date: ${d.year}-${d.month} \max: ${d.max_temperature}°C min:${d.min_temperature}°C`
    })
  ]
})

}


function _7(md){return(
md`# LEVEL 2`
)}

function _endyear(){return(
2017
)}

function _firstYear(){return(
2008
)}

async function _level_2_data(FileAttachment,firstYear,endyear){return(
await FileAttachment("temperature_daily.csv").csv({ typed: true }).then(d =>
  d.map(row => ({
    ...row,  
    year: new Date(row.date).getFullYear(),  // Extract Year  
    month: new Date(row.date).getMonth() + 1,  // Extract Month (0-based index)  
    average_temperature: (row.max_temperature + row.min_temperature) / 2  // Calculate Average  
  })).filter(row => row.year >= firstYear && row.year <= endyear).sort((a, b) => a.date - b.date) 
)
)}

function _processedData_level2(d3,level_2_data){return(
Array.from(
  d3.rollup(
    level_2_data, 
    v => ({
      max_temperature: d3.max(v, d => d.max_temperature),
      min_temperature: d3.min(v, d => d.min_temperature), 
      all_max_temperatures: v.map(d => d.max_temperature), 
      all_min_temperatures: v.map(d => d.min_temperature) 
    }),
    d => d.year,  
    d => d.month  
  ),
  ([year, months]) => 
    Array.from(months, ([month, values]) => ({
      year, month, 
      max_temperature: values.max_temperature,
      min_temperature: values.min_temperature,
      all_max_temperatures: values.all_max_temperatures,
      all_min_temperatures: values.all_min_temperatures
    }))
).flat()
)}

function _level2_radio(Inputs){return(
Inputs.radio(["max_temperature", "min_temperature"], { label: "Choose Temperature Type" , value : 'max_temperature'})
)}

function _13(level2_radio){return(
level2_radio
)}

function _14(d3,processedData_level2,html,level2_radio,Plot)
{
  const years = [2008,2009,2010,2011, 2012, 2013, 2014, 2015, 2016, 2017]
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const m = monthNames.length;
  const n = years.length;
  const containerWidth = 1020;
  const containerHeight = 1020;
  const margin = { top: 40, right: 70, bottom: 40, left: 50 };
  const innerWidth = containerWidth - margin.left - margin.right;
  const innerHeight = containerHeight - margin.top - margin.bottom;

  const legendWidth = 30;
  const legendHeight = 200;
  const legendX = containerWidth - legendWidth - 30;
  const legendY = 10;
  const legendSteps = 10; // Number of color steps in the legend

  const max_maxTemp = d3.max(processedData_level2, d => d.max_temperature)
  const min_maxTemp = d3.min(processedData_level2, d => d.max_temperature)
  const maxTempColorScale = d3.scaleSequential(d3.interpolateReds)
      .domain([min_maxTemp, max_maxTemp]); // Adjust domain based on your data

  const max_minTemp = d3.max(processedData_level2, d => d.min_temperature)
  const min_minTemp = d3.min(processedData_level2, d => d.min_temperature)
  const minTempColorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([min_minTemp, max_minTemp]);
  
  const xScale = d3.scaleBand()
      .domain(years)
      .range([0, innerWidth]);
  
  const yScale = d3.scaleBand()
    .domain(monthNames)
    .range([0, innerHeight]);
  
   // Create a container with a wrapper for axes
  const outerContainer = html`<div style="position: relative; width: ${containerWidth}px; height: ${containerHeight}px;">
    <!-- This will hold our grid -->
    <div id="grid-container" style="position: absolute; top: ${margin.top}px; left: ${margin.left}px; width: ${innerWidth}px; height: ${innerHeight}px; display: grid; grid-template-columns: repeat(${n}, 1fr); grid-template-rows: repeat(${m}, 1fr); gap: 5px;"></div>
    
    <!-- This will hold our axes -->
    <svg width="${containerWidth}" height="${containerHeight}" style="position: absolute; top: 0; left: 0; pointer-events: none;">
      <g id="x-axis" transform="translate(${margin.left}, ${margin.top - 10})"></g>
      <g id="y-axis" transform="translate(${margin.left - 10}, ${margin.top})"></g>
      <g id="legend" transform="translate(${legendX}, ${legendY})"></g>
    </svg>
  </div>`;
    

  const xAxis = d3.axisTop(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  d3.select(outerContainer.querySelector("#x-axis"))
    .call(xAxis);
  
  d3.select(outerContainer.querySelector("#y-axis"))
    .call(yAxis);

    // Create legend
  const showMaxTemp = level2_radio === 'max_temperature';
  const colorScale = showMaxTemp ? maxTempColorScale : minTempColorScale;
  const tempMin = showMaxTemp ? min_maxTemp : min_minTemp;
  const tempMax = showMaxTemp ? max_maxTemp : max_minTemp;
  
  const legendGroup = d3.select(outerContainer.querySelector("#legend"));
  
  // Create color gradient for legend
  for (let i = 0; i < legendSteps; i++) {
    const value = tempMin + (tempMax - tempMin) * (i / (legendSteps - 1));
    legendGroup.append("rect")
      .attr("x", 0)
      .attr("y", i * (legendHeight / legendSteps))
      .attr("width", legendWidth)
      .attr("height", legendHeight / legendSteps)
      .attr("fill", colorScale(value));
  }
  
  // Add labels to legend
  legendGroup.append("text")
    .attr("x", legendWidth + 5)
    .attr("y", 0)
    .attr("dy", "0.32em")
    .attr("text-anchor", "start")
    .text(`${tempMin}`);
    
  legendGroup.append("text")
    .attr("x", legendWidth + 5)
    .attr("y", legendHeight)
    .attr("dy", "0.32em")
    .attr("text-anchor", "start")
    .text(`${tempMax}`);
    
  // Add legend title (optional)
  legendGroup.append("text")
    .attr("x", 0)
    .attr("y", -10)
    .attr("text-anchor", "start")
    .style("font-weight", "bold")
    .text("Temperature");
  
  // Create line legend for max and min temperature
  const lineLegendGroup = legendGroup.append("g")
    .attr("transform", `translate(0, ${legendHeight + 20})`);
    
  // Max temperature line
  lineLegendGroup.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 20)
    .attr("y2", 0)
    .attr("stroke", "green")
    .attr("stroke-width", 3);
    
  lineLegendGroup.append("text")
    .attr("x", 25)
    .attr("y", 0)
    .attr("dy", "0.32em")
    .text("Max");
    
  // Min temperature line
  lineLegendGroup.append("line")
    .attr("x1", 0)
    .attr("y1", 20)
    .attr("x2", 20)
    .attr("y2", 20)
    .attr("stroke", "yellow")
    .attr("stroke-width", 3);
    
  lineLegendGroup.append("text")
    .attr("x", 25)
    .attr("y", 20)
    .attr("dy", "0.32em")
    .text("Min");

  const container =  outerContainer.querySelector("#grid-container");

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const plotIndex = i * 2 + j;
      const plotId = `plot_${plotIndex}`;

      const row = processedData_level2.filter(d => d.year === years[j] && d.month === (i + 1))[0];
        
      const childDiv = document.createElement("div");
        childDiv.id = plotId;
        childDiv.className = "plot-container";
        
      if(row != undefined){

        const maxTempData = row.all_max_temperatures.map((temp, day) => ({
          day: day + 1,
          temperature: temp,
          type: "max"
        }));
    
        const minTempData = row.all_min_temperatures.map((temp, day) => ({
          day: day + 1,
          temperature: temp,
          type: "min"
        }));

        const overallMin = Math.min(...row.all_min_temperatures);
        const overallMax = Math.max(...row.all_max_temperatures);
          
        const box = Plot.plot({
          x: {
            domain: [1, 31],
            label: "Day"
          },
          y: {
            domain: [overallMin - 2, overallMax + 2],
            label: "Temp (°C)"
          },
          marks : [
            Plot.rect(
              [{ x1: 1, y1: overallMin - 2, x2: 31, y2: overallMax + 2 }],
              {
                fill: d => colorScale(row.max_temperature),
                fillOpacity: 1,
                title: (d) => `Date: ${row.year}-${row.month} \max: ${row.max_temperature}°C min:${row.min_temperature}°C`
                
              }
            ),
            Plot.gridX({stroke: "white", strokeOpacity: 1}),
            Plot.gridY({stroke: "white", strokeOpacity: 1}),
            Plot.line(maxTempData, {
              x: "day",
              y: "temperature",
              stroke: "green",
              strokeWidth: 5
            }),
            
            Plot.line(minTempData, {
              x: "day",
              y: "temperature",
              stroke: "yellow",
              strokeWidth: 5
            }),
          ]
        })
        childDiv.appendChild(box);
      }
      container.appendChild(childDiv);
      
    }
  }

  return outerContainer
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["temperature_daily.csv", {url: new URL("./files/b14b4f364b839e451743331d515692dfc66046924d40e4bff6502f032bd591975811b46cb81d1e7e540231b79a2fa0f4299b0e339e0358f08bef900595e74b15.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("processedData")).define("processedData", ["d3","data"], _processedData);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("viewof radio")).define("viewof radio", ["Inputs"], _radio);
  main.variable(observer("radio")).define("radio", ["Generators", "viewof radio"], (G, _) => G.input(_));
  main.variable(observer()).define(["radio"], _5);
  main.variable(observer()).define(["radio","Plot","d3","processedData"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("endyear")).define("endyear", _endyear);
  main.variable(observer("firstYear")).define("firstYear", _firstYear);
  main.variable(observer("level_2_data")).define("level_2_data", ["FileAttachment","firstYear","endyear"], _level_2_data);
  main.variable(observer("processedData_level2")).define("processedData_level2", ["d3","level_2_data"], _processedData_level2);
  main.variable(observer("viewof level2_radio")).define("viewof level2_radio", ["Inputs"], _level2_radio);
  main.variable(observer("level2_radio")).define("level2_radio", ["Generators", "viewof level2_radio"], (G, _) => G.input(_));
  main.variable(observer()).define(["level2_radio"], _13);
  main.variable(observer()).define(["d3","processedData_level2","html","level2_radio","Plot"], _14);
  return main;
}
