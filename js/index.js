const devMode = false;

const impuestitoDollarMock = {
  data: {
    compra: "103,46",
    venta: "109,46",
    fecha: "17/01/2022 - 17:49",
    variacion: "0,23%",
    "class-variacion": "up",
  },
};

const impuestitoTaxesMock = {
  pais: 0.3,
  ganancias: 1,
  bienespersonales: 0.25,
  qatar: 0.05,
};

let impuestitoDollar = undefined;
let impuestitoTaxes = undefined;

const hostname = window.location.hostname;
const pathname = window.location.pathname;
const href = window.location.href;

// Get Taxes and USD exchange rate
if (devMode) {
  console.warn("--- RUNNING IN DEV MODE ---");
  impuestitoDollar = impuestitoDollarMock;
  impuestitoTaxes = impuestitoTaxesMock;
} else {
  chrome.runtime.sendMessage("GET_DOLLAR_OFFICIAL", (response) => {
    impuestitoDollar = response;
  });
  chrome.runtime.sendMessage("GET_TAXES", (response) => {
    impuestitoTaxes = response;
  });
}

// Watch HTML mutations
function observeInit(targetElement, handleScrapperInit) {
  setTimeout(() => {
    handleScrapperInit();
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(() => {
      if (impuestitoTaxes && impuestitoDollar) {
        handleScrapperInit();
      } else {
        console.error("🔴 Missing dollar or taxes value.");
        console.error("🔴 MISSING_DATA", { dollar: impuestitoDollar, taxes: impuestitoTaxes });
        return;
      }
    });

    if (targetElement) {
      observer.observe(targetElement, { subtree: true, attributes: true, childList: true });
    } else {
      console.error("🔴 Missing targetElement to init observer");
    }
  }, 500);
}
