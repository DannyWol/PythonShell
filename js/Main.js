console.group('Run');
const target = document.getElementById('code');
const runBtn = document.getElementById('run-button');
const runPython = new RunPython(target, runBtn);

console.groupEnd('Run End');