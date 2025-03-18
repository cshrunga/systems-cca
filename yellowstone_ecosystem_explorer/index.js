// WolfQuest: Ecosystem Explorer - D3.js Implementation

// Global variables
let currentScreen = "intro";
let wolvesPresent = null;
let animationProgress = 0;
let animationSpeed = 1;
const AnimationInterval = 100;

// Ecosystem metrics
let metrics = {
  wolves: 0,
  elk: 0,
  trees: 0,
  beavers: 0,
  birds: 0,
  riverHealth: 0
};

// Main dimensions
const width = 1600;
const height = 700;

const boxWidth = 180;
const boxHeight = 70;
const spacing = 10;

function resetMetrics() {
  metrics = {
    wolves: 0,
    elk: 0,
    trees: 0,
    beavers: 0,
    birds: 0,
    riverHealth: 0
  };
}

function drawMetricBox(svg, id, x, y, title, value, maxValue, percentage, unit, isWolf = false) {
  x = 0;
  y = 0;

  // Box
  svg.append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("width", boxWidth)
    .attr("height", boxHeight)
    .attr("rx", 5)
    .attr("fill", "#f0f0f0");

  // Title
  svg.append("text")
    .attr("x", x + 10)
    .attr("y", y + 15)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("fill", "#000000")
    .attr("font-size", "14px")
    .text(title);

  // Progress bar background
  svg.append("rect")
    .attr("class", "progress-bg")
    .attr("x", x + 10)
    .attr("y", y + 30)
    .attr("width", boxWidth - 20)
    .attr("height", 10)
    .attr("rx", 5)
    .attr("fill", "#c8c8c8");

  // Progress bar fill
  svg.append("rect")
    .attr("class", "progress-bar")
    .attr("x", x + 10)
    .attr("y", y + 30)
    .attr("width", 0) // Start with 0 width for animation
    .attr("height", 10)
    .attr("rx", 5)
    .attr("fill", getHealthColor(percentage, isWolf));

  // Value text
  svg.append("text")
    .attr("class", "value-text")
    .attr("x", x + 10)
    .attr("y", y + 55)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("fill", "#000000")
    .attr("font-size", "12px")
    .text(Math.round(value) + " " + unit);
}

function drawSim() {
  const gridX = 100;
  const gridY = 320;
  const boxWidth = 180;
  const boxHeight = 70;
  const spacing = 10;

  const entities = [
    ["wolves", gridX, gridY, "Wolves", metrics.wolves, 10, metrics.wolves > 0 ? 100 : 0, "wolves", true],
    ["elk", gridX + boxWidth + spacing, gridY, "Elk Population", metrics.elk, 500, wolvesPresent ? 70 : 30, "elk", false],
    ["trees", gridX + 2 * (boxWidth + spacing), gridY, "Trees & Vegetation", metrics.trees, 100, metrics.trees, "%", false],
    ["beaver", gridX, gridY + boxHeight + spacing, "Beaver Population", metrics.beavers, 15, metrics.beavers * 6, "colonies", false],
    ["bird", gridX + boxWidth + spacing, gridY + boxHeight + spacing, "Bird Species", metrics.birds, 100, metrics.birds, "species", false],
    ["river", gridX + 2 * (boxWidth + spacing), gridY + boxHeight + spacing, "River Health", metrics.riverHealth, 100, metrics.riverHealth, "% healthy", false],
  ];

  const selection = d3.select("#with-wolves-container>#simulator")
    .selectAll("svg")
    .data(entities);

  const enterSelection = selection.enter()
    .append("svg")
    .attr("width", boxWidth)
    .attr("height", boxHeight)
    .each(function (d) {
      drawMetricBox(d3.select(this), ...d);
    });

  // UPDATE - Animate existing elements
  selection.merge(enterSelection)
    .select(".progress-bar")
    .transition()
    .duration(AnimationInterval)
    .attr("width", d => Math.max(0, (d[4] / d[5]) * (boxWidth - 20)))
    .attr("fill", d => getHealthColor(d[6], d[8]));

  selection.merge(enterSelection)
    .select(".value-text")
    .text(d => Math.round(d[4]) + " " + d[7]);

}

function simulate(title, buttonText, resultText, backgroundColor, completionHandler) {
  animationProgress = 0;
  resetMetrics();

  document.getElementById("with-wolves-container").classList.remove("nodisplay");
  let heading = document.querySelector("#with-wolves-container > h2");
  heading.innerHTML = title;

  document.querySelector("#with-wolves-container > .result").style.backgroundColor = "white";
  let resultHeading = document.querySelector("#with-wolves-container > .result > h2");
  resultHeading.classList.add("nodisplay");
  resultHeading.innerHTML = resultText;

  const selection = d3.select("#with-wolves-container>#simulator")
    .selectAll("svg").remove();

  let button = document.getElementById("sim-button");
  button.classList.add("nodisplay");
  button.innerHTML = buttonText;

  drawSim();
  startAnimationLoop(completionHandler);
}

