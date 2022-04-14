/** RunPython 0.1
 *  TODO
 *       5. Javascript로 어느정도까지 실행할 수 있는지 Test(과부하 테스트)
 *       6. Error 처리 => 성공이면 successCallback, 실패면 errorCallback
 *       7. 사전 py 실행*/
class RunPython {
	code = null;
	target = null;
	btn = null;
	funcBind = null;
	successCallback = null;
	isDev = false;
	fileTarget = null;
	importCode = '';

	/** @Constructor
	 *  @Param : HtmlElement - Interpreter로 만들 Element / HtmlElement - Interpreter를 실행시킬 버튼 */
	constructor(object) {
		if (!Boolean(object.el)) throw new Error('Interpreter를 만들 수 없습니다. \n HTML 요소가 필요합니다.');
		if (!Boolean(object.btn)) throw new Error('실행버튼을 만들 수 없습니다. \n HTML 요소가 필요합니다.');

		this.target = object.el;
		this.btn = object.btn;
		this.isDev = object.isDev;
		this.fileTarget = object.file;

		if (typeof object.importCode !== 'undefined') this.importCode = object.importCode;
		if (typeof object.success === 'function') this.successCallback = object.success;
		if (typeof object.error === 'function') this.errorCallback = object.error;

		this.load();
		this.eventBind();
	}

	/** Brython을 사용하기 위해 Load하는 Method */
	load() {
		const link = document.createElement('link');
		const brython = document.createElement('script');

		link.href = '../css/common.css';
		brython.src = '../resource/Brython-3.10.4/brython.js';

		/** Library 로드 후 Interpreter 생성 */
		brython.onload = () => {
			const stdlib = document.createElement('script');
			stdlib.src = '../resource/Brython-3.10.4/brython_stdlib.js';
			document.querySelector('head').appendChild(stdlib);

			this.createInput();
			stdlib.onload = () => this.interpreter();
		};

		document.querySelector('head').appendChild(link);
		document.querySelector('head').appendChild(brython);
	}

	/** 사전에 Server단에서 Load해오는 경우 */
	loadFunc() {

	}

	/** Create Interpreter & Run */
	interpreter() {
		let interpreter = document.getElementById('interpreter');
		/** Interpreter 중복을 막기 위해 삭제*/
		if (interpreter !== null) interpreter.remove();

		interpreter = document.createElement('script');
		interpreter.id = 'interpreter';
		interpreter.type = 'text/python3';

		if (this.funcBind === null) this.funcBind = '';

		if (this.code !== null) {
			interpreter.innerHTML =
				'from browser.local_storage import storage;' +
				'\nfrom browser import document;' +
				'\nimport json;'
				+ '\n' + this.importCode + '\n'

				+ this.funcBind +

				'\nresult = ' + this.code +

				'\ndocument["RunPython_Result"].value =  result';
		}

		document.querySelector('body').appendChild(interpreter);
	}

	/** Python 실행 후 결과를 받아오기 위한 Input 태그 생성*/
	createInput() {
		let input = document.getElementById('RunPython_Result');

		if(input !== null) input.remove();

		input = document.createElement('input');

		input.type = 'hidden';
		input.id = 'RunPython_Result';

		document.querySelector('body').appendChild(input);
	}

	/** Python을 실행시킨 결과를 받아오는 Method */
	getInput() {
		let input = document.getElementById('RunPython_Result');

		return input.value;
	}

	/** Brython 실행 */
	Run() {
		try{
			this.interpreter();
			brython();
			this.getInput();
		}catch (e) {
			console.log(e.name);
			console.log(e.message);
			console.log(e.stack);
		}

		if(typeof this.successCallback === 'function') {
			this.successCallback(this.getInput());
		}
		if(typeof this.errorCallback === 'function') {
			this.errorCallback(this.getInput());
		}
	}

	/** @Event */
	eventBind() {
		/**@Click Run Btn */
		this.btn.addEventListener('click', () => {
			this.Run();
		});

		/** @KeyUp Interpreter */
		this.target.addEventListener('keyup', () => {
			this.code = this.target.value;
		});

		/** @KeyDown Interpreter */
		this.target.addEventListener('keydown', (e) => {
			/** Tab */
			if (e.keyCode === 9) {
				e.preventDefault();
				e.target.value += '    ';
			}
			/** Ctrl + Enter */
			else if (e.ctrlKey && e.keyCode === 13) {
				this.Run();
			}
		});

		if (this.fileTarget !== undefined) {
			this.fileTarget.addEventListener('change', (e) => {

				if (e.target.files.length > 0) {
					for (let file of e.target.files) {
						this.loadPy(file);
					}
				}
			});
		}
	}

	/** Python File을 로드 후 실행시키는 Method */
	loadPy(file) {
		const reader = new FileReader();
		reader.onloadend = e => this.funcBind = e.target.result;
		reader.readAsText(file, 'UTF-8');
	}

	/** Python 예약어
	 *  @Param : String */
	keyword(condTarget) {
		const keyword = ['for', 'if', 'return', 'else', 'else if', 'while'];
		let contain = false;

		for (let word of keyword) {
			contain = condTarget.includes(word);

			if (contain === true) break;
		}

		return contain;
	}
}