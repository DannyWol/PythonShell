Main = {
	prefix: 'Main',

	Init() {
		this.EventBind();
	},

	EventBind() {
		const target = document.getElementById('code');
		// const text = document.getElementById('text');
		const runBtn = document.getElementById('run-button');
		const file = document.getElementById('file');
		const python = new PythonShell(this, this.prefix);

		python.setInterpreter(target);

		let code = '';

		$(target).on('keyup', (e) => {
			code = e.target.value;
		});
		$(runBtn).on('click', () => {
			python.run(code, (state, rtnData) => {
				console.log(`${state} : ${rtnData}`);
			});
		});

		$(file).on('change', (e) => {
			python.loadPy(e.target.files[0]);
		});

	}
}

Main.Init();