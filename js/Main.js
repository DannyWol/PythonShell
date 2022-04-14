console.group('Run');
const target = document.getElementById('code');
const runBtn = document.getElementById('run-button');
const runPython = new RunPython({
	el: target,
	btn: runBtn,
	isDev: true,
	// file: document.getElementById('file'),
	success(data){
		console.log('success : ', data);
	},
	error(data){
		console.log('error : ', data);
	},
})

console.groupEnd('Run End');