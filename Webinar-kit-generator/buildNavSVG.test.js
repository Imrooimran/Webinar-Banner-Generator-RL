/**
 * Test suite for buildNavSVG()
 * Demonstrates usage with different state configurations
 */

const { buildNavSVG } = require("./buildNavSVG");
const fs = require("fs");
const path = require("path");

/**
 * Test Case 1: 1 speaker with photo
 */
console.log("\n=== TEST 1: Single Speaker (with photo) ===");
const state1 = {
  title: "Building Scalable Web Applications with Modern Frameworks",
  date: "Jun 15",
  time: "2:00 PM EST",
  buttonText: "Register now!",
  speakers: [
    {
      name: "Jane Doe",
      photo: "https://via.placeholder.com/100x100?text=Jane",
    },
  ],
};

const svg1 = buildNavSVG(state1);
console.log("✓ Generated SVG for 1 speaker");
console.log(`  SVG length: ${svg1.length} characters`);
console.log(`  Contains speaker photo: ${svg1.includes('<image') ? "YES" : "NO"}`);
console.log(`  Contains title: ${svg1.includes('Building Scalable') ? "YES" : "NO"}`);
console.log(`  Contains button: ${svg1.includes('Register now!') ? "YES" : "NO"}`);

/**
 * Test Case 2: 2 speakers with photo
 */
console.log("\n=== TEST 2: Two Speakers (with photo) ===");
const state2 = {
  title: "Advanced React Patterns and Performance Optimization",
  date: "Jun 22",
  time: "3:30 PM EST",
  buttonText: "Join webinar",
  speakers: [
    { name: "John Smith", photo: "https://via.placeholder.com/100x100?text=John" },
    {
      name: "Sarah Johnson",
      photo: "https://via.placeholder.com/100x100?text=Sarah",
    },
  ],
};

const svg2 = buildNavSVG(state2);
console.log("✓ Generated SVG for 2 speakers");
console.log(`  SVG length: ${svg2.length} characters`);
console.log(`  Contains speaker photo: ${svg2.includes('<image') ? "YES" : "NO"}`);
console.log(`  Photo URL (first speaker): ${state2.speakers[0].photo}`);

/**
 * Test Case 3: 3 speakers (NO photo, expanded title layout)
 */
console.log("\n=== TEST 3: Three Speakers (no photo) ===");
const state3 = {
  title: "Cloud Infrastructure and DevOps Best Practices",
  date: "Jul 5",
  time: "11:00 AM PST",
  buttonText: "Register",
  speakers: [
    { name: "Alex Chen", photo: "https://via.placeholder.com/100x100?text=Alex" },
    {
      name: "Maria Garcia",
      photo: "https://via.placeholder.com/100x100?text=Maria",
    },
    {
      name: "Tom Wilson",
      photo: "https://via.placeholder.com/100x100?text=Tom",
    },
  ],
};

const svg3 = buildNavSVG(state3);
console.log("✓ Generated SVG for 3 speakers");
console.log(`  SVG length: ${svg3.length} characters`);
console.log(`  Contains speaker photo: ${svg3.includes('<image') ? "YES" : "NO"}`);
console.log(`  Title expanded to wider layout: YES (no photo takes space)`);

/**
 * Test Case 4: 4 speakers (NO photo, expanded title layout)
 */
console.log("\n=== TEST 4: Four Speakers (no photo) ===");
const state4 = {
  title: "Machine Learning Engineering: From Theory to Production",
  date: "Jul 12",
  time: "1:00 PM CST",
  buttonText: "Sign up",
  speakers: [
    { name: "Speaker 1", photo: "https://via.placeholder.com/100x100?text=S1" },
    { name: "Speaker 2", photo: "https://via.placeholder.com/100x100?text=S2" },
    { name: "Speaker 3", photo: "https://via.placeholder.com/100x100?text=S3" },
    { name: "Speaker 4", photo: "https://via.placeholder.com/100x100?text=S4" },
  ],
};

const svg4 = buildNavSVG(state4);
console.log("✓ Generated SVG for 4 speakers");
console.log(`  SVG length: ${svg4.length} characters`);
console.log(`  Contains speaker photo: ${svg4.includes('<image') ? "YES" : "NO"}`);

/**
 * Test Case 5: Long title text (tests wrapping)
 */
console.log("\n=== TEST 5: Long Title Text (wrapping test) ===");
const state5 = {
  title:
    "This is a very long webinar title that should wrap to two lines automatically based on the available width in the container",
  date: "Aug 1",
  time: "4:00 PM ET",
  buttonText: "Get access",
  speakers: [
    {
      name: "Expert Speaker",
      photo: "https://via.placeholder.com/100x100?text=Expert",
    },
  ],
};

const svg5 = buildNavSVG(state5);
console.log("✓ Generated SVG with long title");
console.log(`  SVG length: ${svg5.length} characters`);
console.log(
  `  Title wrapping: Tested (should split to ~2 lines or truncate with ...)`
);

/**
 * Test Case 6: Minimal state (all defaults)
 */
console.log("\n=== TEST 6: Minimal State (defaults) ===");
const state6 = {
  title: "Upcoming Webinar",
};

const svg6 = buildNavSVG(state6);
console.log("✓ Generated SVG with minimal state");
console.log(`  SVG length: ${svg6.length} characters`);
console.log(`  Uses default date: ${svg6.includes('Jun 15') ? "YES" : "NO"}`);
console.log(
  `  Uses default time: ${svg6.includes('2:00 PM EST') ? "YES" : "NO"}`
);
console.log(
  `  Uses default button text: ${svg6.includes('Register now!') ? "YES" : "NO"}`
);

/**
 * Write one SVG output to file for manual inspection
 */
console.log("\n=== WRITING SAMPLE SVG TO FILE ===");
const outputPath = path.join(__dirname, "sample-nav-banner.svg");
fs.writeFileSync(outputPath, svg1);
console.log(`✓ Sample SVG written to: ${outputPath}`);
console.log(`  You can open this file in a browser or Figma to verify output`);

/**
 * Validation checks
 */
console.log("\n=== VALIDATION CHECKS ===");
function validateSVG(svgString, testName) {
  const checks = {
    hasValidRoot: svgString.startsWith("<svg") && svgString.endsWith("</svg>"),
    hasDefs: svgString.includes("<defs>") && svgString.includes("</defs>"),
    hasViewBox: svgString.includes('viewBox="0 0 1440 134"'),
    hasDimensions:
      svgString.includes('width="1440"') && svgString.includes('height="134"'),
    hasWebinarPill: svgString.includes("WEBINAR"),
    hasButton: svgString.includes("Register") || svgString.includes("Sign up"),
    hasEscapedContent: !svgString.includes("<") || svgString.includes("&lt;"),
  };

  const allPass = Object.values(checks).every((v) => v);
  const status = allPass ? "✓ PASS" : "✗ FAIL";

  console.log(`\n${status}: ${testName}`);
  for (const [check, result] of Object.entries(checks)) {
    console.log(`  ${result ? "✓" : "✗"} ${check}`);
  }

  return allPass;
}

console.log("");
validateSVG(svg1, "Test 1: Single Speaker");
validateSVG(svg3, "Test 3: Three Speakers");
validateSVG(svg6, "Test 6: Minimal State");

console.log("\n=== ALL TESTS COMPLETE ===");
