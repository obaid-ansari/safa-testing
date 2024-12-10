document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const forexForm = document.getElementById("forexForm");
  const buyBtn = document.getElementById("buyBtn");
  const sellBtn = document.getElementById("sellBtn");
  const purposeContainer = document.getElementById("purposeContainer");
  const purposeSelect = document.getElementById("purpose");
  const currencySelect = document.getElementById("currency");
  const quantityInput = document.getElementById("quantity");
  const amountInput = document.getElementById("amount");

  // Transaction type state
  let currentType = "buy";
  let currentExchangeRate = 0;

  // Function to fetch all currencies
  async function fetchAllCurrencies() {
    try {
      console.log("Fetching currencies...");
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Currencies fetched:", data);

      // Clear existing options except the first one
      while (currencySelect.options.length > 1) {
        currencySelect.remove(1);
      }

      // Add currencies to dropdown
      Object.entries(data).forEach(([code, name]) => {
        if (code.toUpperCase() !== "INR") {
          // Exclude INR as it's the base currency
          const option = document.createElement("option");
          option.value = code.toUpperCase();
          option.textContent = `${code.toUpperCase()} - ${name}`;
          currencySelect.appendChild(option);
        }
      });
    } catch (error) {
      console.error("Error fetching currencies:", error);
      // Add some common currencies as fallback
      const commonCurrencies = {
        USD: "US Dollar",
        EUR: "Euro",
        GBP: "British Pound",
        AUD: "Australian Dollar",
        CAD: "Canadian Dollar",
        SGD: "Singapore Dollar",
        AED: "UAE Dirham",
        SAR: "Saudi Riyal",
      };

      Object.entries(commonCurrencies).forEach(([code, name]) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = `${code} - ${name}`;
        currencySelect.appendChild(option);
      });
    }
  }

  // Function to fetch exchange rate
  async function fetchExchangeRate(currency) {
    try {
      console.log("Fetching exchange rate for:", currency);
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Exchange rate data:", data);
      const rate = data.inr[currency.toLowerCase()];
      return rate ? 1 / rate : null; // Convert to INR rate
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      // Fallback rates
      const fallbackRates = {
        USD: 83.0,
        EUR: 89.5,
        GBP: 104.5,
        AUD: 54.0,
        CAD: 61.0,
        SGD: 61.5,
        AED: 22.6,
        SAR: 22.13,
      };
      return fallbackRates[currency] || 75;
    }
  }

  // Handle Buy/Sell button clicks
  buyBtn.addEventListener("click", function () {
    currentType = "buy";
    buyBtn.classList.add("active");
    buyBtn.classList.remove("inactive");
    sellBtn.classList.add("inactive");
    sellBtn.classList.remove("active");
    purposeContainer.style.display = "block";
    purposeSelect.required = true;
  });

  sellBtn.addEventListener("click", function () {
    currentType = "sell";
    sellBtn.classList.add("active");
    sellBtn.classList.remove("inactive");
    buyBtn.classList.add("inactive");
    buyBtn.classList.remove("active");
    purposeContainer.style.display = "none";
    purposeSelect.required = false;
  });

  // Update amount when currency or quantity changes
  async function updateAmount() {
    const currency = currencySelect.value;
    const quantity = parseFloat(quantityInput.value) || 0;

    if (currency && quantity > 0) {
      if (!currentExchangeRate) {
        currentExchangeRate = await fetchExchangeRate(currency);
      }
      const amount = quantity * currentExchangeRate;
      amountInput.value = amount.toFixed(2);
    }
  }

  // Reset exchange rate when currency changes
  currencySelect.addEventListener("change", function () {
    currentExchangeRate = 0; // Reset rate to force new fetch
    updateAmount();
  });

  quantityInput.addEventListener("input", updateAmount);

  // Handle form submission
  forexForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      transactionType: currentType,
      location: document.getElementById("location").value,
      currency: currencySelect.value,
      quantity: quantityInput.value,
      amount: amountInput.value,
    };

    if (currentType === "buy") {
      formData.purpose = purposeSelect.value;
    }

    try {
      const response = await fetch("/api/forex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error submitting form");
      }

      alert("Form submitted successfully!");
      forexForm.reset();
      currentExchangeRate = 0;

      if (currentType === "sell") {
        buyBtn.click();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  });

  // Initialize the form
  fetchAllCurrencies();
});
