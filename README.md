# PythonShell (0.5)

### 사전준비
brython.js와 brython_stdlib.js는 필수적으로 로드가 되어 있어야 함.

### Python을 실행할 수 있는 JS class

Brython 라이브러리와 연계하여 python을 JS단에서 컴파일 될 수 있도록 하였습니다.

### Callback

Brython 내부의 javascript 라이브러리를 사용하여 해당 데이터를 저장 후 return value를 Callback으로 리턴합니다.


### 사용법
```
const Main = {
    python: new PythonShell(this, 'Main');

    runPython(code) {
    
        /** Brython을 실행하는 Method @Param : state(success or error) / rtnData : 반환하는 데이터 */
        this.python.run(code, (state, rtnData) => {
            console.log('Python Code 실행 상태 : ', state);
            console.log('Python Code 실행 결과 : ', rtnData);
        })
    }
}

...
target.addEventListener('click', () => {
    Main.runPython(code);
})
```

### Callback으로 데이터를 반환받는 방법
code를 입력 받을 때 Python 함수인 callback()에 원하는 데이터를 넣으면 JS단에서 콜백으로 값을 확인할 수 있습니다.
