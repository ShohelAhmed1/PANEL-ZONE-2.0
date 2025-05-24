const paymentSelect = document.getElementById("paymentSelect");
const paymentInfoLabel = document.getElementById("paymentInfo");
const paymentDetails = document.getElementById("paymentDetails");

const paymentInstructions = {
  bkash: "Send Money 300৳ to bKash number: 01796393158",
  nagad: "Send Money 300৳ to Nagad number: 01568870258",
  binance: "Send $3 USDT (TRC20) to Binance Wallet: TKE94FsgVr3jvLR5phqXd2W87ZVpG61win"
};

paymentSelect.addEventListener("change", () => {
  const method = paymentSelect.value;
  if (paymentInstructions[method]) {
    paymentInfoLabel.classList.remove("hidden");
    paymentDetails.classList.remove("hidden");
    paymentDetails.textContent = paymentInstructions[method];
  } else {
    paymentInfoLabel.classList.add("hidden");
    paymentDetails.classList.add("hidden");
    paymentDetails.textContent = "";
  }
});

document.getElementById("resetForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const panel = form.panel.value.trim();
  const username = form.username.value.trim();
  const password = form.password.value.trim();
  const payment = form.payment.value.trim();
  const txid = form.txid.value.trim();
  const screenshot = form.screenshot.files[0];

  // TXID validation
  const txidRegex = /^[A-Z0-9]{10,}$/;
  if (!txidRegex.test(txid)) {
    alert("❌ Invalid TXID format. Use only CAPITAL letters and numbers, at least 10 characters (e.g., CDT6PMGGR0).");
    return;
  }

  if (!screenshot) {
    alert("❌ Please select a screenshot image.");
    return;
  }

  const webhookUrl = "https://discord.com/api/webhooks/1369308873202339840/3upafFmb7rgfH2AOlX2GkjKNa1S7c7DXO4zNzmgQh0Nvupchx8MkreEucDhXL7d_83No";

  // 1. Send embed message (without image)
  const embedPayload = {
    embeds: [{
      title: "🔁 HWID Reset Request",
      color: 0x00ffff,
      fields: [
        { name: "📦 Panel", value: panel, inline: false },
        { name: "👤 Username", value: username, inline: false },
        { name: "🔒 Password", value: password, inline: false },
        { name: "💳 Payment Method", value: payment, inline: false },
        { name: "📄 TXID", value: txid, inline: false }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  try {
    const embedRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embedPayload)
    });

    if (!embedRes.ok) {
      alert("❌ Failed to send reset data.");
      return;
    }

    // 2. Send screenshot image separately
    const imageForm = new FormData();
    imageForm.append("file", screenshot);
    imageForm.append("payload_json", JSON.stringify({
      content: "📷 Screenshot attached below"
    }));

    const imageRes = await fetch(webhookUrl, {
      method: "POST",
      body: imageForm
    });

    if (imageRes.ok) {
      alert("✅ Reset request submitted successfully!");
      form.reset();
      paymentDetails.classList.add("hidden");
      paymentInfoLabel.classList.add("hidden");
    } else {
      alert("❌ Failed to send screenshot.");
    }
  } catch (error) {
    console.error("Submission Error:", error);
    alert("❌ Something went wrong.");
  }
});
