document.addEventListener("DOMContentLoaded", () => {
  const panelSelect = document.getElementById("panel");
  const durationSelect = document.getElementById("duration");
  const paymentMethod = document.getElementById("payment-method");
  const paymentDetails = document.getElementById("payment-details");
  const paymentInfo = document.getElementById("payment-info");
  const submitBtn = document.getElementById("submit-btn");

  const panelPrices = {
    Premium: { "1 Week": 300, "1 Month": 600, "3 Month": 900, "1 Year": 1700, "Lifetime": 2500 },
    Sniper: { "1 Week": 150, "1 Month": 350, "3 Month": 900, "1 Year": 1200, "Lifetime": 1500 },
    Aimbot: { "1 Week": 250, "1 Month": 400, "3 Month": 800, "1 Year": 1200, "Lifetime": 1500 },
    Internal: { "1 Week": 500, "1 Month": 800, "1 Month": 1500, "1 Year": 2500, "Lifetime": 3500 },
    SilentAim: { "1 Day": 150, "7 Day": 800, "1 Month": 2000 },
    Bypass: { "1 Month": 600, "2 Month": 1100, "3 Month": 1500 }
  };

  let selectedAmount = 0;
  let selectedPanel = "";

  const urlParams = new URLSearchParams(window.location.search);
  const panelFromURL = urlParams.get("panel");

  if (panelFromURL && panelPrices[panelFromURL]) {
    panelSelect.value = panelFromURL;
    panelSelect.disabled = true;
    selectedPanel = panelFromURL;
    populateDurations(panelFromURL);
  }

  function populateDurations(panelKey) {
    durationSelect.innerHTML = '<option value="">-- Choose Duration --</option>';
    for (const [key, value] of Object.entries(panelPrices[panelKey])) {
      durationSelect.innerHTML += `<option value="${key}">${key} - ৳${value} / $${(value / 100).toFixed(2)}</option>`;
    }
  }

  panelSelect.addEventListener("change", () => {
    selectedPanel = panelSelect.value;
    populateDurations(selectedPanel);
    paymentDetails.classList.add("hidden");
  });

  const updatePaymentDetails = () => {
    const duration = durationSelect.value;
    const method = paymentMethod.value;

    if (!selectedPanel || !duration || !method) {
      paymentDetails.classList.add("hidden");
      return;
    }

    selectedAmount = panelPrices[selectedPanel][duration];
    let message = "";

    switch (method) {
      case "bkash":
        message = `Send Money ৳${selectedAmount} to bKash number: 01796393158`;
        break;
      case "nagad":
        message = `Send Money ৳${selectedAmount} to Nagad number: 01568870258`;
        break;
      case "binance":
        message = `Send $${(selectedAmount / 100).toFixed(2)} to Binance USDT TRC20: TKE94FsgVr3jvLR5phqXd2W87ZVpG61win`;
        break;
    }

    paymentInfo.innerText = message;
    paymentDetails.classList.remove("hidden");
  };

  durationSelect.addEventListener("change", updatePaymentDetails);
  paymentMethod.addEventListener("change", updatePaymentDetails);

  submitBtn.addEventListener("click", () => {
    const trxid = document.getElementById("trxid").value.trim();
    const email = document.getElementById("email").value.trim();
    const duration = durationSelect.value;
    const method = paymentMethod.value;
    const screenshot = document.getElementById("screenshot")?.files[0]; // Only the first selected file

    // Check if any field is empty
    if (!trxid || !selectedPanel || !duration || !method || !email || !screenshot) {
      alert("Please complete all fields, especially your email and provide a screenshot!");
      // Add red border for missing fields
      if (!trxid) document.getElementById("trxid").classList.add("error");
      if (!email) document.getElementById("email").classList.add("error");
      if (!selectedPanel) panelSelect.classList.add("error");
      if (!duration) durationSelect.classList.add("error");
      if (!method) paymentMethod.classList.add("error");
      if (!screenshot) document.getElementById("screenshot").classList.add("error");
      return; // Do not submit
    }

    const webhookURL = "https://discordapp.com/api/webhooks/1375875309504823478/VTy9khmI0NsWM1u9e5ddShMvppD0TqDnD0yD0-ZdjNXZ9PTPYgLMNE4yXn4jOVvOPdyJ";

    const embedPayload = {
      username: "PANEL ZONE BOT",
      embeds: [{
        title: "🧾 New Panel Payment Submission",
        color: 3447003,
        fields: [
          { name: "Panel", value: selectedPanel, inline: true },
          { name: "Duration", value: duration, inline: true },
          { name: "Payment Method", value: method, inline: true },
          {
            name: "Amount",
            value: method === "binance" ? `$${(selectedAmount / 100).toFixed(2)}` : `৳${selectedAmount}`,
            inline: true
          },
          { name: "Transaction ID", value: trxid },
          { name: "Email", value: email }
        ],
        footer: {
          text: "PANEL ZONE 2.0 Submission",
        },
        timestamp: new Date().toISOString()
      }]
    };

    const formData = new FormData();
    formData.append("file", screenshot); // Only append the first screenshot
    formData.append("payload_json", JSON.stringify(embedPayload));

    fetch(webhookURL, {
      method: "POST",
      body: formData
    }).then(() => {
      alert("✔️ Successfully submitted!");
    }).catch((err) => {
      console.error(err);
      alert("❌ Submission failed!");
    });
  });

  const glowOverlay = document.querySelector('.glow-overlay');
  setInterval(() => {
    glowOverlay.classList.toggle('active');
  }, 2000);

  // Clear errors
  function clearErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach((el) => {
      el.classList.remove('error');
    });
  }
});
