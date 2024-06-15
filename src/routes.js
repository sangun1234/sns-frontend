/* 
    지금까지 링크를 설정할 때,
    url을 각각의 파일마다 설정해놓았는데,
    오타가 있을경우 찾지못하고 해맬 가능성도 있어서
    모든 라우트를 한 파일에 저장해놓는 아키텍쳐를 구상할 것이다
    훨씬 더 메리트 있고 좋아보인다.
*/

const routes = {
  home: "/",
  signUp: "/sign-up",
  message: "/message",
};

export default routes;
