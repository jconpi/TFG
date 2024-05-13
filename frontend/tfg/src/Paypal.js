import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id": "AVOEQnhhouzRBJcwwedYuO2EzaoG9XduEVXlKENaux9SXa0_ebbxB4138UH6BbR4fcbIGIT22n1NYVbQ",
  currency: "EUR",
  intent: "capture",
};

function Paypal() {
  return (
    <PayPalScriptProvider options={initialOptions}>
        <p>a</p>
    </PayPalScriptProvider>
  );
}

export default Paypal;
