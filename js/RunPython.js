/** RunPython 0.1
 *  TODO 1. Interpreter 만들기
 *       2. Interpreter에서 코드 실행(Event)
 *       3. Interpreter에서 코드 실행 후 결과값 받아오기
 *       4. .py 파일을 실행하기
 *       5. Javascript로 어느정도까지 실행할 수 있는지 Test */
class RunPython {
    code = null;
    target = null;
    btn = null;

    /** @Constructor
     *  @Param : HtmlElement - Interpreter로 만들 Element / HtmlElement - Interpreter를 실행시킬 버튼*/
    constructor(target, btn) {
        if(!Boolean(target)) throw new Error('Interpreter를 만들 수 없습니다. \n HTML 요소가 필요합니다.');
        if(!Boolean(btn)) throw new Error('Run_Button를 만들 수 없습니다. \n HTML 요소가 필요합니다.');

        this.target = target;
        this.btn = btn;

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

            stdlib.onload = () => this.interpreter();
        };

        document.querySelector('head').appendChild(link);
        document.querySelector('head').appendChild(brython);
    }

    /** Create Interpreter & Run */
    interpreter() {
        let interpreter = document.getElementById('interpreter');

        /** Interpreter 중복을 막기 위해 삭제*/
        if(interpreter !== null) interpreter.remove();

        interpreter = document.createElement('script');

        interpreter.setAttribute('id', 'interpreter');
        interpreter.setAttribute('type', 'text/python3');

        if (this.code !== null) {
            interpreter.innerHTML = `${this.code}`;
        }

        document.querySelector('body').appendChild(interpreter);
    }

    /** @Event */
    eventBind() {
        /**@Click Run Btn */
        this.btn.addEventListener('click', () => {
            this.interpreter();
            brython();
        });

        /** @KeyUp Interpreter */
        this.target.addEventListener('keyup', () => {
            this.code = this.target.value;
        });
    }

    /** Python File을 로드 후 실행시키는 Method */
    loadPy() {

    }

    /*******************
     * Setter & Getter
     *******************/

    /** @Setter
     *  Code 입력 */
    setCode(code) {
        if(!Boolean(code)) throw new Error('파라미터가 잘못 입력되었습니다.');
        this.code = code;
    }
}