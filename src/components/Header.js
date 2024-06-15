import { gql, useLazyQuery, useReactiveVar } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faCompass,
  faPaperPlane,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHome,
  faMagnifyingGlass,
  faPlus,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { isLoggedInVar } from "../apollo";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import routes from "../routes";
import useUser from "../hooks/useUser";
import Avatar from "./Avatar";
import { useState } from "react";
import CreateFeed from "./feed/CreateFeed";

const SEARCH_USERS_QUERY = gql`
  query searchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      id
      userName
      avatar
    }
  }
`;

const SHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0px; /* 도달했을때 고정시킬 위치 */
`;

const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div``;

const Icon = styled.span`
  margin-left: 15px;
`;

const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 5px 15px;
  color: white;
  font-weight: 600;
  text-decoration-line: none;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%; /* 아이콘 아래로 위치 */
  right: 0;
  width: 30%;
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 4px;
  padding: 10px;
  z-index: 10; /* 다른 요소 위에 표시되도록 */
`;

const UserListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 5px 0;
`;

const AvatarWrapper = styled.div`
  width: 40px; /* 프로필 사진 너비 */
  height: 40px; /* 프로필 사진 높이 */
  margin-right: 10px; /* 프로필 사진과 사용자 이름 사이 간격 */
`;

const UserName = styled.div`
  font-weight: bold;
`;

function Header() {
  const [keyword, setKeyword] = useState("");
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 토글 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchUsers, { data: userData, loading }] =
    useLazyQuery(SEARCH_USERS_QUERY);
  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };
  const { data } = useUser();
  const handleChange = (event) => {
    setKeyword(event.target.value);
    searchUsers({ variables: { keyword: event.target.value } });
  };
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <SHeader>
      <Wrapper>
        <Column>
          <Link to={routes.home}>
            <FontAwesomeIcon icon={faRobot} size="2x" />
          </Link>
        </Column>
        <Column>
          {isLoggedIn ? ( // 로그인 되어 있을때만 아이콘 표시
            <IconsContainer>
              {/* 부모가 없는 많은 요소를 반환하고 싶으면 <> fragment 사용(빈괄호) */}
              <Icon>
                <FontAwesomeIcon
                  onClick={togglePopup}
                  icon={faPlus}
                  size="2x"
                />
              </Icon>
              <Icon onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faMagnifyingGlass} size="2x" />
              </Icon>
              {showDropdown && (
                <Dropdown>
                  <input
                    type="text"
                    value={keyword}
                    onChange={handleChange}
                    placeholder="Search Users"
                  />
                  {/* 검색 결과 출력 */}
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <ul>
                      {userData?.searchUsers.map((user) => (
                        <UserListItem key={user.id}>
                          <Link
                            to={`/users/${user.userName}`}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <AvatarWrapper>
                              <Avatar url={user.avatar} />
                            </AvatarWrapper>
                            <UserName>{user.userName}</UserName>
                          </Link>
                        </UserListItem>
                      ))}
                    </ul>
                  )}
                </Dropdown>
              )}
              <Icon>
                <Link to={routes.message}>
                  <FontAwesomeIcon icon={faPaperPlane} size="2x" />
                </Link>
              </Icon>
              <Icon>
                <Link to={`/users/${data?.me?.userName}`}>
                  <Avatar url={data?.me?.avatar} />
                </Link>
                {/*
                  리엑트 실수. data가 없다면? me가 없다면?
                  가져오는동안의 시간도 생각해야됨 .
                  저렇게 ?을 안붙이면은 에러가 나옴.
                */}
              </Icon>
            </IconsContainer>
          ) : (
            <Link href={routes.home}>
              <Button>Login</Button>
            </Link>
          )}
        </Column>
      </Wrapper>
      {isPopupOpen && <CreateFeed data={data} onClose={togglePopup} />}
    </SHeader>
  );
}
export default Header;
