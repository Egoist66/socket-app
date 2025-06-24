

/**
 * The main app component that displays the current price of BTCUSDT.
 * 
 * @returns {string} The HTML string of the app component.
 */
export const App = () => {
  return `
  
    <div class="d-flex align-items-center justify-content-center mb-3">
      <div class="p-2 bg-primary text-white rounded-start">$</div>
      <input type="text" class="form-control text-center border-0" placeholder="Loading..." aria-label="Price" aria-describedby="basic-addon1" id="price" readonly />
      <div class="p-2 bg-success text-white rounded-end">BTCUSDT</div>
    </div>
    
  `
};
