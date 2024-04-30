function Home({ setIsLoggedIn }) {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => setIsLoggedIn(false)}>Log out now</button>
    </div>
  );
}

export default Home;

// Home.js 와 Login.js와 같이
// 이 두종류의 방법으로 컴포넌트를 만들 수 있다.
/* 
    1. function 변수명 () { return ~~~}
    export default 변수명

    2. const 변수명 = () => return ~~~~~

    export default 변수명

    뭘 쓰든 내 마음이다.
*/
