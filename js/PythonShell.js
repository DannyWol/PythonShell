/** PythonShell Version 0.5
 * */
class PythonShell {
	/* 사용되는 객체 */
	target = null;
	/* 사용되는 객체 이름*/
	prefix = '';
	/* 사전에 정의할 함수*/
	funcBind = '';
	/* Brython 라이브러리 추가 */
	importCode = '';

	/** @Param : Object : 객체 this, String : 해당 객체 이름, String : Brython 라이브러리 / String : 사전에 정의할 함수 */
	constructor(target, prefix, importCode, funcBind) {
		if (__BRYTHON__ === undefined) throw new Error('Brython 라이브러라리가 정상적으로 로드되지 않았습니다.');
		if(target === undefined) throw new Error('객체를 넣어주세요.');
		if(prefix === undefined) throw new Error('해당 객체의 이름을 넣어주세요.');
		if(typeof target !== 'object') throw new Error('타입이 객체여야 합니다.');
		if(typeof prefix !== 'string') throw new Error('타입이 문자열이여야 합니다.');

		this.target = target;
		this.prefix = prefix;
		this.importCode = importCode === undefined ? '' : importCode;
		this.funcBind = funcBind === undefined ? '' : importCode;
	}

	/** @Param : String(innerHTML), Function
	 *  Python을 실행시키는 코드 */
	run(code, callback) {
		if(code === undefined) throw new Error('코드가 입력되지 않았습니다.');
		if(code === '') throw new Error('코드가 빈 문자열입니다.');

		let pythonScript = document.getElementById('pythonScript');
		if (pythonScript !== null) pythonScript.remove();

		/* Callback에 사용할 변수 초기화 */
		this.target.pyFlag = null;
		this.target.pyError = null;
		this.target.pySuccess = null;
		__BRYTHON__.stderr.$method_cache = null;

		code = code.replaceAll('\n', '\n  ')

		pythonScript = document.createElement('script');
		pythonScript.id = 'pythonScript';
		pythonScript.type = 'text/python3';
		pythonScript.innerHTML =
			'from browser import window' +
			'\nfrom javascript import this' +
			'\nfrom browser import document' +
			'\nimport json' +
			'\nimport traceback' +
			'\n' +
			'\ndef callback(val):' +
			'\n  this().' + this.prefix + '.pyFlag = "success"' +
			'\n  this().' + this.prefix + '.pySuccess = json.dumps(val)' +
			'\n' + this.importCode +
			'\n' + this.funcBind +
			'\ntry:' +
			`\n  ${code}` +
			'\nexcept Exception as e:' +
			'\n  error_message=traceback.format_exc()' +
			'\n  print(error_message)' +
			'\n  this().' + this.prefix + '.pyFlag = "error"' +
			'\n  this().' + this.prefix + '.pyError = str(e)';

		document.querySelector('body').appendChild(pythonScript);

		brython();

		this.rtnCallback(callback);
	}

	/** @Param : File 객체 (사용자 Event에서 사용하기)
	 *  Python File Load */
	loadPy(file) {
		const reader = new FileReader();
		reader.onloadend = e => this.funcBind = e.target.result;
		reader.readAsText(file, 'UTF-8');
	}

	/** @Param : Function
	 *  callback 함수 실행 */
	rtnCallback(callback) {
		if (typeof callback !== 'function') return;

		/* Brython_Error _ Syntax Error */
		if (__BRYTHON__.stderr.$method_cache !== null) {
			callback('error', '[Brython_Error] SyntaxError');
		}
		/* Python Compile Error */
		else if (this.target.pyFlag === 'error') {
			callback(this.target.pyFlag, this.target.pyError);
		}
		/* Success Callback(No Return) */
		else if (this.target.pyFlag === null) {
			callback('success');
		}
		/* Success Callback (Return) */
		else {
			callback(this.target.pyFlag, this.target.pySuccess);
		}

		this.target.pyFlag = undefined;
		this.target.pySuccess = undefined;
		this.target.pyError = undefined;
	}

	/** Interpreter Event를 만드는 Method
	 *  @Param : HTML Element, Function (Ctrl + Enter에서 결과를 받아오는 Callback) */
	setInterpreter(el, callback) {
		const call = typeof callback === "function" ? callback : undefined;

		if(el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT') throw new Error('<textarea>와 <input>만 가능합니다.');
		el.addEventListener('keydown', (e)=>{
			/* Tab */
			if (e.keyCode === 9) {
				e.preventDefault();
				e.target.value += '  ';
			}
			/* Ctrl + Enter */
			else if (e.ctrlKey && e.keyCode === 13) {
				this.run(el.value, call);
			}
		})
	}

	/** Brython 라이브러리에 접근*/
	callBrython() {
		return __BRYTHON__;
	}

	/** Brython에서  Error를 관리하는 객체들 */
	getBrythonError() {
		return {
			stdout: __BRYTHON__.stdout,
			stderr: __BRYTHON__.stderr,
			stdin: __BRYTHON__.stdin
		}
	}
}