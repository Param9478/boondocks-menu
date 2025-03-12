import PropTypes from 'prop-types';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const MenuItem = ({
  item,
  selectedOptions,
  setSelectedOptions,
  addItemToBill,
  removeItemFromBill,
  deleteItemFromBill,
  getItemQuantity,
}) => {
  const [pizzaSize, setPizzaSize] = useState(null);
  const [pizzaToppings, setPizzaToppings] = useState(null);
  const [extraCheese, setExtraCheese] = useState(false);

  const isPizza = item.type === 'pizza';

  // Generate the itemKey for cart identification
  const itemKey = isPizza
    ? `${item.name}-${pizzaSize?.name || ''}-${pizzaToppings?.name || ''}-${extraCheese ? 'extraCheese' : ''}`
    : item.options
      ? `${item.name}-${selectedOptions[item.name]?.name}`
      : item.name;

  const quantity = getItemQuantity(itemKey);

  // Helper function to calculate topping price based on the pizza size and topping selection
  const calculateToppingPrice = (sizeName, toppingName) => {
    if (!toppingName || toppingName === 'Cheese') return 0;

    // For Small and Medium sizes
    if (['Small', 'Medium'].includes(sizeName)) {
      if (toppingName === 'Gourmet Pizza') {
        return 5; // $5 for Gourmet on Small/Medium
      }
      // Extract the number from the topping name (e.g., "2 Toppings" -> 2)
      const toppingCount = parseInt(toppingName.split(' ')[0]) || 0;
      return toppingCount; // $1 per topping for Small/Medium
    }

    // For Large and Extra Large sizes - fixed total prices
    if (['Large', 'Extra Large'].includes(sizeName)) {
      if (toppingName === 'Gourmet Pizza') {
        return 6; // $6 flat for Gourmet
      }
      if (toppingName === '1 Topping') {
        return 2; // $2 for 1 topping
      }
      if (toppingName === '2 Toppings') {
        return 3; // $3 for 2 toppings
      }
      if (toppingName === '3 Toppings') {
        return 4; // $4 for 3 toppings
      }
      if (toppingName === '4 Toppings') {
        return 5; // $5 for 4 toppings
      }
    }

    // For Giant size - $2 per additional topping
    if (sizeName === 'Giant') {
      if (toppingName === 'Gourmet Pizza') {
        return 6; // $6 flat for Gourmet
      }
      const toppingCount = parseInt(toppingName.split(' ')[0]) || 0;
      return toppingCount * 2; // $2 per topping for Giant
    }

    return 0; // Default fallback
  };

  // Calculate pizza price when selections change
  useEffect(() => {
    if (isPizza && pizzaSize && pizzaToppings) {
      // Get the base price from the size
      const basePrice = pizzaSize.price;

      // Calculate topping price based on size and topping selection
      const toppingsPrice = calculateToppingPrice(
        pizzaSize.name,
        pizzaToppings.name
      );

      // Add extra cheese price if selected
      const cheesePrice = extraCheese
        ? item.extra_cheese_pricing[pizzaSize.name] || 0
        : 0;

      // Calculate total price
      const totalPrice = basePrice + toppingsPrice + cheesePrice;

      // Create the option object for the cart
      const pizzaOption = {
        name: `${pizzaSize.name}, ${pizzaToppings.name}${extraCheese ? ', Extra Cheese' : ''}`,
        price: totalPrice,
      };

      setSelectedOptions((prev) => ({
        ...prev,
        [item.name]: pizzaOption,
      }));
    }
  }, [
    pizzaSize,
    pizzaToppings,
    extraCheese,
    isPizza,
    item.name,
    item.extra_cheese_pricing,
  ]);

  const handleOptionChange = (e) => {
    const selectedOption = JSON.parse(e.target.value);
    setSelectedOptions((prev) => ({
      ...prev,
      [item.name]: selectedOption,
    }));
    addItemToBill(item, selectedOption);
  };

  const handleAddToCart = () => {
    if (isPizza) {
      if (pizzaSize && pizzaToppings) {
        addItemToBill(item, selectedOptions[item.name]);
      }
    } else {
      addItemToBill(item, selectedOptions[item.name]);
    }
  };

  // Handle size selection for pizza
  const handleSizeChange = (size) => {
    setPizzaSize(size);
    // Reset toppings and extra cheese when size changes
    setPizzaToppings(null);
    setExtraCheese(false);
  };

  // Handle toppings selection for pizza
  const handleToppingsChange = (toppings) => {
    setPizzaToppings(toppings);
  };

  // Handle extra cheese toggle for pizza
  const handleExtraCheeseChange = () => {
    setExtraCheese(!extraCheese);
  };

  // Calculate and display topping prices in dropdown
  const renderToppingPrice = (topping) => {
    if (!pizzaSize || topping.name === 'Cheese') return '';

    const price = calculateToppingPrice(pizzaSize.name, topping.name);
    return price > 0 ? `(+$${price.toFixed(2)})` : '';
  };

  // Display the topping price explanation based on size
  const renderToppingPriceLabel = (sizeName) => {
    if (!sizeName) return '';

    if (['Small', 'Medium'].includes(sizeName)) {
      return ' ($1 per topping)';
    }
    if (['Giant'].includes(sizeName)) {
      return ' ($2 per topping)';
    } else {
      return ' (1 Topping: +$2, 2 Toppings: +$3, 3 Toppings: +$4, 4 Toppings: +$5, Gourmet: +$6)';
    }
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg hover:shadow-2xl transition-shadow bg-white">
      <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
      <p className="text-gray-700 mt-2">
        {item.description || 'No description available.'}
      </p>

      {isPizza ? (
        // Pizza customization interface
        <div className="mt-4 space-y-4">
          {/* Step 1: Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Size
            </label>
            <select
              value={pizzaSize ? JSON.stringify(pizzaSize) : ''}
              onChange={(e) =>
                handleSizeChange(
                  e.target.value ? JSON.parse(e.target.value) : null
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
            >
              <option value="">Select a size</option>
              {item.sizes.map((size, i) => (
                <option key={i} value={JSON.stringify(size)}>
                  {size.name} - ${size.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Toppings Selection (only if size is selected) */}
          {pizzaSize && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Toppings
                {renderToppingPriceLabel(pizzaSize.name)}
              </label>
              <select
                value={pizzaToppings ? JSON.stringify(pizzaToppings) : ''}
                onChange={(e) =>
                  handleToppingsChange(
                    e.target.value ? JSON.parse(e.target.value) : null
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
              >
                <option value="">Select toppings</option>
                {item.toppings.map((topping, i) => (
                  <option key={i} value={JSON.stringify(topping)}>
                    {topping.name} {renderToppingPrice(topping)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 3: Extra Cheese Option (only if size and toppings are selected) */}
          {pizzaSize && pizzaToppings && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="extraCheese"
                checked={extraCheese}
                onChange={handleExtraCheeseChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="extraCheese"
                className="ml-2 block text-sm text-gray-700"
              >
                Extra Cheese (+$
                {item?.extra_cheese_pricing[pizzaSize.name]?.toFixed(2)})
              </label>
            </div>
          )}

          {/* Show total price when all selections are made */}
          {pizzaSize && pizzaToppings && (
            <div className="mt-2 text-lg font-bold text-gray-900">
              Total: ${selectedOptions[item.name]?.price.toFixed(2)}
            </div>
          )}
        </div>
      ) : item.options ? (
        // For items with regular options
        <select
          onChange={handleOptionChange}
          className="mt-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
        >
          <option value="">Select an option</option>
          {item.options.map((option, i) => (
            <option key={i} value={JSON.stringify(option)}>
              {option.name} - ${option.price}
            </option>
          ))}
        </select>
      ) : (
        // For items with fixed price
        <p className="text-gray-900 font-bold mt-4">${item.price}</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {quantity > 0 ? (
            <>
              <button
                onClick={() =>
                  removeItemFromBill({ name: item.name, key: itemKey })
                }
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition transform hover:scale-110"
              >
                <FaMinus />
              </button>
              <span className="text-lg font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={handleAddToCart}
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition transform hover:scale-110"
              >
                <FaPlus />
              </button>
              <button
                onClick={() =>
                  deleteItemFromBill({ name: item.name, key: itemKey })
                }
                className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition transform hover:scale-110"
              >
                <FaTrashAlt />
              </button>
            </>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`text-white px-4 py-2 rounded-md transition ${
                (isPizza && (!pizzaSize || !pizzaToppings)) ||
                (item.options && !selectedOptions[item.name] && !isPizza)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={
                (isPizza && (!pizzaSize || !pizzaToppings)) ||
                (item.options && !selectedOptions[item.name] && !isPizza)
              }
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

MenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  addItemToBill: PropTypes.func.isRequired,
  removeItemFromBill: PropTypes.func.isRequired,
  deleteItemFromBill: PropTypes.func.isRequired,
  getItemQuantity: PropTypes.func.isRequired,
};

export default MenuItem;