function simulateWithWolves() {
  wolvesPresent = true;
  const title = "Healthy Ecosystem (With Wolves)";
  const buttonText = "Remove Wolves";
  const resultText = "Balanced predatory-prey relationship";
  const backgroundColor = "rgb(200, 230, 200)";
  simulate(title, buttonText, resultText, backgroundColor, () => {
    document.querySelector("#with-wolves-container > .result > h2").classList.remove("nodisplay");
    document.querySelector("#with-wolves-container > .result").style.backgroundColor = backgroundColor;
    document.getElementById("sim-button").classList.remove("nodisplay");
    document.getElementById("sim-button").addEventListener("click", () => {
      document.getElementById("with-wolves-container").classList.add("nodisplay");
      document.getElementById("imbalance-container").classList.remove("nodisplay");
      document.getElementById("balance-container").classList.add("nodisplay");
    });
  });
}

function simulateWithOutWolves() {
  wolvesPresent = false;

  const title = "Ecosystem Collapse (No Wolves)";
  const buttonText = "Bring Back Wolves";
  const resultText = "Overgazing by Elk";
  const backgroundColor = "rgb(231, 76, 60)";
  simulate(title, buttonText, resultText, backgroundColor, () => {
    document.querySelector("#with-wolves-container > .result > h2").classList.remove("nodisplay");
    document.querySelector("#with-wolves-container > .result").style.backgroundColor = backgroundColor;
    document.getElementById("sim-button").classList.remove("nodisplay");
    document.getElementById("sim-button").addEventListener("click", () => {
      document.getElementById("with-wolves-container").classList.add("nodisplay");
      document.getElementById("balance-container").classList.remove("nodisplay");
      document.getElementById("imbalance-container").classList.add("nodisplay");
    });
  });
}

// Create SVG container when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Intro
  const buttons = document.getElementById("buttons");
  buttons.innerHTML = `
    <button id="start-with-button">Start with Wolves</button>
    <button id="start-without-button">Start without Wolves</button>
  `;

  document.getElementById("start-with-button").addEventListener("click", () => {
    document.getElementById("intro-container").classList.add("nodisplay");
    simulateWithWolves();
  });

  document.getElementById("start-without-button").addEventListener("click", () => {
    document.getElementById("intro-container").classList.add("nodisplay");
    simulateWithOutWolves();
  });

  document.getElementById("start-over").addEventListener("click", () => {
    document.getElementById("balance-container").classList.add("nodisplay");
    document.getElementById("imbalance-container").classList.add("nodisplay");
    document.getElementById("intro-container").classList.remove("nodisplay");
  });

  document.getElementById("start-over-1").addEventListener("click", () => {
    document.getElementById("balance-container").classList.add("nodisplay");
    document.getElementById("imbalance-container").classList.add("nodisplay");
    document.getElementById("intro-container").classList.remove("nodisplay");
  });

  document.getElementById("try-without-wolves").addEventListener("click", () => {
    document.getElementById("imbalance-container").classList.add("nodisplay");
    simulateWithOutWolves();
  });

  document.getElementById("try-with-wolves").addEventListener("click", () => {
    document.getElementById("balance-container").classList.add("nodisplay");
    simulateWithWolves();
  });
});

let animationInterval;

function startAnimationLoop(handleCompletion) {
  animationInterval = setInterval(() => {
    if (animationProgress < 100) {
      animationProgress += animationSpeed;
      updateMetrics();
      drawSim();
    }

    if (animationProgress >= 100) {
      clearInterval(animationInterval);
      handleCompletion();
    }
  }, AnimationInterval); // 60 FPS
}

function stopAnimationLoop() {
  if (animationInterval) {
    clearInterval(animationInterval);
  }
}




function updateMetrics() {
  if (wolvesPresent) {
    // Calculate values based on animation progress (start → target)
    metrics.wolves = d3.interpolate(1, 8)(animationProgress / 100);
    metrics.elk = d3.interpolate(300, 200)(animationProgress / 100);
    metrics.trees = d3.interpolate(50, 85)(animationProgress / 100);
    metrics.beavers = d3.interpolate(3, 12)(animationProgress / 100);
    metrics.birds = d3.interpolate(30, 70)(animationProgress / 100);
    metrics.riverHealth = d3.interpolate(40, 90)(animationProgress / 100);
  } else {
    metrics.wolves = d3.interpolate(8, 0)(animationProgress / 100);
    metrics.elk = d3.interpolate(200, 500)(animationProgress / 100);
    metrics.trees = d3.interpolate(85, 30)(animationProgress / 100);
    metrics.beavers = d3.interpolate(12, 2)(animationProgress / 100);
    metrics.birds = d3.interpolate(70, 25)(animationProgress / 100);
    metrics.riverHealth = d3.interpolate(90, 30)(animationProgress / 100);
  }
}

function getHealthColor(value, isWolf = false) {
  // For wolves, any presence is good
  if (isWolf) {
    return value > 0 ? "#27ae60" : "#e74c3c";
  }

  // For other metrics, calculate health
  if (value > 80) return "#27ae60"; // Bright green
  if (value > 60) return "#2ecc71"; // Green
  if (value > 40) return "#f1c40f"; // Yellow
  if (value > 20) return "#e67e22"; // Orange
  return "#e74c3c"; // Red
}
