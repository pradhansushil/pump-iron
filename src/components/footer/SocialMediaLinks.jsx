import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import { footerHeadingStyle } from "../../utils/styles";

export default function SocialMediaLinks() {
  return (
    <section aria-labelledby="social-media-links" className="footer-social">
      <h3 className={footerHeadingStyle} id="social-media-links">
        Social Media
      </h3>
      <a href="https://github.com/pradhansushil">
        <FontAwesomeIcon icon={faGithub} />
      </a>
    </section>
  );
}
