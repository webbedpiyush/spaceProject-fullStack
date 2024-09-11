import { Footer as ArwesFooter, Paragraph } from "arwes";
import Centered from "./Centered";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Footer = () => {
  return (
    <ArwesFooter animate>
      <Centered>
        <Paragraph style={{ fontSize: 14, margin: "10px 0" }}>
          This is not an official site , just made for my learning purpose.
          <a
            style={{
              marginLeft: "15px",
              color: "rgb(38, 218, 253)",
              textDecoration: "none",
              marginTop:"10px",
              fontWeight: "bold",
              fontSize: "20px",
            }}
            href="https://github.com/webbedpiyush"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </Paragraph>
      </Centered>
    </ArwesFooter>
  );
};

export default Footer;
