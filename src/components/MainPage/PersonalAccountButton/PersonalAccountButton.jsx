import PersonalAccountButtonSvg from './PersonalAccountButton.svg'
import './PersonalAccountButton.css'
import { useNavigate } from "react-router-dom";

export default function PersonalAccountButton() {
    const navigate = useNavigate();

  function handleClick() {
    if (location.pathname === "/account") {
        navigate("/");
      } else {
        navigate("/account");
      }
  }

  return (
    <button className="personal_btn" onClick={handleClick}>
        <img src={PersonalAccountButtonSvg} alt="Personal Account" width="28" height="28" />
    </button>
  );
}