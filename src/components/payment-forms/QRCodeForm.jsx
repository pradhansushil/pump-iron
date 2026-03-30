import { textColor } from "../../utils/styles";

export default function QRCodeForm() {
  return (
    <>
      <p className={textColor}>
        Scan this code with your payment app (Cash App, Zelle, etc.)
      </p>
      {/* <img src="..." alt="QR Code for payment" /> */}
    </>
  );
}
