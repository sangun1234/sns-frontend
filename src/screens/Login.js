import { isLoggedInVar } from "../apollo";

const Login = () => (
  <div>
    <h1>Login</h1>

    {/* 이런식으로 reactive variable을 선언해놓은 apollo.js를 그대로 가져와서
        바꿔버리면 된다. 이렇게 하면 prop을 사용하지 않고도
        유저의 로그인 여부를 결정할 수 있게 된다.
    */}
    <button onClick={() => isLoggedInVar(true)}>Log in now</button>
  </div>
);
export default Login;
