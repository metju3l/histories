import { orange_main } from '../../../../shared/colors';

const Footer = `
<footer
  style="
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  "
>
  <div
    style="
      display: flex;
      gap: 8px;
      justify-content: center;
      text-align: center;
      line-height: 40px;
    "
  >
    <img
      src="https://www.histories.cc/logo/small.png"
      alt="logo"
      height="40px"
      width="40px"
      style="border-radius: 8px"
    />
    <a
      href="https://www.histories.cc"
      style="font-weight: bold; text-decoration: none; color: black"
    >
      histories.cc
    </a>
  </div>
  <p style="color: #6a6a6a; text-align: center">
      Don’t want to receive these emails?<br />
    <a
      href="https://www.histories.cc/settings/notifications"
      style="color: ${orange_main}; text-decoration: none"
    >
      Unsubscribe here
    </a>
  </p>
  <p>
    © ${new Date().getFullYear()} Kryštof Krátký. All rights reserved.
  </p>
</footer>`;

export default Footer;
