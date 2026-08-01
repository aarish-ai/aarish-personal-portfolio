const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));

for(let i=0; i<15; i++) {
  projects.push({
    id: `dummy-${i}`,
    name: `Dummy Project ${i}`,
    oneLiner: "This is a test project to check 3D layout overlapping.",
    tech: ["Test"],
    image: "",
    problem: "Test",
    approach: "Test",
    outcome: "Test",
    url: ""
  });
}

fs.writeFileSync('data/projects.json', JSON.stringify(projects, null, 2));
console.log("Appended 15 dummy projects");
